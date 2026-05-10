"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ADMIN_ROLES } from "@/lib/rbac/roles";

type TeamAccount = {
  id: string;
  names: string;
  email: string;
  role: string;
  isActive: boolean;
  departmentId?: string;
  supervisorId?: string;
  inviteStatus?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<TeamAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    names: "",
    email: "",
    role: "developer",
    departmentId: "",
    supervisorId: "",
    permissionsCsv: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team/accounts", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch accounts");
      setUsers(data.users || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createAccount = async () => {
    const permissions = form.permissionsCsv
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/team/accounts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        names: form.names,
        email: form.email,
        role: form.role,
        departmentId: form.departmentId || undefined,
        supervisorId: form.supervisorId || undefined,
        permissions,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to create account");
      return;
    }

    toast.success("Account created and invitation prepared.");
    setForm({
      names: "",
      email: "",
      role: "developer",
      departmentId: "",
      supervisorId: "",
      permissionsCsv: "",
    });
    await loadUsers();
  };

  const patchUser = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/team/accounts/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Update failed");
      return;
    }
    toast.success("User updated");
    await loadUsers();
  };

  return (
    <div className="space-y-6 p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Team Management & RBAC</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create accounts, assign department-aware roles, and manage secure activation workflows.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input className="h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="Full name" value={form.names} onChange={(e) => setForm((p) => ({ ...p, names: e.target.value }))} />
          <input className="h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="Work email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <select className="h-10 rounded-lg border border-slate-200 px-3 text-sm" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
            {ADMIN_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <input className="h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="Department ID" value={form.departmentId} onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))} />
          <input className="h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="Supervisor User ID" value={form.supervisorId} onChange={(e) => setForm((p) => ({ ...p, supervisorId: e.target.value }))} />
          <input
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
            placeholder="Extra permissions (comma separated)"
            value={form.permissionsCsv}
            onChange={(e) => setForm((p) => ({ ...p, permissionsCsv: e.target.value }))}
          />
        </div>
        <button onClick={createAccount} className="mt-4 h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">
          Create team account
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Active Team Accounts</h2>
        {loading ? <div className="mt-3 text-sm text-slate-500">Loading accounts...</div> : null}
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Department</th>
                <th className="px-2 py-2">Invite</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-2 py-2 font-medium text-slate-900">{user.names}</td>
                  <td className="px-2 py-2 text-slate-700">{user.email}</td>
                  <td className="px-2 py-2">
                    <select
                      value={user.role}
                      className="h-9 rounded-md border border-slate-200 px-2"
                      onChange={(event) => patchUser(user.id, { role: event.target.value })}
                    >
                      {ADMIN_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-slate-700">{user.departmentId || "-"}</td>
                  <td className="px-2 py-2 text-slate-700">{user.inviteStatus || "accepted"}</td>
                  <td className="px-2 py-2">
                    <span className={["rounded-full px-2 py-1 text-xs", user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"].join(" ")}>
                      {user.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      {user.isActive ? (
                        <button className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700" onClick={() => patchUser(user.id, { action: "suspend" })}>
                          Suspend
                        </button>
                      ) : (
                        <button className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700" onClick={() => patchUser(user.id, { action: "reactivate" })}>
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
