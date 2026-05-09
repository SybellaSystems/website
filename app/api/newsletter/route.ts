import { NextRequest, NextResponse } from 'next/server'
import { logger } from '../../../lib/logger'
import { SecurityValidator } from '../../../lib/security'
import { addSubscriber, getAllSubscribers } from '../../../lib/models/NewsLetter'
import { sendEmail } from '../../../lib/email'
import { authMiddleware } from "@/app/middleware/auth.middleware";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'website' } = body

    if (!email || !SecurityValidator.validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Sanitize email
    const sanitizedEmail = SecurityValidator.sanitizeInput(email)

    // Add subscriber to DB
    const insertResult = await addSubscriber({
      email: sanitizedEmail,
      subscribeAt: new Date(),
      ...(source && { source })
    })

    if (!insertResult.acknowledged) {
      return NextResponse.json(
        { error: "Failed to create new subscription" },
        { status: 500 }
      )
    }

    // sending the subscription success email to the user

    const emailResult = await sendEmail({
      receiver: sanitizedEmail,
      message: "Thanks for subscribing to Sybella Systems newsletter.",
      subject: "Welcome to our Newsletter!"
    })

    if(!emailResult.success) {
      logger.error("Failed to send Email", { error: emailResult.error });

    }

    return NextResponse.json(
      { message: "Successfully subscribed to newsletter" },
      { status: 201 }
    )

  } catch (error) {
    logger.error('Newsletter signup error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}


export async function GET(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["superadmin", "executive", "cto"] });
  if (user instanceof NextResponse) return user;
  try {
    const subscribers = await getAllSubscribers();
    return NextResponse.json({success: true, subscribers}, {status: 200})
  } catch (err) {
    return NextResponse.json({error: "Failed to fetch users"}, {status: 500})
  }

}


