"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OnboardingPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to complete onboarding");
        return;
      }

      toast.success("Password set. You can now sign in.");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Complete your onboarding</h1>
        <p className="mt-1 text-sm text-slate-600">Create your secure password to activate your account.</p>
        <div className="mt-4 space-y-3">
          <input
            type="password"
            placeholder="New password"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Set password"}
          </button>
        </div>
      </form>
    </main>
  );
}

