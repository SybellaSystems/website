export const NewsletterTemplate = (title: string, content: string) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px;">
    <div style="max-width: 650px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h1 style="color: #222; text-align: center;">${title}</h1>
      <hr style="border: none; height: 1px; background: #eee; margin: 20px 0;" />
      <div style="color: #555; font-size: 16px; line-height: 1.6;">
        ${content}
      </div>
      <div style="margin-top: 30px; text-align: center;">
        <a href="#" style="display: inline-block; background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold;">
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

${content}

Visit our website for more info!`;

  return { text, html };
};
