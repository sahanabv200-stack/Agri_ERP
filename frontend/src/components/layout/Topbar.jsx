import React from "react";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Button from "../ui/Button";

const ROUTE_LABELS = {
  "": "Dashboard",
  masters: "Masters",
  purchase: "Purchase",
  weighbridge: "Weighbridge",
  inventory: "Inventory",
  sales: "Sales",
  accounts: "Accounts",
  transport: "Transport",
  reports: "Reports",
  admin: "Setup",
  commodities: "Commodities",
  farmers: "Farmers",
  customers: "Customers",
  brokers: "Brokers",
  warehouses: "Warehouses",
  transporters: "Transporters",
  vehicles: "Vehicles",
  transactions: "Transactions",
  orders: "Orders",
  entries: "Entries",
  batches: "Batches",
  transfers: "Transfers",
  invoices: "Invoices",
  ledgers: "Ledgers",
  payments: "Payments",
  receipts: "Receipts",
  dispatches: "Dispatches",
  "company-profile": "Company Profile",
  users: "Users",
  "roles-permissions": "Roles & Permissions",
  "financial-years": "Financial Years",
  "gst-config": "GST Configuration",
  "price-management": "Price Management",
};

function labelFor(part) {
  return ROUTE_LABELS[part] || part.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function Topbar({ onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const parts = location.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const pageTitle = labelFor(parts[parts.length - 1] || "");
  const breadcrumb = ["Home", ...parts.map(labelFor)];

  return (
    <header className="h-16 md:h-20 border-b border-white/60 bg-white/70 backdrop-blur px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <Button type="button" variant="ghost" className="md:hidden" onClick={onOpenMobileMenu}>
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <div className="text-xs text-slate-500 truncate">{breadcrumb.join(" / ")}</div>
          <div className="font-semibold text-slate-900 truncate">{pageTitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition">
          <Bell size={16} />
        </button>
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-sky-500 text-white text-xs font-semibold flex items-center justify-center">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="text-sm text-slate-700">
            {user?.name || "User"} <span className="text-slate-400">({user?.roleCode || user?.role_code || "ROLE"})</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
