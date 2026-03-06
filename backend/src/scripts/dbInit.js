const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { pgPool } = require("../config/db.pg");

function readSql(file) {
  return fs.readFileSync(path.join(__dirname, "../../sql", file), "utf-8");
}

async function ensureDemoAdmin() {
  const companyResult = await pgPool.query("SELECT id FROM companies WHERE name=$1 LIMIT 1", ["Vertex Agri Trading"]);
  const companyId = companyResult.rows?.[0]?.id;
  if (!companyId) throw new Error("Company not found after seed");

  const email = "admin@vertex.com";
  const password = "Admin@123";
  const hash = await bcrypt.hash(password, 10);

  await pgPool.query(
    `INSERT INTO users (company_id, name, email, phone, password_hash, role_code, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, 1)
     ON CONFLICT (email) DO UPDATE
     SET company_id = EXCLUDED.company_id,
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         password_hash = EXCLUDED.password_hash,
         role_code = EXCLUDED.role_code,
         is_active = EXCLUDED.is_active`,
    [companyId, "Vertex Admin", email, "9999999999", hash, "ADMIN"]
  );

  console.log("Demo admin upserted:", email);
}

async function main() {
  console.log("Applying schema...");
  await pgPool.query(readSql("01_schema.sql"));

  console.log("Applying extensions...");
  await pgPool.query(readSql("03_setup_extensions.sql"));

  console.log("Seeding roles/permissions...");
  await pgPool.query(readSql("02_seed_roles_permissions.sql"));

  await ensureDemoAdmin();

  await pgPool.end();
  console.log("DB init completed successfully.");
}

main().catch(async (e) => {
  console.error("DB init failed:", e);
  try {
    await pgPool.end();
  } catch (_) {}
  process.exit(1);
});
