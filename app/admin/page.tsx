"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, GitBranch, Layers3, ShieldCheck, Users } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

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
  const router = useRouter();

  const [stats, setStats] = useState({
    users: 24,
    projects: 0,
    announcements: 0,
    blocked: 3,
    subscribed: 0,
  });
  const [livePulse, setLivePulse] = useState(0);
  const [activityFeed, setActivityFeed] = useState<string[]>([
    "Release train synced to Kigali workspace",
    "Engineering retrospective published in Knowledge Hub",
    "3 blockers escalated for approval",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    // Redirect if not logged in
    if (!token) {
      router.push("/signin");
      return;
    }

    // Fetch projects
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");

        setStats((prev) => ({
          ...prev,
          projects: Array.isArray(res.data)
            ? res.data.length
            : res.data?.projects?.length || 0,
        }));
      } catch (err) {
        console.error("Fetching Projects error:", err);
      }
    };

    // Fetch blogs
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogposts");

        setStats((prev) => ({
          ...prev,
          announcements: res.data?.data?.length || 0,
        }));
      } catch (err) {
        console.error("Failed while fetching announcements:", err);
      }
    };

    // Fetch subscribers
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get("/api/subscribe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats((prev) => ({
          ...prev,
          subscribed: res.data?.subscribers?.length || 0,
        }));
      } catch (err) {
        console.error("Error fetching subscribers:", err);
      }
    };

    fetchProjects();
    fetchBlogs();
    fetchSubscribers();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse((prev) => prev + 1);
      setStats((prev) => ({
        ...prev,
        blocked: Math.max(0, prev.blocked + (Math.random() > 0.6 ? 1 : -1)),
      }));
      const feedEvent =
        Math.random() > 0.5
          ? "New PR link attached to Sprint board"
          : "Team check-in updated with a blocker status";
      setActivityFeed((prev) => [feedEvent, ...prev].slice(0, 5));
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const velocityData = [
    { sprint: "S1", completed: 21, created: 23 },
    { sprint: "S2", completed: 18, created: 22 },
    { sprint: "S3", completed: 27, created: 25 },
    { sprint: "S4", completed: 24 + (livePulse % 3), created: 26 },
  ];

  const workloadData = [
    { team: "Platform", workload: 76 },
    { team: "Product", workload: 63 },
    { team: "Growth", workload: 52 },
    { team: "Support", workload: 39 },
  ];

  const executiveCards = [
    {
      title: "Active Workforce",
      value: `${stats.users} online`,
      note: "Across Rwanda, Kenya and remote contributors",
      icon: Users,
      tone: "from-indigo-600 to-cyan-500",
    },
    {
      title: "Execution Risk",
      value: `${stats.blocked} blockers`,
      note: "Auto-escalated to approvals queue",
      icon: AlertTriangle,
      tone: "from-rose-600 to-orange-500",
    },
    {
      title: "Deployments",
      value: "8 this week",
      note: "2 pending quality sign-off",
      icon: GitBranch,
      tone: "from-emerald-600 to-teal-500",
    },
    {
      title: "Compliance",
      value: "97.4%",
      note: "Audit trail and policy acknowledgements",
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
            <div className="mt-1 text-2xl font-semibold">{livePulse}</div>
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
          <BarChart data={workloadData}>
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