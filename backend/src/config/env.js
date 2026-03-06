const dotenv = require("dotenv");
const path = require("path");

// Always load .env from the backend project root (helps on Windows & when scripts run from different CWDs)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function must(name, fallback = undefined) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || String(v).trim() === "") {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

function optional(name, fallback = "") {
  const v = process.env[name];
  if (v === undefined || v === null) return fallback;
  return String(v);
}

const DATABASE_URL = optional("DATABASE_URL").trim();
const usePostgres = DATABASE_URL.length > 0;

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  JWT_SECRET: must("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  DATABASE_URL,
  usePostgres,

  DB_HOST: usePostgres ? optional("DB_HOST", "127.0.0.1") : must("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: usePostgres ? optional("DB_USER", "root") : must("DB_USER"),

  // Allow empty DB password for localhost phpMyAdmin/XAMPP setups.
  // If your MySQL has a password, set DB_PASSWORD in .env and it will be used.
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",

  DB_NAME: usePostgres ? optional("DB_NAME", "vertex_agri") : must("DB_NAME"),
};
