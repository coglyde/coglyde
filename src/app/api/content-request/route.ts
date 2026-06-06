import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getClientRepo } from "@/lib/client-repo";
import { createContentRequestIssue, listContentRequests } from "@/lib/github-app";
import { notifyTeam } from "@/lib/notify";

// Node runtime: github-app.ts signs a JWT with node:crypto.
export const runtime = "nodejs";

// Derive a short issue title from the first line of the request.
function titleFromMessage(message: string): string {
  const firstLine = message.trim().split("\n")[0]?.trim() ?? "";
  if (!firstLine) return "Content request";
  return firstLine.length > 70 ? `${firstLine.slice(0, 67)}...` : firstLine;
}

// File a content request: a client describes a change in the dashboard, we open
// a labeled GitHub issue on their site repo. The content agent picks it up.
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = getClientRepo(user);
    if (!repo) {
      return NextResponse.json(
        { error: "No site is linked to your account yet." },
        { status: 400 },
      );
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please describe the change you would like." },
        { status: 400 },
      );
    }

    const email = user.emailAddresses[0]?.emailAddress ?? "unknown";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email;
    const title = titleFromMessage(message);
    const body = `${message.trim()}\n\n---\nRequested by ${name} (${email}) via the Coglyde dashboard.`;

    const issue = await createContentRequestIssue(repo, title, body);
    await notifyTeam(`New content request on ${repo} #${issue.number}: ${title}`);

    return NextResponse.json({ ok: true, number: issue.number, url: issue.url, title });
  } catch (error) {
    console.error("content-request POST error:", error);
    return NextResponse.json(
      { error: "Could not submit your request. Please try again." },
      { status: 500 },
    );
  }
}

// List the client's past requests with their current status.
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = getClientRepo(user);
    if (!repo) return NextResponse.json({ requests: [] });

    const requests = await listContentRequests(repo);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("content-request GET error:", error);
    return NextResponse.json({ error: "Could not load your requests." }, { status: 500 });
  }
}
