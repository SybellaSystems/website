import { NextRequest, NextResponse } from "next/server";
import { staffMemberQuery } from "@/lib/models/StaffMember";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { permissionMiddleware } from "@/app/middleware/permissionMiddleware";
import { updateStaffMember } from "@/lib/models/StaffMember";
import { z } from "zod";


export async function GET(req: NextRequest) {
  const user = await authMiddleware(req, {
    roles: ["executive", "superadmin", "manager", "marketing", "qa-tester"],
  });
  if (user instanceof NextResponse) return user;

  const queryObj = Object.fromEntries(req.nextUrl.searchParams.entries());
  const query = {
    ...queryObj,
    isActive:
      queryObj.isActive === "true"
        ? true
        : queryObj.isActive === "false"
        ? false
        : undefined,
  };

  try {
    let staffList = await staffMemberQuery(query);
    staffList = staffList.map((staff) => ({
      ...staff,
      _id: staff._id.toString(),
    }));

    return NextResponse.json(staffList);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function PATCH(req: NextRequest) {
  try {

      const permResult = await permissionMiddleware(req, ["update_staff_member"]);
      if (permResult instanceof NextResponse) return permResult;
      const { user } = permResult;

    // const user = await authMiddleware(req, {
    //   roles: ["executive", "superadmin", "manager"],
    // });
    // if (user instanceof NextResponse) return user;

    // Extract data from body
    const body = await req.json();

    // Ensure `id` is provided (either from query or body)
    const id = body.id || req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    // Perform the update
    const result = await updateStaffMember(id, body);

    return NextResponse.json({
      message: "Staff member updated successfully",
      staff: result.m,
    });
  } catch (err: any) {
    console.error("Error updating staff:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
