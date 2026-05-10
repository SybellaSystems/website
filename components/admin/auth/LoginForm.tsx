"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

type LoginResponse = {
  success?: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;
      if (!response.ok) {
        toast.error(data.error || "Invalid email or password.");
        return;
      }

      // Backward compatibility for legacy API calls that still read localStorage.
      if (data.accessToken) localStorage.setItem("adminToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      toast.success("Welcome back.");
      router.replace(redirectTo);
      router.refresh();
    } catch {
      toast.error("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Shield className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Admin Sign In</h1>
        <p className="mt-1 text-sm text-slate-600">Use your staff credentials to access the admin workspace.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="admin@company.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-10 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-slate-500 hover:text-slate-700"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Secure cookie session enabled</span>
          <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}

