const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { pool } = require("../../config/db");
const { ok, badRequest, unauthorized } = require("../../utils/apiResponse");

async function fetchUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, company_id, name, email, phone, password_hash, role_code, is_active FROM users WHERE email = :email LIMIT 1",
    { email }
  );
  return rows[0] || null;
}

async function fetchPermissions(companyId, roleCode) {
  const [rows] = await pool.query(
    `
    SELECT p.code
    FROM roles r
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE r.company_id = :companyId AND r.code = :roleCode
    `,
    { companyId, roleCode }
  );
  return rows.map((r) => r.code);
}

module.exports = {
  async login(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return badRequest(res, "Email and password required");

    const user = await fetchUserByEmail(email);
    if (!user || !user.is_active) return unauthorized(res, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return unauthorized(res, "Invalid credentials");

    const permissions = await fetchPermissions(user.company_id, user.role_code);

    const token = jwt.sign(
      { userId: user.id, companyId: user.company_id, roleCode: user.role_code, permissions },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return ok(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, roleCode: user.role_code }
    }, "Login successful");
  },

  async me(req, res) {
    const { userId } = req.user;
    const [rows] = await pool.query(
      "SELECT id, company_id, name, email, phone, role_code, is_active FROM users WHERE id = :id LIMIT 1",
      { id: userId }
    );
    return ok(res, { user: rows[0] || null });
  },
};
