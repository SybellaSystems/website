import { NextRequest, NextResponse } from 'next/server'
import { logger } from '../../../lib/logger'
import { SecurityValidator } from '../../../lib/security'
import { buildEnquiryEmailHtml, sendEmail } from '../../../lib/email'
import { createContact, getAllContacts } from '../../../lib/models/Contact'
import { validatePhoneNumberLength } from 'libphonenumber-js'
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { getPaginationParams, paginate } from "@/app/utils/pagination";


export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const payload = body as Record<string, unknown>
    const {
      name,
      email,
      message,
      company,
      phone,
      country,
      service,
      budget,
      contactMethod,
      privacyConsent,
      website,
    } = payload

    if (typeof website === 'string' && website.trim()) {
      logger.securityEvent('Contact form honeypot triggered')
      return NextResponse.json({ error: 'Unable to submit this enquiry' }, { status: 400 })
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      (company !== undefined && typeof company !== 'string') ||
      (phone !== undefined && typeof phone !== 'string') ||
      (country !== undefined && typeof country !== 'string') ||
      (service !== undefined && typeof service !== 'string') ||
      (budget !== undefined && typeof budget !== 'string') ||
      (contactMethod !== undefined && typeof contactMethod !== 'string')
    ) {
      return NextResponse.json(
        { error: 'Contact fields must be valid text values' },
        { status: 400 }
      )
    }

    if (privacyConsent !== undefined && privacyConsent !== true) {
      return NextResponse.json(
        { error: 'Privacy consent is required' },
        { status: 400 }
      )
    }

    const sanitizedData = {
      name: SecurityValidator.sanitizeInput(name),
      email: SecurityValidator.sanitizeInput(email),
      message: SecurityValidator.sanitizeInput(message),
      company: company ? SecurityValidator.sanitizeInput(company) : '',
      phone: phone ? SecurityValidator.sanitizeInput(phone) : '',
      country: country ? SecurityValidator.sanitizeInput(country) : '',
      service: service ? SecurityValidator.sanitizeInput(service) : '',
      budget: budget ? SecurityValidator.sanitizeInput(budget) : '',
      contactMethod: contactMethod ? SecurityValidator.sanitizeInput(contactMethod) : '',
      ...(privacyConsent === true
        ? { privacyConsent: true, privacyConsentAt: new Date() }
        : {}),
    }

    if (!sanitizedData.name || !sanitizedData.message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    if (!SecurityValidator.validateEmail(sanitizedData.email)) {
      return NextResponse.json(
        { error: 'A valid email is required' },
        { status: 400 }
      )
    }

    if (
      privacyConsent === true &&
      (!sanitizedData.country ||
        !sanitizedData.service ||
        !['Email', 'Phone call', 'WhatsApp'].includes(sanitizedData.contactMethod))
    ) {
      return NextResponse.json(
        { error: 'Country, service, and preferred contact method are required' },
        { status: 400 }
      )
    }

    if (privacyConsent === true && sanitizedData.phone) {
      const phoneLengthError = validatePhoneNumberLength(sanitizedData.phone)
      if (phoneLengthError) {
        const errorMessage =
          phoneLengthError === 'TOO_SHORT'
            ? 'Phone number is too short for the selected country'
            : phoneLengthError === 'TOO_LONG'
              ? 'Phone number is too long for the selected country'
              : 'Phone number length is invalid for the selected country'
        return NextResponse.json({ error: errorMessage }, { status: 400 })
      }
    }

    const textFields: Array<[string, string, number]> = [
      ['name', sanitizedData.name, 120],
      ['email', sanitizedData.email, 254],
      ['message', sanitizedData.message, 5000],
      ['company', sanitizedData.company, 200],
      ['phone', sanitizedData.phone, 40],
      ['country', sanitizedData.country, 120],
      ['service', sanitizedData.service, 160],
      ['budget', sanitizedData.budget, 120],
      ['contactMethod', sanitizedData.contactMethod, 40],
    ]
    const oversizedField = textFields.find(([, value, limit]) => value.length > limit)
    if (oversizedField) {
      return NextResponse.json({ error: 'An enquiry field exceeds the allowed length' }, { status: 400 })
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    const newContact = await createContact({
      ...sanitizedData,
      createdAt: new Date(),
    })

    if (!newContact) {
      return NextResponse.json(
        { error: "Contact not created" },
        { status: 400 }
      )
    }

    const enquiryInbox = process.env.CONTACT_EMAIL || 'sybellasystems@gmail.com'
    const notificationResult = await sendEmail({
      receiver: enquiryInbox,
      replyTo: sanitizedData.email,
      name: 'Sybella Support Team',
      subject: `New enquiry${sanitizedData.service ? `: ${sanitizedData.service}` : ''}`,
      company: sanitizedData.company,
      phone: sanitizedData.phone,
      message: [
        `Name: ${sanitizedData.name}`,
        `Email: ${sanitizedData.email}`,
        `Company / Organisation: ${sanitizedData.company || 'Not provided'}`,
        `Phone: ${sanitizedData.phone || 'Not provided'}`,
        `Country / Location: ${sanitizedData.country || 'Not provided'}`,
        `Service of Interest: ${sanitizedData.service || 'Not specified'}`,
        `Estimated Budget: ${sanitizedData.budget || 'Not provided'}`,
        `Preferred Contact Method: ${sanitizedData.contactMethod || 'Not specified'}`,
        '',
        'Project Description / Message:',
        sanitizedData.message,
      ].join('\n'),
      html: buildEnquiryEmailHtml({
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company,
        phone: sanitizedData.phone,
        country: sanitizedData.country,
        service: sanitizedData.service,
        budget: sanitizedData.budget,
        contactMethod: sanitizedData.contactMethod,
        message: sanitizedData.message,
      }),
    })

    if (!notificationResult.success) {
      logger.error('Failed to notify the enquiries inbox', { error: notificationResult.error })
    }

    const acknowledgementResult = await sendEmail({
      receiver: sanitizedData.email,
      message: "Thank you for your enquiry! We'll get back to you within 24-48 hours.",
      subject: "We received your enquiry",
      company: "Sybella Systems"
    })

    if (!acknowledgementResult.success) {
      logger.error("Failed to send contact acknowledgement", { error: acknowledgementResult.error })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact Saved",
        notificationSent: notificationResult.success,
        acknowledgementSent: acknowledgementResult.success,
      },
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