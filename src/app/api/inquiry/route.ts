import { sendInquiryEmail } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  service?: unknown;
  message?: unknown;
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// Public contact-form endpoint. Distinct from /api/contact, which is the
// auth-gated account support route.
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const service = str(body.service);
  const message = str(body.message);

  // Honeypot: real users never fill "company" via a hidden field, but here it's
  // a real optional field, so validate the meaningful fields instead.
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (message.length < 10)
    errors.message = "A little more detail helps us help you.";

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  try {
    await sendInquiryEmail({ name, email, company, service, message });
  } catch (error) {
    console.error("Inquiry send failed:", error);
    return Response.json(
      { error: "We couldn't send your message. Please email info@coglyde.com." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
