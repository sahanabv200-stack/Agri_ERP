const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const env = require("../config/env");

function readSql(file) {
  return fs.readFileSync(path.join(__dirname, "../../sql", file), "utf-8");
}

async function ensureDemoAdmin(conn) {
  const [companies] = await conn.query("SELECT id FROM companies WHERE name='Vertex Agri Trading' LIMIT 1");
  const companyId = companies?.[0]?.id;
  if (!companyId) throw new Error("Company not found after seed");

  const email = "admin@vertex.local";
  const password = "Admin@123";
  const hash = await bcrypt.hash(password, 10);

  const [existing] = await conn.query("SELECT id FROM users WHERE email=? LIMIT 1", [email]);

  if (!existing.length) {
    await conn.query(
      "INSERT INTO users (company_id, name, email, phone, password_hash, role_code, is_active) VALUES (?,?,?,?,?,?,1)",
      [companyId, "Vertex Admin", email, "9999999999", hash, "ADMIN"]
    );
    console.log("Demo admin created:", email);
  } else {
    await conn.query(
      "UPDATE users SET company_id=?, name=?, phone=?, password_hash=?, role_code='ADMIN', is_active=1 WHERE email=?",
      [companyId, "Vertex Admin", "9999999999", hash, email]
    );
    console.log("Demo admin updated:", email);
  }
}

async function main() {
  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    multipleStatements: true,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await conn.query(`USE \`${env.DB_NAME}\`;`);

  console.log("Applying schema...");
  await conn.query(readSql("01_schema.sql"));

  console.log("Seeding roles/permissions...");
  await conn.query(readSql("02_seed_roles_permissions.sql"));

  await ensureDemoAdmin(conn);

  await conn.end();
  console.log("DB init completed successfully.");
}

main().catch((e) => {
  console.error("DB init failed:", e);
  process.exit(1);
});
