import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportsHome from "./pages/reports/ReportsHome.jsx";

import AppShell from "./components/layout/AppShell.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";

import Commodities from "./pages/masters/Commodities.jsx";
import Farmers from "./pages/masters/Farmers.jsx";
import Customers from "./pages/masters/Customers.jsx";
import Brokers from "./pages/masters/Brokers.jsx";
import Warehouses from "./pages/masters/Warehouses.jsx";
import Transporters from "./pages/masters/Transporters.jsx";
import Vehicles from "./pages/masters/Vehicles.jsx";

import Purchases from "./pages/purchase/Purchases.jsx";
import PurchaseOrders from "./pages/purchase/PurchaseOrders.jsx";
import WeightEntries from "./pages/weighbridge/WeightEntries.jsx";
import Batches from "./pages/inventory/Batches.jsx";
import Transfers from "./pages/inventory/Transfers.jsx";
import SalesOrders from "./pages/sales/SalesOrders.jsx";
import SalesInvoices from "./pages/sales/SalesInvoices.jsx";
import Ledgers from "./pages/accounts/Ledgers.jsx";
import Payments from "./pages/accounts/Payments.jsx";
import Receipts from "./pages/accounts/Receipts.jsx";
import Dispatches from "./pages/transport/Dispatches.jsx";
import CompanyProfile from "./pages/admin/CompanyProfile.jsx";
import Users from "./pages/admin/Users.jsx";
import RolesPermissions from "./pages/admin/RolesPermissions.jsx";
import FinancialYears from "./pages/admin/FinancialYears.jsx";
import GstConfig from "./pages/admin/GstConfig.jsx";
import PriceManagement from "./pages/admin/PriceManagement.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="masters/commodities" element={<Commodities />} />
        <Route path="masters/farmers" element={<Farmers />} />
        <Route path="masters/customers" element={<Customers />} />
        <Route path="masters/brokers" element={<Brokers />} />
        <Route path="masters/warehouses" element={<Warehouses />} />
        <Route path="masters/transporters" element={<Transporters />} />
        <Route path="masters/vehicles" element={<Vehicles />} />

        <Route path="purchase/transactions" element={<Purchases />} />
        <Route path="purchase/orders" element={<PurchaseOrders />} />
        <Route path="weighbridge/entries" element={<WeightEntries />} />
        <Route path="inventory/batches" element={<Batches />} />
        <Route path="inventory/transfers" element={<Transfers />} />
        <Route path="sales/orders" element={<SalesOrders />} />
        <Route path="sales/invoices" element={<SalesInvoices />} />
        <Route path="accounts/ledgers" element={<Ledgers />} />
        <Route path="accounts/payments" element={<Payments />} />
        <Route path="accounts/receipts" element={<Receipts />} />
        <Route path="transport/dispatches" element={<Dispatches />} />

        <Route path="admin/company-profile" element={<CompanyProfile />} />
        <Route path="admin/users" element={<Users />} />
        <Route path="admin/roles-permissions" element={<RolesPermissions />} />
        <Route path="admin/financial-years" element={<FinancialYears />} />
        <Route path="admin/gst-config" element={<GstConfig />} />
        <Route path="admin/price-management" element={<PriceManagement />} />

        <Route path="reports" element={<ReportsHome />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
