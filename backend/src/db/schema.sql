CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(60) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  version VARCHAR(20) NOT NULL,
  status VARCHAR(40) NOT NULL,
  owner_name VARCHAR(120),
  next_review DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80),
  score NUMERIC(5,2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(30) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  item_description TEXT NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  status VARCHAR(40) NOT NULL,
  total_amount NUMERIC(12,2) DEFAULT 0,
  requested_by VARCHAR(120),
  requested_at DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS indicators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  target_value NUMERIC(12,2) NOT NULL,
  current_value NUMERIC(12,2) NOT NULL,
  trend VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  month_label VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audits (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL,
  audit_type VARCHAR(40) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  auditor_name VARCHAR(120) NOT NULL,
  planned_date DATE NOT NULL,
  status VARCHAR(40) NOT NULL,
  summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_findings (
  id SERIAL PRIMARY KEY,
  audit_id INTEGER NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  clause_ref VARCHAR(40),
  description TEXT NOT NULL,
  finding_type VARCHAR(30) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  evidence TEXT,
  responsible_name VARCHAR(120),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id SERIAL PRIMARY KEY,
  protocol VARCHAR(30) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  channel VARCHAR(60) NOT NULL,
  category VARCHAR(80) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL,
  description TEXT NOT NULL,
  solution TEXT,
  opened_at DATE,
  closed_at DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  owner_name VARCHAR(120),
  objective TEXT,
  risk_level VARCHAR(20),
  performance_status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS management_reviews (
  id SERIAL PRIMARY KEY,
  meeting_date DATE NOT NULL,
  chairperson VARCHAR(120) NOT NULL,
  agenda TEXT NOT NULL,
  decisions TEXT,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  module_name VARCHAR(80) NOT NULL,
  what_text TEXT NOT NULL,
  why_text TEXT NOT NULL,
  where_text TEXT,
  when_date DATE,
  who_name VARCHAR(120),
  how_text TEXT,
  how_much NUMERIC(12,2),
  status VARCHAR(30) NOT NULL,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  probability INTEGER NOT NULL,
  impact INTEGER NOT NULL,
  score INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  mitigation_plan TEXT,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  expected_gain TEXT,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS changes_log (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  impact_level VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
