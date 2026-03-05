-- =========================
-- Vertex Agri Manager - Schema
-- =========================

CREATE TABLE IF NOT EXISTS companies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  gstin VARCHAR(20),
  address TEXT,
  state VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_company_name (name)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role_code VARCHAR(60) NOT NULL DEFAULT 'ADMIN',
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  code VARCHAR(60) NOT NULL,
  name VARCHAR(80) NOT NULL,
  UNIQUE(company_id, code),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- =========================
-- MASTERS
-- =========================
CREATE TABLE IF NOT EXISTS commodities (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(30),
  unit VARCHAR(30) DEFAULT 'KG',
  hsn VARCHAR(20),
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(company_id, name),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS farmers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  village VARCHAR(120),
  aadhaar VARCHAR(20),
  phone VARCHAR(20),
  address TEXT,
  bank_name VARCHAR(120),
  bank_account VARCHAR(40),
  ifsc VARCHAR(20),
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(120),
  gstin VARCHAR(20),
  address TEXT,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS brokers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  commission_pct DECIMAL(6,2) DEFAULT 0,
  address TEXT,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS warehouses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(180),
  capacity_kg DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS transporters (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  vehicle_no VARCHAR(30) NOT NULL,
  transporter_id BIGINT NULL,
  driver_name VARCHAR(120),
  driver_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(company_id, vehicle_no),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (transporter_id) REFERENCES transporters(id)
);

-- =========================
-- PURCHASE + WEIGHBRIDGE
-- =========================
CREATE TABLE IF NOT EXISTS purchases (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  purchase_date DATE NOT NULL,
  farmer_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  quantity_kg DECIMAL(12,2) NOT NULL,
  rate DECIMAL(12,2) NOT NULL,
  moisture_pct DECIMAL(6,2) DEFAULT 0,
  quality_grade VARCHAR(30),
  commission_amount DECIMAL(12,2) DEFAULT 0,
  total_payable DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  order_date DATE NOT NULL,
  farmer_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  expected_qty_kg DECIMAL(12,2) NOT NULL,
  expected_rate DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS weight_entries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  entry_date DATETIME NOT NULL,
  vehicle_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  gross_weight_kg DECIMAL(12,2) NOT NULL,
  tare_weight_kg DECIMAL(12,2) NOT NULL,
  net_weight_kg DECIMAL(12,2) NOT NULL,
  slip_no VARCHAR(40),
  status VARCHAR(20) DEFAULT 'IN_YARD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

-- =========================
-- INVENTORY
-- =========================
CREATE TABLE IF NOT EXISTS stock_batches (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  batch_no VARCHAR(40) NOT NULL,
  warehouse_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  purchase_id BIGINT NULL,
  bags INT DEFAULT 0,
  quantity_kg DECIMAL(12,2) NOT NULL,
  available_kg DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(company_id, batch_no),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id),
  FOREIGN KEY (purchase_id) REFERENCES purchases(id)
);

CREATE TABLE IF NOT EXISTS warehouse_transfers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  transfer_date DATE NOT NULL,
  from_warehouse_id BIGINT NOT NULL,
  to_warehouse_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  quantity_kg DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

-- =========================
-- SALES
-- =========================
CREATE TABLE IF NOT EXISTS sales_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  order_date DATE NOT NULL,
  customer_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  quantity_kg DECIMAL(12,2) NOT NULL,
  rate DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  broker_id BIGINT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id),
  FOREIGN KEY (broker_id) REFERENCES brokers(id)
);

CREATE TABLE IF NOT EXISTS sales_invoices (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  invoice_date DATE NOT NULL,
  invoice_no VARCHAR(40) NOT NULL,
  sales_order_id BIGINT NULL,
  customer_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  quantity_kg DECIMAL(12,2) NOT NULL,
  rate DECIMAL(12,2) NOT NULL,
  taxable_amount DECIMAL(12,2) NOT NULL,
  gst_pct DECIMAL(6,2) DEFAULT 0,
  gst_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(company_id, invoice_no),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS broker_commissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  broker_id BIGINT NOT NULL,
  sales_invoice_id BIGINT NOT NULL,
  commission_pct DECIMAL(6,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (broker_id) REFERENCES brokers(id),
  FOREIGN KEY (sales_invoice_id) REFERENCES sales_invoices(id)
);

-- =========================
-- ACCOUNTS (simplified)
-- =========================
CREATE TABLE IF NOT EXISTS ledgers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(40) NOT NULL,
  ref_table VARCHAR(60),
  ref_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  payment_date DATE NOT NULL,
  paid_to_ledger_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  mode VARCHAR(20) DEFAULT 'CASH',
  reference_no VARCHAR(60),
  narration VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (paid_to_ledger_id) REFERENCES ledgers(id)
);

CREATE TABLE IF NOT EXISTS receipts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  receipt_date DATE NOT NULL,
  received_from_ledger_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  mode VARCHAR(20) DEFAULT 'CASH',
  reference_no VARCHAR(60),
  narration VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (received_from_ledger_id) REFERENCES ledgers(id)
);

-- =========================
-- TRANSPORT / DISPATCH
-- =========================
CREATE TABLE IF NOT EXISTS dispatches (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  dispatch_date DATE NOT NULL,
  sales_invoice_id BIGINT NOT NULL,
  transporter_id BIGINT NULL,
  vehicle_id BIGINT NULL,
  freight_charge DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'PLANNED',
  delivery_confirmed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (sales_invoice_id) REFERENCES sales_invoices(id),
  FOREIGN KEY (transporter_id) REFERENCES transporters(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
