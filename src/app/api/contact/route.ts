import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Send email using a service like Resend, SendGrid, etc.
    // For now, we'll log it and return success
    // TODO: Integrate with email service
    console.log("Contact form submission:", {
      from: user.emailAddresses[0]?.emailAddress,
      subject,
      message,
      userName: `${user.firstName} ${user.lastName}`,
    });

    // In production, you'd send an actual email here
    // const response = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "hello@coglyde.com",
    //     to: "info@coglyde.com",
    //     subject: `Support: ${subject}`,
    //     html: `<p>From: ${user.emailAddresses[0]?.emailAddress}</p><p>Name: ${user.firstName} ${user.lastName}</p><p>Subject: ${subject}</p><p>Message:</p><p>${message}</p>`,
    //   }),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
