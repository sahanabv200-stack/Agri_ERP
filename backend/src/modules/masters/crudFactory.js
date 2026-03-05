const { pool } = require("../../config/db");
const { ok, created, badRequest, notFound } = require("../../utils/apiResponse");

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj?.[k] !== undefined) out[k] = obj[k];
  return out;
}

function createCrudController({ table, idField = "id", allowedFields, searchFields = [] }) {
  return {
    async list(req, res) {
      const { companyId } = req.user;
      const q = String(req.query.q || "").trim();
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(5, Number(req.query.limit || 50)));
      const offset = (page - 1) * limit;

      let where = "WHERE company_id = :company_id";
      const params = { company_id: companyId, limit, offset };

      if (q && searchFields.length) {
        where += " AND (" + searchFields.map((f) => `\`${f}\` LIKE :q`).join(" OR ") + ")";
        params.q = `%${q}%`;
      }

      const [rows] = await pool.query(
        `SELECT * FROM \`${table}\` ${where} ORDER BY \`${idField}\` DESC LIMIT :limit OFFSET :offset`,
        params
      );
      return ok(res, rows);
    },

    async get(req, res) {
      const { companyId } = req.user;
      const id = Number(req.params.id);
      const [rows] = await pool.query(
        `SELECT * FROM \`${table}\` WHERE \`${idField}\`=:id AND company_id=:company_id LIMIT 1`,
        { id, company_id: companyId }
      );
      if (!rows[0]) return notFound(res, "Record not found");
      return ok(res, rows[0]);
    },

    async create(req, res) {
      const { companyId } = req.user;
      const data = pick(req.body || {}, allowedFields);
      if (!Object.keys(data).length) return badRequest(res, "No valid fields provided");
      data.company_id = companyId;

      const keys = Object.keys(data);
      const cols = keys.map((k) => `\`${k}\``).join(", ");
      const vals = keys.map((k) => `:${k}`).join(", ");

      const [r] = await pool.query(`INSERT INTO \`${table}\` (${cols}) VALUES (${vals})`, data);
      return created(res, { id: r.insertId }, "Created");
    },

    async update(req, res) {
      const { companyId } = req.user;
      const id = Number(req.params.id);
      const data = pick(req.body || {}, allowedFields);
      if (!Object.keys(data).length) return badRequest(res, "No valid fields provided");

      const sets = Object.keys(data).map((k) => `\`${k}\`= :${k}`).join(", ");
      const [r] = await pool.query(
        `UPDATE \`${table}\` SET ${sets} WHERE \`${idField}\`=:id AND company_id=:company_id`,
        { ...data, id, company_id: companyId }
      );
      if (r.affectedRows === 0) return notFound(res, "Record not found");
      return ok(res, null, "Updated");
    },

    async remove(req, res) {
      const { companyId } = req.user;
      const id = Number(req.params.id);
      const [r] = await pool.query(
        `DELETE FROM \`${table}\` WHERE \`${idField}\`=:id AND company_id=:company_id`,
        { id, company_id: companyId }
      );
      if (r.affectedRows === 0) return notFound(res, "Record not found");
      return ok(res, null, "Deleted");
    },
  };
}

module.exports = { createCrudController };
