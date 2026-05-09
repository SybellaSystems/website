import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FEATURE_KEY_SET } from "@/lib/supabase/feature-keys";

export const dynamic = "force-dynamic";

const updateItemSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  notes: z.string().max(5000).optional(),
  status: z.enum(["todo", "in_progress", "blocked", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { feature: string; itemId: string } }
) {
  try {
    if (!FEATURE_KEY_SET.has(params.feature)) {
      return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateItemSchema.parse(body);
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("feature_items")
      .update(parsed)
      .eq("id", params.itemId)
      .eq("feature_key", params.feature)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { feature: string; itemId: string } }
) {
  try {
    if (!FEATURE_KEY_SET.has(params.feature)) {
      return NextResponse.json({ error: "Unknown feature key" }, { status: 404 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("feature_items")
      .delete()
      .eq("id", params.itemId)
      .eq("feature_key", params.feature);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
