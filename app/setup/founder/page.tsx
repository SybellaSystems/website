"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FounderSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ names: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/setup/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Founder setup failed");
        return;
      }
      toast.success("Founder account created.");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Founder Bootstrapping</h1>
        <p className="mt-1 text-sm text-slate-600">
          First-run setup: creates the initial founder account. Requires `MONGODB_URI` in `.env.local`.
        </p>
        <div className="mt-4 space-y-3">
          <input className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Full name" value={form.names} onChange={(e) => setForm((p) => ({ ...p, names: e.target.value }))} required />
          <input className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Founder email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <input className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Secure password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
            {loading ? "Creating founder..." : "Create founder account"}
          </button>
        </div>
      </form>
    </main>
  );
}

