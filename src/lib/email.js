import nodemailer from "nodemailer";
import { getAdminEmail } from "@/lib/auth/admin";
import { getContactEmail } from "@/lib/site/contact";
import { CUSTOM_ORDER_STATUS_LABELS } from "@/lib/custom-orders/defaults";

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

function getCustomOrderAdminRecipient() {
  return getAdminEmail() || getContactEmail() || process.env.SMTP_USER || "";
}

function formatProductReferences(order) {
  return order.productTitles?.length ? order.productTitles.join(", ") : "None";
}

function formatCustomOrderText(order) {
  return [
    "New custom order request — Crochet Corner",
    "",
    `Customer: ${order.userName || "Not provided"}`,
    `Email: ${order.userEmail}`,
    `Mobile: ${order.mobile || "Not provided"}`,
    `Referenced products: ${formatProductReferences(order)}`,
    `Status: ${CUSTOM_ORDER_STATUS_LABELS[order.status] || order.status}`,
    "",
    "Order details:",
    order.details,
  ].join("\n");
}

function formatCustomOrderHtml(order) {
  const statusLabel = CUSTOM_ORDER_STATUS_LABELS[order.status] || order.status;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #fff8f0; border-radius: 16px;">
      <h2 style="color: #e8876f; margin-bottom: 8px;">Crochet Corner</h2>
      <p style="color: #444; font-size: 16px; font-weight: bold;">New custom order request</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; color: #444;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Customer</td><td style="padding: 6px 0;">${order.userName || "Not provided"}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email</td><td style="padding: 6px 0;">${order.userEmail}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Mobile</td><td style="padding: 6px 0;">${order.mobile || "Not provided"}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Product references</td><td style="padding: 6px 0;">${formatProductReferences(order)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Status</td><td style="padding: 6px 0;">${statusLabel}</td></tr>
      </table>
      <p style="color: #666; font-size: 14px; font-weight: bold;">Order details</p>
      <p style="color: #444; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${order.details}</p>
    </div>
  `;
}

export async function sendCustomOrderAdminEmail(order) {
  const to = getCustomOrderAdminRecipient();
  if (!to) {
    throw new Error("No admin email configured for custom order notifications.");
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Crochet Corner" <${process.env.SMTP_USER}>`,
    to,
    replyTo: order.userEmail,
    subject: `Custom order request from ${order.userEmail}`,
    text: formatCustomOrderText(order),
    html: formatCustomOrderHtml(order),
  });
}

export async function sendCustomOrderConfirmationEmail(order) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Crochet Corner" <${process.env.SMTP_USER}>`,
    to: order.userEmail,
    subject: "Crochet Corner — Custom order request received",
    text: [
      "Thank you for your custom order request.",
      "",
      "We have received your details and will get back to you soon.",
      "",
      "Your request:",
      order.details,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #fff8f0; border-radius: 16px;">
        <h2 style="color: #e8876f; margin-bottom: 8px;">Crochet Corner</h2>
        <p style="color: #444; font-size: 16px;">Thank you for your custom order request.</p>
        <p style="color: #666; font-size: 14px;">We have received your details and will get back to you soon.</p>
        <p style="color: #666; font-size: 14px; font-weight: bold; margin-top: 16px;">Your request</p>
        <p style="color: #444; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${order.details}</p>
      </div>
    `,
  });
}
