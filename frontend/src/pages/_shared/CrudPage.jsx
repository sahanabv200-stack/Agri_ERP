import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, FileText, Hash, CalendarDays, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/layout/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import useCrud from "./useCrud";

export default function CrudPage({ title, endpoint, columns, formFields, defaultValues }) {
  const { rows, loading, error, create, update, remove } = useCrud(endpoint);
  const [mode, setMode] = useState(null); // create | edit
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState(defaultValues || {});
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  function iconForField(key) {
    if (/date/i.test(key)) return CalendarDays;
    if (/amount|rate|price|total|gst|commission|freight/i.test(key)) return IndianRupee;
    if (/id|qty|kg|bags|pct/i.test(key)) return Hash;
    if (/notes|address|narration/i.test(key)) return FileText;
    return null;
  }

  function openCreate() {
    setMode("create");
    setCurrent(null);
    setForm(defaultValues || {});
    setFieldErrors({});
  }

  function openEdit(row) {
    setMode("edit");
    setCurrent(row);
    setForm({ ...row });
    setFieldErrors({});
  }

  function inferType(field) {
    if (field.type) return field.type;
    if (/entry_date/i.test(field.key)) return "datetime-local";
    if (/date|_at/i.test(field.key)) return "date";
    if (/id|qty|kg|bags|pct|amount|rate|price|total|freight/i.test(field.key)) return "number";
    return "text";
  }

  function isRequired(field) {
    if (field.required !== undefined) return field.required;
    return /name|code|date|_id|amount|rate|total|qty|quantity|ledger_id|commodity_id|customer_id|farmer_id/i.test(field.key);
  }

  function normalizePayload(values) {
    const out = { ...values };
    for (const field of formFields) {
      const type = inferType(field);
      const value = out[field.key];
      if (value === "" || value === null || value === undefined) continue;

      if (type === "number") out[field.key] = Number(value);
      if (type === "datetime-local" && typeof value === "string") {
        out[field.key] = value.includes("T") ? `${value.replace("T", " ")}:00` : value;
      }
    }
    return out;
  }

  function validateForm(values) {
    const errors = {};
    for (const field of formFields) {
      const type = inferType(field);
      const required = isRequired(field);
      const raw = values[field.key];
      const value = typeof raw === "string" ? raw.trim() : raw;

      if (required && (value === "" || value === null || value === undefined)) {
        errors[field.key] = `${field.label} is required`;
        continue;
      }

      if (value === "" || value === null || value === undefined) continue;

      if (type === "number" && Number.isNaN(Number(value))) {
        errors[field.key] = `${field.label} must be a number`;
      }
      if (type === "date" && Number.isNaN(Date.parse(`${value}T00:00:00`))) {
        errors[field.key] = `${field.label} must be a valid date`;
      }
      if (type === "datetime-local" && Number.isNaN(Date.parse(value))) {
        errors[field.key] = `${field.label} must be a valid date-time`;
      }
    }
    return errors;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix form validation errors");
      return;
    }

    const payload = normalizePayload(form);
    setSaving(true);
    try {
      if (mode === "create") {
        await create(payload);
        toast.success(`${title} created`);
      }
      if (mode === "edit") {
        await update(current.id, payload);
        toast.success(`${title} updated`);
      }
      setMode(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        subtitle="Manage records with quick create/edit actions"
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add
          </Button>
        }
      />
      <Card
        title="Records"
      >
        {loading ? <div className="text-slate-500 mb-3">Loading...</div> : null}
        {error ? <div className="text-sm text-rose-600 mb-3">{error}</div> : null}

        <DataTable
          columns={columns}
          rows={rows}
          onEdit={openEdit}
          onDelete={async (row) => {
            if (!confirm("Delete this record?")) return;
            try {
              await remove(row.id);
              toast.success("Record deleted");
            } catch (e) {
              toast.error(e?.response?.data?.message || "Delete failed");
            }
          }}
        />
      </Card>

      <AnimatePresence>
        {mode ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMode(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 p-4 md:p-8 flex items-end md:items-center justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full max-w-4xl app-surface rounded-2xl border border-white/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-base font-semibold text-slate-900">
                    {mode === "create" ? `Create ${title}` : `Edit ${title}`}
                  </div>
                  <Button type="button" variant="ghost" onClick={() => setMode(null)}>
                    <X size={16} />
                  </Button>
                </div>
                <form onSubmit={onSubmit} className="p-5 grid md:grid-cols-2 gap-4">
                  {formFields.map((f) => {
                    const value = form?.[f.key] ?? "";
                    const icon = f.icon || iconForField(f.key);
                    const type = inferType(f);
                    const common = {
                      key: f.key,
                      label: f.label,
                      error: fieldErrors[f.key],
                      value,
                      onChange: (e) => {
                        const next = e.target.value;
                        setForm((s) => ({ ...s, [f.key]: next }));
                        if (fieldErrors[f.key]) {
                          setFieldErrors((prev) => ({ ...prev, [f.key]: "" }));
                        }
                      },
                    };

                    if (f.type === "select" || f.options) {
                      return <Select {...common} options={f.options || []} />;
                    }
                    if (f.type === "textarea" || /notes|address|narration/i.test(f.key)) {
                      return <Textarea {...common} rows={3} />;
                    }
                    return <Input {...common} icon={icon} type={type} placeholder={f.placeholder || ""} step={type === "number" ? "any" : undefined} />;
                  })}
                  <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setMode(null)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : mode === "create" ? "Create" : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
