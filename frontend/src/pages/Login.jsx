import React, { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@vertex.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/", { replace: true });
    } catch (e) {
      const apiMessage = e?.response?.data?.message;
      if (apiMessage) {
        setError(apiMessage);
      } else if (e?.message === "Network Error") {
        setError("Cannot reach backend API. Check backend is running and CORS is configured.");
      } else {
        setError("Login failed. Please verify credentials and backend connectivity.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-app-gradient">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-lg">
        <Card title="Login - Vertex Agri Manager">
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" icon={LockKeyhole} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error ? <div className="text-sm text-rose-600">{error}</div> : null}
            <Button className="w-full" type="submit">
              Sign In
            </Button>
            <div className="text-xs text-slate-500">Demo: admin@vertex.local / Admin@123</div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
