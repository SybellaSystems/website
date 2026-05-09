"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { FEATURE_KEY_SET } from "@/lib/supabase/feature-keys";

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
  integrations: "Integrations",
  "ai-assistant": "AI Assistant",
  audit: "Audit Log",
  os: "Internal OS",
};

type FeatureItem = {
  id: string;
  feature_key: string;
  title: string;
  notes: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
};

const STATUSES: FeatureItem["status"][] = ["todo", "in_progress", "blocked", "done"];
const PRIORITIES: FeatureItem["priority"][] = ["low", "medium", "high"];

const WIKI_STARTER_PAGES = [
  { title: "Engineering Handbook", notes: "Standards, release process, and architecture decisions." },
  { title: "On-call Runbook", notes: "Escalation paths, incident flow, and severity matrix." },
  { title: "API Catalog", notes: "Service ownership, endpoint conventions, and auth model." },
];

export default function FeaturePage({
  params,
}: {
  params: { feature: string };
}) {
  const feature = params.feature;
  const title = useMemo(() => TITLES[feature] ?? feature.replace(/-/g, " "), [feature]);
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const isKnownFeature = FEATURE_KEY_SET.has(feature);
  const isWiki = feature === "wiki";

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/features/${feature}/items`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load items");
      }
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load feature items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isKnownFeature) {
      setLoading(false);
      setItems([]);
      return;
    }
    loadItems();
  }, [feature]);

  useEffect(() => {
    if (!isKnownFeature) return;

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`feature-items-${feature}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feature_items",
          filter: `feature_key=eq.${feature}`,
        },
        () => {
          loadItems();
        }
      )
      .subscribe((status) => {
        setSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      setSubscribed(false);
      supabase.removeChannel(channel);
    };
  }, [feature, isKnownFeature]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    await createItem({
      title: newTitle.trim(),
      notes: newNotes.trim(),
      status: "todo",
      priority: "medium",
    });
  };

  const createItem = async (payload: {
    title: string;
    notes: string;
    status: FeatureItem["status"];
    priority: FeatureItem["priority"];
  }) => {
    setCreating(true);
    try {
      const res = await fetch(`/api/features/${feature}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create item");
      }
      setNewTitle("");
      setNewNotes("");
      toast.success("Saved");
      loadItems();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create item");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (item: FeatureItem, status: FeatureItem["status"]) => {
    try {
      const res = await fetch(`/api/features/${feature}/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update item");
      }
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status } : it)));
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const updatePriority = async (item: FeatureItem, priority: FeatureItem["priority"]) => {
    try {
      const res = await fetch(`/api/features/${feature}/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update item");
      }
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, priority } : it)));
    } catch (error: any) {
      toast.error(error.message || "Failed to update priority");
    }
  };

  const addWikiStarterPages = async () => {
    for (const entry of WIKI_STARTER_PAGES) {
      const ok = await createItem({
        title: entry.title,
        notes: entry.notes,
        status: "todo",
        priority: "medium",
      });
      if (!ok) return;
    }
    toast.success("Wiki starter pages created");
  };

  const todoCount = items.filter((i) => i.status === "todo").length;
  const inProgressCount = items.filter((i) => i.status === "in_progress").length;
  const doneCount = items.filter((i) => i.status === "done").length;
  const blockedCount = items.filter((i) => i.status === "blocked").length;

  const statusChipClass = (status: FeatureItem["status"]) =>
    ({
      todo: "bg-slate-100 text-slate-700",
      in_progress: "bg-blue-100 text-blue-700",
      blocked: "bg-red-100 text-red-700",
      done: "bg-emerald-100 text-emerald-700",
    }[status]);

  const priorityChipClass = (priority: FeatureItem["priority"]) =>
    ({
      low: "bg-emerald-100 text-emerald-700",
      medium: "bg-amber-100 text-amber-700",
      high: "bg-rose-100 text-rose-700",
    }[priority]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const deleteItem = async (item: FeatureItem) => {
    try {
      const res = await fetch(`/api/features/${feature}/items/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete item");
      }
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      toast.success("Item deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-indigo-100">
              Operational workspace with live database sync and role-friendly tracking.
            </p>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            {subscribed ? "Realtime connected" : "Realtime connecting"}
          </div>
        </div>
      </div>

      {!isKnownFeature ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unknown feature route. Use one of the configured pages from the sidebar.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">To do</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{todoCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">In progress</div>
          <div className="mt-2 text-2xl font-semibold text-blue-700">{inProgressCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Blocked</div>
          <div className="mt-2 text-2xl font-semibold text-rose-700">{blockedCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Done</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-700">{doneCount}</div>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_auto]">
        <div className="grid gap-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={`Add a ${title} item title`}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Optional notes"
            rows={3}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-end gap-2">
          {isWiki ? (
            <button
              type="button"
              onClick={addWikiStarterPages}
              disabled={creating || !isKnownFeature}
              className="rounded-md border border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
            >
              Add wiki starter pages
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !isKnownFeature}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? "Saving..." : "Add item"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            No items yet. Add your first record above.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  {item.notes ? <div className="mt-1 text-sm text-slate-600">{item.notes}</div> : null}
                  <div className="mt-2 text-xs text-slate-500">Updated {formatDate(item.updated_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusChipClass(item.status)}`}>
                    {item.status.replace("_", " ")}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityChipClass(item.priority)}`}>
                    {item.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteItem(item)}
                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(item, status)}
                    className={[
                      "rounded-full px-3 py-1 text-xs",
                      item.status === status
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    ].join(" ")}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
                <select
                  value={item.priority}
                  onChange={(e) => updatePriority(item, e.target.value as FeatureItem["priority"])}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

