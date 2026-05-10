"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Database, Layers3, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    updates: 0,
    teamMembers: 0,
    contacts: 0,
    subscribers: 0,
    blocked: 0,
    workspaceTotal: 0,
  });
  const [activityFeed, setActivityFeed] = useState<string[]>([]);
  const [featureMetrics, setFeatureMetrics] = useState<Array<{ team: string; workload: number }>>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      const res = await axios.get("/api/admin/overview", { withCredentials: true });
      setStats({
        projects: res.data.projects ?? 0,
        updates: res.data.updates ?? 0,
        teamMembers: res.data.teamMembers ?? 0,
        contacts: res.data.contacts ?? 0,
        subscribers: res.data.subscribers ?? 0,
        blocked: res.data.workspaceBlockedRecords ?? 0,
        workspaceTotal: res.data.workspaceTotalRecords ?? 0,
      });

      const workloads = Object.entries(res.data.workspaceByFeature ?? {})
        .slice(0, 6)
        .map(([key, value]) => ({ team: key, workload: Number(value) || 0 }));
      setFeatureMetrics(workloads);

      setActivityFeed([
        `${res.data.projects ?? 0} total active projects in pipeline`,
        `${res.data.updates ?? 0} update entries across news and announcements`,
        `${res.data.workspaceBlockedRecords ?? 0} blocked records need intervention`,
      ]);
    };

    fetchOverview().catch((error) => console.error("Failed to load overview:", error));
  }, []);

  const velocityData = [
    { sprint: "Projects", completed: stats.projects, created: stats.projects + 3 },
    { sprint: "Updates", completed: stats.updates, created: stats.updates + 2 },
    { sprint: "Team", completed: stats.teamMembers, created: stats.teamMembers + 1 },
    { sprint: "Subscribers", completed: stats.subscribers, created: stats.subscribers + 4 },
  ];

  const executiveCards = [
    {
      title: "Projects",
      value: `${stats.projects}`,
      note: "Current project entities in MongoDB",
      icon: Users,
      tone: "from-indigo-600 to-cyan-500",
    },
    {
      title: "Execution Risk",
      value: `${stats.blocked} blockers`,
      note: "Supabase workspace blocked records",
      icon: AlertTriangle,
      tone: "from-rose-600 to-orange-500",
    },
    {
      title: "Subscribers",
      value: `${stats.subscribers}`,
      note: "Newsletter audience in production list",
      icon: Database,
      tone: "from-emerald-600 to-teal-500",
    },
    {
      title: "Compliance",
      value: `${stats.workspaceTotal}`,
      note: "Total tracked operational records",
      icon: ShieldCheck,
      tone: "from-violet-600 to-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-slate-900 via-indigo-900 to-cyan-800 p-6 text-white shadow-2xl shadow-indigo-900/20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Activity className="h-3.5 w-3.5" />
              Realtime Company Command Center
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Sybella Operating System</h1>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100">
              Unified visibility into execution, team health, communications and delivery outcomes for remote teams across Africa.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
            <div className="text-indigo-100">Live sync cycle</div>
            <div className="mt-1 text-2xl font-semibold">{stats.workspaceTotal}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {executiveCards.map((card) => (
          <motion.article
            key={card.title}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.note}</p>
              </div>
              <div className={["flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white", card.tone].join(" ")}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Sprint Velocity Intelligence</h2>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">Auto-updating</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sprint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#38bdf8" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Live Operations Feed</h2>
            <Layers3 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="space-y-3">
            {activityFeed.map((event, idx) => (
              <div key={`${event}-${idx}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                {event}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Cross-Team Workload Distribution</h2>
          <span className="text-xs text-slate-500">Capacity planning view</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={featureMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="workload" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}