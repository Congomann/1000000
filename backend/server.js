
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const SERVER_START_TIME = new Date().toISOString();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres error', err);
});

// --- HELPER: WEBHOOK NORMALIZERS ---
// These functions automatically correct incoming messy JSON from ad platforms into our clean Schema

const WebhookNormalizer = {
    google: (payload) => {
        const fields = {};
        // Google sends data in a 'user_column_data' array
        if (payload.user_column_data) {
            payload.user_column_data.forEach(col => {
                fields[col.column_id] = col.string_value;
            });
        }
        return {
            name: fields.FULL_NAME || `${fields.FIRST_NAME || ''} ${fields.LAST_NAME || ''}`.trim() || 'Google Lead',
            email: fields.EMAIL || 'Not Provided',
            phone: fields.PHONE_NUMBER || 'N/A',
            interest: fields.PRODUCT_INTEREST || 'Life Insurance', // Default fallback
            campaign_id: payload.campaign_id,
            source: 'google_ads'
        };
    },
    meta: (payload) => {
        // Meta/Facebook sends data in entry[].changes[].value
        const entry = payload.entry?.[0];
        const change = entry?.changes?.[0]?.value || payload; // Handle raw test payloads too
        const form = change.form_data || {}; // Hypothetical flattened structure or normalize field_data
        
        // Real Meta payloads often use 'field_data' array mapping name->values
        const fieldMap = {};
        if (change.field_data) {
            change.field_data.forEach(f => fieldMap[f.name] = f.values[0]);
        }

        return {
            name: fieldMap.full_name || change.full_name || 'Meta Lead',
            email: fieldMap.email || change.email || 'Not Provided',
            phone: fieldMap.phone_number || change.phone_number || 'N/A',
            interest: fieldMap.job_title || 'Business Insurance', // Often mapped to custom questions
            campaign_id: change.campaign_id,
            source: 'meta_ads'
        };
    },
    tiktok: (payload) => {
        const data = payload.data || {};
        return {
            name: data.details?.name || 'TikTok Lead',
            email: data.details?.email || 'Not Provided',
            phone: data.details?.phone || 'N/A',
            interest: 'Indexed Universal Life (IUL)', // TikTok default high intent
            campaign_id: data.campaign_id,
            source: 'tiktok_ads'
        };
    }
};

// --- API ROUTES ---

// 1. Dashboard Metrics
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    const revenueQuery = await pool.query('SELECT SUM(premium) as total FROM clients');
    const clientsQuery = await pool.query('SELECT COUNT(*) as count FROM clients');
    const leadsQuery = await pool.query("SELECT COUNT(*) as count FROM leads WHERE status = 'New'");
    
    res.json({
      totalRevenue: parseFloat(revenueQuery.rows[0].total || 0),
      activeClients: parseInt(clientsQuery.rows[0].count),
      pendingLeads: parseInt(leadsQuery.rows[0].count),
      monthlyPerformance: [
        { month: 'Jan', revenue: 45000, leads: 24 },
        { month: 'Feb', revenue: 52000, leads: 30 },
        { month: 'Mar', revenue: 48000, leads: 28 },
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 0. Health Check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', time: SERVER_START_TIME });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 2. Leads Management
app.get('/api/leads', async (req, res) => {
  try {
    const { advisorId } = req.query;
    let query = 'SELECT * FROM leads WHERE is_archived = false';
    const params = [];
    
    if (advisorId) {
      query += ' AND (assigned_to = $1 OR assigned_to IS NULL)';
      params.push(advisorId);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    
    // Convert snake_case DB to camelCase for frontend
    const leads = result.rows.map(mapLeadRow);
    
    res.json(leads);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/leads', async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, phone, interest, status, source, assignedTo, message, lifeDetails, realEstateDetails, securitiesDetails, customDetails } = req.body;
    
    await client.query('BEGIN');
    
    const insertQuery = `
      INSERT INTO leads (
          name, email, phone, interest, status, source, assigned_to, message, 
          life_details, real_estate_details, securities_details, custom_details
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;
    
    const result = await client.query(insertQuery, [
      name, email, phone, interest, status || 'New', source, assignedTo, message, 
      lifeDetails, realEstateDetails, securitiesDetails, customDetails
    ]);
    
    await client.query('COMMIT');
    res.status(201).json({ id: result.rows[0].id, success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const allowedFields = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    interest: 'interest',
    status: 'status',
    source: 'source',
    assignedTo: 'assigned_to',
    message: 'message',
    lifeDetails: 'life_details',
    realEstateDetails: 'real_estate_details',
    securitiesDetails: 'securities_details',
    customDetails: 'custom_details',
    score: 'score',
    qualification: 'qualification',
    priority: 'priority',
    campaign: 'campaign_id',
    adGroup: 'ad_group_id',
    adId: 'ad_id',
    platformData: 'platform_data',
    isArchived: 'is_archived'
  };

  const updates = [];
  const values = [];
  let index = 1;

  Object.entries(allowedFields).forEach(([key, column]) => {
    if (req.body[key] !== undefined) {
      updates.push(`${column} = $${index}`);
      values.push(req.body[key]);
      index += 1;
    }
  });

  if (updates.length === 0) {
    res.status(400).json({ error: 'No valid fields provided' });
    return;
  }

  values.push(id);
  const query = `
    UPDATE leads
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING *
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json(mapLeadRow(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Webhook Ingestion (The Auto-Corrector)
app.post('/api/webhooks/:platform', async (req, res) => {
  const { platform } = req.params;
  const payload = req.body;
  
  console.log(`[API] Received ${platform} webhook`);

  // 1. Log Raw Event
  await pool.query(
    'INSERT INTO integration_logs (platform, event_type, status, payload) VALUES ($1, $2, $3, $4)',
    [platform, 'INGEST_ATTEMPT', 'pending', JSON.stringify(payload)]
  );

  try {
      // 2. Normalize Data
      let leadData = null;
      if (platform === 'google') leadData = WebhookNormalizer.google(payload);
      else if (platform === 'meta') leadData = WebhookNormalizer.meta(payload);
      else if (platform === 'tiktok') leadData = WebhookNormalizer.tiktok(payload);
      else throw new Error('Unsupported platform');

      // 3. Insert Normalized Lead
      if (leadData) {
          await pool.query(
              `INSERT INTO leads (name, email, phone, interest, source, campaign_id, status, platform_data, message)
               VALUES ($1, $2, $3, $4, $5, $6, 'New', $7, 'Auto-Imported via Webhook')`,
              [leadData.name, leadData.email, leadData.phone, leadData.interest, leadData.source, leadData.campaign_id, JSON.stringify(payload)]
          );
          
          res.json({ success: true, message: 'Lead normalized and ingested' });
      } else {
          res.status(400).json({ error: 'Normalization failed' });
      }

  } catch (err) {
      console.error(err);
      // Log Failure
      await pool.query(
        'INSERT INTO integration_logs (platform, event_type, status, error_message) VALUES ($1, $2, $3, $4)',
        [platform, 'INGEST_ERROR', 'failure', err.message]
      );
      res.status(500).json({ error: err.message });
  }
});

// 4. Auth
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  // Simplified login for demo - in prod use bcrypt compare
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
  if (result.rows.length > 0) {
      res.json(mapUserRow(result.rows[0]));
  } else {
      res.status(401).json({ error: 'User not found' });
  }
});

// 5. Clients
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows.map(mapClientRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  const {
    advisorId,
    userId,
    name,
    email,
    phone,
    product,
    policyNumber,
    carrier,
    premium,
    renewalDate,
    commissionAmount,
    address
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO clients (
        advisor_id, user_id, name, email, phone, product, policy_number, carrier,
        premium, renewal_date, commission_amount, address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        advisorId,
        userId,
        name,
        email,
        phone,
        product,
        policyNumber,
        carrier,
        premium,
        renewalDate,
        commissionAmount,
        address
      ]
    );

    res.status(201).json(mapClientRow(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const allowedFields = {
    advisorId: 'advisor_id',
    userId: 'user_id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    product: 'product',
    policyNumber: 'policy_number',
    carrier: 'carrier',
    premium: 'premium',
    renewalDate: 'renewal_date',
    commissionAmount: 'commission_amount',
    address: 'address'
  };

  const updates = [];
  const values = [];
  let index = 1;

  Object.entries(allowedFields).forEach(([key, column]) => {
    if (req.body[key] !== undefined) {
      updates.push(`${column} = $${index}`);
      values.push(req.body[key]);
      index += 1;
    }
  });

  if (updates.length === 0) {
    res.status(400).json({ error: 'No valid fields provided' });
    return;
  }

  values.push(id);
  const query = `
    UPDATE clients
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING *
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(mapClientRow(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC');
    res.json(result.rows.map(mapUserRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const {
    email,
    name,
    role,
    category,
    title,
    phone,
    avatar,
    bio,
    productsSold,
    license_states,
    micrositeEnabled,
    onboardingCompleted
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (
        email, name, role, category, title, phone, avatar, bio, products_sold, license_states,
        microsite_enabled, onboarding_completed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        email,
        name,
        role,
        category,
        title,
        phone,
        avatar,
        bio,
        productsSold,
        license_states,
        micrositeEnabled,
        onboardingCompleted
      ]
    );

    res.status(201).json(mapUserRow(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const allowedFields = {
    email: 'email',
    name: 'name',
    role: 'role',
    category: 'category',
    title: 'title',
    phone: 'phone',
    avatar: 'avatar',
    bio: 'bio',
    productsSold: 'products_sold',
    license_states: 'license_states',
    micrositeEnabled: 'microsite_enabled',
    onboardingCompleted: 'onboarding_completed'
  };

  const updates = [];
  const values = [];
  let index = 1;

  Object.entries(allowedFields).forEach(([key, column]) => {
    if (req.body[key] !== undefined) {
      updates.push(`${column} = $${index}`);
      values.push(req.body[key]);
      index += 1;
    }
  });

  if (updates.length === 0) {
    res.status(400).json({ error: 'No valid fields provided' });
    return;
  }

  values.push(id);
  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING *
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(mapUserRow(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Company Settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM company_settings WHERE id = $1', ['global_config']);
    if (result.rows.length === 0) {
      res.json(null);
      return;
    }
    res.json(result.rows[0].settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const settings = req.body;
    const result = await pool.query(
      `INSERT INTO company_settings (id, settings)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET settings = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING settings`,
      ['global_config', settings]
    );
    res.json(result.rows[0].settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Integration Logs
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM integration_logs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`NHFG CRM API Server running on port ${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Closing server.`);
  await pool.end();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
