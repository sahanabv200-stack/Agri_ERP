const { z } = require("zod");
const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

const createSchema = z.object({
  entry_date: z.string().min(8),
  vehicle_id: z.number().int(),
  commodity_id: z.number().int(),
  gross_weight_kg: z.number().positive(),
  tare_weight_kg: z.number().positive(),
  slip_no: z.string().optional(),
});

module.exports = {
  async list(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT we.*, v.vehicle_no, c.name AS commodity_name
       FROM weight_entries we
       JOIN vehicles v ON v.id = we.vehicle_id
       JOIN commodities c ON c.id = we.commodity_id
       WHERE we.company_id=:company_id
       ORDER BY we.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async get(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      "SELECT * FROM weight_entries WHERE id=:id AND company_id=:company_id LIMIT 1",
      { id, company_id: companyId }
    );
    if (!rows[0]) return notFound(res, "Entry not found");
    return ok(res, rows[0]);
  },

  async create(req, res) {
    const { companyId } = req.user;
    const payload = createSchema.parse({
      ...req.body,
      vehicle_id: Number(req.body?.vehicle_id),
      commodity_id: Number(req.body?.commodity_id),
      gross_weight_kg: Number(req.body?.gross_weight_kg),
      tare_weight_kg: Number(req.body?.tare_weight_kg),
    });

    const net = payload.gross_weight_kg - payload.tare_weight_kg;

    const [r] = await pool.query(
      `INSERT INTO weight_entries
       (company_id, entry_date, vehicle_id, commodity_id, gross_weight_kg, tare_weight_kg, net_weight_kg, slip_no, status)
       VALUES
       (:company_id,:entry_date,:vehicle_id,:commodity_id,:gross,:tare,:net,:slip,'IN_YARD')`,
      {
        company_id: companyId,
        entry_date: payload.entry_date,
        vehicle_id: payload.vehicle_id,
        commodity_id: payload.commodity_id,
        gross: payload.gross_weight_kg,
        tare: payload.tare_weight_kg,
        net,
        slip: payload.slip_no || null,
      }
    );
    return created(res, { id: r.insertId, net_weight_kg: net }, "Weight entry created");
  },

  async update(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { gross_weight_kg, tare_weight_kg, status, slip_no } = req.body || {};

    let net = null;
    if (gross_weight_kg !== undefined && tare_weight_kg !== undefined) {
      net = Number(gross_weight_kg) - Number(tare_weight_kg);
    }

    const [r] = await pool.query(
      `UPDATE weight_entries SET
        gross_weight_kg = COALESCE(:gross, gross_weight_kg),
        tare_weight_kg = COALESCE(:tare, tare_weight_kg),
        net_weight_kg = COALESCE(:net, net_weight_kg),
        status = COALESCE(:status, status),
        slip_no = COALESCE(:slip_no, slip_no)
      WHERE id=:id AND company_id=:company_id`,
      { gross: gross_weight_kg, tare: tare_weight_kg, net, status, slip_no, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Entry not found");
    return ok(res, null, "Updated");
  },

  async remove(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM weight_entries WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Entry not found");
    return ok(res, null, "Deleted");
  },
};
