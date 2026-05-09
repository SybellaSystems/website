"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
    loadItems();
  }, [feature]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`/api/features/${feature}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          notes: newNotes.trim(),
          status: "todo",
          priority: "medium",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create item");
      }
      setNewTitle("");
      setNewNotes("");
      toast.success("Item created");
      loadItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to create item");
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-600">
        This page now persists its items to Supabase without touching existing Mongo-backed modules.
      </p>

      <div className="mt-5 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={`Add a ${title} item title`}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <textarea
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="Optional notes"
          rows={3}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="w-fit rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {creating ? "Saving..." : "Add item"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No items yet. Add your first one above.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                  {item.notes ? <div className="mt-1 text-sm text-gray-600">{item.notes}</div> : null}
                </div>
                <button
                  type="button"
                  onClick={() => deleteItem(item)}
                  className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(["todo", "in_progress", "blocked", "done"] as const).map((status) => (
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

