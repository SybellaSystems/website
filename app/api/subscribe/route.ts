import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/app/middleware/auth.middleware";


export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const client = await clientPromise();
    const db = client.db("newsletterDB");
    const collection = db.collection("subscribers");

    const existing = await collection.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }

    await collection.insertOne({ email, subscribedAt: new Date() });
    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const user = await authMiddleware(req, {
    roles: ["executive", "superadmin", "manager", "marketing"],
  });
  if (user instanceof NextResponse) return user;
  try {
    const client = await clientPromise();
    const db = client.db("newsletterDB");
    const collection = db.collection("subscribers");

    const subscribers = await collection.find({}).toArray();
    return NextResponse.json({ subscribers });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}