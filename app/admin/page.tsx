// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Database,
  ShieldCheck,
  Layers,
  ArrowRight,
  Code2,
  Globe,
  Smartphone,
  Cloud,
} from "lucide-react";

interface Stats {
  projects: number;
  updates: number;
  teamMembers: number;
  contacts: number;
  subscribers: number;
  blocked: number;
  workspaceTotal: number;
}

// ─── Typed Static Data ─────────────────────────────────────────────────────
const REVENUE_DATA: { month: string; revenue: number }[] = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 6800 },
  { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 9400 },
  { month: "May", revenue: 7800 },
  { month: "Jun", revenue: 12300 },
  { month: "Jul", revenue: 10500 },
];

const ACTIVE_PROJECTS: Array<{
  id: number;
  name: string;
  client: string;
  service: string;
  status: string;
  progress: number;
  due: string;
  color: string;
}> = [
  { id: 1, name: "GridNexus Platform", client: "Rwanda Energy Group", service: "SyCore™", status: "In Development", progress: 72, due: "Jun 30 2026", color: "#6366F1" },
  { id: 2, name: "Ogera Web App", client: "Internal — Sybella", service: "SyWeb™", status: "Beta Launch", progress: 91, due: "Jun 14 2026", color: "#10B981" },
  { id: 3, name: "Graben School Portal", client: "Graben Highlight Academy", service: "SyWeb™", status: "QA Review", progress: 85, due: "May 28 2026", color: "#F59E0B" },
  { id: 4, name: "Mobile POS System", client: "Kigali Retail Co.", service: "SyMobile™", status: "Scoping", progress: 18, due: "Aug 15 2026", color: "#3B82F6" },
];

const SERVICES: Array<{
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  projects: number;
  desc: string;
}> = [
  { name: "SyCore™", icon: Code2, color: "#6366F1", projects: 3, desc: "Custom software platforms" },
  { name: "SyWeb™", icon: Globe, color: "#10B981", projects: 5, desc: "Web design & development" },
  { name: "SyMobile™", icon: Smartphone, color: "#F59E0B", projects: 2, desc: "Mobile applications" },
  { name: "SyCloud™", icon: Cloud, color: "#3B82F6", projects: 1, desc: "Cloud infrastructure" },
];

const TEAM_ACTIVITY = [
  { name: "Neema M.", initials: "NM", color: "#6366F1", action: "Pushed GridNexus v2.4 build", time: "2h ago" },
  { name: "Kayla E.", initials: "KE", color: "#EC4899", action: "Approved Ogera brand assets", time: "4h ago" },
  { name: "COO", initials: "CO", color: "#10B981", action: "Sent Kigali Retail proposal", time: "6h ago" },
];

const MILESTONES = [
  { label: "Ogera Beta Launch", date: "Jun 14 2026", status: "on-track", project: "Ogera Web App", color: "#10B981" },
  { label: "GridNexus v2.5 Release", date: "Jun 30 2026", status: "at-risk", project: "GridNexus Platform", color: "#6366F1" },
];

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    updates: 0,
    teamMembers: 0,
    contacts: 0,
    subscribers: 0,
    blocked: 0,
    workspaceTotal: 0,
  });

  useEffect(() => {
    axios
      .get("/api/admin/overview", { withCredentials: true })
      .then((res) => {
        setStats({
          projects: res.data.projects ?? 0,
          updates: res.data.updates ?? 0,
          teamMembers: res.data.teamMembers ?? 0,
          contacts: res.data.contacts ?? 0,
          subscribers: res.data.subscribers ?? 0,
          blocked: res.data.workspaceBlockedRecords ?? 0,
          workspaceTotal: res.data.workspaceTotalRecords ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  const kpis = [
    { label: "Active Projects", value: stats.projects, note: "Live client engagements", icon: Layers, color: "#6366F1" },
    { label: "Team Activity", value: stats.updates, note: "This week", icon: Activity, color: "#10B981" },
    { label: "Security Alerts", value: stats.blocked, note: "Blocked attempts", icon: ShieldCheck, color: "#F59E0B" },
    { label: "Workspace Records", value: stats.workspaceTotal, note: "Total managed", icon: Database, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Real-time company overview</p>
        </div>
        <p className="text-sm text-slate-500">May 11, 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#1C2537] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all"
          >
            <div className="p-3 rounded-2xl bg-slate-800/50 w-fit">
              <kpi.icon size={26} color={kpi.color} />
            </div>
            <div className="mt-6 text-4xl font-bold tracking-tighter">{kpi.value}</div>
            <div className="text-slate-400 mt-1">{kpi.label}</div>
            <div className="text-xs text-slate-500 mt-3">{kpi.note}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Charts & Projects */}
        <div className="lg:col-span-8 space-y-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C2537] border border-slate-800 rounded-3xl p-6"
          >
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Revenue Forecast</h3>
                <p className="text-slate-400 text-sm">Last 7 months</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="#6366F1"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Active Projects Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1C2537] border border-slate-800 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Active Projects</h3>
              <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
                View all <ArrowRight size={16} />
              </button>
            </div>
            {/* You can add the table here later */}
          </motion.div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1C2537] border border-slate-800 rounded-3xl p-6"
          >
            <h3 className="text-xl font-semibold mb-5">Service Stack</h3>
            <div className="space-y-4">
              {SERVICES.map((service) => (
                <div
                  key={service.name}
                  className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-800 transition"
                >
                  <div className="p-3 rounded-2xl bg-slate-800">
                    <service.icon size={22} color={service.color} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-slate-400">{service.desc}</p>
                  </div>
                  <span className="text-xs bg-slate-800 px-3 py-1 rounded-full">
                    {service.projects} proj
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}