const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const env = require("./config/env");

const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const mastersRoutes = require("./modules/masters/masters.routes");
const purchaseRoutes = require("./modules/purchase/purchase.routes");
const weighbridgeRoutes = require("./modules/weighbridge/weighbridge.routes");
const inventoryRoutes = require("./modules/inventory/inventory.routes");
const salesRoutes = require("./modules/sales/sales.routes");
const accountsRoutes = require("./modules/accounts/accounts.routes");
const transportRoutes = require("./modules/transport/transport.routes");
const reportsRoutes = require("./modules/reports/reports.routes");

const app = express();

app.use(helmet());
const explicitOrigins = String(env.CORS_ORIGIN || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (explicitOrigins.includes(origin)) return cb(null, true);
      if (env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(rateLimit({ windowMs: 60 * 1000, max: 240 }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/masters", mastersRoutes);
app.use("/api/v1/purchase", purchaseRoutes);
app.use("/api/v1/weighbridge", weighbridgeRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/accounts", accountsRoutes);
app.use("/api/v1/transport", transportRoutes);
app.use("/api/v1/reports", reportsRoutes);

app.use(errorHandler);

module.exports = app;
