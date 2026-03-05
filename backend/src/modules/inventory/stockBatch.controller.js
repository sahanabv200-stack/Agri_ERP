const { z } = require("zod");
const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

const createSchema = z.object({
  batch_no: z.string().min(2),
  warehouse_id: z.number().int(),
  commodity_id: z.number().int(),
  purchase_id: z.number().int().optional(),
  bags: z.number().int().min(0).optional().default(0),
  quantity_kg: z.number().positive(),
});

module.exports = {
  async list(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT sb.*, w.name AS warehouse_name, c.name AS commodity_name
       FROM stock_batches sb
       JOIN warehouses w ON w.id = sb.warehouse_id
       JOIN commodities c ON c.id = sb.commodity_id
       WHERE sb.company_id=:company_id
       ORDER BY sb.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async create(req, res) {
    const { companyId } = req.user;
    const payload = createSchema.parse({
      ...req.body,
      warehouse_id: Number(req.body?.warehouse_id),
      commodity_id: Number(req.body?.commodity_id),
      purchase_id: req.body?.purchase_id ? Number(req.body.purchase_id) : undefined,
      bags: req.body?.bags !== undefined ? Number(req.body.bags) : 0,
      quantity_kg: Number(req.body?.quantity_kg),
    });

    const [r] = await pool.query(
      `INSERT INTO stock_batches
       (company_id, batch_no, warehouse_id, commodity_id, purchase_id, bags, quantity_kg, available_kg)
       VALUES
       (:company_id,:batch_no,:warehouse_id,:commodity_id,:purchase_id,:bags,:quantity_kg,:quantity_kg)`,
      { company_id: companyId, ...payload }
    );
    return created(res, { id: r.insertId }, "Batch created");
  },

  async update(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { bags, quantity_kg, available_kg } = req.body || {};
    if (bags === undefined && quantity_kg === undefined && available_kg === undefined) return badRequest(res, "No fields provided");

    const [r] = await pool.query(
      `UPDATE stock_batches SET
        bags = COALESCE(:bags, bags),
        quantity_kg = COALESCE(:quantity_kg, quantity_kg),
        available_kg = COALESCE(:available_kg, available_kg)
      WHERE id=:id AND company_id=:company_id`,
      { bags, quantity_kg, available_kg, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Batch not found");
    return ok(res, null, "Updated");
  },

  async remove(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM stock_batches WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Batch not found");
    return ok(res, null, "Deleted");
  },
};
