import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasRole, isFeatureKey, parseWorkspaceActor } from "@/lib/workspace";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().min(2).max(180).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(["todo", "in_progress", "blocked", "review", "approved", "done", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  severity: z.enum(["info", "normal", "major", "critical"]).optional(),
  assignee_name: z.string().max(120).optional().nullable(),
  due_at: z.string().datetime().optional().nullable(),
  starts_at: z.string().datetime().optional().nullable(),
  linked_module: z.string().optional().nullable(),
  linked_record_id: z.string().uuid().optional().nullable(),
  metadata: z.record(z.any()).optional(),
});

const commentSchema = z.object({
  body: z.string().min(2).max(4000),
});

const approvalSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().max(1000).optional().default(""),
});

export async function PATCH(req: NextRequest, { params }: { params: { feature: string; recordId: string } }) {
  try {
    if (!isFeatureKey(params.feature)) return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    const actor = parseWorkspaceActor(req.headers);
    if (!hasRole("manager", actor.role)) return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });

    const body = await req.json();
    const supabase = getSupabaseServerClient();

    if (body?.action === "comment") {
      const parsedComment = commentSchema.parse(body);
      const { data, error } = await supabase
        .from("workspace_comments")
        .insert({
          feature_key: params.feature,
          record_id: params.recordId,
          author_name: actor.name,
          body: parsedComment.body,
        })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, comment: data }, { status: 200 });
    }

    if (body?.action === "approval") {
      if (!hasRole("executive", actor.role)) {
        return NextResponse.json({ error: "Executive approval role required." }, { status: 403 });
      }
      const parsedApproval = approvalSchema.parse(body);
      const { data: approval, error: approvalErr } = await supabase
        .from("workspace_approvals")
        .insert({
          feature_key: params.feature,
          record_id: params.recordId,
          decision: parsedApproval.decision,
          decided_by: actor.name,
          reason: parsedApproval.reason,
          decided_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      if (approvalErr) return NextResponse.json({ error: approvalErr.message }, { status: 500 });

      const { data: record, error: recordErr } = await supabase
        .from("workspace_records")
        .update({ status: parsedApproval.decision === "approved" ? "approved" : "blocked" })
        .eq("id", params.recordId)
        .eq("feature_key", params.feature)
        .select("*")
        .single();
      if (recordErr) return NextResponse.json({ error: recordErr.message }, { status: 500 });

      return NextResponse.json({ success: true, approval, record }, { status: 200 });
    }

    const parsed = updateSchema.parse(body);
    const { data, error } = await supabase
      .from("workspace_records")
      .update(parsed)
      .eq("id", params.recordId)
      .eq("feature_key", params.feature)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, record: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update record" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { feature: string; recordId: string } }) {
  try {
    if (!isFeatureKey(params.feature)) return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    const actor = parseWorkspaceActor(req.headers);
    if (!hasRole("manager", actor.role)) return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("workspace_records")
      .update({ deleted_at: new Date().toISOString(), status: "cancelled", metadata: { deleted_by: actor.name } })
      .eq("id", params.recordId)
      .eq("feature_key", params.feature);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete record" }, { status: 500 });
  }
}
