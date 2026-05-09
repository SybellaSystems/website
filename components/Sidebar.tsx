"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  Phone,
  FileText,
  Users,
  UserCog,
  ClipboardList,
<<<<<<< HEAD
  ChevronDown,
  ChevronRight,
  Building2,
  CheckSquare,
  Target,
  Inbox,
  CalendarDays,
  MessageSquare,
  Megaphone,
  BookOpen,
  Activity,
  TrendingUp,
  Award,
  HeartPulse,
  GitBranch,
  Bell,
  ShieldCheck,
  Plug,
  Sparkles,
=======
  DollarSign,
  ChevronDown,
  ChevronRight,
>>>>>>> 8de9b24de294f15f15fc3cafec3ae240d3f8c2a4
} from "lucide-react";

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setRole(decoded.role);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, [router]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const menuItems: {
    name: string;
    href?: string;
    icon: any;
    roles: string[];
    children?: { name: string; href: string }[];
  }[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: [
        "executive",
        "manager",
        "accountant",
        "sales",
        "marketing",
        "qa-tester",
        "superadmin",
      ],
    },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: Phone,
      roles: ["executive", "marketing", "superadmin"],
    },
    {
      name: "Blogs",
      icon: FileText,
      roles: ["executive", "marketing", "superadmin"],
      children: [
        { name: "Add Blog", href: "/admin/blogs/add" },
        { name: "View Blogs", href: "/admin/blogs" },
      ],
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      roles: ["executive", "superadmin"],
    },
    {
      name: "Staff",
      icon: UserCog,
      roles: ["executive", "manager", "superadmin"],
      children: [
        { name: "Add Staff", href: "/admin/staffs/add" },
        { name: "View Staff", href: "/admin/staffs" },
      ],
    },
    {
      name: "Sections",
      icon: ClipboardList,
      roles: ["executive", "marketing", "manager", "superadmin"],
      children: [
        { name: "Milestones", href: "/admin/sections?tab=milestones" },
        { name: "Team Members", href: "/admin/sections?tab=team_members" },
        { name: "Projects", href: "/admin/sections?tab=projects" },
        { name: "Updates", href: "/admin/sections?tab=updates" },
      ],
    },
<<<<<<< HEAD
    {
      name: "Operate",
      icon: LayoutDashboard,
      roles: ["executive", "manager", "accountant", "sales", "marketing", "qa-tester", "superadmin"],
      children: [
        { name: "Tasks", href: "/admin/tasks" },
        { name: "Goals", href: "/admin/goals" },
        { name: "Approvals", href: "/admin/approvals" },
        { name: "Calendar", href: "/admin/calendar" },
      ],
    },
    {
      name: "People Ops",
      icon: Users,
      roles: ["executive", "manager", "marketing", "qa-tester", "superadmin"],
      children: [
        { name: "Team", href: "/admin/team" },
        { name: "Check-ins", href: "/admin/checkins" },
        { name: "Announcements", href: "/admin/announcements" },
      ],
    },
    {
      name: "Knowledge",
      icon: BookOpen,
      roles: ["executive", "manager", "marketing", "qa-tester", "superadmin"],
      children: [
        { name: "Wiki", href: "/admin/wiki" },
        { name: "Reports", href: "/admin/reports" },
        { name: "Updates", href: "/admin/updates" },
      ],
    },
    {
      name: "Insight",
      icon: TrendingUp,
      roles: ["executive", "manager", "accountant", "sales", "marketing", "qa-tester", "superadmin"],
      children: [
        { name: "Accountability", href: "/admin/accountability" },
        { name: "Progress & KPIs", href: "/admin/progress" },
        { name: "Trust Scores", href: "/admin/trust" },
        { name: "Burnout Watch", href: "/admin/burnout" },
        { name: "Timeline", href: "/admin/timeline" },
      ],
    },
    {
      name: "System",
      icon: ShieldCheck,
      roles: ["executive", "superadmin"],
      children: [
        { name: "Alerts", href: "/admin/alerts" },
        { name: "Integrations", href: "/admin/integrations" },
        { name: "AI Assistant", href: "/admin/ai-assistant" },
        { name: "Audit Log", href: "/admin/audit" },
      ],
    },
    // { name: "Updates", href: "/admin/updates", icon: ClipboardList, roles: ["executive"] },
  ];

  const visibleItems = menuItems.filter((item) => role && item.roles.includes(role));

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-gray-900">Admin Portal</div>
            <div className="text-xs text-gray-500">Management console</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          <div>
            <div className="px-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              Main
            </div>
            <div className="mt-2 space-y-1">
              {visibleItems
                .filter((i) => ["Dashboard"].includes(i.name))
                .map((item) => {
                  const isActive = item.href ? pathname === item.href : false;
                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
                      className={[
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-indigo-50",
                      ].join(" ")}
                    >
                      <item.icon className={["h-5 w-5", isActive ? "text-white" : "text-indigo-600"].join(" ")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
            </div>
          </div>

          <div>
            <div className="px-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              Content
            </div>
            <div className="mt-2 space-y-1">
              {visibleItems
                .filter((i) => ["Contacts", "Blogs", "Sections", "Operate", "Knowledge", "Insight", "System"].includes(i.name))
                .map((item) => {
                  const isActive = item.href ? pathname === item.href : false;
                  const isChildActive = item.children?.some((child) => pathname === child.href);

                  if (item.children) {
                    const expanded = openDropdown === item.name || Boolean(isChildActive);
                    return (
                      <div key={item.name}>
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.name)}
                          className={[
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                            isChildActive ? "bg-indigo-600 text-white shadow-sm" : "text-gray-700 hover:bg-indigo-50",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={["h-5 w-5", isChildActive ? "text-white" : "text-indigo-600"].join(" ")} />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>

                        {expanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => {
                              const active = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={[
                                    "block rounded-md px-3 py-2 text-sm transition",
                                    active ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-indigo-50",
                                  ].join(" ")}
                                >
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
                      className={[
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        isActive ? "bg-indigo-600 text-white shadow-sm" : "text-gray-700 hover:bg-indigo-50",
                      ].join(" ")}
                    >
                      <item.icon className={["h-5 w-5", isActive ? "text-white" : "text-indigo-600"].join(" ")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
            </div>
          </div>

          <div>
            <div className="px-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              People
            </div>
            <div className="mt-2 space-y-1">
              {visibleItems
                .filter((i) => ["Users", "Staff", "People Ops"].includes(i.name))
                .map((item) => {
                  const isActive = item.href ? pathname === item.href : false;
                  const isChildActive = item.children?.some((child) => pathname === child.href);

                  if (item.children) {
                    const expanded = openDropdown === item.name || Boolean(isChildActive);
                    return (
                      <div key={item.name}>
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.name)}
                          className={[
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition",
                            isChildActive ? "bg-indigo-600 text-white shadow-sm" : "text-gray-700 hover:bg-indigo-50",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={["h-5 w-5", isChildActive ? "text-white" : "text-indigo-600"].join(" ")} />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>

                        {expanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => {
                              const active = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={[
                                    "block rounded-md px-3 py-2 text-sm transition",
                                    active ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-indigo-50",
                                  ].join(" ")}
                                >
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
                      className={[
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        isActive ? "bg-indigo-600 text-white shadow-sm" : "text-gray-700 hover:bg-indigo-50",
                      ].join(" ")}
                    >
                      <item.icon className={["h-5 w-5", isActive ? "text-white" : "text-indigo-600"].join(" ")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
=======
    // { name: "Updates", href: "/admin/updates", icon: ClipboardList, roles: ["executive"] },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col p-6 shadow-sm">
      <nav className="flex flex-col gap-1 flex-grow">
        {menuItems
          .filter((item) => role && item.roles.includes(role))
          .map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            const isChildActive = item.children?.some(
              (child) => pathname === child.href
            );

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition ${
                      isChildActive
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-700 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-5 w-5 ${
                          isChildActive ? "text-white" : "text-indigo-600"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {openDropdown === item.name ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {openDropdown === item.name && (
                    <div className="ml-8 mt-2 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            pathname === child.href
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-600 hover:bg-indigo-50"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href!}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-indigo-600"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
>>>>>>> 8de9b24de294f15f15fc3cafec3ae240d3f8c2a4
      </nav>
    </aside>
  );
}
