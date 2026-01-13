import { NextRequest, NextResponse } from 'next/server'
import { logger } from '../../../lib/logger'
import { SecurityValidator } from '../../../lib/security'
import { sendEmail } from '../../../lib/email'
import { createContact, getAllContacts } from '../../../lib/models/Contact'
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { getPaginationParams, paginate } from "@/app/utils/pagination";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, company, phone } = body
    const phoneStr = typeof phone === 'string' ? phone : (phone !== undefined && phone !== null ? String(phone) : '');

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (!SecurityValidator.validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // if (phoneStr && !SecurityValidator.validatePhone(phoneStr)) {
    //   return NextResponse.json(
    //     { error: 'Valid phone number is required' },
    //     { status: 400 }
    //   )
    // }

    const sanitizedData = {
      name: SecurityValidator.sanitizeInput(name),
      email: SecurityValidator.sanitizeInput(email),
      message: SecurityValidator.sanitizeInput(message),
      company: company ? SecurityValidator.sanitizeInput(company) : '',
      phone: phoneStr ? SecurityValidator.sanitizeInput(phoneStr) : ''
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    const newContact = await createContact({
      name,
      email,
      message,
      company,
      phone,
      createdAt: new Date()
    })

    if (!newContact) {
      return NextResponse.json(
        { error: "Contact not created" },
        { status: 400 }
      )
    }

    const emailResult = await sendEmail({
      receiver: email,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      subject: "New contact from Sybella Systems",
      company: "Sybella Systems"
    })

    if (!emailResult.success) {
      logger.error("Failed to send Email", { error: emailResult.error });
    }

    return NextResponse.json(
      { success: true, message: "Contact Saved"},
      { status: 201 }
    )

  } catch (error) {
    logger.error('Contact form error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}


export async function GET(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["superadmin", "executive", "cto", "marketing"] });
  if (user instanceof NextResponse) return user;

  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const { contacts, totalItems } = await getAllContacts(skip, limit);
    const result = paginate(contacts, totalItems, { page, limit });

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}