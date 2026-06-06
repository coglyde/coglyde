// Resend wrapper for the public contact form. Kept separate from the route so
// the route stays a thin validation + response layer.

import { Resend } from "resend";

export type InquiryInput = {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
};

// Default sender is Resend's shared onboarding address, which works without
// domain verification. For production, verify coglyde.com in Resend and set
// CONTACT_FROM_EMAIL to something like "Coglyde <hello@coglyde.com>".
const FROM = process.env.CONTACT_FROM_EMAIL || "Coglyde <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || "info@coglyde.com";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function renderHtml(input: InquiryInput) {
  const rows: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company || "Not specified"],
    ["Interested in", input.service || "Not specified"],
  ];
  const meta = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#9ca3af;font:13px/1.5 -apple-system,Segoe UI,sans-serif">${label}</td><td style="padding:4px 0;color:#f4f4f5;font:13px/1.5 -apple-system,Segoe UI,sans-serif">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  return `<div style="background:#0a0a0c;padding:32px;border-radius:16px;max-width:560px">
    <h2 style="margin:0 0 20px;color:#fff;font:600 18px/1.3 -apple-system,Segoe UI,sans-serif">New contact inquiry</h2>
    <table style="border-collapse:collapse;margin-bottom:20px">${meta}</table>
    <div style="padding:16px;border-radius:12px;background:rgba(255,255,255,0.04);color:#e4e4e7;font:14px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${escapeHtml(
      input.message,
    )}</div>
  </div>`;
}

function renderText(input: InquiryInput) {
  return [
    `New contact inquiry`,
    ``,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Company: ${input.company || "Not specified"}`,
    `Interested in: ${input.service || "Not specified"}`,
    ``,
    input.message,
  ].join("\n");
}

/** Send an inquiry email. Throws if Resend is misconfigured or rejects. */
export async function sendInquiryEmail(input: InquiryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);
  const subject = input.service
    ? `New inquiry from ${input.name} · ${input.service}`
    : `New inquiry from ${input.name}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: input.email,
    subject,
    text: renderText(input),
    html: renderHtml(input),
  });

  if (error) {
    throw new Error(error.message || "Resend rejected the message");
  }
}
