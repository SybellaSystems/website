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
  DollarSign,
  ChevronDown,
  ChevronRight,
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
        "cto",
      ],
    },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: Phone,
      roles: ["executive", "marketing", "superadmin", "cto"],
    },
    {
      name: "Blogs",
      icon: FileText,
      roles: ["executive", "marketing", "superadmin", "cto"],
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
      roles: ["executive", "marketing", "manager", "superadmin", "cto"],
      children: [
        { name: "Milestones", href: "/admin/sections?tab=milestones" },
        { name: "Team Members", href: "/admin/sections?tab=team_members" },
        { name: "Projects", href: "/admin/sections?tab=projects" },
        // { name: "Blogs", href: "/admin/sections?tab=blogs" },
        { name: "Updates", href: "/admin/sections?tab=updates" },
      ],
    },
    // { name: "Updates", href: "/admin/updates", icon: ClipboardList, roles: ["executive"] },
    {
      name: "Accounts",
      href: "/admin/accounts",
      icon: DollarSign,
      roles: ["accountant", "superadmin"],
    },
    {
      name: "Sales",
      href: "/admin/sales",
      icon: DollarSign,
      roles: ["sales", "superadmin"],
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col p-6 shadow-sm">
      <nav className="flex flex-col gap-1 flex-grow">
        {menuItems
          .filter((item) => {
            // Superadmin and CTO have access to everything
            if (role === "superadmin" || role === "cto") return true;
            return role && item.roles.includes(role);
          })
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
      </nav>
    </aside>
  );
}
