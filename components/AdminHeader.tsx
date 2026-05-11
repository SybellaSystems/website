"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useTokenRefresh } from "@/lib/userToken";

type AdminHeaderProps = {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  role?: string;
};

export default function AdminHeader({ 
  sidebarCollapsed, 
  onToggleSidebar 
}: AdminHeaderProps) {
  const [adminName, setAdminName] = useState("Admin");
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useTokenRefresh();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        setRole(decoded.role);

        // Role-based quick redirects
        if (decoded.role === "marketing") router.push("/admin/marketing");
        else if (decoded.role === "qa-tester") router.push("/admin/qa-tester");

        const res = await fetch("/api/staff/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setAdminName(data.name || data.names || "Admin");
      } catch (err) {
        console.error("Fetch admin error:", err);
        localStorage.removeItem("adminToken");
        router.push("/signin");
      }
    };

    fetchAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user");
      router.push("/signin");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0A0F1C] px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Side - Toggle & Title */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-slate-800 rounded-xl transition"
            >
              <User className="h-5 w-5 text-slate-400" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Sybella OS</h1>
            <p className="text-xs text-slate-500 -mt-1">Admin Command Center</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="h-9 w-9 flex items-center justify-center rounded-2xl hover:bg-slate-800 transition relative">
            <Bell className="h-5 w-5 text-slate-400" />
            <div className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></div>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 hover:bg-slate-800 rounded-2xl pl-2 pr-4 py-1.5 transition"
            >
              <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-semibold text-sm">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium leading-none">{adminName}</p>
                <p className="text-xs text-slate-500 capitalize">{role}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1C2537] border border-slate-700 rounded-2xl shadow-xl py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="font-semibold">{adminName}</p>
                  <p className="text-xs text-slate-400 capitalize">{role}</p>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/admin/settings");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 text-slate-300"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}