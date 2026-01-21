import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { updateTeamMember, deleteTeamMember } from "@/lib/models/TeamMember";

interface Params {
  params: { id: string };
}


export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const authResult = await authMiddleware(req, { roles: ["executive", "superadmin"] });

    //If middleware returned a NextResponse, it means auth failed
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const updated = await updateTeamMember(params.id, body);

    if (!updated)
      return NextResponse.json({ success: false, message: "Team Member not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Team Member updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authResult = await authMiddleware(req, { roles: ["executive", "superadmin"] });

    //If middleware returned a NextResponse, it means auth failed
    if (authResult instanceof NextResponse) return authResult;

    const deleted = await deleteTeamMember(params.id);

    if (!deleted)
      return NextResponse.json({ success: false, message: "Team Member not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Team Member deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
