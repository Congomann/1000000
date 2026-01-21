
import { Lead, ProductType, LeadStatus, User, UserRole, Commission, Client, CompanySettings, IntegrationLog } from '../types';
import { InternalLead, Transformers, IngestionEngine } from './marketingBackend';
import { DB } from './database';

// --- CONFIGURATION ---
const USE_REAL_BACKEND = false; 
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * NHFG BACKEND CORE
 * Seamlessly switches between local browser storage and production API.
 */
class NHFGBackend {
  
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('nhfg_jwt_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Helper to handle API responses and global errors
  private async handleResponse(res: Response) {
      if (res.status === 401) {
          // Auto-logout on unauthorized
          this.logout();
          window.location.href = '/login'; 
          throw new Error('Session expired');
      }
      if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || `API Error: ${res.statusText}`);
      }
      return res.json();
  }

  // --- AUTHENTICATION ---
  
  async login(email: string, password?: string): Promise<User | null> {
    if (USE_REAL_BACKEND) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: password || 'password' }) // Fallback for quick login
            });
            
            const data = await this.handleResponse(res);
            if (data.access_token) {
                localStorage.setItem('nhfg_jwt_token', data.access_token);
            }
            return data.user;
        } catch (e) {
            console.error("API Login Failed", e);
            return null; 
        }
    }
    return null;
  }

  logout() {
      localStorage.removeItem('nhfg_jwt_token');
  }

  // --- LEAD MANAGEMENT ---

  async getLeads(advisorId?: string): Promise<Lead[]> {
    if (USE_REAL_BACKEND) {
        try {
            const url = advisorId ? `${API_BASE_URL}/leads?advisorId=${advisorId}` : `${API_BASE_URL}/leads`;
            const res = await fetch(url, { headers: this.getAuthHeaders() });
            return await this.handleResponse(res);
        } catch (e) { 
            console.warn("API Connection Failed - Falling back to local DB", e); 
            return DB.getAll<Lead>('leads');
        }
    }
    return DB.getAll<Lead>('leads');
  }

  async saveLead(lead: Partial<Lead>): Promise<void> {
    if (USE_REAL_BACKEND) {
        try {
            const method = 'POST';
            const url = `${API_BASE_URL}/leads`;
            const res = await fetch(url, {
                method,
                headers: this.getAuthHeaders(),
                body: JSON.stringify(lead)
            });
            await this.handleResponse(res);
            return;
        } catch (e) { console.error("Save Lead API Failed", e); }
    }
    await DB.save('leads', { ...lead, id: lead.id || crypto.randomUUID() } as Lead);
  }

  // --- WEBHOOK SIMULATION ---
  
  public async handleWebhook(platform: 'google' | 'meta' | 'tiktok', payload: any): Promise<{success: boolean, isNew: boolean}> {
    if (USE_REAL_BACKEND) {
        try {
            const res = await fetch(`${API_BASE_URL}/webhooks/${platform}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            await this.handleResponse(res);
            return { success: true, isNew: true };
        } catch (e) {
            console.error("API Webhook Failed", e);
            return { success: false, isNew: false };
        }
    }

    console.log(`[API Gateway] Processing ${platform} webhook via local engine...`);
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
          campaign: normalized.campaign_id,
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

  async getClients(): Promise<Client[]> {
    return DB.getAll<Client>('clients');
  }

  async getUsers(): Promise<User[]> {
    return DB.getAll<User>('users');
  }

  async getSettings(): Promise<CompanySettings | null> {
    const all = await DB.getAll<CompanySettings>('settings');
    return all.length > 0 ? all[0] : null;
  }

  async getLogs(): Promise<IntegrationLog[]> {
    return DB.getAll<IntegrationLog>('logs');
  }

  async saveClient(client: Client): Promise<void> {
    await DB.save('clients', client);
  }

  async saveUser(user: User): Promise<void> {
    await DB.save('users', user);
  }

  async saveSettings(settings: CompanySettings): Promise<void> {
    await DB.save('settings', { ...settings, id: 'global_config' } as any);
  }
}

export const Backend = new NHFGBackend();
