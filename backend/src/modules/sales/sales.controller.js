const { z } = require("zod");
const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

const orderSchema = z.object({
  order_date: z.string().min(8),
  customer_id: z.number().int(),
  commodity_id: z.number().int(),
  quantity_kg: z.number().positive(),
  rate: z.number().positive(),
  broker_id: z.number().int().optional(),
  discount_amount: z.number().min(0).optional().default(0),
  notes: z.string().optional(),
});

module.exports = {
  async listOrders(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT so.*, cu.name AS customer_name, co.name AS commodity_name, b.name AS broker_name
       FROM sales_orders so
       JOIN customers cu ON cu.id = so.customer_id
       JOIN commodities co ON co.id = so.commodity_id
       LEFT JOIN brokers b ON b.id = so.broker_id
       WHERE so.company_id=:company_id
       ORDER BY so.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async createOrder(req, res) {
    const { companyId } = req.user;
    const payload = orderSchema.parse({
      ...req.body,
      customer_id: Number(req.body?.customer_id),
      commodity_id: Number(req.body?.commodity_id),
      quantity_kg: Number(req.body?.quantity_kg),
      rate: Number(req.body?.rate),
      broker_id: req.body?.broker_id ? Number(req.body.broker_id) : undefined,
      discount_amount: req.body?.discount_amount !== undefined ? Number(req.body.discount_amount) : 0,
    });

    const [r] = await pool.query(
      `INSERT INTO sales_orders
       (company_id, order_date, customer_id, commodity_id, quantity_kg, rate, broker_id, discount_amount, notes, status)
       VALUES
       (:company_id,:order_date,:customer_id,:commodity_id,:quantity_kg,:rate,:broker_id,:discount_amount,:notes,'OPEN')`,
      { company_id: companyId, ...payload }
    );
    return created(res, { id: r.insertId }, "Sales order created");
  },

  async updateOrder(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["order_date","customer_id","commodity_id","quantity_kg","rate","broker_id","discount_amount","notes","status"];
    const data = {};
    for (const k of allowed) if (req.body?.[k] !== undefined) data[k] = req.body[k];
    if (!Object.keys(data).length) return badRequest(res, "No fields provided");

    const sets = Object.keys(data).map((k) => `\`${k}\`= :${k}`).join(", ");
    const [r] = await pool.query(
      `UPDATE sales_orders SET ${sets} WHERE id=:id AND company_id=:company_id`,
      { ...data, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Order not found");
    return ok(res, null, "Updated");
  },

  async deleteOrder(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM sales_orders WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Order not found");
    return ok(res, null, "Deleted");
  },

  async listInvoices(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT si.*, cu.name AS customer_name, co.name AS commodity_name
       FROM sales_invoices si
       JOIN customers cu ON cu.id = si.customer_id
       JOIN commodities co ON co.id = si.commodity_id
       WHERE si.company_id=:company_id
       ORDER BY si.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async createInvoice(req, res) {
    const { companyId } = req.user;
    const { invoice_date, invoice_no, customer_id, commodity_id, quantity_kg, rate, gst_pct } = req.body || {};
    const qty = Number(quantity_kg);
    const rt = Number(rate);
    if (!invoice_date || !invoice_no || !customer_id || !commodity_id || !qty || !rt) {
      return badRequest(res, "invoice_date, invoice_no, customer_id, commodity_id, quantity_kg, rate required");
    }

    const taxable = qty * rt;
    const gstp = gst_pct !== undefined ? Number(gst_pct) : 0;
    const gsta = taxable * (gstp / 100);
    const total = taxable + gsta;

    const [r] = await pool.query(
      `INSERT INTO sales_invoices
       (company_id, invoice_date, invoice_no, customer_id, commodity_id, quantity_kg, rate, taxable_amount, gst_pct, gst_amount, total_amount, status)
       VALUES
       (:company_id,:invoice_date,:invoice_no,:customer_id,:commodity_id,:quantity_kg,:rate,:taxable,:gst_pct,:gst_amount,:total,'DRAFT')`,
      {
        company_id: companyId,
        invoice_date,
        invoice_no,
        customer_id: Number(customer_id),
        commodity_id: Number(commodity_id),
        quantity_kg: qty,
        rate: rt,
        taxable,
        gst_pct: gstp,
        gst_amount: gsta,
        total,
      }
    );
    return created(res, { id: r.insertId, total_amount: total }, "Invoice created");
  },

  async updateInvoice(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const [r] = await pool.query(
      "UPDATE sales_invoices SET status = COALESCE(:status, status) WHERE id=:id AND company_id=:company_id",
      { status, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Invoice not found");
    return ok(res, null, "Updated");
  },

  async deleteInvoice(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM sales_invoices WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Invoice not found");
    return ok(res, null, "Deleted");
  },
};
