import nodemailer from 'nodemailer';

export interface EmailData {
  receiver: string;     // recipient email
  subject?: string;     // optional subject
  message: string;      // email body
  name?: string;        // sender name
  company?: string;
  phone?: string;
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
      subject: data.subject || "Message from Sybella Systems",
      text: data.message,
      html: `<p>${data.message}</p>
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