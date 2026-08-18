"use client";

import Sidebar from "@/components/Sidebar";
import { AppToaster } from "@/components/Toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="min-h-screen lg:ml-64">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <AppToaster />
    </div>
  );
}