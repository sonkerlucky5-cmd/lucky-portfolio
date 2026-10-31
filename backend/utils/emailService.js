import nodemailer from "nodemailer";

export const sendNotificationEmail = async ({ name, email, subject, message }) => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || "sonkerlucky5@gmail.com";

  if (!host || !user || !pass) {
    console.log(
      `[Email] SMTP not configured. Notification skipped for message from: ${name} <${email}>`
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"${name} (Portfolio)" <${user}>`,
      to: recipient,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject || "New Message"} - from ${name}`,
      text: `You received a new inquiry from your portfolio website:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #da5f36; margin-top: 0;">New Portfolio Message</h2>
          <p><strong>From:</strong> ${name} &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
          <p><strong>Subject:</strong> ${subject || "Portfolio Inquiry"}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap; color: #333; line-height: 1.6;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Sent via Lucky Sonker Portfolio Contact API</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Notification email successfully sent to ${recipient}`);
    return true;
  } catch (err) {
    console.error(`[Email] Failed to send email notification:`, err.message);
    return false;
  }
};

