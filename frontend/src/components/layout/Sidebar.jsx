import React from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Blocks,
  Box,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileBarChart2,
  Gauge,
  Scale,
  Settings2,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  Weight,
} from "lucide-react";
import Button from "../ui/Button";

const SIDEBAR_GROUPS = [
  {
    title: "Home",
    items: [{ to: "/", label: "Dashboard", icon: Gauge }],
  },
  {
    title: "Masters",
    items: [
      { to: "/masters/commodities", label: "Commodities", icon: Box },
      { to: "/masters/farmers", label: "Farmers", icon: Users },
      { to: "/masters/customers", label: "Customers", icon: BriefcaseBusiness },
      { to: "/masters/brokers", label: "Brokers", icon: CircleDollarSign },
      { to: "/masters/warehouses", label: "Warehouses", icon: Warehouse },
      { to: "/masters/transporters", label: "Transporters", icon: Truck },
      { to: "/masters/vehicles", label: "Vehicles", icon: Truck },
    ],
  },
  {
    title: "Operations",
    items: [
      { to: "/purchase/transactions", label: "Purchases", icon: ShoppingCart },
      { to: "/purchase/orders", label: "Purchase Orders", icon: ClipboardList },
      { to: "/weighbridge/entries", label: "Weighbridge Entries", icon: Weight },
      { to: "/inventory/batches", label: "Stock Batches", icon: Blocks },
      { to: "/inventory/transfers", label: "Warehouse Transfers", icon: Scale },
      { to: "/sales/orders", label: "Sales Orders", icon: ClipboardList },
      { to: "/sales/invoices", label: "Sales Invoices", icon: FileBarChart2 },
      { to: "/transport/dispatches", label: "Dispatches", icon: Truck },
    ],
  },
  {
    title: "Finance",
    items: [
      { to: "/accounts/ledgers", label: "Ledgers", icon: CircleDollarSign },
      { to: "/accounts/payments", label: "Payments", icon: CircleDollarSign },
      { to: "/accounts/receipts", label: "Receipts", icon: CircleDollarSign },
      { to: "/reports", label: "Reports", icon: FileBarChart2 },
    ],
  },
  {
    title: "Setup",
    items: [
      { to: "/admin/company-profile", label: "Company Profile", icon: BriefcaseBusiness },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/roles-permissions", label: "Roles & Permissions", icon: Settings2 },
      { to: "/admin/financial-years", label: "Financial Years", icon: ClipboardList },
      { to: "/admin/gst-config", label: "GST Configuration", icon: FileBarChart2 },
      { to: "/admin/price-management", label: "Price Management", icon: CircleDollarSign },
    ],
  },
];

function NavItem({ item, compact = false, onClick }) {
  const Icon = item.icon || Gauge;

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
          isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full ${isActive ? "bg-brand-500" : "bg-transparent"}`} />
          <Icon size={16} className="shrink-0" />
          {!compact ? <span className="truncate">{item.label}</span> : null}
        </>
      )}
    </NavLink>
  );
}

function SidebarBody({ compact = false, onNavigate }) {
  return (
    <div className="space-y-3 overflow-y-auto px-3 pb-3">
      {SIDEBAR_GROUPS.map((group, idx) => (
        <details key={group.title} open={idx < 3} className="group rounded-xl border border-slate-200 bg-slate-50/80">
          <summary className={`list-none cursor-pointer px-3 py-2 text-xs uppercase tracking-wide text-slate-500 ${compact ? "text-center" : ""}`}>
            {compact ? group.title.charAt(0) : group.title}
          </summary>
          <div className="px-2 pb-2 space-y-1">
            {group.items.map((item) => (
              <NavItem key={item.to} item={item} compact={compact} onClick={onNavigate} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile, collapsed, onToggleCollapse }) {
  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 96 : 288 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col h-screen sticky top-0 border-r border-white/60 bg-white/80 backdrop-blur z-20"
      >
        <div className="h-20 px-3 flex items-center justify-between border-b border-slate-100">
          {!collapsed ? <div className="font-bold text-slate-900">Vertex Agri</div> : <div className="font-bold text-slate-900">VA</div>}
          <Button type="button" size="sm" variant="ghost" onClick={onToggleCollapse}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        <SidebarBody compact={collapsed} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-72 border-r border-white/60 bg-white z-40 pt-4"
            >
              <div className="h-14 px-4 flex items-center justify-between">
                <div className="font-bold text-slate-900">Vertex Agri</div>
                <Button type="button" variant="ghost" onClick={onCloseMobile}>
                  Close
                </Button>
              </div>
              <SidebarBody onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
