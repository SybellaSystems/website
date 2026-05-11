"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88c.8-.19 1.7-.19 2.5 0a3 3 0 1 1-2.5 0Z" />
    <path d="M12 5s7 3 10 7-3 7-10 7S2 12 5 7l2.1-2.1" />
    <path d="M19 19 5 5" />
  </svg>
);

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("Login successful!");

        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");
        router.push(next && next.startsWith("/admin") ? next : "/admin");
      } else {
        toast.error(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("[LoginForm] Network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white shadow-sm">
          A
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Admin Portal</div>
          <div className="text-xs text-indigo-200">Sign in to continue</div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Sign in</h1>
        <p className="mt-1 text-indigo-200">Use your admin credentials.</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-indigo-100 mb-1">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-200 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-indigo-100 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-200 outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-200"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-indigo-100 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-violet-500"
            />
            Remember me
          </label>

          <Link href="/forgot-password" className="text-sm text-violet-300 hover:text-violet-200">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

      </form>
    </div>
  );
}