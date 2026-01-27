import { Lead, ProductType, LeadStatus, User, UserRole, Commission, Client, CompanySettings, IntegrationLog } from '../types';
import { InternalLead, Transformers, IngestionEngine } from './marketingBackend';
import { DB } from './database';

// --- CONFIGURATION ---
const USE_REAL_BACKEND = true; 

/**
 * NHFG BACKEND CORE
 * Seamlessly switches between local browser storage and production API.
 * Standardized Fallback Pattern: Try API -> Silent Fallback if unreachable/404 -> Error only on logic failure
 */
class NHFGBackend {
  
  private get baseUrl(): string {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
        return 'http://localhost:3001/api';
    }
    return `${window.location.origin}/api`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('nhfg_jwt_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse(res: Response) {
      if (res.status === 401) {
          this.logout();
          window.location.href = '#/login'; 
          throw new Error('Session expired');
      }
      
      if (!res.ok) {
          let errorMessage = `HTTP Error ${res.status}: ${res.statusText || 'Unknown Status'}`;
          
          try {
              // Attempt to parse JSON error detail
              const errorData = await res.json();
              errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch (e) {
              // If not JSON, attempt to read as plain text
              try {
                  const text = await res.clone().text();
                  if (text && text.length < 150) errorMessage = text;
              } catch (textErr) {}
          }
          
          throw new Error(errorMessage);
      }
      
      return res.json();
  }

  // Helper to wrap API calls with IndexedDB fallback
  private async apiRequest<T>(url: string, options: RequestInit, fallbackStore: string): Promise<T> {
      if (!USE_REAL_BACKEND) return DB.getAll<any>(fallbackStore) as any;
      
      try {
          const res = await fetch(url, options);
          return await this.handleResponse(res);
      } catch (e: any) {
          const isNetworkError = e instanceof TypeError;
          const isNotFound = e.message.includes('404') || e.message.toLowerCase().includes('not found');

          // If it's a connectivity issue or a missing endpoint, fall back silently
          if (isNetworkError || isNotFound) {
              console.debug(`[Backend] API ${isNotFound ? 'endpoint 404' : 'unreachable'}. Falling back to local storage for: ${fallbackStore}`);
          } else {
              // Real logic or server-side error (500, 403, etc.)
              console.error(`[Backend] API Error: ${e.message}`);
          }
          
          return DB.getAll<any>(fallbackStore) as any;
      }
  }

  // --- AUTHENTICATION ---
  
  async login(email: string, password?: string): Promise<User | null> {
    if (!USE_REAL_BACKEND) return null;
    try {
        const res = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: password || 'password' })
        });
        const data = await this.handleResponse(res);
        if (data.access_token) {
            localStorage.setItem('nhfg_jwt_token', data.access_token);
        }
        return data.user;
    } catch (e: any) {
        if (!(e instanceof TypeError) && !e.message.includes('404')) {
            console.warn(`[Backend] Login API Exception: ${e.message}`);
        }
        return null; 
    }
  }

  logout() {
      localStorage.removeItem('nhfg_jwt_token');
  }

  // --- ENTITY MANAGEMENT ---

  async getLeads(advisorId?: string): Promise<Lead[]> {
    const url = advisorId ? `${this.baseUrl}/leads?advisorId=${advisorId}` : `${this.baseUrl}/leads`;
    return this.apiRequest<Lead[]>(url, { headers: this.getAuthHeaders() }, 'leads');
  }

  async saveLead(lead: Partial<Lead>): Promise<void> {
    if (USE_REAL_BACKEND) {
        try {
            await fetch(`${this.baseUrl}/leads`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(lead)
            });
        } catch (e) {}
    }
    await DB.save('leads', { ...lead, id: lead.id || crypto.randomUUID() } as Lead);
  }

  async getClients(): Promise<Client[]> {
    return this.apiRequest<Client[]>(`${this.baseUrl}/clients`, { headers: this.getAuthHeaders() }, 'clients');
  }

  async saveClient(client: Client): Promise<void> {
    if (USE_REAL_BACKEND) {
        try {
            await fetch(`${this.baseUrl}/clients`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(client)
            });
        } catch (e) {}
    }
    await DB.save('clients', client);
  }

  async getUsers(): Promise<User[]> {
    return this.apiRequest<User[]>(`${this.baseUrl}/users`, { headers: this.getAuthHeaders() }, 'users');
  }

  async saveUser(user: User): Promise<void> {
    if (USE_REAL_BACKEND) {
        try {
            await fetch(`${this.baseUrl}/users`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(user)
            });
        } catch (e) {}
    }
    await DB.save('users', user);
  }

  async getSettings(): Promise<CompanySettings | null> {
    const settings = await this.apiRequest<CompanySettings[]>(`${this.baseUrl}/settings`, { headers: this.getAuthHeaders() }, 'settings');
    return settings && settings.length > 0 ? settings[0] : null;
  }

  async saveSettings(settings: CompanySettings): Promise<void> {
    if (USE_REAL_BACKEND) {
        try {
            await fetch(`${this.baseUrl}/settings`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(settings)
            });
        } catch (e) {}
    }
    await DB.save('settings', { ...settings, id: 'global_config' } as any);
  }

  async getLogs(): Promise<IntegrationLog[]> {
    return this.apiRequest<IntegrationLog[]>(`${this.baseUrl}/logs`, { headers: this.getAuthHeaders() }, 'logs');
  }

  // --- WEBHOOKS ---
  
  public async handleWebhook(platform: 'google' | 'meta' | 'tiktok', payload: any): Promise<{success: boolean, isNew: boolean}> {
    if (USE_REAL_BACKEND) {
        try {
            const res = await fetch(`${this.baseUrl}/webhooks/${platform}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            await this.handleResponse(res);
            return { success: true, isNew: true };
        } catch (e: any) {
             if (!(e instanceof TypeError) && !e.message.includes('404')) {
                console.warn(`[Backend] API Webhook Exception: ${e.message}`);
             }
        }
    }

    // Local Webhook Processing (Simulation)
    let normalized: InternalLead;
    try {
      switch(platform) {
        case 'google': normalized = Transformers.fromGoogle(payload); break;
        case 'meta': normalized = Transformers.fromMeta(payload); break;
        case 'tiktok': normalized = Transformers.fromTikTok(payload); break;
        default: throw new Error("Unsupported marketing platform");
      }

      const leads = await this.getLeads();
      const result = IngestionEngine.process(normalized, leads);

      if (result.isNew) {
        const newLead: Lead = {
          id: crypto.randomUUID(),
          name: result.lead.name!,
          email: result.lead.email!,
          phone: result.lead.phone!,
          interest: result.lead.interest!,
          status: LeadStatus.NEW,
          message: result.lead.message!,
          date: normalized.timestamp,
          score: result.lead.score || 75,
          qualification: result.lead.qualification as any,
          source: result.lead.source,
          platformData: JSON.stringify(payload)
        };
        await DB.save('leads', newLead);
      }
      return { success: true, isNew: !!result.isNew };
    } catch (err: any) {
      console.error(err);
      return { success: false, isNew: false };
    }
  }
}

export const Backend = new NHFGBackend();