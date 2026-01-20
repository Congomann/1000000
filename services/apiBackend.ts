
import { Lead, ProductType, LeadStatus, User, UserRole, Commission, Client, CompanySettings, IntegrationLog, DashboardMetrics } from '../types';
import { InternalLead, Transformers, IngestionEngine } from './marketingBackend';
import { DB } from './database';

// --- CONFIGURATION ---
// Set this to TRUE to use the new Node.js/PostgreSQL backend you just built.
// Set to FALSE to keep using the browser-based IndexedDB simulation.
export const USE_REAL_BACKEND = true;
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * NHFG BACKEND CORE
 * Seamlessly switches between local browser storage and production API.
 */
class NHFGBackend {
  private token: string | null = localStorage.getItem('nhfg_auth_token');

  private get headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
    };
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('nhfg_auth_token', token);
    } else {
      localStorage.removeItem('nhfg_auth_token');
    }
  }

  // --- AUTH ---
  async login(email: string, password?: string): Promise<{ user: User, token: string } | null> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: password || 'password123' }) // Default password for testing
        });
        if (!res.ok) throw new Error('Auth failed');
        const data = await res.json();
        this.setToken(data.token);
        return data;
      } catch (e) {
        console.error("Login Failed", e);
        return null;
      }
    }
    return null;
  }

  // --- LEAD MANAGEMENT ---

  async getLeads(advisorId?: string): Promise<Lead[]> {
    if (USE_REAL_BACKEND) {
      try {
        const url = advisorId ? `${API_BASE_URL}/leads?advisorId=${advisorId}` : `${API_BASE_URL}/leads`;
        const res = await fetch(url, { headers: this.headers });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) this.setToken(null);
          throw new Error('API Error');
        }
        return await res.json();
      } catch (e) { console.error("Fetch Leads Failed", e); return []; }
    }
    // Fallback: Local DB
    return DB.getAll<Lead>('leads');
  }

  async saveLead(lead: Partial<Lead>): Promise<void> {
    if (USE_REAL_BACKEND) {
      try {
        const method = lead.id ? 'PUT' : 'POST';
        const url = lead.id ? `${API_BASE_URL}/leads/${lead.id}` : `${API_BASE_URL}/leads`;
        await fetch(url, {
          method,
          headers: this.headers,
          body: JSON.stringify(lead)
        });
      } catch (e) { console.error("Save Lead Failed", e); }
      return;
    }
    // Fallback: Local DB
    await DB.save('leads', { ...lead, id: lead.id || crypto.randomUUID() } as Lead);
  }

  // --- WEBHOOK SIMULATION (Frontend Gateway) ---

  public async handleWebhook(platform: 'google' | 'meta' | 'tiktok', payload: any): Promise<{ success: boolean, isNew: boolean }> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/webhooks/${platform}`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(payload)
        });
        return { success: res.ok, isNew: true };
      } catch (e) {
        console.error("API Webhook Failed", e);
        return { success: false, isNew: false };
      }
    }

    // Fallback: Client-Side Simulation Logic (IndexedDB)
    console.log(`[API Gateway] Processing ${platform} webhook via local engine...`);
    let normalized: InternalLead;
    try {
      switch (platform) {
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

  async getMetrics(advisorId?: string): Promise<DashboardMetrics> {
    if (USE_REAL_BACKEND) {
      try {
        const url = advisorId ? `${API_BASE_URL}/dashboard/metrics?advisorId=${advisorId}` : `${API_BASE_URL}/dashboard/metrics`;
        const res = await fetch(url, { headers: this.headers });
        if (!res.ok) throw new Error('API Error');
        return await res.json();
      } catch (e) {
        console.error("Fetch Metrics Failed", e);
        return { totalRevenue: 0, activeClients: 0, pendingLeads: 0, monthlyPerformance: [], totalCommission: 0 };
      }
    }
    return { totalRevenue: 0, activeClients: 0, pendingLeads: 0, monthlyPerformance: [], totalCommission: 0 };
  }

  // --- OTHER ENTITIES (Clients, Users, Settings) ---

  async getClients(advisorId?: string): Promise<Client[]> {
    if (USE_REAL_BACKEND) {
      try {
        const url = advisorId ? `${API_BASE_URL}/clients?advisorId=${advisorId}` : `${API_BASE_URL}/clients`;
        const res = await fetch(url, { headers: this.headers });
        if (!res.ok) throw new Error('API Error');
        return await res.json();
      } catch (e) { console.error("Fetch Clients Failed", e); return []; }
    }
    return DB.getAll<Client>('clients');
  }

  async getUsers(): Promise<User[]> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/users`, { headers: this.headers });
        if (!res.ok) throw new Error('API Error');
        return await res.json();
      } catch (e) { console.error("Fetch Users Failed", e); return []; }
    }
    return DB.getAll<User>('users');
  }

  async getSettings(): Promise<CompanySettings | null> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`, { headers: this.headers });
        if (!res.ok) throw new Error('API Error');
        return await res.json();
      } catch (e) { console.error("Fetch Settings Failed", e); return null; }
    }
    const all = await DB.getAll<CompanySettings>('settings');
    return all.length > 0 ? all[0] : null;
  }

  async getLogs(): Promise<IntegrationLog[]> {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${API_BASE_URL}/logs`, { headers: this.headers });
        if (!res.ok) throw new Error('API Error');
        return await res.json();
      } catch (e) { console.error("Fetch Logs Failed", e); return []; }
    }
    return DB.getAll<IntegrationLog>('logs');
  }

  async saveClient(client: Partial<Client>): Promise<void> {
    if (USE_REAL_BACKEND) {
      try {
        const method = client.id ? 'PUT' : 'POST';
        const url = client.id ? `${API_BASE_URL}/clients/${client.id}` : `${API_BASE_URL}/clients`;
        await fetch(url, {
          method,
          headers: this.headers,
          body: JSON.stringify(client)
        });
      } catch (e) { console.error("Save Client Failed", e); }
      return;
    }
    await DB.save('clients', { ...client, id: client.id || crypto.randomUUID() } as Client);
  }

  async saveUser(user: Partial<User>): Promise<void> {
    if (USE_REAL_BACKEND) {
      try {
        const method = user.id ? 'PUT' : 'POST';
        const url = user.id ? `${API_BASE_URL}/users/${user.id}` : `${API_BASE_URL}/users`;
        await fetch(url, {
          method,
          headers: this.headers,
          body: JSON.stringify(user)
        });
      } catch (e) { console.error("Save User Failed", e); }
      return;
    }
    await DB.save('users', { ...user, id: user.id || crypto.randomUUID() } as User);
  }

  async saveSettings(settings: CompanySettings): Promise<void> {
    if (USE_REAL_BACKEND) {
      try {
        await fetch(`${API_BASE_URL}/settings`, {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(settings)
        });
      } catch (e) { console.error("Save Settings Failed", e); }
      return;
    }
    await DB.save('settings', { ...settings, id: 'global_config' } as any);
  }
}

export const Backend = new NHFGBackend();
