import { FEATURE_KEY_SET } from "@/lib/supabase/feature-keys";

export type WorkspaceRole =
  | "superadmin"
  | "founder"
  | "ceo"
  | "managing-director"
  | "executive"
  | "operations-manager"
  | "project-manager"
  | "product-manager"
  | "technical-lead"
  | "developer"
  | "designer"
  | "qa-tester"
  | "marketing"
  | "sales"
  | "customer-support"
  | "accountant"
  | "finance-manager"
  | "hr-manager"
  | "recruiter"
  | "legal-counsel"
  | "business-analyst"
  | "content-manager"
  | "social-media-manager"
  | "intern"
  | "viewer";

export const ROLE_PRIORITY: Record<WorkspaceRole, number> = {
  viewer: 1,
  intern: 1,
  "qa-tester": 2,
  sales: 2,
  marketing: 2,
  designer: 2,
  developer: 2,
  accountant: 3,
  "customer-support": 3,
  "social-media-manager": 3,
  recruiter: 3,
  "content-manager": 3,
  "business-analyst": 3,
  "operations-manager": 4,
  "project-manager": 4,
  "product-manager": 4,
  "technical-lead": 4,
  "finance-manager": 4,
  "hr-manager": 4,
  "legal-counsel": 4,
  executive: 5,
  "managing-director": 6,
  ceo: 7,
  founder: 8,
  superadmin: 9,
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
  const rawRole = (headers.get("x-user-role") || "viewer") as WorkspaceRole;
  const safeRole: WorkspaceRole =
    rawRole in ROLE_PRIORITY ? rawRole : "viewer";
  const name = headers.get("x-user-name")?.trim() || "Operations Bot";
  return { role: safeRole, name };
}

export function hasRole(required: WorkspaceRole, actual: WorkspaceRole): boolean {
  return ROLE_PRIORITY[actual] >= ROLE_PRIORITY[required];
}
