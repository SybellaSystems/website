import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const createItemSchema = z.object({
  title: z.string().min(2).max(160),
  notes: z.string().max(5000).optional().default(""),
  status: z.enum(["todo", "in_progress", "blocked", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("feature_items")
      .select("*")
      .eq("feature_key", params.feature)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data ?? [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    const body = await req.json();
    const parsed = createItemSchema.parse(body);
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("feature_items")
      .insert({
        feature_key: params.feature,
        title: parsed.title,
        notes: parsed.notes,
        status: parsed.status,
        priority: parsed.priority,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
