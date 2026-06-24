import { NextRequest, NextResponse } from "next/server";
import { resolveSubject } from "@/lib/site-content-access";
import { createContentRequestIssue, listContentRequests } from "@/lib/github-app";
import { notifyTeam } from "@/lib/notify";

// Node runtime: github-app.ts signs a JWT with node:crypto.
export const runtime = "nodejs";

function clientIdFrom(req: NextRequest): string | null {
  return new URL(req.url).searchParams.get("clientId");
}

// Derive a short issue title from the first line of the request.
function titleFromMessage(message: string): string {
  const firstLine = message.trim().split("\n")[0]?.trim() ?? "";
  if (!firstLine) return "Content request";
  return firstLine.length > 70 ? `${firstLine.slice(0, 67)}...` : firstLine;
}

// File a content request: a client (or an admin viewing as them) describes a
// change, we open a labeled GitHub issue on the site repo. The agent picks it up.
export async function POST(req: NextRequest) {
  try {
    const access = await resolveSubject(clientIdFrom(req));
    if ("error" in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please describe the change you would like." },
        { status: 400 },
      );
    }

    const email = access.requester.emailAddresses[0]?.emailAddress ?? "unknown";
    const name =
      [access.requester.firstName, access.requester.lastName].filter(Boolean).join(" ") || email;
    const title = titleFromMessage(message);
    const body = `${message.trim()}\n\n---\nRequested by ${name} (${email}) via the Coglyde dashboard.`;

    const issue = await createContentRequestIssue(access.repo, title, body);
    await notifyTeam(`New content request on ${access.repo} #${issue.number}: ${title}`);

    return NextResponse.json({ ok: true, number: issue.number, url: issue.url, title });
  } catch (error) {
    console.error("content-request POST error:", error);
    return NextResponse.json(
      { error: "Could not submit your request. Please try again." },
      { status: 500 },
    );
  }
}

// List past requests with their current status (empty if no site is linked).
export async function GET(req: NextRequest) {
  try {
    const access = await resolveSubject(clientIdFrom(req));
    if ("error" in access) return NextResponse.json({ requests: [] });

    const requests = await listContentRequests(access.repo);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("content-request GET error:", error);
    return NextResponse.json({ error: "Could not load your requests." }, { status: 500 });
  }
}
