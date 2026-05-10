import { redirect } from "next/navigation";
import { getServerAdminSession } from "@/lib/auth/admin-session";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { type AdminRole } from "@/lib/rbac/roles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = getServerAdminSession();
  if (!session) {
    redirect("/signin");
  }

  const role = (session.role || "viewer") as AdminRole;
  return <AdminShell role={role}>{children}</AdminShell>;
}
