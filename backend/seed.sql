INSERT INTO users (email, name, role, category, title, phone, products_sold, languages, social_links, calendar_url)
VALUES
  ('admin@nhfg.local', 'Admin User', 'Administrator', 'Insurance & General', 'Admin', '555-0100', ARRAY['Life Insurance', 'Real Estate'],
   ARRAY['English'], '[{"platform":"LinkedIn","url":"https://linkedin.com/company/nhfg"}]'::jsonb, 'https://cal.example.com/admin'),
  ('advisor@nhfg.local', 'Avery Advisor', 'Advisor', 'Insurance & General', 'Senior Advisor', '555-0101', ARRAY['Life Insurance'],
   ARRAY['English', 'Spanish'], '[{"platform":"Facebook","url":"https://facebook.com/nhfg"}]'::jsonb, 'https://cal.example.com/advisor');

INSERT INTO leads (name, email, phone, interest, status, source, assigned_to, message, priority)
VALUES
  ('Jordan Lee', 'jordan.lee@example.com', '555-0200', 'Life Insurance', 'New', 'google_ads', (SELECT id FROM users WHERE email = 'advisor@nhfg.local'), 'Interested in term coverage.', 'High'),
  ('Casey Morgan', 'casey.morgan@example.com', '555-0201', 'Real Estate', 'New', 'meta_ads', NULL, 'Looking for first home financing.', 'Medium');

INSERT INTO clients (advisor_id, name, email, phone, product, policy_number, carrier, premium, renewal_date, commission_amount, address)
VALUES
  ((SELECT id FROM users WHERE email = 'advisor@nhfg.local'), 'Taylor Client', 'taylor.client@example.com', '555-0300', 'Life Insurance', 'NHFG-1001', 'NHFG Carrier', 1200.00, CURRENT_DATE + INTERVAL '1 year', 200.00,
   '{"street":"100 Main St","city":"Austin","state":"TX","zip":"78701"}'::jsonb);

INSERT INTO company_settings (id, data)
VALUES (
  'global_config',
  '{
    "phone": "555-0000",
    "email": "support@nhfg.local",
    "address": "100 Main St",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "heroBackgroundType": "image",
    "heroBackgroundUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "heroTitle": "New Horizon Financial Group",
    "heroSubtitle": "Insurance, real estate, and wealth solutions",
    "hiddenProducts": []
  }'::jsonb
);
