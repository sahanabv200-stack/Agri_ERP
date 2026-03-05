const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

module.exports = {
  async list(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT d.*, si.invoice_no, t.name AS transporter_name, v.vehicle_no
       FROM dispatches d
       JOIN sales_invoices si ON si.id = d.sales_invoice_id
       LEFT JOIN transporters t ON t.id = d.transporter_id
       LEFT JOIN vehicles v ON v.id = d.vehicle_id
       WHERE d.company_id=:company_id
       ORDER BY d.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async create(req, res) {
    const { companyId } = req.user;
    const { dispatch_date, sales_invoice_id, transporter_id, vehicle_id, freight_charge } = req.body || {};
    if (!dispatch_date || !sales_invoice_id) return badRequest(res, "dispatch_date and sales_invoice_id required");

    const [r] = await pool.query(
      `INSERT INTO dispatches (company_id, dispatch_date, sales_invoice_id, transporter_id, vehicle_id, freight_charge, status)
       VALUES (:company_id,:dispatch_date,:sales_invoice_id,:transporter_id,:vehicle_id,:freight_charge,'PLANNED')`,
      {
        company_id: companyId,
        dispatch_date,
        sales_invoice_id: Number(sales_invoice_id),
        transporter_id: transporter_id ? Number(transporter_id) : null,
        vehicle_id: vehicle_id ? Number(vehicle_id) : null,
        freight_charge: freight_charge ? Number(freight_charge) : 0,
      }
    );
    return created(res, { id: r.insertId }, "Dispatch created");
  },

  async update(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { status, freight_charge } = req.body || {};
    if (status === undefined && freight_charge === undefined) return badRequest(res, "No fields provided");

    const [r] = await pool.query(
      "UPDATE dispatches SET status=COALESCE(:status,status), freight_charge=COALESCE(:freight_charge,freight_charge) WHERE id=:id AND company_id=:company_id",
      { status, freight_charge, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Dispatch not found");
    return ok(res, null, "Updated");
  },

  async remove(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM dispatches WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Dispatch not found");
    return ok(res, null, "Deleted");
  },

  async confirmDelivery(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query(
      "UPDATE dispatches SET status='DELIVERED', delivery_confirmed_at=NOW() WHERE id=:id AND company_id=:company_id",
      { id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Dispatch not found");
    return ok(res, null, "Delivery confirmed");
  },
};
