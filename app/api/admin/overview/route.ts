import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { readAdminTokenFromRequest } from "@/lib/auth/admin-session";
import { verifyAccessToken } from "@/app/utils/jwt";

export const dynamic = "force-dynamic";

async function countCollection(dbName: string | undefined, collectionName: string): Promise<number> {
  const client = await getClientPromise();
  const db = dbName ? client.db(dbName) : client.db();
  return db.collection(collectionName).countDocuments();
}

export async function GET(req: NextRequest) {
  try {
    const token = readAdminTokenFromRequest(req);
    const session = token ? verifyAccessToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [projects, updates, teamMembers, contacts, subscribers, workspaceSnapshot] = await Promise.all([
      countCollection(undefined, "projects"),
      countCollection(undefined, "updates"),
      countCollection(undefined, "team_members"),
      countCollection(undefined, "contacts"),
      countCollection("newsletterDB", "subscribers"),
      getSupabaseServerClient().from("workspace_feature_snapshot").select("*"),
    ]);

    const workspaceByFeature = (workspaceSnapshot.data || []).reduce<Record<string, number>>((acc, row: any) => {
      acc[row.feature_key] = row.total_records ?? 0;
      return acc;
    }, {});

    return NextResponse.json({
      projects,
      updates,
      teamMembers,
      contacts,
      subscribers,
      workspaceTotalRecords: (workspaceSnapshot.data || []).reduce((sum: number, row: any) => sum + (row.total_records || 0), 0),
      workspaceBlockedRecords: (workspaceSnapshot.data || []).reduce((sum: number, row: any) => sum + (row.blocked_records || 0), 0),
      workspaceByFeature,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load admin overview" }, { status: 500 });
  }
}

