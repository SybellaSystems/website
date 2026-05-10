import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasRole, isFeatureKey, parseWorkspaceActor } from "@/lib/workspace";

export const dynamic = "force-dynamic";

const createRecordSchema = z.object({
  title: z.string().min(2).max(180),
  description: z.string().max(5000).optional().default(""),
  status: z.enum(["todo", "in_progress", "blocked", "review", "approved", "done", "cancelled"]).optional().default("todo"),
  priority: z.enum(["low", "medium", "high", "critical"]).optional().default("medium"),
  severity: z.enum(["info", "normal", "major", "critical"]).optional().default("normal"),
  assignee_name: z.string().max(120).optional().nullable(),
  due_at: z.string().datetime().optional().nullable(),
  starts_at: z.string().datetime().optional().nullable(),
  linked_module: z.string().optional().nullable(),
  linked_record_id: z.string().uuid().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export async function GET(_req: NextRequest, { params }: { params: { feature: string } }) {
  try {
    if (!isFeatureKey(params.feature)) {
      return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    }

    const supabase = getSupabaseServerClient();
    const [recordsRes, activityRes, notificationsRes, commentsRes, approvalsRes, attachmentsRes, snapshotRes] = await Promise.all([
      supabase.from("workspace_records").select("*").eq("feature_key", params.feature).is("deleted_at", null).order("updated_at", { ascending: false }),
      supabase.from("workspace_activity").select("*").eq("feature_key", params.feature).order("created_at", { ascending: false }).limit(25),
      supabase.from("workspace_notifications").select("*").eq("feature_key", params.feature).order("created_at", { ascending: false }).limit(25),
      supabase.from("workspace_comments").select("*").eq("feature_key", params.feature).order("created_at", { ascending: false }).limit(100),
      supabase.from("workspace_approvals").select("*").eq("feature_key", params.feature).order("created_at", { ascending: false }).limit(100),
      supabase.from("workspace_attachments").select("*").eq("feature_key", params.feature).order("created_at", { ascending: false }).limit(100),
      supabase.from("workspace_feature_snapshot").select("*").eq("feature_key", params.feature).maybeSingle(),
    ]);

    const err =
      recordsRes.error || activityRes.error || notificationsRes.error || commentsRes.error || approvalsRes.error || attachmentsRes.error || snapshotRes.error;
    if (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        records: recordsRes.data ?? [],
        activity: activityRes.data ?? [],
        notifications: notificationsRes.data ?? [],
        comments: commentsRes.data ?? [],
        approvals: approvalsRes.data ?? [],
        attachments: attachmentsRes.data ?? [],
        snapshot: snapshotRes.data ?? null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load workspace" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { feature: string } }) {
  try {
    if (!isFeatureKey(params.feature)) {
      return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    }

    const actor = parseWorkspaceActor(req.headers);
    if (!hasRole("operations-manager", actor.role)) {
      return NextResponse.json({ error: "Insufficient permissions to create records." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createRecordSchema.parse(body);
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("workspace_records")
      .insert({
        feature_key: params.feature,
        title: parsed.title,
        description: parsed.description,
        status: parsed.status,
        priority: parsed.priority,
        severity: parsed.severity,
        assignee_name: parsed.assignee_name ?? null,
        due_at: parsed.due_at ?? null,
        starts_at: parsed.starts_at ?? null,
        linked_module: parsed.linked_module ?? null,
        linked_record_id: parsed.linked_record_id ?? null,
        metadata: parsed.metadata ?? {},
        created_by: actor.name,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, record: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create record" }, { status: 400 });
  }
}
