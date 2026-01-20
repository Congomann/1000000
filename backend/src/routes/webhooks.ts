import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// --- HELPER: WEBHOOK NORMALIZERS ---
const WebhookNormalizer = {
    google: (payload: any) => {
        const fields: Record<string, string> = {};
        if (payload.user_column_data) {
            payload.user_column_data.forEach((col: any) => {
                fields[col.column_id] = col.string_value;
            });
        }
        return {
            name: fields.FULL_NAME || `${fields.FIRST_NAME || ''} ${fields.LAST_NAME || ''}`.trim() || 'Google Lead',
            email: fields.EMAIL || 'Not Provided',
            phone: fields.PHONE_NUMBER || 'N/A',
            interest: fields.PRODUCT_INTEREST || 'Life Insurance',
            campaign_id: String(payload.campaign_id),
            source: 'google_ads'
        };
    },
    meta: (payload: any) => {
        const entry = payload.entry?.[0];
        const change = entry?.changes?.[0]?.value || payload;

        const fieldMap: Record<string, string> = {};
        if (change.field_data) {
            change.field_data.forEach((f: any) => fieldMap[f.name] = f.values[0]);
        }

        return {
            name: fieldMap.full_name || change.full_name || 'Meta Lead',
            email: fieldMap.email || change.email || 'Not Provided',
            phone: fieldMap.phone_number || change.phone_number || 'N/A',
            interest: fieldMap.job_title || 'Business Insurance',
            campaign_id: String(change.campaign_id),
            source: 'meta_ads'
        };
    },
    tiktok: (payload: any) => {
        const data = payload.data || {};
        return {
            name: data.details?.name || 'TikTok Lead',
            email: data.details?.email || 'Not Provided',
            phone: data.details?.phone || 'N/A',
            interest: 'Indexed Universal Life (IUL)',
            campaign_id: String(data.campaign_id),
            source: 'tiktok_ads'
        };
    }
};

router.post('/:platform', async (req, res) => {
    const { platform } = req.params;
    const payload = req.body;

    console.log(`[API] Received ${platform} webhook`);

    try {
        // 1. Log Raw Event
        // @ts-ignore
        await prisma.integrationLog.create({
            data: {
                platform,
                // @ts-ignore
                eventType: 'INGEST_ATTEMPT',
                status: 'pending',
                payload
            }
        });

        // 2. Normalize Data
        let leadData = null;
        if (platform === 'google') leadData = WebhookNormalizer.google(payload);
        else if (platform === 'meta') leadData = WebhookNormalizer.meta(payload);
        else if (platform === 'tiktok') leadData = WebhookNormalizer.tiktok(payload);
        else throw new Error('Unsupported platform');

        // 3. Insert Normalized Lead
        if (leadData) {
            // @ts-ignore
            await prisma.lead.create({
                data: {
                    name: leadData.name,
                    email: leadData.email,
                    phone: leadData.phone,
                    interest: leadData.interest,
                    source: leadData.source,
                    campaignId: leadData.campaign_id,
                    status: 'New',
                    platformData: payload,
                    message: 'Auto-Imported via Webhook'
                }
            });

            res.json({ success: true, message: 'Lead normalized and ingested' });
        } else {
            res.status(400).json({ error: 'Normalization failed' });
        }

    } catch (err: any) {
        console.error(err);
        // Log Failure
        try {
            // @ts-ignore
            await prisma.integrationLog.create({
                data: {
                    platform,
                    // @ts-ignore
                    eventType: 'INGEST_ERROR',
                    status: 'failure',
                    errorMessage: err.message
                }
            });
        } catch (logErr) { console.error("Failed to log error", logErr); }

        res.status(500).json({ error: err.message });
    }
});

export default router;
