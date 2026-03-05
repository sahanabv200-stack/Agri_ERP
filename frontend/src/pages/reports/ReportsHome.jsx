import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { http } from "../../api/http";

export default function ReportsHome() {
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2026-12-31");
  const [result, setResult] = useState(null);

  async function run(report) {
    if (!from || !to) return;
    const res = await http.get(`/reports/${report}?from=${from}&to=${to}`);
    setResult({ report, data: res.data?.data });
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" subtitle="Run on-demand operational reports" />
      <Card title="Reports (Read-only)">
        <div className="grid md:grid-cols-3 gap-4">
          <Input type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} />
          <div className="flex items-end gap-2">
            <Button onClick={() => run("purchase")}>Purchase</Button>
            <Button onClick={() => run("sales")}>Sales</Button>
            <Button onClick={() => run("stock")}>Stock</Button>
          </div>
        </div>

        {result ? (
          <pre className="mt-5 p-4 bg-slate-950 text-slate-100 rounded-2xl overflow-auto text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : (
          <div className="mt-5 text-sm text-slate-600">Select a report.</div>
        )}
      </Card>
    </div>
  );
}
