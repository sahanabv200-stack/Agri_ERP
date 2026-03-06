-- Company
INSERT INTO companies (name, gstin, address, state, phone, email)
VALUES ('Vertex Agri Trading', NULL, 'Bengaluru, Karnataka', 'Karnataka', '9999999999', 'admin@vertex.local')
ON CONFLICT (name) DO UPDATE
SET address = EXCLUDED.address,
    state = EXCLUDED.state,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;

-- Roles
INSERT INTO roles (company_id, code, name) VALUES
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'ADMIN', 'Admin / Business Owner'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'PURCHASE', 'Purchase Department'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'WEIGHBRIDGE', 'Weighbridge / Yard'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'WAREHOUSE', 'Warehouse / Inventory'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'SALES', 'Sales Department'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'BROKER', 'Broker Management'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'ACCOUNTS', 'Accounts & Finance'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'TRANSPORT', 'Transport & Logistics'),
((SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1), 'VIEWER', 'Viewer (Read-only)')
ON CONFLICT (company_id, code) DO UPDATE
SET name = EXCLUDED.name;

-- Permissions (starter set)
INSERT INTO permissions (code, description) VALUES
('masters.commodity.create','Create commodity'),
('masters.commodity.read','Read commodity'),
('masters.commodity.update','Update commodity'),
('masters.commodity.delete','Delete commodity'),

('masters.farmer.create','Create farmer'),
('masters.farmer.read','Read farmer'),
('masters.farmer.update','Update farmer'),
('masters.farmer.delete','Delete farmer'),

('masters.customer.create','Create customer'),
('masters.customer.read','Read customer'),
('masters.customer.update','Update customer'),
('masters.customer.delete','Delete customer'),

('masters.broker.create','Create broker'),
('masters.broker.read','Read broker'),
('masters.broker.update','Update broker'),
('masters.broker.delete','Delete broker'),

('masters.warehouse.create','Create warehouse'),
('masters.warehouse.read','Read warehouse'),
('masters.warehouse.update','Update warehouse'),
('masters.warehouse.delete','Delete warehouse'),

('masters.transporter.create','Create transporter'),
('masters.transporter.read','Read transporter'),
('masters.transporter.update','Update transporter'),
('masters.transporter.delete','Delete transporter'),

('masters.vehicle.create','Create vehicle'),
('masters.vehicle.read','Read vehicle'),
('masters.vehicle.update','Update vehicle'),
('masters.vehicle.delete','Delete vehicle'),

('purchase.transaction.create','Create purchase'),
('purchase.transaction.read','Read purchase'),
('purchase.transaction.update','Update purchase'),
('purchase.transaction.delete','Delete purchase'),

('weighbridge.entry.create','Create weigh entry'),
('weighbridge.entry.read','Read weigh entry'),
('weighbridge.entry.update','Update weigh entry'),
('weighbridge.entry.delete','Delete weigh entry'),

('inventory.batch.create','Create stock batch'),
('inventory.batch.read','Read stock batch'),
('inventory.batch.update','Update stock batch'),
('inventory.batch.delete','Delete stock batch'),

('inventory.transfer.create','Create warehouse transfer'),
('inventory.transfer.read','Read warehouse transfer'),
('inventory.transfer.update','Update warehouse transfer'),
('inventory.transfer.delete','Delete warehouse transfer'),

('sales.order.create','Create sales order'),
('sales.order.read','Read sales order'),
('sales.order.update','Update sales order'),
('sales.order.delete','Delete sales order'),

('sales.invoice.create','Create sales invoice'),
('sales.invoice.read','Read sales invoice'),
('sales.invoice.update','Update sales invoice'),
('sales.invoice.delete','Delete sales invoice'),

('accounts.ledger.create','Create ledger'),
('accounts.ledger.read','Read ledger'),
('accounts.ledger.update','Update ledger'),
('accounts.ledger.delete','Delete ledger'),

('accounts.payment.create','Create payment'),
('accounts.payment.read','Read payment'),
('accounts.payment.update','Update payment'),
('accounts.payment.delete','Delete payment'),

('accounts.receipt.create','Create receipt'),
('accounts.receipt.read','Read receipt'),
('accounts.receipt.update','Update receipt'),
('accounts.receipt.delete','Delete receipt'),

('transport.dispatch.create','Create dispatch'),
('transport.dispatch.read','Read dispatch'),
('transport.dispatch.update','Update dispatch'),
('transport.dispatch.delete','Delete dispatch'),

('reports.read','Read reports')
ON CONFLICT (code) DO NOTHING;

-- Role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.company_id = (SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1)
  AND r.code = 'ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON TRUE
WHERE r.company_id = (SELECT id FROM companies WHERE name = 'Vertex Agri Trading' LIMIT 1)
  AND r.code = 'VIEWER'
  AND (p.code LIKE '%.read' OR p.code = 'reports.read')
ON CONFLICT (role_id, permission_id) DO NOTHING;
