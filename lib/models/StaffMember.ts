import getClientPromise from '../mongodb'
import { z } from 'zod'
import {
    staffMemberSchema,
    staffMemberOutScheme,
    staffMemberPasswordSchema,
    staffMemberQuerySchema,
    staffMemberSelfUpdateSchema,
    staffMemberUpdateSchema,
    loginSchema
} from '@/app/schemas/user.schema'


import { logger } from '@/lib/logger'
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '@/app/utils/jwt'
import crypto from "crypto";


// post staff member

export async function createStaffMember(staffMember: z.infer<typeof staffMemberSchema>) {

    const parsed = staffMemberSchema.parse(staffMember);

    const client = await getClientPromise();

    const db = client.db()

    // Build query - only check phone if it's provided and not empty
    // Escape special regex characters in email for safe matching
    const escapedEmail = parsed.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const queryConditions: any[] = [
        { email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } } // Case-insensitive email match
    ];
    
    // Only check phone if it's provided and not empty
    if (parsed.phone && parsed.phone.trim() !== '') {
        queryConditions.push({ phone: parsed.phone.trim() });
    }

    const existing = await db.collection("staff_members").findOne({
        $or: queryConditions
    });

    if (existing) {
        // Provide more specific error message
        if (existing.email?.toLowerCase() === parsed.email.toLowerCase()) {
            throw new Error("A staff member with this email already exists");
        }
        if (parsed.phone && existing.phone === parsed.phone) {
            throw new Error("A staff member with this phone number already exists");
        }
        throw new Error("A staff member with this email or phone number already exists");
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10);
    const staffToInsert = {
        ...parsed,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const res = await db.collection("staff_members").insertOne(staffToInsert);
    return res;
}


// get staffMember

export async function getStaffMemberOut(id: string) {
    const client = await getClientPromise();

    const db = client.db();

    const staff = await db.collection("staff_members").findOne({ id });

    if (!staff) {
        throw new Error("Staff member not found")
    }

    const staffMember: z.infer<typeof staffMemberOutScheme> = staffMemberOutScheme.parse(staff);

    return staffMember;
}

// get all members

export async function getStaffMembersOut() {
    const client = await getClientPromise();

    const db = client.db()

    const staffList = await db.collection("staff_members").find({}).toArray();

    return staffList.map(staff => staffMemberOutScheme.parse(staff)) || [];
}

// update staff member

export async function updateStaffMember(id: string, 
    data: z.infer<typeof staffMemberUpdateSchema>) {
    
    const parsed = staffMemberUpdateSchema.parse(data);
    const client = await getClientPromise();

    const db = client.db();

    const existing = db.collection("staff_members").findOne({ id });

    if (!existing) {
        throw new Error("Staff not found!");
    }
    await db.collection("staff_members").updateOne({ id }, { $set: { ...parsed, updatedAt: new Date() } });
    const updatedStaff: z.infer<typeof updateStaffMember> = await db.collection("staff_members").findOne({ id });
    if (!updatedStaff) {
        throw new Error("Staff Member Not Found!")
    }
    const m = staffMemberOutScheme.parse(updatedStaff)
    return {m};
}

// staff self update

export async function selfUpdateStaffMember(id:string, 
    data: z.infer<typeof staffMemberSelfUpdateSchema>) {
    const parsed = staffMemberSelfUpdateSchema.parse(data);
    const client = await getClientPromise();
    const db = client.db();
    const existing = await db.collection("staff_members").findOne({ id });
    if(!existing) {
        throw new Error("Staff Member Not Found");
    }
    await db.collection("staff_members").updateOne({ id }, {$set: { ...parsed, updatedAt: new Date() }})
    const updatedStaff = await db.collection("staff_members").findOne({ id });
    if(!updatedStaff){
        throw new Error ("Staff member not found");
    }
    return staffMemberOutScheme.parse(updatedStaff);
}

// update staff password

export async function updateStaffPassword(id: string, data: z.infer<typeof staffMemberPasswordSchema>) {
    const parsed = staffMemberPasswordSchema.parse(data);
    const client = await getClientPromise();
    const db = client.db()

    const existing = await db.collection("staff_members").findOne({ id });
    if(!existing) {
        throw new Error("Staff Member Not Found!");
    }
    const hashedPassword = await bcrypt.hash(parsed.oldPassword, 10);
    await db.collection("staff_members").updateOne({ id }, {$set: {password: hashedPassword, updatedAt: new Date()}})
    return {message: "Password Updated well"};
}

// member updaing self password

export async function updateSelfPassword(id: string, data: z.infer<typeof staffMemberPasswordSchema>) {
  const parsed = staffMemberPasswordSchema.parse(data);
  const client = await getClientPromise();
  const db = client.db();

  const existing = await db.collection("staff_members").findOne({ id });
  if (!existing) {
    throw new Error("Staff Member Not Found!");
  }

  const oldPasswordMatch = await bcrypt.compare(parsed.oldPassword, existing.password);
    if (!oldPasswordMatch) {
        throw new Error("Old password is incorrect!");
    }

  const isSame = await bcrypt.compare(parsed.newPassword, existing.password);
  if (isSame) {
    throw new Error("New password cannot be the same as the current password!");
  }

  // Hash and update
  const hashedPassword = await bcrypt.hash(parsed.newPassword, 10);
  await db.collection("staff_members").updateOne(
    { id },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );

  return { message: "Password updated successfully" };
}



// Staff Member Filtering

export async function staffMemberQuery(query: z.infer<typeof staffMemberQuerySchema>) {
  // Validate query
  const parsed = staffMemberQuerySchema.parse(query);

  const client = await getClientPromise();
  const db = client.db();

  // Build filter
  const filter: any = {};
  if (parsed.role) filter.role = parsed.role;
  if (typeof parsed.isActive === "boolean") filter.isActive = parsed.isActive;
  if (parsed.search) {
    filter.$or = [
      { names: { $regex: parsed.search, $options: "i" } },
      { email: { $regex: parsed.search, $options: "i" } },
    ];
  }

  // Query DB
  const staffList = await db.collection("staff_members").find(filter).toArray();

  return staffList.map((staff) => {
    const parsedStaff = staffMemberOutScheme.parse(staff);
    return { ...parsedStaff, _id: staff._id.toString() };
  });
}


// Staff Member Login

export async function loginStaff(input: unknown) {
    const parsed = loginSchema.parse(input);

    const client = await getClientPromise();

    const db = client.db();

    const staff = await db.collection("staff_members").findOne({ email: parsed.email });
    if(!staff) throw new Error ("Invalid Email or Password");
    if (staff.isActive === false) throw new Error("Account is suspended");
    if (staff.inviteStatus === "pending") throw new Error("Please complete onboarding from invitation email");

    const passwordMatch  = await bcrypt.compare(parsed.password, staff.password);
    if (!passwordMatch) throw new Error ("Invalid Email or Password");

    const accessToken = createAccessToken({id: staff.id, role: staff.role, permissions: staff.permissions });
    const refreshToken = createRefreshToken({ id: staff.id, role: staff.role, permissions: staff.permissions });

    return { accessToken, refreshToken }

}

export async function createStaffInviteAccount(input: {
  names: string;
  email: string;
  role: string;
  departmentId?: string;
  supervisorId?: string;
  permissions?: string[];
  createdBy: string;
}) {
  const client = await getClientPromise();
  const db = client.db();
  const existing = await db.collection("staff_members").findOne({ email: input.email.toLowerCase() });
  if (existing) throw new Error("A user with this email already exists");

  const temporaryPassword = crypto.randomBytes(8).toString("hex");
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
  const inviteToken = crypto.randomBytes(32).toString("hex");
  const now = new Date();

  const account = {
    id: crypto.randomUUID(),
    names: input.names.trim(),
    email: input.email.toLowerCase().trim(),
    password: hashedPassword,
    role: input.role,
    permissions: input.permissions || [],
    isActive: true,
    departmentId: input.departmentId || null,
    supervisorId: input.supervisorId || null,
    inviteToken,
    inviteStatus: "pending",
    inviteExpiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("staff_members").insertOne(account);

  return {
    id: account.id,
    inviteToken,
    temporaryPassword,
    email: account.email,
    names: account.names,
  };
}

export async function setupInvitedStaffPassword(inviteToken: string, password: string) {
  const client = await getClientPromise();
  const db = client.db();
  const account = await db.collection("staff_members").findOne({ inviteToken });
  if (!account) throw new Error("Invalid invite token");
  if (account.inviteStatus === "accepted") throw new Error("Invitation already used");
  if (account.inviteExpiresAt && new Date(account.inviteExpiresAt).getTime() < Date.now()) {
    throw new Error("Invitation link expired");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection("staff_members").updateOne(
    { inviteToken },
    {
      $set: {
        password: hashedPassword,
        inviteStatus: "accepted",
        updatedAt: new Date(),
      },
      $unset: { inviteToken: "", inviteExpiresAt: "" },
    }
  );

  return { success: true };
}



export async function findStaffByEmail(email: string) {
  const client = await getClientPromise();
  const db = client.db();
  return await db.collection("staff_members").findOne({ email });
}


export async function updateStaffPassword2fa(email: string, hashedPassword: string) {
  const client = await getClientPromise();
  const db = client.db();
  return await db
    .collection("staff_members")
    .updateOne({ email }, { $set: { password: hashedPassword } });
}

// delete staff member
export async function deleteStaffMember(id: string) {
  const client = await getClientPromise();
  const db = client.db();
  const res = await db.collection("staff_members").deleteOne({ id });
  return res.deletedCount > 0;
}