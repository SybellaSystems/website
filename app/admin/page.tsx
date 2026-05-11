"use client";

import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  MoreHorizontal,
  ShoppingCart,
  Eye,
  Heart,
  Star,
  Package,
  Wallet,
  Activity,
  LogOut,
  HelpCircle,
  FileText,
  CreditCard,
  UserCheck,
} from "lucide-react";
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
  Area,
  AreaChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatsData {
  projects: number;
  updates: number;
  teamMembers: number;
  contacts: number;
  subscribers: number;
  blocked: number;
  workspaceTotal: number;
}

interface ActivityItem {
  id: number;
  customer: string;
  initials: string;
  color: string;
  item: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

interface TopUser {
  name: string;
  initials: string;
  color: string;
  role: string;
  score: number;
}

// ─── Mock / fallback data (replaced by live API when available) ────────────────

const FALLBACK_STATS: StatsData = {
  projects: 40,
  updates: 70,
  teamMembers: 120,
  contacts: 28,
  subscribers: 13,
  blocked: 2,
  workspaceTotal: 273,
};

const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 1,
    customer: "Dianne Russell",
    initials: "DR",
    color: "#6366F1",
    item: "Apple Watch Series 7",
    amount: "$1,549.00",
    date: "12.09.2019",
    status: "completed",
  },
  {
    id: 2,
    customer: "Wade Warren",
    initials: "WW",
    color: "#EC4899",
    item: "iMac 27″",
    amount: "$1,049.00",
    date: "12.09.2019",
    status: "completed",
  },
  {
    id: 3,
    customer: "Devon Lane",
    initials: "DL",
    color: "#F59E0B",
    item: "iPhone 13 Pro",
    amount: "$900.00",
    date: "12.09.2019",
    status: "pending",
  },
  {
    id: 4,
    customer: "Ralph Edwards",
    initials: "RE",
    color: "#10B981",
    item: "Apple Watch Series 6",
    amount: "$920.00",
    date: "12.09.2019",
    status: "cancelled",
  },
  {
    id: 5,
    customer: "Courtney Henry",
    initials: "CH",
    color: "#3B82F6",
    item: "iPad Air",
    amount: "$499.00",
    date: "12.09.2019",
    status: "completed",
  },
];

const TOP_USERS: TopUser[] = [
  { name: "Theresa Webb", initials: "TW", color: "#6366F1", role: "Admin", score: 98 },
  { name: "Kristin Watson", initials: "KW", color: "#EC4899", role: "Manager", score: 94 },
  { name: "Cameron Will.", initials: "CW", color: "#F59E0B", role: "Editor", score: 89 },
];

const BAR_DATA = [
  { month: "Jan", value: 65, prev: 40 },
  { month: "Feb", value: 78, prev: 55 },
  { month: "Mar", value: 55, prev: 70 },
  { month: "Apr", value: 90, prev: 60 },
  { month: "May", value: 72, prev: 80 },
  { month: "Jun", value: 85, prev: 65 },
  { month: "Jul", value: 95, prev: 75 },
  { month: "Aug", value: 68, prev: 85 },
  { month: "Sep", value: 88, prev: 70 },
  { month: "Oct", value: 75, prev: 90 },
  { month: "Nov", value: 92, prev: 68 },
  { month: "Dec", value: 80, prev: 78 },
];

const LINE_DATA = [
  { day: "Mon", sales: 30, revenue: 20 },
  { day: "Tue", sales: 55, revenue: 40 },
  { day: "Wed", sales: 45, revenue: 65 },
  { day: "Thu", sales: 70, revenue: 55 },
  { day: "Fri", sales: 60, revenue: 80 },
  { day: "Sat", sales: 85, revenue: 70 },
  { day: "Sun", sales: 75, revenue: 90 },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ShoppingCart, label: "eCommerce", active: false },
  { icon: FolderKanban, label: "Projects", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: MessageSquare, label: "Messages", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: CreditCard, label: "Payments", active: false },
  { icon: Settings, label: "Settings", active: false },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  icon: Icon,
  iconBg,
  trend,
  trendValue,
  delay = 0,
}: {
  value: number | string;
  label: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: "up" | "down";
  trendValue?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(99,102,241,0.12)" }}
      className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-slate-100 shadow-sm cursor-default"
    >
      <div className="flex items-start justify-between">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          {trend === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
          )}
          <span
            className={`text-xs font-medium ${
              trend === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trendValue}
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: ActivityItem["status"] }) {
  const map = {
    completed: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    cancelled: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Dashboard");

  // Fetch live data — gracefully falls back to mock if API unavailable
  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/overview", { withCredentials: true });
        setStats({
          projects: res.data.projects ?? FALLBACK_STATS.projects,
          updates: res.data.updates ?? FALLBACK_STATS.updates,
          teamMembers: res.data.teamMembers ?? FALLBACK_STATS.teamMembers,
          contacts: res.data.contacts ?? FALLBACK_STATS.contacts,
          subscribers: res.data.subscribers ?? FALLBACK_STATS.subscribers,
          blocked: res.data.workspaceBlockedRecords ?? FALLBACK_STATS.blocked,
          workspaceTotal: res.data.workspaceTotalRecords ?? FALLBACK_STATS.workspaceTotal,
        });
      } catch {
        // Use fallback — no console noise in production
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const statCards = [
    {
      value: stats.projects,
      label: "Total Projects",
      icon: FolderKanban,
      iconBg: "linear-gradient(135deg, #6366F1, #818CF8)",
      trend: "up" as const,
      trendValue: "+8.2%",
    },
    {
      value: stats.updates,
      label: "Total Updates",
      icon: Activity,
      iconBg: "linear-gradient(135deg, #10B981, #34D399)",
      trend: "up" as const,
      trendValue: "+5.1%",
    },
    {
      value: stats.teamMembers,
      label: "Team Members",
      icon: Users,
      iconBg: "linear-gradient(135deg, #3B82F6, #60A5FA)",
      trend: "down" as const,
      trendValue: "-2.0%",
    },
    {
      value: stats.contacts,
      label: "Active Contacts",
      icon: UserCheck,
      iconBg: "linear-gradient(135deg, #F59E0B, #FCD34D)",
      trend: "up" as const,
      trendValue: "+12.4%",
    },
    {
      value: stats.subscribers,
      label: "Subscribers",
      icon: Bell,
      iconBg: "linear-gradient(135deg, #EC4899, #F472B6)",
      trend: "up" as const,
      trendValue: "+3.7%",
    },
  ];

  return (
    <div className="flex h-screen bg-[#EEF2FF] font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-shrink-0 bg-[#1C2434] h-full flex flex-col overflow-hidden"
        style={{ minWidth: sidebarOpen ? 240 : 72 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-white font-semibold text-sm whitespace-nowrap overflow-hidden"
              >
                Sybella OS
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">
            {sidebarOpen ? "Main Menu" : ""}
          </p>
          {NAV_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeNav === label
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-white/10 pt-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-all">
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            {sidebarOpen && <span>Help</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-all">
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700 placeholder-slate-400 border-none outline-none focus:ring-2 focus:ring-indigo-300 w-56 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full" />
            </button>
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                NM
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">Neema M.</p>
                <p className="text-[10px] text-slate-400">Admin</p>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Page title */}
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, Neema. Here's what's happening.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {statCards.map((card, i) => (
                <StatCard key={card.label} {...card} delay={i * 0.07} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Revenue Overview</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Monthly comparison — current vs previous year</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500 inline-block" />
                      Current
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="h-2.5 w-2.5 rounded-sm bg-indigo-200 inline-block" />
                      Previous
                    </span>
                    <button className="text-xs text-indigo-600 hover:underline font-medium ml-2">This Year</button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={BAR_DATA} barGap={4} barSize={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", fontSize: 12 }}
                      cursor={{ fill: "rgba(99,102,241,0.06)" }}
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name="Current" />
                    <Bar dataKey="prev" fill="#C7D2FE" radius={[4, 4, 0, 0]} name="Previous" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Area / Line Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Weekly Performance</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Sales vs Revenue — this week</p>
                  </div>
                  <button className="text-xs text-indigo-600 hover:underline font-medium">View All</button>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={LINE_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={2.5} fill="url(#colorSales)" name="Sales" dot={false} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#colorRevenue)" name="Revenue" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6">
              {/* Recent Purchase Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-slate-800">Recent Purchase Activity</h2>
                  <button className="text-xs text-indigo-600 hover:underline font-medium">See All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3">Customer</th>
                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3">Product</th>
                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3">Date</th>
                        <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3">Amount</th>
                        <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {ACTIVITY_FEED.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                style={{ background: item.color }}
                              >
                                {item.initials}
                              </div>
                              <span className="font-medium text-slate-700 text-xs whitespace-nowrap">{item.customer}</span>
                            </div>
                          </td>
                          <td className="py-3 text-xs text-slate-500 whitespace-nowrap">{item.item}</td>
                          <td className="py-3 text-xs text-slate-400 whitespace-nowrap">{item.date}</td>
                          <td className="py-3 text-xs font-semibold text-slate-800 text-right whitespace-nowrap">{item.amount}</td>
                          <td className="py-3 text-right">
                            <StatusBadge status={item.status} />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Users + Summary Panel */}
              <div className="flex flex-col gap-4">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      NM
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Neema Mwanjwa</p>
                      <p className="text-xs text-slate-400">Managing Director</p>
                    </div>
                    <button className="ml-auto text-xs text-indigo-600 hover:underline font-medium">Edit</button>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {[
                      { label: "Projects", value: stats.projects },
                      { label: "Tasks", value: stats.updates },
                      { label: "Members", value: stats.teamMembers },
                    ].map((s) => (
                      <div key={s.label} className="text-center px-2">
                        <p className="text-base font-bold text-slate-800">{s.value}</p>
                        <p className="text-[11px] text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Users */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-800">Top Users</h2>
                    <button className="text-xs text-indigo-600 hover:underline font-medium">See All</button>
                  </div>
                  <div className="space-y-3">
                    {TOP_USERS.map((user, i) => (
                      <div key={user.name} className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 w-4">{i + 1}</span>
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: user.color }}
                        >
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-800">{user.score}</p>
                          <p className="text-[10px] text-slate-400">score</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick stats */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <div className="bg-indigo-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="text-[10px] text-indigo-600 font-medium">Revenue</span>
                      </div>
                      <p className="text-sm font-bold text-indigo-800">$45.2K</p>
                      <p className="text-[10px] text-indigo-400 mt-0.5">+18% this mo.</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px] text-emerald-600 font-medium">Orders</span>
                      </div>
                      <p className="text-sm font-bold text-emerald-800">1,240</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5">+6% this mo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}