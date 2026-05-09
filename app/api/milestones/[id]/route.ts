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


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authMiddleware(req, { roles: ["executive"] });
    const body = await req.json();

    const updated = await updateMilestone(params.id, body);

    if (!updated)
      return NextResponse.json({ success: false, message: "Failed to update milestone" }, { status: 400 });

    return NextResponse.json({ success: true, message: "Milestone updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
