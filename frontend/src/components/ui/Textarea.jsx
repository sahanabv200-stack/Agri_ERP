import React from "react";

export default function Textarea({ label, error = "", className = "", ...props }) {
  return (
    <label className="block">
      {label ? <div className="text-xs font-medium text-slate-500 mb-1.5">{label}</div> : null}
      <textarea
        {...props}
        className={`w-full px-3 py-2.5 rounded-xl border bg-white/90 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-100 ${error ? "border-rose-300" : "border-slate-200"} ${className}`}
      />
      {error ? <div className="text-xs text-rose-600 mt-1">{error}</div> : null}
    </label>
  );
}
