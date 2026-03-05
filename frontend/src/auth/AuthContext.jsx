import React, { createContext, useContext, useEffect, useState } from "react";
import { http } from "../api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const token = localStorage.getItem("vam_token");
      if (!token) { setUser(null); return; }
      const res = await http.get("/auth/me");
      setUser(res.data?.data?.user || null);
    } catch {
      localStorage.removeItem("vam_token");
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadMe();
      setLoading(false);
    })();
  }, []);

  async function login(email, password) {
    const res = await http.post("/auth/login", { email: String(email || "").trim(), password: String(password || "") });
    const token = res.data?.data?.token;
    const u = res.data?.data?.user;
    if (!token || !u) throw new Error("Invalid login response");
    localStorage.setItem("vam_token", token);
    setUser(u);
    return u;
  }

  function logout() {
    localStorage.removeItem("vam_token");
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
