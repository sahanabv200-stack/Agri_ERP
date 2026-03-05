const { z } = require("zod");
const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

const createSchema = z.object({
  transfer_date: z.string().min(8),
  from_warehouse_id: z.number().int(),
  to_warehouse_id: z.number().int(),
  commodity_id: z.number().int(),
  quantity_kg: z.number().positive(),
  notes: z.string().optional(),
});

module.exports = {
  async list(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT wt.*, wf.name AS from_name, wtow.name AS to_name, c.name AS commodity_name
       FROM warehouse_transfers wt
       JOIN warehouses wf ON wf.id = wt.from_warehouse_id
       JOIN warehouses wtow ON wtow.id = wt.to_warehouse_id
       JOIN commodities c ON c.id = wt.commodity_id
       WHERE wt.company_id=:company_id
       ORDER BY wt.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async create(req, res) {
    const { companyId } = req.user;
    const payload = createSchema.parse({
      ...req.body,
      from_warehouse_id: Number(req.body?.from_warehouse_id),
      to_warehouse_id: Number(req.body?.to_warehouse_id),
      commodity_id: Number(req.body?.commodity_id),
      quantity_kg: Number(req.body?.quantity_kg),
    });
    if (payload.from_warehouse_id === payload.to_warehouse_id) return badRequest(res, "From and To warehouse cannot be same");

    const [r] = await pool.query(
      `INSERT INTO warehouse_transfers
       (company_id, transfer_date, from_warehouse_id, to_warehouse_id, commodity_id, quantity_kg, status, notes)
       VALUES
       (:company_id,:transfer_date,:from_warehouse_id,:to_warehouse_id,:commodity_id,:quantity_kg,'OPEN',:notes)`,
      { company_id: companyId, ...payload }
    );
    return created(res, { id: r.insertId }, "Transfer created");
  },

  async update(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { quantity_kg, status, notes } = req.body || {};
    if (quantity_kg === undefined && status === undefined && notes === undefined) return badRequest(res, "No fields provided");

    const [r] = await pool.query(
      `UPDATE warehouse_transfers SET
        quantity_kg = COALESCE(:quantity_kg, quantity_kg),
        status = COALESCE(:status, status),
        notes = COALESCE(:notes, notes)
      WHERE id=:id AND company_id=:company_id`,
      { quantity_kg, status, notes, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Transfer not found");
    return ok(res, null, "Updated");
  },

  async remove(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM warehouse_transfers WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Transfer not found");
    return ok(res, null, "Deleted");
  },
};
