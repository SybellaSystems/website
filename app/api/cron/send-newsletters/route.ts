import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";

// Newsletter template function
const NewsletterTemplate = (title: string, content: string) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px;">
    <div style="max-width: 650px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h1 style="color: #222; text-align: center;">${title}</h1>
      <hr style="border: none; height: 1px; background: #eee; margin: 20px 0;" />
      <div style="color: #555; font-size: 16px; line-height: 1.6;">
        ${content}
      </div>
      <div style="margin-top: 30px; text-align: center;">
        <a href="https://sybellasystems.co.rw/" style="display: inline-block; background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold;">
          Visit Our Website
        </a>
      </div>
      <p style="margin-top: 20px; color: #999; font-size: 14px; text-align: center;">
        You are receiving this email because you subscribed to our newsletter.
      </p>
    </div>
  </div>
  `;

  const text = `Hello,

Here’s this week’s newsletter from our website:

- New Product Launch 
- Exclusive Discounts 
- Tips & Tricks for Users 

Visit our website for more info!`;

  return { text, html };
};

export async function GET() {
  try {
    const client = await clientPromise();
    const db = client.db("newsletterDB");
    const collection = db.collection("subscribers");
    const subscribers = await collection.find().toArray();

    if (!subscribers.length) {
      return NextResponse.json({ message: "No subscribers found" }, { status: 200 });
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare the template content
    const { text, html } = NewsletterTemplate(
      "Your Weekly Newsletter 📰",
      `
      <p>Here’s this week’s highlights from our website:</p>
      <ul>
        <li>New Product Launch 🚀</li>
        <li>Exclusive Discounts 💰</li>
        <li>Tips & Tricks for Users ✨</li>
      </ul>
      <p>Thanks for staying with us!</p>
      `
    );

    // Send to all subscribers
    for (const user of subscribers) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Weekly Newsletter 📰",
        text,
        html,
      });
    }

    return NextResponse.json({ message: "Newsletter sent successfully" });
  } catch (error: any) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json({ error: "Failed to send newsletters" }, { status: 500 });
  }
}
