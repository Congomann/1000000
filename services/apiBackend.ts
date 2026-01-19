
import { Lead, ProductType, LeadStatus, User, UserRole, Commission, Client, CompanySettings, IntegrationLog } from '../types';
import { InternalLead, Transformers, IngestionEngine } from './marketingBackend';
import { DB } from './database';

// --- CONFIGURATION ---
// Set this to TRUE to use the new Node.js/PostgreSQL backend you just built.
// Set to FALSE to keep using the browser-based IndexedDB simulation.
const USE_REAL_BACKEND = false; 
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * NHFG BACKEND CORE
 * Seamlessly switches between local browser storage and production API.
 */
class NHFGBackend {
  
  // --- LEAD MANAGEMENT ---

  async getLeads(advisorId?: string): Promise<Lead[]> {
    if (USE_REAL_BACKEND) {
        try {
            const url = advisorId ? `${API_BASE_URL}/leads?advisorId=${advisorId}` : `${API_BASE_URL}/leads`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (e) { console.error("Fetch Leads Failed", e); return []; }
    }
    // Fallback: Local DB
    return DB.getAll<Lead>('leads');
  }

  async saveLead(lead: Partial<Lead>): Promise<void> {
    if (USE_REAL_BACKEND) {
        try {
            const method = lead.id ? 'PUT' : 'POST'; // Determine if update or create
            const url = lead.id ? `${API_BASE_URL}/leads/${lead.id}` : `${API_BASE_URL}/leads`;
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
        } catch (e) { console.error("Save Lead Failed", e); }
        return;
    }
    // Fallback: Local DB
    await DB.save('leads', { ...lead, id: lead.id || crypto.randomUUID() } as Lead);
  }

  // --- WEBHOOK SIMULATION (Frontend Gateway) ---
  
  public async handleWebhook(platform: 'google' | 'meta' | 'tiktok', payload: any): Promise<{success: boolean, isNew: boolean}> {
    if (USE_REAL_BACKEND) {
        // Pass payload directly to real server to handle normalization and SQL insertion
        try {
            const res = await fetch(`${API_BASE_URL}/webhooks/${platform}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
      switch(platform) {
        case 'google': normalized = Transformers.fromGoogle(payload); break;
        case 'meta': normalized = Transformers.fromMeta(payload); break;
        case 'tiktok': normalized = Transformers.fromTikTok(payload); break;
        default: throw new Error("Unsupported marketing platform");
      }

      const leads = await this.getLeads();
      const result = IngestionEngine.process(normalized, leads); // Dedupe logic

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

  // --- OTHER ENTITIES (Clients, Users, Settings) ---

  async getClients(): Promise<Client[]> {
    if (USE_REAL_BACKEND) return []; // Implement /api/clients in server.js similarly
    return DB.getAll<Client>('clients');
  }

  async getUsers(): Promise<User[]> {
    if (USE_REAL_BACKEND) return []; // Implement /api/users
    return DB.getAll<User>('users');
  }

  async getSettings(): Promise<CompanySettings | null> {
    if (USE_REAL_BACKEND) return null;
    const all = await DB.getAll<CompanySettings>('settings');
    return all.length > 0 ? all[0] : null;
  }

  async getLogs(): Promise<IntegrationLog[]> {
    if (USE_REAL_BACKEND) return [];
    return DB.getAll<IntegrationLog>('logs');
  }

  async saveClient(client: Client): Promise<void> {
    if (USE_REAL_BACKEND) return;
    await DB.save('clients', client);
  }

  async saveUser(user: User): Promise<void> {
    if (USE_REAL_BACKEND) return;
    await DB.save('users', user);
  }

  async saveSettings(settings: CompanySettings): Promise<void> {
    if (USE_REAL_BACKEND) return;
    await DB.save('settings', { ...settings, id: 'global_config' } as any);
  }
}

export const Backend = new NHFGBackend();
