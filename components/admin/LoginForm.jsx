"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ next }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login gagal. Periksa email dan password.");
        return;
      }
      router.replace(next || "/admin");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      ) : null}
      <div>
        <label htmlFor="email" className="ck-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className="ck-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="ck-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="ck-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading} className="ck-btn-primary w-full">
        {loading ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
