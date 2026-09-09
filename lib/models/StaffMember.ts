import getClientPromise from "../mongodb";

import { z } from "zod";

import {
  staffMemberSchema,
  staffMemberOutScheme,
  staffMemberPasswordSchema,
  staffMemberQuerySchema,
  staffMemberSelfUpdateSchema,
  staffMemberUpdateSchema,
  loginSchema,
} from "@/app/schemas/user.schema";

import { logger } from "@/lib/logger";

import bcrypt from "bcryptjs";

import {
  createAccessToken,
  createRefreshToken,
} from "@/app/utils/jwt";

// ============================================================
// CREATE STAFF MEMBER
// ============================================================

export async function createStaffMember(
  staffMember: z.infer<typeof staffMemberSchema>
) {
  const parsed = staffMemberSchema.parse(staffMember);

  const client = await getClientPromise();
  const db = client.db();

  const escapedEmail = parsed.email.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const queryConditions: any[] = [
    {
      email: {
        $regex: new RegExp(`^${escapedEmail}$`, "i"),
      },
    },
  ];

  if (parsed.phone && parsed.phone.trim() !== "") {
    queryConditions.push({
      phone: parsed.phone.trim(),
    });
  }

  const existing = await db.collection("staff_members").findOne({
    $or: queryConditions,
  });

  if (existing) {
    if (
      existing.email?.toLowerCase() ===
      parsed.email.toLowerCase()
    ) {
      throw new Error(
        "A staff member with this email already exists"
      );
    }

    if (parsed.phone && existing.phone === parsed.phone) {
      throw new Error(
        "A staff member with this phone number already exists"
      );
    }

    throw new Error(
      "A staff member with this email or phone number already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(
    parsed.password,
    10
  );

  const staffToInsert = {
    ...parsed,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const res = await db
    .collection("staff_members")
    .insertOne(staffToInsert);

  return res;
}

// ============================================================
// GET STAFF MEMBER
// ============================================================

export async function getStaffMemberOut(id: string) {
  const client = await getClientPromise();
  const db = client.db();

  const staff = await db
    .collection("staff_members")
    .findOne({ id });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  const staffMember =
    staffMemberOutScheme.parse(staff);

  return staffMember;
}

// ============================================================
// GET ALL STAFF MEMBERS
// ============================================================

export async function getStaffMembersOut() {
  const client = await getClientPromise();
  const db = client.db();

  const staffList = await db
    .collection("staff_members")
    .find({})
    .toArray();

  return staffList.map((staff) =>
    staffMemberOutScheme.parse(staff)
  );
}

// ============================================================
// UPDATE STAFF MEMBER
// ============================================================

export async function updateStaffMember(
  id: string,
  data: z.infer<typeof staffMemberUpdateSchema>
) {
  const parsed = staffMemberUpdateSchema.parse(data);

  const client = await getClientPromise();
  const db = client.db();

  const existing = await db
    .collection("staff_members")
    .findOne({ id });

  if (!existing) {
    throw new Error("Staff not found!");
  }

  await db.collection("staff_members").updateOne(
    { id },
    {
      $set: {
        ...parsed,
        updatedAt: new Date(),
      },
    }
  );

  const updatedStaff = await db
    .collection("staff_members")
    .findOne({ id });

  if (!updatedStaff) {
    throw new Error("Staff Member Not Found!");
  }

  const m = staffMemberOutScheme.parse(updatedStaff);

  return { m };
}

// ============================================================
// STAFF SELF UPDATE
// ============================================================

export async function selfUpdateStaffMember(
  id: string,
  data: z.infer<typeof staffMemberSelfUpdateSchema>
) {
  const parsed =
    staffMemberSelfUpdateSchema.parse(data);

  const client = await getClientPromise();
  const db = client.db();

  const existing = await db
    .collection("staff_members")
    .findOne({ id });

  if (!existing) {
    throw new Error("Staff Member Not Found");
  }

  await db.collection("staff_members").updateOne(
    { id },
    {
      $set: {
        ...parsed,
        updatedAt: new Date(),
      },
    }
  );

  const updatedStaff = await db
    .collection("staff_members")
    .findOne({ id });

  if (!updatedStaff) {
    throw new Error("Staff member not found");
  }

  return staffMemberOutScheme.parse(updatedStaff);
}

// ============================================================
// UPDATE STAFF PASSWORD
// ============================================================

export async function updateStaffPassword(
  id: string,
  data: z.infer<typeof staffMemberPasswordSchema>
) {
  const parsed =
    staffMemberPasswordSchema.parse(data);

  const client = await getClientPromise();
  const db = client.db();

  const existing = await db
    .collection("staff_members")
    .findOne({ id });

  if (!existing) {
    throw new Error("Staff Member Not Found!");
  }

  // FIX: hash the NEW password, not the old password
  const hashedPassword = await bcrypt.hash(
    parsed.newPassword,
    10
  );

  await db.collection("staff_members").updateOne(
    { id },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    }
  );

  return {
    message: "Password Updated well",
  };
}

// ============================================================
// MEMBER UPDATING SELF PASSWORD
// ============================================================

export async function updateSelfPassword(
  id: string,
  data: z.infer<typeof staffMemberPasswordSchema>
) {
  const parsed =
    staffMemberPasswordSchema.parse(data);

  const client = await getClientPromise();
  const db = client.db();

  const existing = await db
    .collection("staff_members")
    .findOne({ id });

  if (!existing) {
    throw new Error("Staff Member Not Found!");
  }

  const oldPasswordMatch =
    await bcrypt.compare(
      parsed.oldPassword,
      existing.password
    );

  if (!oldPasswordMatch) {
    throw new Error(
      "Old password is incorrect!"
    );
  }

  const isSame = await bcrypt.compare(
    parsed.newPassword,
    existing.password
  );

  if (isSame) {
    throw new Error(
      "New password cannot be the same as the current password!"
    );
  }

  const hashedPassword = await bcrypt.hash(
    parsed.newPassword,
    10
  );

  await db.collection("staff_members").updateOne(
    { id },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    }
  );

  return {
    message: "Password updated successfully",
  };
}

// ============================================================
// STAFF MEMBER FILTERING
// ============================================================

export async function staffMemberQuery(
  query: z.infer<typeof staffMemberQuerySchema>
) {
  const parsed =
    staffMemberQuerySchema.parse(query);

  const client = await getClientPromise();
  const db = client.db();

  const filter: any = {};

  if (parsed.role) {
    filter.role = parsed.role;
  }

  if (typeof parsed.isActive === "boolean") {
    filter.isActive = parsed.isActive;
  }

  if (parsed.search) {
    filter.$or = [
      {
        names: {
          $regex: parsed.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: parsed.search,
          $options: "i",
        },
      },
    ];
  }

  const staffList = await db
    .collection("staff_members")
    .find(filter)
    .toArray();

  return staffList.map((staff) => {
    const parsedStaff =
      staffMemberOutScheme.parse(staff);

    return {
      ...parsedStaff,
      _id: staff._id.toString(),
    };
  });
}

// ============================================================
// STAFF MEMBER LOGIN
// ============================================================

export async function loginStaff(input: unknown) {
  const parsed = loginSchema.parse(input);

  const client = await getClientPromise();
  const db = client.db();

  // TEMPORARY DEBUGGING
  console.log(
    "================ LOGIN DEBUG ================"
  );

  console.log(
    "DATABASE:",
    db.databaseName
  );

  const collections =
    await db.listCollections().toArray();

  console.log(
    "COLLECTIONS:",
    collections.map((c) => c.name)
  );

  console.log(
    "LOGIN EMAIL:",
    parsed.email
  );

  const staff = await db
    .collection("staff_members")
    .findOne({
      email: parsed.email.toLowerCase(),
    });

  console.log(
    "STAFF FOUND:",
    !!staff
  );

  if (staff) {
    console.log(
      "DB EMAIL:",
      staff.email
    );

    console.log(
      "PASSWORD HASH EXISTS:",
      !!staff.password
    );

    const passwordMatch =
      await bcrypt.compare(
        parsed.password,
        staff.password
      );

    console.log(
      "PASSWORD MATCH:",
      passwordMatch
    );

    console.log(
      "============================================"
    );

    if (!passwordMatch) {
      throw new Error(
        "Invalid Email or Password"
      );
    }
  } else {
    console.log(
      "============================================"
    );

    throw new Error(
      "Invalid Email or Password"
    );
  }

  const accessToken =
    createAccessToken({
      id: staff.id,
      role: staff.role,
      permissions: staff.permissions,
    });

  const refreshToken =
    createRefreshToken({
      id: staff.id,
      role: staff.role,
      permissions: staff.permissions,
    });

  return {
    accessToken,
    refreshToken,
  };
}

// ============================================================
// FIND STAFF BY EMAIL
// ============================================================

export async function findStaffByEmail(
  email: string
) {
  const client = await getClientPromise();
  const db = client.db();

  return await db
    .collection("staff_members")
    .findOne({
      email: email.toLowerCase(),
    });
}

// ============================================================
// UPDATE STAFF PASSWORD - 2FA
// ============================================================

export async function updateStaffPassword2fa(
  email: string,
  hashedPassword: string
) {
  const client = await getClientPromise();
  const db = client.db();

  return await db
    .collection("staff_members")
    .updateOne(
      {
        email: email.toLowerCase(),
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
}

// ============================================================
// DELETE STAFF MEMBER
// ============================================================

export async function deleteStaffMember(
  id: string
) {
  const client = await getClientPromise();
  const db = client.db();

  const res = await db
    .collection("staff_members")
    .deleteOne({ id });

  return res.deletedCount > 0;
}