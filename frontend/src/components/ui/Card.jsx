import React from "react";
import { motion } from "framer-motion";

export default function Card({ title, actions, children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.002 }}
      transition={{ duration: 0.18 }}
      className={`app-surface rounded-2xl ${className}`}
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div>{actions}</div>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}
