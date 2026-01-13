// app/api/staff/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createStaffMember } from '@/lib/models/StaffMember';
import { authMiddleware } from '@/app/middleware/auth.middleware';
import { ZodError } from 'zod';
export async function POST(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["executive", "superadmin", "manager"] });
  if (user instanceof NextResponse) return user;

  const body = await req.json();

  try {
    const staff = await createStaffMember(body);
    return NextResponse.json({staff, message: "New Staff Member Created"}, { status: 201 });
  } catch (err: any) {

    if (err instanceof ZodError) {
      const errors = err.format();
      return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

