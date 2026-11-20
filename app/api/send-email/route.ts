import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { SecurityValidator } from "@/lib/security";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  if (
    typeof payload.name !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.message !== "string" ||
    (payload.company !== undefined && typeof payload.company !== "string") ||
    (payload.role !== undefined && typeof payload.role !== "string")
  ) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }

  const name = SecurityValidator.sanitizeInput(payload.name);
  const email = SecurityValidator.sanitizeInput(payload.email);
  const message = SecurityValidator.sanitizeInput(payload.message);
  const company = typeof payload.company === "string"
    ? SecurityValidator.sanitizeInput(payload.company)
    : "";
  const role = typeof payload.role === "string"
    ? SecurityValidator.sanitizeInput(payload.role)
    : "";

  if (!name || !SecurityValidator.validateEmail(email) || !message) {
    return NextResponse.json(
      { error: "A valid name, email, and message are required" },
      { status: 400 }
    );
  }

  if (
    name.length > 120 ||
    email.length > 254 ||
    company.length > 200 ||
    role.length > 100 ||
    message.length > 5000
  ) {
    return NextResponse.json({ error: "Inquiry exceeds the allowed length" }, { status: 400 });
  }

  const inbox = process.env.EMAIL_USER;
  if (!inbox || !process.env.EMAIL_PASS) {
    console.error("Inquiry email delivery is not configured");
    return NextResponse.json(
      { error: "Unable to send your inquiry right now" },
      { status: 500 }
    );
  }

  const emailResult = await sendEmail({
    receiver: inbox,
    replyTo: email,
    name: "Website Inquiry",
    subject: "New website inquiry",
    company,
    message: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "Not provided"}`,
      `Role: ${role || "Not provided"}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  });

  if (!emailResult.success) {
    return NextResponse.json(
      { error: "Unable to send your inquiry right now" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Inquiry sent successfully" });
}
