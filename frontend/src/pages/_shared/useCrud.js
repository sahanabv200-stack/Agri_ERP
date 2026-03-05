import { useEffect, useState } from "react";
import { http } from "../../api/http";

export default function useCrud(endpoint) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await http.get(endpoint);
      setRows(res.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function create(payload) {
    await http.post(endpoint, payload);
    await load();
  }

  async function update(id, payload) {
    await http.put(`${endpoint}/${id}`, payload);
    await load();
  }

  async function remove(id) {
    await http.delete(`${endpoint}/${id}`);
    await load();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { rows, loading, error, load, create, update, remove };
}
