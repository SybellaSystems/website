// app/api/admin/overview/route.ts
import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { readAdminTokenFromRequest } from "@/lib/auth/admin-session";
import { verifyAccessToken } from "@/app/utils/jwt";

export const dynamic = "force-dynamic";

interface MongoStats {
  projects: number;
  updates: number;
  teamMembers: number;
  contacts: number;
  subscribers: number;
  workspaceTotalRecords: number;
  workspaceBlockedRecords: number;
  workspaceByFeature?: Record<string, number>;
}

export async function GET(req: NextRequest) {
  try {
    const token = readAdminTokenFromRequest(req);
    const session = token ? verifyAccessToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    // Run queries in parallel with graceful fallbacks
    const [
      mongoStatsResult,
      projectsResult,
      revenueResult,
      activitiesResult,
      onlineUsersResult,
    ] = await Promise.allSettled([
      // MongoDB + Workspace Stats
      (async (): Promise<MongoStats> => {
        const client = await getClientPromise();
        const db = client.db();

        const [projects, updates, teamMembers, contacts, subscribers] = await Promise.all([
          db.collection("projects").countDocuments(),
          db.collection("updates").countDocuments(),
          db.collection("team_members").countDocuments(),
          db.collection("contacts").countDocuments(),
          client.db("newsletterDB").collection("subscribers").countDocuments(),
        ]);

        const { data: workspaceSnapshot } = await supabase
          .from("workspace_feature_snapshot")
          .select("*");

        return {
          projects,
          updates,
          teamMembers,
          contacts,
          subscribers,
          workspaceTotalRecords: workspaceSnapshot?.reduce((sum: number, row: any) => sum + (row.total_records || 0), 0) || 0,
          workspaceBlockedRecords: workspaceSnapshot?.reduce((sum: number, row: any) => sum + (row.blocked_records || 0), 0) || 0,
          workspaceByFeature: workspaceSnapshot?.reduce((acc: Record<string, number>, row: any) => {
            acc[row.feature_key] = row.total_records ?? 0;
            return acc;
          }, {}),
        };
      })(),

      // Active Projects from Supabase
      supabase
        .from("projects")
        .select(`
          id, title, client_name, status, progress, due_date, updated_at,
          project_team!inner(team_members(name, initials, avatar_color))
        `)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(10),

      // Revenue Trend
      supabase
        .from("revenue_records")
        .select("month, revenue")
        .order("month", { ascending: true })
        .limit(12),

      // Recent Activities
      supabase
        .from("activities")
        .select(`
          id, action, target, created_at,
          staff(name, initials)
        `)
        .order("created_at", { ascending: false })
        .limit(15),

      // Online Users (last 30 min)
      supabase
        .from("staff")
        .select("id, name, role, last_active, initials")
        .gte("last_active", new Date(Date.now() - 30 * 60 * 1000).toISOString())
        .order("last_active", { ascending: false }),
    ]);

    // Safe data extraction
    const mongoStats: MongoStats = mongoStatsResult.status === "fulfilled" 
      ? mongoStatsResult.value 
      : {
          projects: 0,
          updates: 0,
          teamMembers: 0,
          contacts: 0,
          subscribers: 0,
          workspaceTotalRecords: 0,
          workspaceBlockedRecords: 0,
        };

    const activeProjects = projectsResult.status === "fulfilled" ? projectsResult.value.data || [] : [];
    const revenueTrend = revenueResult.status === "fulfilled" ? revenueResult.value.data || [] : [];
    const recentActivities = activitiesResult.status === "fulfilled" ? activitiesResult.value.data || [] : [];
    const onlineUsers = onlineUsersResult.status === "fulfilled" ? onlineUsersResult.value.data || [] : [];

    return NextResponse.json({
      stats: {
        totalProjects: mongoStats.projects,
        activeProjects: activeProjects.length,
        totalRevenue: 124800,           // TODO: Replace with real aggregation later
        monthlyRevenue: 28500,          // TODO: Replace with real aggregation later
        teamMembers: mongoStats.teamMembers,
        onlineNow: onlineUsers.length,
      },
      revenueTrend,
      activeProjects: activeProjects.map((p: any) => ({
        ...p,
        teamMembers: p.project_team?.flatMap((pt: any) => pt.team_members) || [],
      })),
      recentActivities: recentActivities.map((a: any) => ({
        ...a,
        user: a.staff,
      })),
      onlineUsers,
      workspaceByFeature: mongoStats.workspaceByFeature || {},
    });
  } catch (error: any) {
    console.error("Dashboard Overview Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}