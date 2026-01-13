
import { NextRequest, NextResponse } from 'next/server';
import { getStaffMemberOut, updateStaffMember } from '@/lib/models/StaffMember';
import { authMiddleware} from '@/app/middleware/auth.middleware';
import { ZodError, z } from 'zod';
import { staffMemberSelfUpdateSchema, staffMemberUpdateSchema } from '@/app/schemas/user.schema';
// get staff individual staff member

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authMiddleware(req);
  if (user instanceof NextResponse) return user;
  
  try {
    const staff = await getStaffMemberOut(params.id);
    return NextResponse.json(staff);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

// Updating staff member

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authMiddleware(req, { roles: ["executive", "superadmin"] });
  if (user instanceof NextResponse) return user;


  const body = await req.json();
  try {
    const parsed = staffMemberUpdateSchema.parse(JSON.parse(JSON.stringify(body)))
    const updatedStaff = await updateStaffMember(params.id, parsed);
    if (!updatedStaff) {
        return;
    }
    return NextResponse.json({message: "Updated User", user: updatedStaff});
  } catch (err: any) {
    if (err instanceof z.ZodError) {
    return NextResponse.json({ error: err.format() }, { status: 400 });
  }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

