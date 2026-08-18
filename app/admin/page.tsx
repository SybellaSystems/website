"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Users,
  FolderKanban,
  Newspaper,
  Mail,
  ArrowUpRight,
  Plus,
  FileText,
  UserPlus,
  BriefcaseBusiness,
  Activity,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import HeartBeat from "./heartBeat";

interface Stats {
  users: number;
  projects: number;
  blogs: number;
  subscribed: number;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    users: 0,
    projects: 0,
    blogs: 0,
    subscribed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      const [projectsResult, blogsResult, subscribersResult] =
        await Promise.allSettled([
          axios.get("/api/projects/"),
          axios.get("/api/blogposts"),
          axios.get("/api/subscribe", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }),
        ]);

      let projects = 0;
      let blogs = 0;
      let subscribed = 0;

      if (projectsResult.status === "fulfilled") {
        projects = Array.isArray(projectsResult.value.data)
          ? projectsResult.value.data.length
          : 0;
      }

      if (blogsResult.status === "fulfilled") {
        blogs = Array.isArray(blogsResult.value.data?.data)
          ? blogsResult.value.data.data.length
          : 0;
      }

      if (subscribersResult.status === "fulfilled") {
        subscribed = Array.isArray(
          subscribersResult.value.data?.subscribers
        )
          ? subscribersResult.value.data.subscribers.length
          : 0;
      }

      setStats({
        users: subscribed,
        projects,
        blogs,
        subscribed,
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/signin");
      return;
    }

    fetchDashboardData();
  }, [router]);

  const subscriptionData = useMemo(
    () => [
      {
        name: "Subscribed",
        value: stats.subscribed,
      },
      {
        name: "Other Users",
        value: Math.max(stats.users - stats.subscribed, 0),
      },
    ],
    [stats]
  );

  const overviewData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Projects",
      value: stats.projects,
    },
    {
      name: "Blogs",
      value: stats.blogs,
    },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      description: "Registered users",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      description: "Active projects",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Blog Posts",
      value: stats.blogs,
      icon: Newspaper,
      description: "Published articles",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Subscribers",
      value: stats.subscribed,
      icon: Mail,
      description: "Newsletter subscribers",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">

      <HeartBeat />

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Activity className="h-4 w-4 text-indigo-500" />
            Admin Overview
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Welcome back 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening across Sybella Systems today.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>

                <ArrowUpRight className="h-4 w-4 text-gray-300" />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {loading ? "—" : card.value}
                  </h2>

                  <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    Live
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Quickly manage important areas of the website.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction
            icon={Plus}
            label="Add Blog"
            href="/admin/blogs/add"
          />

          <QuickAction
            icon={UserPlus}
            label="Add Staff"
            href="/admin/staffs/add"
          />

          <QuickAction
            icon={FileText}
            label="View Blogs"
            href="/admin/blogs"
          />

          <QuickAction
            icon={BriefcaseBusiness}
            label="Manage Projects"
            href="/admin/sections?tab=projects"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-5">

        {/* Overview */}
        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              System Overview
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Current platform statistics.
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overviewData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                  barSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription */}
        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Subscription Overview
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Newsletter subscription status.
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#4f46e5" />
                  <Cell fill="#e5e7eb" />
                </Pie>

                <Tooltip />

                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-900 text-2xl font-bold"
                >
                  {stats.subscribed}
                </text>

                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-400 text-xs"
                >
                  Subscribers
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              <span className="text-gray-500">Subscribed</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="text-gray-500">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Platform status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Platform Status
              </h2>

              <p className="text-xs text-gray-500">
                Current system health
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-800">
                All systems operational
              </span>
            </div>

            <span className="text-xs font-medium text-emerald-600">
              Online
            </span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Activity
              </h2>

              <p className="text-xs text-gray-500">
                Latest dashboard information
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ActivityRow
              label="Blog posts"
              value={stats.blogs}
              href="/admin/blogs"
            />

            <ActivityRow
              label="Projects"
              value={stats.projects}
              href="/admin/sections?tab=projects"
            />

            <ActivityRow
              label="Subscribers"
              value={stats.subscribed}
              href="/admin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* Quick Action */
/* ------------------------------------------------ */

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: any;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-indigo-100 hover:bg-indigo-50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition group-hover:text-indigo-600">
        <Icon className="h-4 w-4" />
      </span>

      <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-700">
        {label}
      </span>
    </a>
  );
}

/* ------------------------------------------------ */
/* Activity Row */
/* ------------------------------------------------ */

function ActivityRow({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition hover:border-indigo-100 hover:bg-indigo-50/50"
    >
      <span className="text-sm text-gray-600">{label}</span>

      <span className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">
          {value}
        </span>

        <ArrowUpRight className="h-4 w-4 text-gray-400" />
      </span>
    </a>
  );
}