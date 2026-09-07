import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

export async function sendOtpEmail({ to, code, purpose }) {
  const subject =
    purpose === "password_reset"
      ? "Crochet Corner — Password Reset Code"
      : "Crochet Corner — Email Verification Code";

  const heading =
    purpose === "password_reset"
      ? "Reset your password"
      : "Verify your email address";

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Crochet Corner" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: `Your Crochet Corner verification code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #fff8f0; border-radius: 16px;">
        <h2 style="color: #e8876f; margin-bottom: 8px;">Crochet Corner</h2>
        <p style="color: #444; font-size: 16px;">${heading}</p>
        <p style="color: #666; font-size: 14px;">Use this 6-digit code to continue:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d6a5e; padding: 16px 0;">${code}</div>
        <p style="color: #888; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}
