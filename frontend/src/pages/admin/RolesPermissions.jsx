import React, { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/layout/PageHeader";

export default function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [assigned, setAssigned] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const groupedPermissions = useMemo(() => {
    const groups = {};
    for (const p of permissions) {
      const group = (p.code || "").split(".")[0] || "other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(p);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  async function loadBasics() {
    setLoading(true);
    setError("");
    try {
      const [rolesRes, permsRes] = await Promise.all([http.get("/admin/roles"), http.get("/admin/permissions")]);
      const roleRows = rolesRes.data?.data || [];
      setRoles(roleRows);
      setPermissions(permsRes.data?.data || []);
      if (roleRows.length && !selectedRole) setSelectedRole(roleRows[0].code);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load roles/permissions");
    } finally {
      setLoading(false);
    }
  }

  async function loadRolePermissions(roleCode) {
    if (!roleCode) return;
    setError("");
    try {
      const res = await http.get(`/admin/roles/${roleCode}/permissions`);
      setAssigned(new Set(res.data?.data?.permissionCodes || []));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load role permissions");
    }
  }

  useEffect(() => {
    loadBasics();
  }, []);

  useEffect(() => {
    loadRolePermissions(selectedRole);
  }, [selectedRole]);

  function toggle(code) {
    setAssigned((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  async function savePermissions() {
    if (!selectedRole) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await http.put(`/admin/roles/${selectedRole}/permissions`, { permissionCodes: [...assigned] });
      setMessage("Permissions updated");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  }

  async function assignDefaults() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await http.post("/admin/roles/assign-defaults", {});
      setMessage("Default permissions assigned to roles");
      await loadBasics();
      if (selectedRole) await loadRolePermissions(selectedRole);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to assign default permissions");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Assign capability sets by department role"
        actions={
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={assignDefaults} disabled={saving || loading}>
              Assign Defaults
            </Button>
            <Button type="button" onClick={savePermissions} disabled={saving || loading || !selectedRole}>
              {saving ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        }
      />
      <Card title="Permission Matrix">
        {loading ? <div className="text-slate-600 mb-3">Loading...</div> : null}
        {error ? <div className="text-sm text-rose-600 mb-3">{error}</div> : null}
        {message ? <div className="text-sm text-emerald-700 mb-3">{message}</div> : null}

        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-1">Role</div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full md:w-80 px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {roles.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code} - {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-5">
          {groupedPermissions.map(([group, perms]) => (
            <div key={group}>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">{group}</div>
              <div className="grid md:grid-cols-2 gap-2">
                {perms.map((p) => (
                  <label key={p.code} className="flex items-center gap-2 text-sm text-slate-700 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
                    <input type="checkbox" checked={assigned.has(p.code)} onChange={() => toggle(p.code)} />
                    <span>{p.code}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
