import React from "react";

export default function Input({ label, icon: Icon, error = "", className = "", ...props }) {
  return (
    <label className="block">
      {label ? <div className="text-xs font-medium text-slate-500 mb-1.5">{label}</div> : null}
      <div className="relative">
        {Icon ? <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /> : null}
        <input
          {...props}
          className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl border bg-white/90 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-100 ${error ? "border-rose-300" : "border-slate-200"} ${className}`}
        />
      </div>
      {error ? <div className="text-xs text-rose-600 mt-1">{error}</div> : null}
    </label>
  );
}
