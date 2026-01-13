import { NextRequest, NextResponse } from "next/server";
import { permissionMiddleware } from "@/app/middleware/permissionMiddleware";
import getClientPromise  from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";

const COLLECTIONS = {
  contacts: "contacts",
  subscribers: "subscribers",
  staff: "staff",
};

export async function POST(req: NextRequest) {
  const permResult = await permissionMiddleware(req, ["reply_contacts"]);
  if (permResult instanceof NextResponse) return permResult;

  const { user } = permResult;

  try {
    const { type, id, subject, message } = await req.json() as {
      type: keyof typeof COLLECTIONS;
      id: string;
      subject: string;
      message: string;
    };
    if (!type || !id || !subject || !message) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const collectionName = COLLECTIONS[type];
    if (!collectionName)
      return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });

    const client = await getClientPromise();
    let db;
    if(collectionName == 'subscribers') {
      db = client.db('newsletterDB')
    } else {
    db = client.db();
    }
    const record = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!record)
      return NextResponse.json({ success: false, message: `${type} not found` }, { status: 404 });

    const emailResult = await sendEmail({
      receiver: record.email,
      subject,
      message,
      name: "Sybella Support Team",
      company: record.company || "Sybella Systems",
      phone: record.phone || "+254 715 410 009",
    });

    if (!emailResult.success)
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });

    await db.collection("replies").insertOne({
      type,
      recordId: new ObjectId(id),
      email: record.email,
      subject,
      message,
      sentAt: new Date(),
      sentBy: user.id,
    });

    return NextResponse.json({ success: true, message: "Reply sent successfully" });
  } catch (err) {
    console.error("Global reply error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
