import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasRole, isFeatureKey, parseWorkspaceActor } from "@/lib/workspace";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { feature: string } }) {
  try {
    if (!isFeatureKey(params.feature)) return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    const actor = parseWorkspaceActor(req.headers);
    if (!hasRole("operations-manager", actor.role)) return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get("file");
    const recordId = (formData.get("recordId") as string | null) ?? null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing upload file." }, { status: 400 });
    }
    if (!recordId) {
      return NextResponse.json({ error: "recordId is required for uploads." }, { status: 400 });
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${params.feature}/${recordId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const supabase = getSupabaseServerClient();

    const { error: uploadErr } = await supabase.storage.from("workspace-media").upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

    const { data: publicUrlData } = supabase.storage.from("workspace-media").getPublicUrl(path);

    const { data: attachment, error: dbErr } = await supabase
      .from("workspace_attachments")
      .insert({
        record_id: recordId,
        feature_key: params.feature,
        file_path: path,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        bytes: file.size,
        uploaded_by: actor.name,
      })
      .select("*")
      .single();
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

    return NextResponse.json({ success: true, attachment, publicUrl: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
