import { NextRequest, NextResponse } from 'next/server';
import { selfUpdateStaffMember } from '@/lib/models/StaffMember';
import { authMiddleware } from '@/app/middleware/auth.middleware';

export async function PATCH(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["*"] });
  if (user instanceof NextResponse) return user;

  const body = await req.json();

  try {
    const updatedStaff = await selfUpdateStaffMember(user.id, body);
    return NextResponse.json(updatedStaff);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
