import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getClientPromise from "@/lib/mongodb";
import { requireAdminAccess } from "@/lib/rbac/guard";
import { ADMIN_ROLES } from "@/lib/rbac/roles";
import { createStaffInviteAccount } from "@/lib/models/StaffMember";
import { sendEmail } from "@/lib/email";

const createAccountSchema = z.object({
  names: z.string().min(2),
  email: z.string().email(),
  role: z.enum(ADMIN_ROLES),
  departmentId: z.string().optional(),
  supervisorId: z.string().optional(),
  permissions: z.array(z.string()).optional().default([]),
});

export async function GET(req: NextRequest) {
  const auth = await requireAdminAccess(req, { permissions: ["users.update"] });
  if (auth instanceof NextResponse) return auth;

  const client = await getClientPromise();
  const users = await client
    .db()
    .collection("staff_members")
    .find({})
    .project({
      _id: 0,
      id: 1,
      names: 1,
      email: 1,
      role: 1,
      isActive: 1,
      departmentId: 1,
      supervisorId: 1,
      inviteStatus: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAccess(req, { permissions: ["users.create"] });
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const parsed = createAccountSchema.parse(body);
  const account = await createStaffInviteAccount({
    ...parsed,
    createdBy: auth.id,
  });

  const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding/${account.inviteToken}`;
  await sendEmail({
    receiver: account.email,
    subject: "You have been invited to the company platform",
    message: `Hello ${account.names}, you were invited to the company platform.\nSet your password here: ${onboardingUrl}\nTemporary password: ${account.temporaryPassword}`,
    name: "Sybella Admin",
  });

  return NextResponse.json({
    success: true,
    account: {
      id: account.id,
      email: account.email,
      names: account.names,
      onboardingUrl,
      temporaryPassword: account.temporaryPassword,
    },
  });
}

