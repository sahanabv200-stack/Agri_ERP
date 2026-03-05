const { pool } = require("../../config/db");
const { ok } = require("../../utils/apiResponse");

module.exports = {
  async dashboardSummary(req, res) {
    const { companyId } = req.user;

    const [[purchaseToday]] = await pool.query(
      `SELECT COUNT(*) AS count, COALESCE(SUM(total_payable), 0) AS amount
       FROM purchases
       WHERE company_id=:company_id AND purchase_date = CURDATE()`,
      { company_id: companyId }
    );

    const [[salesToday]] = await pool.query(
      `SELECT COUNT(*) AS count, COALESCE(SUM(total_amount), 0) AS amount
       FROM sales_invoices
       WHERE company_id=:company_id AND invoice_date = CURDATE() AND status <> 'CANCELLED'`,
      { company_id: companyId }
    );

    const [[openDispatches]] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM dispatches
       WHERE company_id=:company_id AND (status <> 'DELIVERED' OR delivery_confirmed_at IS NULL)`,
      { company_id: companyId }
    );

    const [[outstanding]] = await pool.query(
      `SELECT COUNT(*) AS invoices, COALESCE(SUM(total_amount), 0) AS amount
       FROM sales_invoices
       WHERE company_id=:company_id AND status IN ('DRAFT', 'OPEN', 'PENDING')`,
      { company_id: companyId }
    );

    const [[stock]] = await pool.query(
      `SELECT COALESCE(SUM(available_kg), 0) AS available_kg
       FROM stock_batches
       WHERE company_id=:company_id`,
      { company_id: companyId }
    );

    return ok(res, {
      purchaseToday: {
        count: Number(purchaseToday?.count || 0),
        amount: Number(purchaseToday?.amount || 0),
      },
      salesToday: {
        count: Number(salesToday?.count || 0),
        amount: Number(salesToday?.amount || 0),
      },
      openDispatches: {
        count: Number(openDispatches?.count || 0),
      },
      outstanding: {
        invoices: Number(outstanding?.invoices || 0),
        amount: Number(outstanding?.amount || 0),
      },
      stock: {
        availableKg: Number(stock?.available_kg || 0),
      },
    });
  },

  async purchaseReport(req, res) {
    const { companyId } = req.user;
    const from = req.query.from || "2000-01-01";
    const to = req.query.to || "2100-01-01";
    const [rows] = await pool.query(
      `SELECT purchase_date, COUNT(*) AS purchases, SUM(total_payable) AS total_payable
       FROM purchases
       WHERE company_id=:company_id AND purchase_date BETWEEN :from AND :to
       GROUP BY purchase_date
       ORDER BY purchase_date DESC`,
      { company_id: companyId, from, to }
    );
    return ok(res, rows);
  },

  async salesReport(req, res) {
    const { companyId } = req.user;
    const from = req.query.from || "2000-01-01";
    const to = req.query.to || "2100-01-01";
    const [rows] = await pool.query(
      `SELECT invoice_date, COUNT(*) AS invoices, SUM(total_amount) AS total_sales
       FROM sales_invoices
       WHERE company_id=:company_id AND invoice_date BETWEEN :from AND :to AND status <> 'CANCELLED'
       GROUP BY invoice_date
       ORDER BY invoice_date DESC`,
      { company_id: companyId, from, to }
    );
    return ok(res, rows);
  },

  async stockReport(req, res) {
    const { companyId } = req.user;
    const [rows] = await pool.query(
      `SELECT c.name AS commodity, SUM(available_kg) AS available_kg
       FROM stock_batches sb
       JOIN commodities c ON c.id = sb.commodity_id
       WHERE sb.company_id=:company_id
       GROUP BY c.name
       ORDER BY available_kg DESC`,
      { company_id: companyId }
    );
    return ok(res, rows);
  },

  async outstandingReport(req, res) {
    return ok(res, { note: "Outstanding report requires full accounting postings. Add after ledger automation." });
  },

  async profitLossReport(req, res) {
    return ok(res, { note: "P&L report requires full double-entry postings. Add next." });
  },
};
