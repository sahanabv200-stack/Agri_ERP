import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, CircleDollarSign, FileClock, ShoppingCart, Truck, UserCog, Wallet } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/layout/PageHeader";
import { http } from "../api/http";

const quickActions = [
  { label: "Create Purchase", to: "/purchase/transactions", icon: ShoppingCart },
  { label: "Create Sales Invoice", to: "/sales/invoices", icon: Wallet },
  { label: "Add Stock Batch", to: "/inventory/batches", icon: Boxes },
  { label: "Record Payment", to: "/accounts/payments", icon: CircleDollarSign },
];

const moduleTiles = [
  {
    title: "Procurement",
    routes: [
      { label: "Purchase Transactions", to: "/purchase/transactions" },
      { label: "Purchase Orders", to: "/purchase/orders" },
      { label: "Weighbridge Entries", to: "/weighbridge/entries" },
    ],
  },
  {
    title: "Inventory & Dispatch",
    routes: [
      { label: "Stock Batches", to: "/inventory/batches" },
      { label: "Warehouse Transfers", to: "/inventory/transfers" },
      { label: "Dispatches", to: "/transport/dispatches" },
    ],
  },
  {
    title: "Sales & Accounts",
    routes: [
      { label: "Sales Orders", to: "/sales/orders" },
      { label: "Sales Invoices", to: "/sales/invoices" },
      { label: "Receipts", to: "/accounts/receipts" },
    ],
  },
  {
    title: "Administration",
    routes: [
      { label: "Company Profile", to: "/admin/company-profile" },
      { label: "Users", to: "/admin/users" },
      { label: "Roles & Permissions", to: "/admin/roles-permissions" },
    ],
  },
];

function fmtINR(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await http.get("/reports/dashboard-summary");
        setSummary(res.data?.data || null);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpiCards = [
    {
      label: "Purchases Today",
      icon: ShoppingCart,
      value: loading ? null : fmtINR(summary?.purchaseToday?.amount || 0),
      hint: loading ? "Loading..." : `${summary?.purchaseToday?.count || 0} transactions`,
    },
    {
      label: "Sales Today",
      icon: Wallet,
      value: loading ? null : fmtINR(summary?.salesToday?.amount || 0),
      hint: loading ? "Loading..." : `${summary?.salesToday?.count || 0} invoices`,
    },
    {
      label: "Open Dispatches",
      icon: Truck,
      value: loading ? null : String(summary?.openDispatches?.count || 0),
      hint: loading ? "Loading..." : "Pending delivery confirmations",
    },
    {
      label: "Outstanding",
      icon: FileClock,
      value: loading ? null : fmtINR(summary?.outstanding?.amount || 0),
      hint: loading ? "Loading..." : `${summary?.outstanding?.invoices || 0} pending invoices`,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Dashboard" subtitle="Overview of operations, finance, and setup actions" />
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.label} title={card.label}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {card.value === null ? (
                  <div className="h-8 w-28 rounded-lg bg-slate-100 animate-pulse" />
                ) : (
                  <div className="text-2xl font-semibold text-slate-900">{card.value}</div>
                )}
                <div className="text-xs text-slate-500">{card.hint}</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <card.icon size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Quick Actions">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <motion.div key={action.to} whileHover={{ y: -2 }} transition={{ duration: 0.16 }}>
              <Link
              key={action.to}
              to={action.to}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  <action.icon size={16} className="text-brand-600" />
                  {action.label}
                </span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {moduleTiles.map((tile) => (
          <Card key={tile.title} title={tile.title}>
            <div className="space-y-2">
              {tile.routes.map((route) => (
                <Link key={route.to} to={route.to} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <span>{route.label}</span>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card
        title="ERP Experience"
        actions={
          <Link to="/admin/roles-permissions">
            <Button variant="secondary" size="sm">
              <UserCog size={14} />
              Manage Access
            </Button>
          </Link>
        }
      >
        <div className="text-sm text-slate-700 space-y-1">
          <div>Live dashboard widgets are sourced from the database via reports summary.</div>
          <div>Total available stock: <span className="font-semibold">{loading ? "..." : `${summary?.stock?.availableKg || 0} KG`}</span></div>
          <div>Quick actions reduce navigation time for daily transactions.</div>
          <div>Use role permissions to customize module visibility per department.</div>
        </div>
      </Card>
    </div>
  );
}
