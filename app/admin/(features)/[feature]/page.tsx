"use client";

import { useMemo } from "react";
import PlaceholderPage from "@/components/admin/PlaceholderPage";

const TITLES: Record<string, string> = {
  tasks: "Tasks",
  goals: "Goals",
  approvals: "Approvals",
  calendar: "Calendar",
  checkins: "Check-ins",
  announcements: "Announcements",
  wiki: "Wiki",
  reports: "Reports",
  accountability: "Accountability",
  progress: "Progress & KPIs",
  trust: "Trust Scores",
  burnout: "Burnout Watch",
  timeline: "Timeline",
  alerts: "Alerts",
  knowledge: "Knowledge Vault",
  transparency: "Transparency",
  integrations: "Integrations",
  "ai-assistant": "AI Assistant",
  audit: "Audit Log",
  os: "Internal OS",
};

export default function FeaturePage({
  params,
}: {
  params: { feature: string };
}) {
  const feature = params.feature;
  const title = useMemo(() => TITLES[feature] ?? feature.replace(/-/g, " "), [feature]);

  return (
    <PlaceholderPage
      title={title}
      description="This feature exists in the source admin. It’s been scaffolded here and is ready to be connected to your database/API."
      integrationHint="If a schema/model already exists, add a matching app/api route and call it with adminApi (Authorization header auto-attached)."
    />
  );
}

