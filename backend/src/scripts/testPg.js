const { pgPool } = require("../config/db.pg");

async function main() {
  const result = await pgPool.query("SELECT NOW() AS now");
  console.log("PostgreSQL connection OK:", result.rows[0]?.now);
  await pgPool.end();
}

main().catch(async (err) => {
  console.error("PostgreSQL connection test failed:", err);
  try {
    await pgPool.end();
  } catch (_) {}
  process.exit(1);
});
