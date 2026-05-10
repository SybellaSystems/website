import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasRole, isFeatureKey, parseWorkspaceActor } from "@/lib/workspace";

export const dynamic = "force-dynamic";

function parseCsv(content: string): Array<Record<string, string>> {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    return headers.reduce((acc, key, idx) => {
      acc[key] = values[idx] ?? "";
      return acc;
    }, {} as Record<string, string>);
  });
}

export async function POST(req: NextRequest, { params }: { params: { feature: string } }) {
  try {
    if (!isFeatureKey(params.feature)) return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    const actor = parseWorkspaceActor(req.headers);
    if (!hasRole("operations-manager", actor.role)) return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "CSV file is required." }, { status: 400 });
    }
    const content = await file.text();
    const rows = parseCsv(content);
    if (!rows.length) {
      return NextResponse.json({ error: "No rows found in CSV." }, { status: 400 });
    }

    const payload = rows.map((row) => ({
      feature_key: params.feature,
      title: row.title || "Imported item",
      description: row.description || "",
      status: (row.status || "todo").toLowerCase(),
      priority: (row.priority || "medium").toLowerCase(),
      assignee_name: row.assignee_name || null,
      due_at: row.due_at || null,
      created_by: actor.name,
    }));

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("workspace_records").insert(payload).select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, inserted: data?.length ?? 0 }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Import failed" }, { status: 500 });
  }
}
