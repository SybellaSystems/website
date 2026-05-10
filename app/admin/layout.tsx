"use client";

import Sidebar from "@/components/Sidebar";
import { AppToaster } from "@/components/Toaster";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Plus, Search, Sparkles, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [activeUsers] = useState(["BK", "AY", "TN", "JM"]);

  const filteredActions = useMemo(
    () =>
      [
        { label: "Create task", href: "/admin/tasks" },
        { label: "Publish announcement", href: "/admin/announcements" },
        { label: "Open reports", href: "/admin/reports" },
      ].filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/signin");
  }, [router]);

  useEffect(() => {
    const checkConnection = () => setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    checkConnection();
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);
    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_top,#eef4ff_0%,#f8fafc_45%,#f8fafc_100%)] text-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Sparkles className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search people, docs, tasks, pull requests..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {search && filteredActions.length > 0 ? (
                <div className="absolute left-0 right-0 top-12 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {filteredActions.slice(0, 3).map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => router.push(item.href)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-slate-400">Jump</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={["inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium", isOnline ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"].join(" ")}>
                {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {isOnline ? "Realtime connected" : "Offline mode"}
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Quick action
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-2">
              {activeUsers.map((user) => (
                <motion.div
                  key={user}
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white bg-gradient-to-br from-indigo-500 to-cyan-500 text-[10px] font-bold text-white"
                >
                  {user}
                </motion.div>
              ))}
              <div className="inline-flex h-7 items-center justify-center rounded-full border border-slate-200 bg-white px-2 text-[10px] text-slate-500">
                {activeUsers.length} active
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("refreshToken");
                  router.push("/signin");
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <AppToaster />
    </div>
  );
}
