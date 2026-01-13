"use client";

import Sidebar from "@/components/Sidebar";
import { AppToaster } from "@/components/Toaster"; // 👈 import toaster

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>

      {/* ✅ Toaster inside Admin area */}
      <AppToaster />
    </div>
  );
}
