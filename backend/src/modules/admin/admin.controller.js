const bcrypt = require("bcryptjs");
const { pool } = require("../../config/db");
const { ok, created, badRequest, notFound } = require("../../utils/apiResponse");

const DEFAULT_ROLE_PERMISSION_PREFIXES = {
  ADMIN: ["*"],
  PURCHASE: ["purchase.", "masters.farmer.read", "masters.commodity.read", "masters.broker.read", "reports.read"],
  WEIGHBRIDGE: ["weighbridge.", "masters.vehicle.read", "masters.commodity.read", "reports.read"],
  WAREHOUSE: ["inventory.", "masters.warehouse.read", "masters.commodity.read", "purchase.transaction.read", "reports.read"],
  SALES: ["sales.", "masters.customer.read", "masters.broker.read", "masters.commodity.read", "transport.dispatch.read", "reports.read"],
  BROKER: ["masters.broker.", "sales.order.read", "sales.invoice.read", "reports.read"],
  ACCOUNTS: ["accounts.", "purchase.transaction.read", "sales.invoice.read", "reports.read"],
  TRANSPORT: ["transport.", "sales.invoice.read", "masters.vehicle.read", "masters.transporter.read", "reports.read"],
  VIEWER: [".read", "reports.read"],
};

function mapDefaultPermissions(roleCode, permissionCodes) {
  const prefixes = DEFAULT_ROLE_PERMISSION_PREFIXES[roleCode] || [".read"];
  if (prefixes.includes("*")) return permissionCodes;
  return permissionCodes.filter((code) => prefixes.some((prefix) => code.includes(prefix) || code.startsWith(prefix)));
}

async function fetchRoleByCode(companyId, code) {
  const [rows] = await pool.query(
    "SELECT id, code, name FROM roles WHERE company_id=:companyId AND code=:code LIMIT 1",
    { companyId, code }
  );
  return rows[0] || null;
}

async function fetchAllPermissionCodes() {
  const [rows] = await pool.query("SELECT code FROM permissions ORDER BY code ASC");
  return rows.map((row) => row.code);
}

async function replaceRolePermissions(roleId, permissionCodes) {
  await pool.query("DELETE FROM role_permissions WHERE role_id=:roleId", { roleId });
  if (!permissionCodes.length) return;
  const params = { roleId };
  const keys = permissionCodes.map((code, i) => {
    const key = `code${i}`;
    params[key] = code;
    return `:${key}`;
  });
  await pool.query(
    `INSERT IGNORE INTO role_permissions (role_id, permission_id)
     SELECT :roleId, p.id
     FROM permissions p
     WHERE p.code IN (${keys.join(", ")})`,
    params
  );
}

module.exports = {
  async getCompany(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query("SELECT * FROM companies WHERE id=:id LIMIT 1", { id: companyId });
    return ok(res, rows[0] || null);
  },

  async updateCompany(req, res) {
    const { companyId } = req.user;
    const { name, gstin, address, state, phone, email } = req.body || {};
    await pool.query(
      `UPDATE companies SET
        name = COALESCE(:name, name),
        gstin = COALESCE(:gstin, gstin),
        address = COALESCE(:address, address),
        state = COALESCE(:state, state),
        phone = COALESCE(:phone, phone),
        email = COALESCE(:email, email)
      WHERE id = :id`,
      { id: companyId, name, gstin, address, state, phone, email }
    );
    return ok(res, null, "Company updated");
  },

  async listUsers(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role_code, is_active, created_at FROM users WHERE company_id=:companyId ORDER BY id DESC",
      { companyId }
    );
    return ok(res, rows);
  },

  async createUser(req, res) {
    const { companyId } = req.user;
    const { name, email, phone, password, roleCode } = req.body || {};
    if (!name || !email || !password || !roleCode) return badRequest(res, "name, email, password, roleCode required");

    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (company_id, name, email, phone, password_hash, role_code, is_active) VALUES (:companyId,:name,:email,:phone,:password_hash,:role_code,1)",
      { companyId, name, email, phone: phone || null, password_hash, role_code: roleCode }
    );
    return created(res, null, "User created");
  },

  async updateUser(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { name, phone, roleCode, isActive } = req.body || {};
    const [r] = await pool.query(
      "UPDATE users SET name=COALESCE(:name,name), phone=COALESCE(:phone,phone), role_code=COALESCE(:role_code,role_code), is_active=COALESCE(:is_active,is_active) WHERE id=:id AND company_id=:companyId",
      { id, companyId, name, phone, role_code: roleCode, is_active: isActive }
    );
    if (r.affectedRows === 0) return notFound(res, "User not found");
    return ok(res, null, "User updated");
  },

  async deleteUser(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM users WHERE id=:id AND company_id=:companyId", { id, companyId });
    if (r.affectedRows === 0) return notFound(res, "User not found");
    return ok(res, null, "User deleted");
  },

  async listRoles(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT r.id, r.code, r.name, COUNT(rp.permission_id) AS permission_count
       FROM roles r
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       WHERE r.company_id=:companyId
       GROUP BY r.id, r.code, r.name
       ORDER BY r.code ASC`,
      { companyId }
    );
    return ok(res, rows);
  },

  async listPermissions(req, res) {
    const [rows] = await pool.query("SELECT id, code, description FROM permissions ORDER BY code ASC");
    return ok(res, rows);
  },

  async getRolePermissions(req, res) {
    const { companyId } = req.user;
    const code = String(req.params.code || "").toUpperCase();
    const role = await fetchRoleByCode(companyId, code);
    if (!role) return notFound(res, "Role not found");

    const [rows] = await pool.query(
      `SELECT p.code
       FROM role_permissions rp
       JOIN permissions p ON p.id = rp.permission_id
       WHERE rp.role_id=:roleId
       ORDER BY p.code ASC`,
      { roleId: role.id }
    );
    return ok(res, { role, permissionCodes: rows.map((row) => row.code) });
  },

  async updateRolePermissions(req, res) {
    const { companyId } = req.user;
    const code = String(req.params.code || "").toUpperCase();
    const permissionCodes = Array.isArray(req.body?.permissionCodes)
      ? req.body.permissionCodes.map((p) => String(p))
      : null;
    if (!permissionCodes) return badRequest(res, "permissionCodes array required");

    const role = await fetchRoleByCode(companyId, code);
    if (!role) return notFound(res, "Role not found");

    const allCodes = await fetchAllPermissionCodes();
    const allowed = new Set(allCodes);
    const sanitized = [...new Set(permissionCodes)].filter((p) => allowed.has(p));
    await replaceRolePermissions(role.id, sanitized);
    return ok(res, { assignedCount: sanitized.length }, "Role permissions updated");
  },

  async assignDefaultRolePermissions(req, res) {
    const { companyId } = req.user;
    const roleCode = req.body?.roleCode ? String(req.body.roleCode).toUpperCase() : null;
    const [roles] = await pool.query(
      "SELECT id, code FROM roles WHERE company_id=:companyId" + (roleCode ? " AND code=:roleCode" : ""),
      roleCode ? { companyId, roleCode } : { companyId }
    );
    if (!roles.length) return notFound(res, "Role not found");

    const allCodes = await fetchAllPermissionCodes();
    let updated = 0;
    for (const role of roles) {
      const defaults = mapDefaultPermissions(role.code, allCodes);
      await replaceRolePermissions(role.id, defaults);
      updated += 1;
    }
    return ok(res, { updatedRoles: updated }, "Default role permissions assigned");
  },

  async listFinancialYears(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      "SELECT * FROM financial_years WHERE company_id=:companyId ORDER BY start_date DESC, id DESC",
      { companyId }
    );
    return ok(res, rows);
  },

  async createFinancialYear(req, res) {
    const { companyId } = req.user;
    const { code, start_date, end_date, is_active } = req.body || {};
    if (!code || !start_date || !end_date) return badRequest(res, "code, start_date, end_date required");
    const [r] = await pool.query(
      `INSERT INTO financial_years (company_id, code, start_date, end_date, is_active)
       VALUES (:companyId, :code, :start_date, :end_date, :is_active)`,
      { companyId, code, start_date, end_date, is_active: is_active ?? 0 }
    );
    return created(res, { id: r.insertId }, "Financial year created");
  },

  async updateFinancialYear(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { code, start_date, end_date, is_active } = req.body || {};
    if (code === undefined && start_date === undefined && end_date === undefined && is_active === undefined) {
      return badRequest(res, "No fields provided");
    }
    const [r] = await pool.query(
      `UPDATE financial_years SET
       code=COALESCE(:code, code),
       start_date=COALESCE(:start_date, start_date),
       end_date=COALESCE(:end_date, end_date),
       is_active=COALESCE(:is_active, is_active)
       WHERE id=:id AND company_id=:companyId`,
      { id, companyId, code, start_date, end_date, is_active }
    );
    if (r.affectedRows === 0) return notFound(res, "Financial year not found");
    return ok(res, null, "Financial year updated");
  },

  async deleteFinancialYear(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM financial_years WHERE id=:id AND company_id=:companyId", { id, companyId });
    if (r.affectedRows === 0) return notFound(res, "Financial year not found");
    return ok(res, null, "Financial year deleted");
  },

  async listGstConfigs(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT g.*, c.name AS commodity_name
       FROM gst_configs g
       LEFT JOIN commodities c ON c.id = g.commodity_id
       WHERE g.company_id=:companyId
       ORDER BY g.effective_from DESC, g.id DESC`,
      { companyId }
    );
    return ok(res, rows);
  },

  async createGstConfig(req, res) {
    const { companyId } = req.user;
    const { commodity_id, hsn, cgst_pct, sgst_pct, igst_pct, effective_from, is_active } = req.body || {};
    if (!hsn || !effective_from) return badRequest(res, "hsn and effective_from required");
    const [r] = await pool.query(
      `INSERT INTO gst_configs
       (company_id, commodity_id, hsn, cgst_pct, sgst_pct, igst_pct, effective_from, is_active)
       VALUES (:companyId, :commodity_id, :hsn, :cgst_pct, :sgst_pct, :igst_pct, :effective_from, :is_active)`,
      {
        companyId,
        commodity_id: commodity_id ? Number(commodity_id) : null,
        hsn,
        cgst_pct: Number(cgst_pct || 0),
        sgst_pct: Number(sgst_pct || 0),
        igst_pct: Number(igst_pct || 0),
        effective_from,
        is_active: is_active ?? 1,
      }
    );
    return created(res, { id: r.insertId }, "GST config created");
  },

  async updateGstConfig(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["commodity_id", "hsn", "cgst_pct", "sgst_pct", "igst_pct", "effective_from", "is_active"];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (Object.keys(data).length === 0) return badRequest(res, "No fields provided");
    if (data.commodity_id !== undefined) data.commodity_id = data.commodity_id ? Number(data.commodity_id) : null;

    const sets = Object.keys(data).map((key) => `\`${key}\`= :${key}`).join(", ");
    const [r] = await pool.query(
      `UPDATE gst_configs SET ${sets} WHERE id=:id AND company_id=:companyId`,
      { ...data, id, companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "GST config not found");
    return ok(res, null, "GST config updated");
  },

  async deleteGstConfig(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM gst_configs WHERE id=:id AND company_id=:companyId", { id, companyId });
    if (r.affectedRows === 0) return notFound(res, "GST config not found");
    return ok(res, null, "GST config deleted");
  },

  async listCommodityPrices(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT cp.*, c.name AS commodity_name
       FROM commodity_prices cp
       JOIN commodities c ON c.id = cp.commodity_id
       WHERE cp.company_id=:companyId
       ORDER BY cp.effective_date DESC, cp.id DESC`,
      { companyId }
    );
    return ok(res, rows);
  },

  async createCommodityPrice(req, res) {
    const { companyId } = req.user;
    const { commodity_id, price_type, rate, effective_date, notes } = req.body || {};
    if (!commodity_id || !price_type || !rate || !effective_date) {
      return badRequest(res, "commodity_id, price_type, rate, effective_date required");
    }
    const [r] = await pool.query(
      `INSERT INTO commodity_prices (company_id, commodity_id, price_type, rate, effective_date, notes)
       VALUES (:companyId, :commodity_id, :price_type, :rate, :effective_date, :notes)`,
      {
        companyId,
        commodity_id: Number(commodity_id),
        price_type,
        rate: Number(rate),
        effective_date,
        notes: notes || null,
      }
    );
    return created(res, { id: r.insertId }, "Commodity price created");
  },

  async updateCommodityPrice(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["commodity_id", "price_type", "rate", "effective_date", "notes"];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (Object.keys(data).length === 0) return badRequest(res, "No fields provided");
    if (data.commodity_id !== undefined) data.commodity_id = Number(data.commodity_id);
    if (data.rate !== undefined) data.rate = Number(data.rate);

    const sets = Object.keys(data).map((key) => `\`${key}\`= :${key}`).join(", ");
    const [r] = await pool.query(
      `UPDATE commodity_prices SET ${sets} WHERE id=:id AND company_id=:companyId`,
      { ...data, id, companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Commodity price not found");
    return ok(res, null, "Commodity price updated");
  },

  async deleteCommodityPrice(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM commodity_prices WHERE id=:id AND company_id=:companyId", { id, companyId });
    if (r.affectedRows === 0) return notFound(res, "Commodity price not found");
    return ok(res, null, "Commodity price deleted");
  },
};
