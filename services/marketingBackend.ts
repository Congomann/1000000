
import crypto from 'crypto';
import { ProductType, LeadStatus, Lead } from '../types';

/**
 * UNIFIED INTERNAL LEAD SCHEMA
 * Normalizing all ad platforms into this structure for the CRM.
 */
export interface InternalLead {
  external_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  platform: 'google' | 'meta' | 'tiktok';
  campaign_id: string;
  ad_group_id?: string;
  form_id: string;
  ad_id?: string;
  interest: ProductType;
  raw_payload: any;
  timestamp: string;
}

/**
 * PRODUCTION-GRADE SECURITY VALIDATORS
 */
export const Security = {
  // TikTok uses HMAC SHA256 signatures for webhook verification
  validateTikTokSignature: (signature: string, body: string, secret: string): boolean => {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return signature === hash;
  },
  
  validateGoogleKey: (providedKey: string, actualKey: string): boolean => {
    return providedKey === actualKey;
  }
};

/**
 * API TRANSFORMERS
 * These handle the messy "raw" JSON from ad platforms and turn it into NHFG standard.
 */
export const Transformers = {
  fromGoogle: (payload: any): InternalLead => {
    const fields: Record<string, string> = {};
    if (payload.user_column_data) {
        payload.user_column_data.forEach((col: any) => {
            fields[col.column_id] = col.string_value;
        });
    }

    return {
      external_id: payload.lead_id,
      first_name: fields.FULL_NAME?.split(' ')[0] || fields.FIRST_NAME || 'Unknown',
      last_name: fields.FULL_NAME?.split(' ').slice(1).join(' ') || fields.LAST_NAME || 'User',
      email: fields.EMAIL || 'Not Provided',
      phone: fields.PHONE_NUMBER || 'N/A',
      platform: 'google',
      campaign_id: String(payload.campaign_id),
      ad_group_id: String(payload.ad_group_id),
      form_id: String(payload.form_id),
      ad_id: String(payload.ad_id),
      interest: (fields.PRODUCT_INTEREST as ProductType) || ProductType.LIFE,
      raw_payload: payload,
      timestamp: new Date().toISOString()
    };
  },

  fromMeta: (payload: any): InternalLead => {
    // Meta sends changes in an array structure
    const value = payload.entry?.[0]?.changes?.[0]?.value || payload;
    const fields = value.normalized_fields || {};

    return {
      external_id: value.leadgen_id,
      first_name: fields.full_name?.split(' ')[0] || 'Meta',
      last_name: fields.full_name?.split(' ').slice(1).join(' ') || 'User',
      email: fields.email || 'Not Provided',
      phone: fields.phone || 'N/A',
      platform: 'meta',
      campaign_id: String(value.campaign_id),
      ad_group_id: String(value.adset_id),
      form_id: String(value.form_id),
      ad_id: String(value.ad_id),
      interest: (fields.interest as ProductType) || ProductType.BUSINESS,
      raw_payload: payload,
      timestamp: new Date().toISOString()
    };
  },

  fromTikTok: (payload: any): InternalLead => {
    const data = payload.data || {};
    return {
      external_id: data.lead_id,
      first_name: data.details?.name?.split(' ')[0] || 'TikTok',
      last_name: data.details?.name?.split(' ').slice(1).join(' ') || 'User',
      email: data.details?.email || 'Not Provided',
      phone: data.details?.phone || 'N/A',
      platform: 'tiktok',
      campaign_id: String(data.campaign_id),
      form_id: String(data.form_id),
      ad_id: String(data.ad_id),
      interest: ProductType.IUL, // TikTok defaults to high-intent IUL for NHFG
      raw_payload: payload,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * BUSINESS LOGIC: INGESTION ENGINE
 * Handles Deduplication and Lead Scoring.
 */
export const IngestionEngine = {
  process: (normalized: InternalLead, existingLeads: Lead[]): { lead: Partial<Lead>, isNew: boolean, error?: string } => {
    
    // 1. Strict Deduplication (Protecting Advisor Commissions)
    // Key: email (if provided) or phone number
    const duplicate = existingLeads.find(l => {
        const emailMatch = l.email.toLowerCase() === normalized.email.toLowerCase() && normalized.email !== 'Not Provided';
        const phoneMatch = l.phone.replace(/\D/g,'') === normalized.phone.replace(/\D/g,'') && normalized.phone !== 'N/A';
        return emailMatch || phoneMatch;
    });

    if (duplicate) {
      return {
        isNew: false,
        lead: {
          id: duplicate.id,
          notes: `Re-engaged via ${normalized.platform} campaign ${normalized.campaign_id}`
        }
      };
    }

    // 2. New Lead Construction with locked attribution
    return {
      isNew: true,
      lead: {
        name: `${normalized.first_name} ${normalized.last_name}`,
        email: normalized.email,
        phone: normalized.phone,
        interest: normalized.interest,
        status: LeadStatus.NEW,
        source: `${normalized.platform}_ads`, 
        score: normalized.platform === 'google' ? 95 : 85, // Higher scoring for Google search intent
        qualification: 'Hot',
        message: `API Ingested Lead from ${normalized.platform}. Form: ${normalized.form_id}`,
      }
    };
  }
};
