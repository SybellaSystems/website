import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import {
  addMilestone,
  getAllMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  Milestone,
} from "@/lib/models/Milestone";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    // await authMiddleware(req, {roles: ['executive', 'marketing', 'qatester']});

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const milestone = await getMilestoneById(id);
      if (!milestone) return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });
      return NextResponse.json({ success: true, milestone });
    }

    const milestones = await getAllMilestones();
    return NextResponse.json({ success: true, milestones });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await authMiddleware(req, {roles: ['executive', 'marketing']});
  try {
    const body = await req.json();
    const { name, description, startYear, endYear } = body;

    if (!name || !description || !startYear || !endYear) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const milestone: Milestone = { name, description, startYear, endYear };
    const res = await addMilestone(milestone);

    return NextResponse.json({ success: true, milestoneId: res.milestoneId });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    await authMiddleware(req, {roles: ['executive']});

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Milestone ID is required" }, { status: 400 });

    const deleted = await deleteMilestone(id);
    if (!deleted) return NextResponse.json({ success: false, message: "Failed to delete milestone" }, { status: 400 });

    return NextResponse.json({ success: true, message: "Milestone deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
