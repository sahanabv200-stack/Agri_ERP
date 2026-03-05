const { z } = require("zod");
const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

const purchaseCreateSchema = z.object({
  purchase_date: z.string().min(8),
  farmer_id: z.number().int(),
  commodity_id: z.number().int(),
  quantity_kg: z.number().positive(),
  rate: z.number().positive(),
  moisture_pct: z.number().min(0).max(100).optional().default(0),
  quality_grade: z.string().optional(),
  commission_amount: z.number().min(0).optional().default(0),
  total_payable: z.number().positive(),
  notes: z.string().optional(),
});

module.exports = {
  async listPurchases(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT p.*, f.name AS farmer_name, c.name AS commodity_name
       FROM purchases p
       JOIN farmers f ON f.id = p.farmer_id
       JOIN commodities c ON c.id = p.commodity_id
       WHERE p.company_id = :company_id
       ORDER BY p.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async getPurchase(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [rows] = await pool.query(
      "SELECT * FROM purchases WHERE id=:id AND company_id=:company_id LIMIT 1",
      { id, company_id: companyId }
    );
    if (!rows[0]) return notFound(res, "Purchase not found");
    return ok(res, rows[0]);
  },

  async createPurchase(req, res) {
    const { companyId } = req.user;
    const payload = purchaseCreateSchema.parse({
      ...req.body,
      farmer_id: Number(req.body?.farmer_id),
      commodity_id: Number(req.body?.commodity_id),
      quantity_kg: Number(req.body?.quantity_kg),
      rate: Number(req.body?.rate),
      moisture_pct: req.body?.moisture_pct !== undefined ? Number(req.body.moisture_pct) : 0,
      commission_amount: req.body?.commission_amount !== undefined ? Number(req.body.commission_amount) : 0,
      total_payable: Number(req.body?.total_payable),
    });

    const [r] = await pool.query(
      `INSERT INTO purchases
      (company_id, purchase_date, farmer_id, commodity_id, quantity_kg, rate, moisture_pct, quality_grade, commission_amount, total_payable, notes)
      VALUES
      (:company_id,:purchase_date,:farmer_id,:commodity_id,:quantity_kg,:rate,:moisture_pct,:quality_grade,:commission_amount,:total_payable,:notes)`,
      { company_id: companyId, ...payload }
    );
    return created(res, { id: r.insertId }, "Purchase created");
  },

  async updatePurchase(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["purchase_date","farmer_id","commodity_id","quantity_kg","rate","moisture_pct","quality_grade","commission_amount","total_payable","notes","status"];
    const data = {};
    for (const k of allowed) if (req.body?.[k] !== undefined) data[k] = req.body[k];
    if (Object.keys(data).length === 0) return badRequest(res, "No fields provided");

    const sets = Object.keys(data).map((k) => `\`${k}\`= :${k}`).join(", ");
    const [r] = await pool.query(
      `UPDATE purchases SET ${sets} WHERE id=:id AND company_id=:company_id`,
      { ...data, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Purchase not found");
    return ok(res, null, "Updated");
  },

  async deletePurchase(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM purchases WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Purchase not found");
    return ok(res, null, "Deleted");
  },

  async listPurchaseOrders(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query("SELECT * FROM purchase_orders WHERE company_id=:company_id ORDER BY id DESC LIMIT 200", { company_id: companyId });
    return ok(res, rows);
  },

  async createPurchaseOrder(req, res) {
    const { companyId } = req.user;
    const { order_date, farmer_id, commodity_id, expected_qty_kg, expected_rate } = req.body || {};
    const [r] = await pool.query(
      `INSERT INTO purchase_orders (company_id, order_date, farmer_id, commodity_id, expected_qty_kg, expected_rate)
       VALUES (:company_id,:order_date,:farmer_id,:commodity_id,:expected_qty_kg,:expected_rate)`,
      {
        company_id: companyId,
        order_date,
        farmer_id: Number(farmer_id),
        commodity_id: Number(commodity_id),
        expected_qty_kg: Number(expected_qty_kg),
        expected_rate: Number(expected_rate),
      }
    );
    return created(res, { id: r.insertId }, "Purchase order created");
  },

  async updatePurchaseOrder(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["order_date", "farmer_id", "commodity_id", "expected_qty_kg", "expected_rate", "status"];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (Object.keys(data).length === 0) return badRequest(res, "No fields provided");

    if (data.farmer_id !== undefined) data.farmer_id = Number(data.farmer_id);
    if (data.commodity_id !== undefined) data.commodity_id = Number(data.commodity_id);
    if (data.expected_qty_kg !== undefined) data.expected_qty_kg = Number(data.expected_qty_kg);
    if (data.expected_rate !== undefined) data.expected_rate = Number(data.expected_rate);

    const sets = Object.keys(data).map((key) => `\`${key}\`= :${key}`).join(", ");
    const [r] = await pool.query(
      `UPDATE purchase_orders SET ${sets} WHERE id=:id AND company_id=:company_id`,
      { ...data, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Purchase order not found");
    return ok(res, null, "Purchase order updated");
  },

  async deletePurchaseOrder(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM purchase_orders WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Purchase order not found");
    return ok(res, null, "Purchase order deleted");
  },
};
