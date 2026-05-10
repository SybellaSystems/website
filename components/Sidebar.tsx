"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

type Role =
  | "executive"
  | "manager"
  | "accountant"
  | "sales"
  | "marketing"
  | "qa-tester"
  | "superadmin";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  badge?: string;
};

type NavGroup = {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const ALL_ROLES: Role[] = [
  "executive",
  "manager",
  "accountant",
  "sales",
  "marketing",
  "qa-tester",
  "superadmin",
];

const EXEC_ONLY: Role[] = ["executive", "superadmin"];

const NAV_GROUPS: NavGroup[] = [
  {
    key: "main",
    title: "Main",
    icon: LayoutDashboard,
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL_ROLES },
      { label: "Activity Feed", href: "/admin/timeline", icon: Activity, roles: ALL_ROLES, badge: "Live" },
      { label: "Notifications", href: "/admin/alerts", icon: Bell, roles: EXEC_ONLY },
    ],
  },
  {
    key: "operations",
    title: "Operations",
    icon: Workflow,
    items: [
      { label: "Tasks", href: "/admin/tasks", icon: FolderKanban, roles: ALL_ROLES },
      { label: "Projects", href: "/admin/projects", icon: Briefcase, roles: ALL_ROLES },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays, roles: ALL_ROLES },
      { label: "Approvals", href: "/admin/approvals", icon: CircleDot, roles: ALL_ROLES },
      { label: "Reports", href: "/admin/reports", icon: FileStack, roles: ALL_ROLES },
    ],
  },
  {
    key: "people",
    title: "People",
    icon: Users,
    items: [
      { label: "Staff", href: "/admin/staffs", icon: Users, roles: ["executive", "manager", "superadmin"] },
      { label: "Teams", href: "/admin/team", icon: Users, roles: ["executive", "manager", "superadmin"] },
      { label: "Check-ins", href: "/admin/checkins", icon: Sparkles, roles: ALL_ROLES },
    ],
  },
  {
    key: "knowledge",
    title: "Knowledge",
    icon: BookOpen,
    items: [
      { label: "Internal Wiki", href: "/admin/wiki", icon: BookOpen, roles: ALL_ROLES },
      { label: "AI Insights", href: "/admin/ai-assistant", icon: Bot, roles: ALL_ROLES, badge: "AI" },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone, roles: ALL_ROLES },
    ],
  },
  {
    key: "system",
    title: "System",
    icon: ShieldCheck,
    items: [
      { label: "Integrations", href: "/admin/integrations", icon: Workflow, roles: EXEC_ONLY },
      { label: "Security & Audit", href: "/admin/audit", icon: ShieldCheck, roles: EXEC_ONLY },
    ],
  },
];

export default function Sidebar() {
  const [role, setRole] = useState<Role | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string>("main");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<{ role?: Role }>(token);
      if (decoded.role) {
        setRole(decoded.role);
      } else {
        setRole("manager");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setRole("manager");
    }
  }, [router]);

  const visibleGroups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => (role ? item.roles.includes(role) : false)),
      })).filter((group) => group.items.length > 0),
    [role]
  );

  useEffect(() => {
    const activeGroup = visibleGroups.find((group) =>
      group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    );
    if (activeGroup) setOpenGroup(activeGroup.key);
  }, [pathname, visibleGroups]);

  return (
    <aside
      className={[
        "hidden h-screen shrink-0 border-r border-white/50 bg-white/70 backdrop-blur-xl md:flex md:flex-col",
        collapsed ? "w-[88px]" : "w-[290px]",
      ].join(" ")}
    >
      <div className="border-b border-slate-200/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
              <Workflow className="h-5 w-5" />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">Sybella OS</div>
                <div className="truncate text-xs text-slate-500">Realtime company command center</div>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto p-3">
        {visibleGroups.map((group) => {
          const expanded = !collapsed && openGroup === group.key;
          const GroupIcon = group.icon;

          return (
            <div key={group.key} className="rounded-xl border border-slate-200/70 bg-white/80">
              <button
                type="button"
                onClick={() => setOpenGroup((prev) => (prev === group.key ? "" : group.key))}
                className="flex w-full items-center justify-between px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="h-4 w-4 text-indigo-600" />
                  {!collapsed ? <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</span> : null}
                </div>
                {!collapsed ? (
                  expanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />
                ) : null}
              </button>

              <AnimatePresence initial={false}>
                {(expanded || collapsed) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 px-2 pb-2"
                  >
                    {group.items.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      const ItemIcon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={[
                            "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-all",
                            active
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30"
                              : "text-slate-700 hover:bg-slate-100",
                          ].join(" ")}
                        >
                          <ItemIcon className={["h-4 w-4 shrink-0", active ? "text-white" : "text-indigo-600"].join(" ")} />
                          {!collapsed ? (
                            <>
                              <span className="truncate font-medium">{item.label}</span>
                              {item.badge ? (
                                <span className={["ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold", active ? "bg-white/25 text-white" : "bg-indigo-100 text-indigo-700"].join(" ")}>
                                  {item.badge}
                                </span>
                              ) : null}
                            </>
                          ) : null}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
