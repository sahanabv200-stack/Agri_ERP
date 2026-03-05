-- Company
INSERT INTO companies (name, gstin, address, state, phone, email)
VALUES ('Vertex Agri Trading', NULL, 'Bengaluru, Karnataka', 'Karnataka', '9999999999', 'admin@vertex.local')
ON DUPLICATE KEY UPDATE
  address=VALUES(address),
  state=VALUES(state),
  phone=VALUES(phone),
  email=VALUES(email);

SET @company_id := (SELECT id FROM companies WHERE name='Vertex Agri Trading' LIMIT 1);

-- Roles
INSERT INTO roles (company_id, code, name) VALUES
(@company_id,'ADMIN','Admin / Business Owner'),
(@company_id,'PURCHASE','Purchase Department'),
(@company_id,'WEIGHBRIDGE','Weighbridge / Yard'),
(@company_id,'WAREHOUSE','Warehouse / Inventory'),
(@company_id,'SALES','Sales Department'),
(@company_id,'BROKER','Broker Management'),
(@company_id,'ACCOUNTS','Accounts & Finance'),
(@company_id,'TRANSPORT','Transport & Logistics'),
(@company_id,'VIEWER','Viewer (Read-only)')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Permissions (starter set)
INSERT IGNORE INTO permissions (code, description) VALUES
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

('reports.read','Read reports');

-- Role permissions
SET @admin_role_id := (SELECT id FROM roles WHERE company_id=@company_id AND code='ADMIN' LIMIT 1);
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT @admin_role_id, p.id FROM permissions p;

SET @viewer_role_id := (SELECT id FROM roles WHERE company_id=@company_id AND code='VIEWER' LIMIT 1);
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT @viewer_role_id, p.id
FROM permissions p
WHERE p.code LIKE '%.read' OR p.code='reports.read';
