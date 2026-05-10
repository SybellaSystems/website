import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isFeatureKey } from "@/lib/workspace";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const raw = String(value ?? "");
  if (raw.includes(",") || raw.includes('"') || raw.includes("\n")) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export async function GET(_req: Request, { params }: { params: { feature: string } }) {
  try {
    if (!isFeatureKey(params.feature)) {
      return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    }
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("workspace_records")
      .select("*")
      .eq("feature_key", params.feature)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const headers = ["id", "title", "status", "priority", "assignee_name", "due_at", "updated_at", "description"];
    const rows = (data ?? []).map((row: any) => headers.map((h) => csvEscape(row[h])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${params.feature}-workspace-export.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Export failed" }, { status: 500 });
  }
}
