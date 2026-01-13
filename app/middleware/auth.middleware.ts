import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getClientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "";

type MiddlewareOptions = {
  roles?: string[];
};

type DecodedToken = {
  id: string;
  role: string;
  permissions?: string[] | string; 
};

export async function authMiddleware(req: NextRequest, options?: MiddlewareOptions) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;


    if (options?.roles && !options.roles.includes("*") && !options.roles.includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden: Insufficient role" }, { status: 403 });
    }

    if (!decoded.permissions) {
      const client = await getClientPromise();
      const db = client.db();
      let queryId: ObjectId;
      try {
        queryId = new ObjectId(decoded.id);
      } catch (e) {
        console.error("JWT ID is not a valid ObjectId:", decoded.id);
        return NextResponse.json({ error: "Unauthorized: Invalid token ID format" }, { status: 401 });
      }

      const foundUser = await db.collection("users").findOne({ _id: queryId });
      
      if (foundUser) {
        decoded.permissions = foundUser.permissions || [];
      } else {
        console.warn(`Valid token for user ID ${decoded.id}, but user not found in DB.`);
      }
    }

    (req as any).user = decoded;

    return decoded;
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
  }
}