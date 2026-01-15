
import { Lead, ProductType, LeadStatus, User, UserRole, Commission, Client, CompanySettings, IntegrationLog } from '../types';
import { InternalLead, Transformers, IngestionEngine } from './marketingBackend';
import { DB } from './database';

/**
 * NHFG BACKEND CORE - MARKETING & API EDITION
 * This controller handles the lifecycle of marketing-driven data.
 */
class NHFGBackend {
  
  // --- MARKETING API HUB ---

  /**
   * Universal Webhook Gateway
   * Processes incoming leads from Google, Meta, and TikTok with campaign tracking.
   */
  public async handleWebhook(platform: 'google' | 'meta' | 'tiktok', payload: any): Promise<{success: boolean, isNew: boolean}> {
    console.log(`[API Gateway] Processing ${platform} webhook ingestion...`);
    
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

      if (result.error) {
        await this.logEvent(platform, 'error', payload, result.error);
        throw new Error(result.error);
      }

      // Permanent Logging for Marketing Analytics
      await this.logEvent(
        platform, 
        result.isNew ? 'lead_creation' : 'lead_reengagement', 
        payload
      );

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
          source: result.lead.source, // Attribution is locked to the ad source
          campaign: normalized.campaign_id,
          adGroup: normalized.ad_group_id,
          adId: normalized.ad_id,
          platformData: JSON.stringify(payload)
        };
        await DB.save('leads', newLead);
      } else if (result.lead.id) {
        // Handle Re-engagement (Update existing record with new metadata)
        const existing = leads.find(l => l.id === result.lead.id);
        if (existing) {
          await DB.save('leads', { 
            ...existing, 
            ...result.lead,
            // Preserve original source but log newest campaign activity
            notes: `${existing.notes || ''}\n[Marketing Sync] User re-engaged via ${platform} campaign ${normalized.campaign_id} on ${new Date().toLocaleDateString()}`
          });
        }
      }

      return { success: true, isNew: !!result.isNew };
    } catch (err: any) {
      await this.logEvent(platform, 'critical_failure', payload, err.message);
      throw err;
    }
  }

  /**
   * Internal Logging System
   * Stores transaction logs permanently for audit and marketing ROI tracking.
   */
  private async logEvent(platform: string, eventType: string, payload: any, error?: string) {
    const log: IntegrationLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      platform: `${platform}_ads` as any,
      event: eventType.toUpperCase(),
      status: error ? 'failure' : 'success',
      payload: payload,
      error: error
    };
    await DB.save('logs', log);
  }

  // --- CORE DATABASE WRAPPERS ---

  async getLeads(): Promise<Lead[]> {
    return DB.getAll<Lead>('leads');
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

  // --- PERSISTENCE OPERATIONS ---

  async saveLead(lead: Lead): Promise<void> {
    await DB.save('leads', lead);
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

  /**
   * ADMIN CONTROL: Permanent Entity Erasure
   */
  async permanentDelete(entity: 'leads' | 'clients' | 'users', id: string): Promise<void> {
    console.warn(`[Admin Console] Permanent deletion requested for ${entity}:${id}`);
    await DB.delete(entity, id);
  }
}

export const Backend = new NHFGBackend();
