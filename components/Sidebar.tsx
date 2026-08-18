"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  Phone,
  FileText,
  Users,
  UserCog,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

interface MenuChild {
  name: string;
  href: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  roles: string[];
  children?: MenuChild[];
}

interface DecodedToken {
  role?: string;
  name?: string;
  email?: string;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("Admin");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      console.log("ADMIN TOKEN:", decoded);
      console.log("ADMIN ROLE:", decoded.role);

      setRole(decoded.role || null);
      setUserName(decoded.name || "Admin");
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("adminToken");
      router.push("/signin");
    }
  }, [router]);

  const menuItems: MenuItem[] = [
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
        {
          name: "Add Blog",
          href: "/admin/blogs/add",
        },
        {
          name: "View Blogs",
          href: "/admin/blogs",
        },
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
        {
          name: "Add Staff",
          href: "/admin/staffs/add",
        },
        {
          name: "View Staff",
          href: "/admin/staffs",
        },
      ],
    },
    {
      name: "Sections",
      icon: ClipboardList,
      roles: ["executive", "marketing", "manager", "superadmin"],
      children: [
        {
          name: "Milestones",
          href: "/admin/sections?tab=milestones",
        },
        {
          name: "Team Members",
          href: "/admin/sections?tab=team_members",
        },
        {
          name: "Projects",
          href: "/admin/sections?tab=projects",
        },
        {
          name: "Updates",
          href: "/admin/sections?tab=updates",
        },
      ],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["executive", "superadmin"],
    },
  ];

  const visibleItems = role
    ? menuItems.filter((item) => item.roles.includes(role))
    : [];

  const isItemActive = (item: MenuItem) => {
    if (item.href) {
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }

    return (
      item.children?.some((child) => {
        const childPath = child.href.split("?")[0];

        return pathname === childPath || pathname.startsWith(`${childPath}/`);
      }) ?? false
    );
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((current) => (current === name ? null : name));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/signin");
  };

  const getInitials = () => {
    if (!userName) return "A";

    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex h-[76px] items-center justify-between border-b border-gray-100 px-5">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <span className="text-lg font-bold text-white">S</span>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Sybella
            </h1>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Admin Portal
            </p>
          </div>
        </Link>

        {/* Mobile close */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Main Menu
        </p>

        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            if (item.children) {
              const dropdownOpen = openDropdown === item.name || active;

              return (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.name)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          active
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <span>{item.name}</span>
                    </span>

                    {dropdownOpen ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="ml-7 mt-1 space-y-1 border-l border-gray-100 pl-4">
                      {item.children.map((child) => {
                        const childPath = child.href.split("?")[0];

                        const activeChild =
                          pathname === childPath ||
                          pathname.startsWith(`${childPath}/`);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`relative flex items-center rounded-lg px-3 py-2 text-sm transition ${
                              activeChild
                                ? "bg-indigo-50 font-medium text-indigo-700"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {activeChild && (
                              <span className="absolute -left-[21px] h-2 w-2 rounded-full bg-indigo-600" />
                            )}

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
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-gray-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {getInitials()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              {userName}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-indigo-500" />

              <span className="truncate text-[11px] capitalize text-gray-500">
                {role || "Admin"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
            <LogOut className="h-4 w-4" />
          </span>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-100 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 transform border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>
    </>
  );
}
