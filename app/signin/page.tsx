"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// Icons — UNCHANGED
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300"><path d="M9.88 9.88c.8-.19 1.7-.19 2.5 0a3 3 0 1 1-2.5 0Z"></path><path d="M12 5s7 3 10 7-3 7-10 7S2 12 5 7l2.1-2.1"></path><path d="M19 19 5 5"></path></svg>
);

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Auth logic UNCHANGED ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: { accessToken?: string; refreshToken?: string; error?: string } = {};

      try {
        data = await res.json();
      } catch (err) {
        console.error("Invalid JSON response:", err);
        toast.error("Unexpected server response.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        localStorage.setItem("adminToken", data.accessToken || "");
        localStorage.setItem("refreshToken", data.refreshToken || "");
        toast.success("Login successful!");
        router.push("/admin");
      } else {
        toast.error(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Google Font + Styling ───────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #1a0a2e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 55% at 20% 50%, rgba(109,40,217,0.45) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(139,92,246,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 70% 80%, rgba(88,28,135,0.3) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        .form-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .form-subheading {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 0.4rem;
        }

        .form-input {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          background: rgba(255,255,255,0.05);
          color: #fff;
          outline: none;
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .form-input:focus {
          border-color: #a78bfa;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper .form-input {
          padding-right: 2.5rem;
        }

        .eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0;
        }

        .remember-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .forgot-link {
          font-size: 0.8rem;
          color: #c4b5fd;
          text-decoration: none;
        }

        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          font-weight: 500;
          cursor: pointer;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          <h1 className="form-heading">Log in</h1>
          <p className="form-subheading">Access your admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="form-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <Link href="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}