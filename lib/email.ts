import nodemailer from 'nodemailer';

export interface EmailData {
  receiver: string;     // recipient email
  subject?: string;     // optional subject
  message: string;      // email body
  name?: string;        // sender name
  replyTo?: string;
  company?: string;
  phone?: string;
  html?: string;
}

export interface EnquiryEmailData {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  service: string;
  budget: string;
  contactMethod: string;
  message: string;
}

export interface SupportReplyEmailData {
  recipientName?: string;
  message: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function buildEnquiryEmailHtml(data: EnquiryEmailData) {
  const replySubject = `Re: New enquiry${data.service ? `: ${data.service}` : ""}`;
  const replyBody = [
    `Hello ${data.name},`,
    "",
    `Thank you for contacting Sybella Systems${data.service ? ` about ${data.service}` : ""}.`,
    "",
    "[Add your response here]",
    "",
    "Kind regards,",
    "Sybella Support Team",
    "Sybella Systems",
    "contact@sybellasystems.co.rw",
  ].join("\n");
  const replyUrl = `mailto:${data.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;

  const rows = [
    ["Full name", data.name],
    ["Email address", data.email, `mailto:${data.email}`],
    ["Company / Organisation", data.company || "Not provided"],
    ["Phone number", data.phone || "Not provided", data.phone ? `tel:${data.phone.replace(/[^\d+]/g, "")}` : undefined],
    ["Country / Location", data.country || "Not provided"],
    ["Service of interest", data.service || "Not specified"],
    ["Estimated project budget", data.budget || "Not provided"],
    ["Preferred contact method", data.contactMethod || "Not specified"],
  ] as const;

  const detailRows = rows.map(([label, value, href]) => {
    const displayValue = escapeHtml(value);
    const valueMarkup = href
      ? `<a href="${escapeHtml(href)}" style="color:#2563eb;text-decoration:none;">${displayValue}</a>`
      : displayValue;

    return `<tr>
      <td style="padding:12px 14px;border-bottom:1px solid #e8edf4;color:#64748b;font-size:13px;width:36%;">${escapeHtml(label)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e8edf4;color:#172033;font-size:14px;line-height:1.5;word-break:break-word;">${valueMarkup}</td>
    </tr>`;
  }).join("");

  const message = escapeHtml(data.message).replace(/\r\n|\r|\n/g, "<br>");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f3f6fb;color:#172033;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;border:1px solid #e5eaf2;border-radius:10px;background:#ffffff;border-collapse:separate;border-spacing:0;overflow:hidden;">
            <tr>
              <td style="padding:24px 30px;background:#111827;border-bottom:4px solid #3b82f6;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:1px;">SYBELLA SYSTEMS</td>
                    <td align="right" style="color:#bfdbfe;font-size:11px;font-weight:700;letter-spacing:1px;">WEBSITE ENQUIRY</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                <h1 style="margin:0 0 8px;color:#111827;font-size:24px;line-height:1.3;">New enquiry received</h1>
                <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">A prospective client has submitted an enquiry through the Sybella Systems website.</p>
                <h2 style="margin:0 0 10px;color:#111827;font-size:15px;">Contact and project details</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e8edf4;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;">
                  ${detailRows}
                </table>
                <h2 style="margin:24px 0 10px;color:#111827;font-size:15px;">Project description</h2>
                <div style="padding:16px;border:1px solid #e8edf4;border-left:3px solid #3b82f6;border-radius:5px;background:#f8fafc;color:#334155;font-size:14px;line-height:1.7;word-break:break-word;">${message}</div>
                <p style="margin:24px 0 0;">
                  <a href="${escapeHtml(replyUrl)}" style="display:inline-block;padding:12px 18px;border-radius:5px;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Reply to enquiry</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 30px;background:#f8fafc;border-top:1px solid #e8edf4;color:#94a3b8;font-size:11px;line-height:1.5;">This notification was generated by the Sybella Systems website enquiry form.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildSupportReplyEmailHtml(data: SupportReplyEmailData) {
  const greeting = data.recipientName
    ? `Hello ${escapeHtml(data.recipientName)},`
    : "Hello,";
  const message = escapeHtml(data.message).replace(/\r\n|\r|\n/g, "<br>");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f3f6fb;color:#172033;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;border:1px solid #e5eaf2;border-radius:10px;background:#ffffff;border-collapse:separate;border-spacing:0;overflow:hidden;">
            <tr>
              <td style="padding:24px 30px;background:#111827;border-bottom:4px solid #3b82f6;color:#ffffff;font-size:17px;font-weight:700;letter-spacing:1px;">SYBELLA SYSTEMS <span style="color:#bfdbfe;font-size:11px;font-weight:600;letter-spacing:1px;">&nbsp; SUPPORT</span></td>
            </tr>
            <tr>
              <td style="padding:32px 30px;">
                <h1 style="margin:0 0 20px;color:#111827;font-size:23px;line-height:1.35;">A message from Sybella Systems</h1>
                <p style="margin:0 0 16px;color:#172033;font-size:15px;line-height:1.7;">${greeting}</p>
                <div style="color:#334155;font-size:15px;line-height:1.8;word-break:break-word;">${message}</div>
                <p style="margin:24px 0 0;color:#334155;font-size:14px;line-height:1.7;">Thank you for reaching out. We look forward to helping with your enquiry.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 30px;background:#f8fafc;border-top:1px solid #e8edf4;color:#64748b;font-size:12px;line-height:1.6;">Sybella Systems Support Team<br><a href="mailto:contact@sybellasystems.co.rw" style="color:#2563eb;text-decoration:none;">contact@sybellasystems.co.rw</a></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendEmail(data: EmailData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"${data.name || "Sybella System"}" <${process.env.EMAIL_USER}>`,
      to: data.receiver,
      ...(data.replyTo ? { replyTo: data.replyTo } : {}),
      subject: data.subject || "Message from Sybella Systems",
      text: data.message,
      html: data.html ?? `<p>${data.message}</p>
             <p>Company: ${data.company || ""}</p>
             <p>Phone: ${data.phone || "+254 715 410 009"}</p>
             <p>You can also contact us on support email info@sybellasystems.com</p>`,
             
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("sendEmail error:", error);
    return { success: false, error };
  }
}