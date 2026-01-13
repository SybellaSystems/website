"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { toast } from "sonner"; 

// Icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9.88 9.88c.8-.19 1.7-.19 2.5 0a3 3 0 1 1-2.5 0Z"></path><path d="M12 5s7 3 10 7-3 7-10 7S2 12 5 7l2.1-2.1"></path><path d="M19 19 5 5"></path></svg>
);

export default function AdminLogin() {
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
        body: JSON.stringify({ email, password }),
      });

      let data: { accessToken?: string, refreshToken?: string, error?: string } = {};
      try {
        data = await res.json();
      } catch (err) {
        console.error("Invalid JSON response:", err);
        toast.error("❌ Unexpected server response.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        localStorage.setItem("adminToken", data.accessToken || "");
        localStorage.setItem("refreshToken", data.refreshToken || "");
        toast.success("✅ Login successful!");
        router.push("/admin");
      } else {
        toast.error(data.error || "❌ Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT COLUMN: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-16">
        <div className="max-w-md w-full p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-600">Sign in to your Account</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E-mail Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="@##*%" 
                  required
                  className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center h-full"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
  <div className="flex items-center">
    <input
      id="remember-me"
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
      Remember me
    </label>
  </div>

  {/* Forgot password link */}
  <Link
    href="/forgot-password"
    className="text-sm font-medium text-blue-600 hover:text-blue-800"
  >
    Forgot password?
  </Link>
</div>


            

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 p-16 text-white flex-col justify-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-700/50 rounded-full translate-x-1/3 -translate-y-1/3"></div>

        <div className="relative z-10 space-y-10">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-black space-y-4 max-w-sm">
            <h2 className="text-2xl font-extrabold text-blue-700">
              Welcome to Admin Sybella Portal
            </h2>
            <p className="text-gray-600 text-sm">Africa innovation</p>
            <Link href="#" className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
              Learn more
            </Link>

            <div className="border border-gray-200 p-3 rounded-lg flex items-center mt-4 w-3/4">
              <span className="text-lg font-bold text-gray-900 mr-2">📈</span>
              <div>
                <p className="text-sm text-gray-500 leading-none">Sybella</p>
                <p className="text-2xl font-extrabold text-gray-900">1+ Years</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-bold">Introducing features</h3>
            <p className="text-gray-100 text-lg">
              Manage your platform with ease using our intuitive admin portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
