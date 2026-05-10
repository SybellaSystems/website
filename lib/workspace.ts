import { FEATURE_KEY_SET } from "@/lib/supabase/feature-keys";

export type WorkspaceRole = "executive" | "manager" | "accountant" | "sales" | "marketing" | "qa-tester" | "superadmin";

export const ROLE_PRIORITY: Record<WorkspaceRole, number> = {
  "qa-tester": 1,
  sales: 1,
  marketing: 1,
  accountant: 2,
  manager: 3,
  executive: 4,
  superadmin: 5,
};

export type WorkspaceRecord = {
  id: string;
  feature_key: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "blocked" | "review" | "approved" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  severity: "info" | "normal" | "major" | "critical";
  assignee_name: string | null;
  due_at: string | null;
  starts_at: string | null;
  linked_module: string | null;
  linked_record_id: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export function isFeatureKey(feature: string): boolean {
  return FEATURE_KEY_SET.has(feature);
}

export function parseWorkspaceActor(headers: Headers): { role: WorkspaceRole; name: string } {
  const rawRole = (headers.get("x-user-role") || "manager") as WorkspaceRole;
  const safeRole: WorkspaceRole =
    rawRole in ROLE_PRIORITY ? rawRole : "manager";
  const name = headers.get("x-user-name")?.trim() || "Operations Bot";
  return { role: safeRole, name };
}

export function hasRole(required: WorkspaceRole, actual: WorkspaceRole): boolean {
  return ROLE_PRIORITY[actual] >= ROLE_PRIORITY[required];
}
