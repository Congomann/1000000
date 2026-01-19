INSERT INTO users (email, name, role, category, title, phone, products_sold)
VALUES
  ('admin@nhfg.local', 'Admin User', 'Administrator', 'Insurance & General', 'Admin', '555-0100', ARRAY['Life Insurance', 'Real Estate']),
  ('advisor@nhfg.local', 'Avery Advisor', 'Advisor', 'Insurance & General', 'Senior Advisor', '555-0101', ARRAY['Life Insurance']);

INSERT INTO leads (name, email, phone, interest, status, source, assigned_to, message, priority)
VALUES
  ('Jordan Lee', 'jordan.lee@example.com', '555-0200', 'Life Insurance', 'New', 'google_ads', (SELECT id FROM users WHERE email = 'advisor@nhfg.local'), 'Interested in term coverage.', 'High'),
  ('Casey Morgan', 'casey.morgan@example.com', '555-0201', 'Real Estate', 'New', 'meta_ads', NULL, 'Looking for first home financing.', 'Medium');

INSERT INTO clients (advisor_id, name, email, phone, product, policy_number, carrier, premium, renewal_date, commission_amount, address)
VALUES
  ((SELECT id FROM users WHERE email = 'advisor@nhfg.local'), 'Taylor Client', 'taylor.client@example.com', '555-0300', 'Life Insurance', 'NHFG-1001', 'NHFG Carrier', 1200.00, CURRENT_DATE + INTERVAL '1 year', 200.00,
   '{"street":"100 Main St","city":"Austin","state":"TX","zip":"78701"}'::jsonb);
