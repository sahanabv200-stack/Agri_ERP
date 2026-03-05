import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import PageHeader from "../../components/layout/PageHeader";

const EMPTY_FORM = {
  name: "",
  gstin: "",
  address: "",
  state: "",
  phone: "",
  email: "",
};

export default function CompanyProfile() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await http.get("/admin/company");
      setForm({ ...EMPTY_FORM, ...(res.data?.data || {}) });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await http.put("/admin/company", form);
      setMessage("Company profile updated");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save company profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Company Profile Setup"
        subtitle="Configure GSTIN, address, and business contact details"
        actions={
          <Button type="submit" form="company-profile-form" disabled={saving || loading}>
            {saving ? "Saving..." : "Save"}
          </Button>
        }
      />
      <Card title="Profile">
        {loading ? <div className="text-slate-600">Loading...</div> : null}
        {error ? <div className="text-sm text-rose-600 mb-3">{error}</div> : null}
        {message ? <div className="text-sm text-emerald-700 mb-3">{message}</div> : null}

        <form id="company-profile-form" onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <Input label="Company Name" value={form.name || ""} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Input label="GSTIN" value={form.gstin || ""} onChange={(e) => setForm((s) => ({ ...s, gstin: e.target.value }))} />
          <Input label="State" value={form.state || ""} onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))} />
          <Input label="Phone" value={form.phone || ""} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
          <Input label="Email" value={form.email || ""} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <Textarea
            label="Address"
            rows={3}
            className="md:col-span-2"
            value={form.address || ""}
            onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
          />
        </form>
      </Card>
    </div>
  );
}
