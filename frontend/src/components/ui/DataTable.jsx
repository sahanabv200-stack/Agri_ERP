import React from "react";
import { Pencil, Trash2, Database } from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";

export default function DataTable({ columns, rows, onEdit, onDelete }) {
  function renderCell(row, column) {
    const value = row?.[column.key];
    if (column.render) return column.render(value, row);

    const isStatus = /status|active|paid|pending|draft/i.test(column.key);
    if (isStatus && value !== undefined && value !== null && value !== "") return <Badge value={value} />;
    return String(value ?? "-");
  }

  return (
    <div className="overflow-auto border border-slate-200 rounded-2xl bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-3 font-semibold text-slate-600 uppercase tracking-wide text-xs">
                {c.label}
              </th>
            ))}
            {onEdit || onDelete ? <th className="px-4 py-3 text-right uppercase tracking-wide text-xs text-slate-600">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows?.length ? (
            rows.map((r, idx) => (
              <tr key={r.id} className={`border-t border-slate-100 ${idx % 2 ? "bg-slate-50/50" : "bg-white"} hover:bg-brand-50/40 transition-colors`}>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-slate-700 align-top">
                    {renderCell(r, c)}
                  </td>
                ))}
                {onEdit || onDelete ? (
                  <td className="px-4 py-3 text-right">
                    {onEdit ? (
                      <Button type="button" size="sm" variant="secondary" className="mr-2" onClick={() => onEdit(r)}>
                        <Pencil size={14} />
                        Edit
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button type="button" size="sm" variant="danger" onClick={() => onDelete(r)}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-12 text-slate-500 text-center" colSpan={columns.length + 1}>
                <div className="flex flex-col items-center gap-2">
                  <Database size={20} className="text-slate-300" />
                  <span>No records found</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
