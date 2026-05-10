"use client";

import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { FEATURE_KEY_SET, FEATURE_KEYS } from "@/lib/supabase/feature-keys";
import { AlertTriangle, CalendarDays, CheckCircle2, Download, FileUp, Link2, MessageCircle, Paperclip, ShieldCheck } from "lucide-react";
import type { WorkspaceRole } from "@/lib/workspace";

type WorkspaceRecord = {
  id: string;
  feature_key: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_name: string | null;
  due_at: string | null;
  linked_module: string | null;
  metadata: Record<string, unknown>;
  updated_at: string;
};

type WorkspacePayload = {
  records: WorkspaceRecord[];
  notifications: Array<{ id: string; message: string; target_role: string; created_at: string }>;
  activity: Array<{ id: string; event_type: string; details: string; actor_name: string; created_at: string }>;
  comments: Array<{ id: string; record_id: string; body: string; author_name: string; created_at: string }>;
  approvals: Array<{ id: string; record_id: string; decision: string; reason: string; decided_by: string | null; created_at: string }>;
  attachments: Array<{ id: string; record_id: string; file_name: string; created_at: string }>;
  snapshot: { total_records: number; blocked_records: number; completed_records: number; unread_notifications: number } | null;
};

const FEATURE_META: Record<string, { title: string; purpose: string; action: string; tone: string }> = {
  tasks: { title: "Task Orchestration", purpose: "Sprint delivery and dependency control", action: "Create task", tone: "from-indigo-600 to-blue-600" },
  goals: { title: "Goals Workspace", purpose: "Objective ownership and measurable outcomes", action: "Add objective", tone: "from-emerald-600 to-teal-600" },
  approvals: { title: "Approval Desk", purpose: "Leadership signoff workflows", action: "Request approval", tone: "from-violet-600 to-fuchsia-600" },
  calendar: { title: "Execution Calendar", purpose: "Schedule planning and due-date control", action: "Schedule item", tone: "from-cyan-600 to-sky-600" },
  checkins: { title: "People Check-ins", purpose: "Wellbeing, blockers and accountability", action: "Log check-in", tone: "from-rose-600 to-orange-600" },
  announcements: { title: "Announcement Studio", purpose: "Internal communication and alignment", action: "Publish broadcast", tone: "from-indigo-700 to-fuchsia-600" },
  wiki: { title: "Knowledge Hub", purpose: "Living documentation and runbooks", action: "Create article", tone: "from-blue-700 to-cyan-600" },
  reports: { title: "Reporting Lab", purpose: "Leadership exports and reporting packs", action: "Add report draft", tone: "from-slate-700 to-slate-900" },
  accountability: { title: "Accountability Matrix", purpose: "Commitments and ownership tracking", action: "Add commitment", tone: "from-amber-600 to-orange-600" },
  progress: { title: "KPI Monitor", purpose: "Realtime progress and performance indicators", action: "Add KPI item", tone: "from-green-600 to-lime-600" },
  trust: { title: "Trust Signals", purpose: "Team trust health and intervention loops", action: "Log signal", tone: "from-purple-600 to-indigo-700" },
  burnout: { title: "Burnout Watch", purpose: "Risk detection and mitigation workflows", action: "Flag risk", tone: "from-red-600 to-rose-700" },
  timeline: { title: "Company Timeline", purpose: "Cross-module activity visibility", action: "Add event", tone: "from-sky-700 to-blue-800" },
  alerts: { title: "Incident Alerts", purpose: "Escalation, severity and response management", action: "Raise alert", tone: "from-red-700 to-orange-700" },
  integrations: { title: "Integration Ops", purpose: "Sync jobs, connector health and incidents", action: "Create sync job", tone: "from-cyan-700 to-indigo-700" },
  "ai-assistant": { title: "AI Operations", purpose: "Prompt workflows and assisted execution", action: "Queue AI task", tone: "from-violet-700 to-indigo-800" },
  audit: { title: "Security & Audit", purpose: "Compliance evidence and event integrity", action: "Log audit event", tone: "from-slate-800 to-zinc-900" },
  os: { title: "Company Operating System", purpose: "Connected command center across all modules", action: "Create operating directive", tone: "from-indigo-800 to-cyan-700" },
};

export default function OperationalWorkspace({ params }: { params: { feature: string } }) {
  const feature = params.feature;
  const knownFeature = FEATURE_KEY_SET.has(feature);
  const meta = FEATURE_META[feature] ?? { title: feature, purpose: "Operational workspace", action: "Create record", tone: "from-indigo-600 to-blue-600" };
  const [payload, setPayload] = useState<WorkspacePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<WorkspaceRecord | null>(null);
  const [comment, setComment] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("manager");
  const [actorName, setActorName] = useState("Operations User");

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/features/${feature}/workspace`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load workspace");
      setPayload(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!knownFeature) return;
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const decoded = jwtDecode<{ role?: WorkspaceRole; name?: string; fullName?: string }>(token);
        if (decoded.role) setRole(decoded.role);
        setActorName(decoded.fullName || decoded.name || "Operations User");
      }
    } catch {
      setRole("manager");
    }
    loadWorkspace();
  }, [feature, knownFeature]);

  useEffect(() => {
    if (!knownFeature) return;
    let client;
    try {
      client = getSupabaseBrowserClient();
    } catch {
      return;
    }
    const recordsChannel = client
      .channel(`workspace-records-${feature}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_records", filter: `feature_key=eq.${feature}` }, loadWorkspace)
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_activity", filter: `feature_key=eq.${feature}` }, loadWorkspace)
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_notifications", filter: `feature_key=eq.${feature}` }, loadWorkspace)
      .subscribe((status) => setSubscribed(status === "SUBSCRIBED"));
    return () => {
      setSubscribed(false);
      client.removeChannel(recordsChannel);
    };
  }, [feature, knownFeature]);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-user-role": role,
      "x-user-name": actorName,
    }),
    [actorName, role]
  );

  const canApprove = role === "executive" || role === "superadmin";
  const records = payload?.records ?? [];
  const selectedComments = payload?.comments.filter((entry) => entry.record_id === selected?.id) ?? [];
  const selectedApprovals = payload?.approvals.filter((entry) => entry.record_id === selected?.id) ?? [];
  const selectedFiles = payload?.attachments.filter((entry) => entry.record_id === selected?.id) ?? [];

  const createRecord = async () => {
    if (!title.trim()) return toast.error("Title is required");
    const optimistic: WorkspaceRecord = {
      id: `tmp-${Date.now()}`,
      feature_key: feature,
      title: title.trim(),
      description: description.trim(),
      status: "todo",
      priority: "medium",
      assignee_name: actorName,
      due_at: null,
      linked_module: null,
      metadata: {},
      updated_at: new Date().toISOString(),
    };
    setPayload((prev) => (prev ? { ...prev, records: [optimistic, ...prev.records] } : prev));
    const localTitle = title;
    const localDescription = description;
    setTitle("");
    setDescription("");
    const res = await fetch(`/api/features/${feature}/workspace`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title: localTitle, description: localDescription, assignee_name: actorName, metadata: { module_context: feature } }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to create");
      loadWorkspace();
      return;
    }
    toast.success("Record created");
    loadWorkspace();
  };

  const updateRecord = async (recordId: string, updates: Record<string, unknown>) => {
    const res = await fetch(`/api/features/${feature}/workspace/${recordId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed to update");
    loadWorkspace();
  };

  const submitComment = async () => {
    if (!selected || !comment.trim()) return;
    const res = await fetch(`/api/features/${feature}/workspace/${selected.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ action: "comment", body: comment.trim() }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Comment failed");
    setComment("");
    loadWorkspace();
  };

  const approve = async (decision: "approved" | "rejected") => {
    if (!selected) return;
    const res = await fetch(`/api/features/${feature}/workspace/${selected.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ action: "approval", decision }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Approval failed");
    toast.success(`Record ${decision}`);
    loadWorkspace();
  };

  const uploadFile = async (file: File) => {
    if (!selected) return toast.error("Select a record first");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("recordId", selected.id);
    const res = await fetch(`/api/features/${feature}/workspace/upload`, {
      method: "POST",
      headers: { "x-user-role": role, "x-user-name": actorName },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Upload failed");
    toast.success("File uploaded");
    loadWorkspace();
  };

  const featureIntelligence = () => {
    if (feature === "tasks") {
      const inSprint = records.filter((r) => r.status === "in_progress").length;
      return <div className="text-xs text-slate-600">Sprint throughput monitor: {inSprint} active cards linked to delivery.</div>;
    }
    if (feature === "approvals") {
      const pending = records.filter((r) => r.status === "review" || r.status === "todo").length;
      return <div className="text-xs text-slate-600">Decision queue: {pending} items awaiting governance action.</div>;
    }
    if (feature === "calendar") {
      const upcoming = records.filter((r) => r.due_at && new Date(r.due_at).getTime() > Date.now()).length;
      return <div className="text-xs text-slate-600">Upcoming timeline events: {upcoming} planned milestones.</div>;
    }
    if (feature === "announcements") {
      return <div className="text-xs text-slate-600">Broadcast mode: updates auto-fanout to notifications and timeline.</div>;
    }
    if (feature === "reports") {
      return <div className="text-xs text-slate-600">Reporting ops: use import/export to build board-ready packs quickly.</div>;
    }
    if (feature === "burnout") {
      const risk = records.filter((r) => r.priority === "critical" || r.status === "blocked").length;
      return <div className="text-xs text-rose-700">Risk watch: {risk} intervention cases need manager follow-up.</div>;
    }
    if (feature === "integrations") {
      return <div className="text-xs text-slate-600">Connector health: track failed syncs as blocked records.</div>;
    }
    if (feature === "audit") {
      return <div className="text-xs text-slate-600">Compliance mode: all changes are activity-logged and role-attributed.</div>;
    }
    if (feature === "os") {
      return <div className="text-xs text-slate-600">Cross-module command center: link records to any other workspace module.</div>;
    }
    return <div className="text-xs text-slate-600">This module uses a dedicated workflow lens with realtime synchronization.</div>;
  };

  if (!knownFeature) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unknown feature workspace.</div>;
  }

  return (
    <div className="space-y-5">
      <section className={`rounded-2xl bg-gradient-to-r ${meta.tone} p-6 text-white`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{meta.title}</h1>
            <p className="mt-1 text-sm text-white/90">{meta.purpose}</p>
            <div className="mt-2 text-xs text-white/80">Role: {role} • Feature: {feature}</div>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs">{subscribed ? "Realtime connected" : "Realtime connecting..."}</div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">{meta.action}</h2>
          <div className="mt-3 grid gap-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Describe ${feature} workflow details, dependencies, owners and outcome...`}
              rows={3}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
            <button onClick={createRecord} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Save
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Stat label="Total" value={payload?.snapshot?.total_records ?? records.length} />
            <Stat label="Blocked" value={payload?.snapshot?.blocked_records ?? 0} tone="text-rose-600" />
            <Stat label="Completed" value={payload?.snapshot?.completed_records ?? 0} tone="text-emerald-600" />
            <Stat label="Unread Alerts" value={payload?.snapshot?.unread_notifications ?? 0} tone="text-indigo-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Imports, Exports, and Connected Modules</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`/api/features/${feature}/workspace/export`} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </a>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
              <FileUp className="h-3.5 w-3.5" /> Import CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch(`/api/features/${feature}/workspace/import`, {
                    method: "POST",
                    headers: { "x-user-role": role, "x-user-name": actorName },
                    body: formData,
                  });
                  const data = await res.json();
                  if (!res.ok) return toast.error(data.error || "Import failed");
                  toast.success(`Imported ${data.inserted} rows`);
                  loadWorkspace();
                }}
              />
            </label>
          </div>
          <div className="mt-4 text-xs text-slate-500">Linked modules: {FEATURE_KEYS.filter((entry) => entry !== feature).slice(0, 4).join(", ")}...</div>
          <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2">{featureIntelligence()}</div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Operational Board</h3>
          {loading ? <div className="mt-3 text-sm text-slate-500">Loading records...</div> : null}
          <div className="mt-3 space-y-2">
            {records.map((record) => (
              <button
                type="button"
                key={record.id}
                onClick={() => setSelected(record)}
                className={`w-full rounded-xl border p-3 text-left ${selected?.id === record.id ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-slate-50"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-slate-600">{record.description || "No description yet."}</div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                      <CalendarDays className="h-3 w-3" /> {record.due_at ? new Date(record.due_at).toLocaleDateString() : "No due date"}
                      {record.linked_module ? <span className="inline-flex items-center gap-1"><Link2 className="h-3 w-3" />{record.linked_module}</span> : null}
                    </div>
                  </div>
                  <select
                    value={record.status}
                    onChange={(e) => updateRecord(record.id, { status: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px]"
                  >
                    {["todo", "in_progress", "blocked", "review", "approved", "done", "cancelled"].map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                </div>
              </button>
            ))}
            {!loading && records.length === 0 ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">No records yet.</div> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Collaboration Thread</h3>
          {!selected ? <div className="mt-3 text-sm text-slate-500">Select a record to collaborate.</div> : null}
          {selected ? (
            <>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-900">{selected.title}</div>
                <div className="mt-1 text-xs text-slate-600">{selected.description || "No details"}</div>
              </div>
              <div className="mt-3 space-y-2">
                {selectedComments.map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-slate-200 bg-white p-2 text-xs">
                    <div className="font-medium text-slate-700">{entry.author_name}</div>
                    <div className="text-slate-600">{entry.body}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-2">
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="rounded-md border border-slate-200 px-3 py-2 text-xs" placeholder="Add operational context..." />
                <div className="flex items-center gap-2">
                  <button onClick={submitComment} className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white"><MessageCircle className="h-3.5 w-3.5" /> Comment</button>
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600">
                    <Paperclip className="h-3.5 w-3.5" /> Attach
                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
                  </label>
                </div>
                {selectedFiles.length ? <div className="text-xs text-slate-500">Files: {selectedFiles.map((f) => f.file_name).join(", ")}</div> : null}
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Approvals & Governance</h3>
            {!canApprove ? <div className="mt-2 text-xs text-amber-700">Executive role required to approve or reject.</div> : null}
            {selected ? (
              <div className="mt-3 space-y-2">
                {canApprove ? (
                  <div className="flex gap-2">
                    <button onClick={() => approve("approved")} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
                    <button onClick={() => approve("rejected")} className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-xs text-white"><AlertTriangle className="h-3.5 w-3.5" /> Reject</button>
                  </div>
                ) : null}
                <div className="space-y-1">
                  {selectedApprovals.map((entry) => (
                    <div key={entry.id} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                      {entry.decision} by {entry.decided_by || "system"}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-500">Select an item to review decisions.</div>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900"><ShieldCheck className="h-4 w-4 text-indigo-600" /> Activity & Notifications</h3>
            <div className="mt-3 space-y-2">
              {(payload?.notifications ?? []).slice(0, 4).map((note) => (
                <div key={note.id} className="rounded-md border border-indigo-100 bg-indigo-50 p-2 text-xs text-indigo-800">{note.message}</div>
              ))}
              {(payload?.activity ?? []).slice(0, 4).map((entry) => (
                <div key={entry.id} className="rounded-md border border-slate-100 bg-slate-50 p-2 text-xs text-slate-700">
                  <span className="font-medium">{entry.actor_name}</span> {entry.details}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, tone = "text-slate-900" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-sm font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
