import React from "react";
import { motion } from "framer-motion";

export default function Button({ variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-brand-600 to-sky-500 text-white hover:brightness-105 shadow"
      : variant === "secondary"
      ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
      : variant === "ghost"
      ? "bg-transparent text-slate-600 hover:bg-slate-100"
      : variant === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-700"
      : "bg-slate-100 text-slate-900 hover:bg-slate-200";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      {...props}
      className={`${base} ${sizeClass} ${styles} ${className}`}
    />
  );
}
