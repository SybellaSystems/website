export const FEATURE_KEYS = [
  "tasks",
  "goals",
  "approvals",
  "calendar",
  "checkins",
  "announcements",
  "wiki",
  "reports",
  "accountability",
  "progress",
  "trust",
  "burnout",
  "timeline",
  "alerts",
  "integrations",
  "ai-assistant",
  "audit",
  "os",
] as const;

export const FEATURE_KEY_SET = new Set<string>(FEATURE_KEYS);
