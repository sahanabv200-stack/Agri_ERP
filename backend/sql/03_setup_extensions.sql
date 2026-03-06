-- Setup module extensions

CREATE TABLE IF NOT EXISTS financial_years (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL,
  code VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uniq_fin_year UNIQUE (company_id, code),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gst_configs (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL,
  commodity_id BIGINT NULL,
  hsn VARCHAR(20) NOT NULL,
  cgst_pct DECIMAL(6,2) DEFAULT 0,
  sgst_pct DECIMAL(6,2) DEFAULT 0,
  igst_pct DECIMAL(6,2) DEFAULT 0,
  effective_from DATE NOT NULL,
  is_active SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS commodity_prices (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL,
  commodity_id BIGINT NOT NULL,
  price_type VARCHAR(20) NOT NULL DEFAULT 'PURCHASE',
  rate DECIMAL(12,2) NOT NULL,
  effective_date DATE NOT NULL,
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE
);

