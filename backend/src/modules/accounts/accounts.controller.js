const { pool } = require("../../config/db");
const { ok, created, notFound, badRequest } = require("../../utils/apiResponse");

module.exports = {
  async listLedgers(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query("SELECT * FROM ledgers WHERE company_id=:company_id ORDER BY id DESC LIMIT 200", { company_id: companyId });
    return ok(res, rows);
  },

  async createLedger(req, res) {
    const { companyId } = req.user;
    const { name, type, ref_table, ref_id } = req.body || {};
    if (!name || !type) return badRequest(res, "name and type required");
    const [r] = await pool.query(
      "INSERT INTO ledgers (company_id, name, type, ref_table, ref_id) VALUES (:company_id,:name,:type,:ref_table,:ref_id)",
      { company_id: companyId, name, type, ref_table: ref_table || null, ref_id: ref_id || null }
    );
    return created(res, { id: r.insertId }, "Ledger created");
  },

  async updateLedger(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const { name, type } = req.body || {};
    if (name === undefined && type === undefined) return badRequest(res, "No fields provided");

    const [r] = await pool.query(
      "UPDATE ledgers SET name=COALESCE(:name,name), type=COALESCE(:type,type) WHERE id=:id AND company_id=:company_id",
      { name, type, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Ledger not found");
    return ok(res, null, "Updated");
  },

  async deleteLedger(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM ledgers WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Ledger not found");
    return ok(res, null, "Deleted");
  },

  async listPayments(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT p.*, l.name AS paid_to
       FROM payments p
       JOIN ledgers l ON l.id = p.paid_to_ledger_id
       WHERE p.company_id=:company_id
       ORDER BY p.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async createPayment(req, res) {
    const { companyId } = req.user;
    const { payment_date, paid_to_ledger_id, amount, mode, reference_no, narration } = req.body || {};
    if (!payment_date || !paid_to_ledger_id || !amount) return badRequest(res, "payment_date, paid_to_ledger_id, amount required");
    const [r] = await pool.query(
      `INSERT INTO payments (company_id, payment_date, paid_to_ledger_id, amount, mode, reference_no, narration)
       VALUES (:company_id,:payment_date,:paid_to_ledger_id,:amount,:mode,:reference_no,:narration)`,
      {
        company_id: companyId,
        payment_date,
        paid_to_ledger_id: Number(paid_to_ledger_id),
        amount: Number(amount),
        mode: mode || "CASH",
        reference_no: reference_no || null,
        narration: narration || null,
      }
    );
    return created(res, { id: r.insertId }, "Payment created");
  },

  async updatePayment(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["payment_date", "paid_to_ledger_id", "amount", "mode", "reference_no", "narration"];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (Object.keys(data).length === 0) return badRequest(res, "No fields provided");
    if (data.paid_to_ledger_id !== undefined) data.paid_to_ledger_id = Number(data.paid_to_ledger_id);
    if (data.amount !== undefined) data.amount = Number(data.amount);

    const sets = Object.keys(data).map((key) => `\`${key}\`= :${key}`).join(", ");
    const [r] = await pool.query(
      `UPDATE payments SET ${sets} WHERE id=:id AND company_id=:company_id`,
      { ...data, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Payment not found");
    return ok(res, null, "Payment updated");
  },

  async deletePayment(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM payments WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Payment not found");
    return ok(res, null, "Deleted");
  },

  async listReceipts(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT r.*, l.name AS received_from
       FROM receipts r
       JOIN ledgers l ON l.id = r.received_from_ledger_id
       WHERE r.company_id=:company_id
       ORDER BY r.id DESC LIMIT 200`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async createReceipt(req, res) {
    const { companyId } = req.user;
    const { receipt_date, received_from_ledger_id, amount, mode, reference_no, narration } = req.body || {};
    if (!receipt_date || !received_from_ledger_id || !amount) return badRequest(res, "receipt_date, received_from_ledger_id, amount required");
    const [r] = await pool.query(
      `INSERT INTO receipts (company_id, receipt_date, received_from_ledger_id, amount, mode, reference_no, narration)
       VALUES (:company_id,:receipt_date,:received_from_ledger_id,:amount,:mode,:reference_no,:narration)`,
      {
        company_id: companyId,
        receipt_date,
        received_from_ledger_id: Number(received_from_ledger_id),
        amount: Number(amount),
        mode: mode || "CASH",
        reference_no: reference_no || null,
        narration: narration || null,
      }
    );
    return created(res, { id: r.insertId }, "Receipt created");
  },

  async updateReceipt(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const allowed = ["receipt_date", "received_from_ledger_id", "amount", "mode", "reference_no", "narration"];
    const data = {};
    for (const key of allowed) if (req.body?.[key] !== undefined) data[key] = req.body[key];
    if (Object.keys(data).length === 0) return badRequest(res, "No fields provided");
    if (data.received_from_ledger_id !== undefined) data.received_from_ledger_id = Number(data.received_from_ledger_id);
    if (data.amount !== undefined) data.amount = Number(data.amount);

    const sets = Object.keys(data).map((key) => `\`${key}\`= :${key}`).join(", ");
    const [r] = await pool.query(
      `UPDATE receipts SET ${sets} WHERE id=:id AND company_id=:company_id`,
      { ...data, id, company_id: companyId }
    );
    if (r.affectedRows === 0) return notFound(res, "Receipt not found");
    return ok(res, null, "Receipt updated");
  },

  async deleteReceipt(req, res) {
    const { companyId } = req.user;
    const id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM receipts WHERE id=:id AND company_id=:company_id", { id, company_id: companyId });
    if (r.affectedRows === 0) return notFound(res, "Receipt not found");
    return ok(res, null, "Deleted");
  },
};
