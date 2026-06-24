import { currentUser, clerkClient, type User } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getClientRepo } from "@/lib/client-repo";
import { getEditableContentTypes } from "@/lib/capabilities";
import { isAdmin } from "@/lib/admin";
import { getSchema, validateContent, type ContentSchema } from "@/lib/site-content";
import { getRepoFile, putRepoFile } from "@/lib/github-app";
import { notifyTeam } from "@/lib/notify";

// Node runtime: github-app.ts signs a JWT with node:crypto.
export const runtime = "nodejs";

type Resolved = { requester: User; subject: User; schema: ContentSchema; repo: string };
type Failure = { error: string; status: 400 | 401 | 403 | 404 };

// Work out who is editing, whose content, which schema, and whether it's allowed.
// A client edits only their own enabled types; an admin may target any client
// (?clientId=) and edit any known type.
async function resolve(type: string, clientId: string | null): Promise<Resolved | Failure> {
  const requester = await currentUser();
  if (!requester) return { error: "Unauthorized", status: 401 };

  const schema = getSchema(type);
  if (!schema) return { error: "Unknown content type.", status: 404 };

  if (clientId) {
    if (!isAdmin(requester)) return { error: "Forbidden.", status: 403 };
    const subject = await (await clerkClient()).users.getUser(clientId);
    const repo = getClientRepo(subject);
    if (!repo) return { error: "That client has no linked site.", status: 400 };
    return { requester, subject, schema, repo };
  }

  if (!getEditableContentTypes(requester).includes(type)) {
    return { error: "That editor is not enabled for your account.", status: 403 };
  }
  const repo = getClientRepo(requester);
  if (!repo) return { error: "No site is linked to your account yet.", status: 400 };
  return { requester, subject: requester, schema, repo };
}

function listFrom(schema: ContentSchema, json: unknown): unknown {
  if (schema.listKey) {
    return json && typeof json === "object" && !Array.isArray(json)
      ? (json as Record<string, unknown>)[schema.listKey]
      : undefined;
  }
  return json;
}

// GET: current values for the form to load.
export async function GET(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await ctx.params;
    const clientId = new URL(req.url).searchParams.get("clientId");
    const r = await resolve(type, clientId);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });

    const file = await getRepoFile(r.repo, r.schema.path);
    const raw = file ? listFrom(r.schema, file.json) : [];
    return NextResponse.json({ items: Array.isArray(raw) ? raw : [] });
  } catch (error) {
    console.error("site-content GET error:", error);
    return NextResponse.json({ error: "Could not load this content." }, { status: 500 });
  }
}

// PUT: validate and commit straight to the repo's default branch (direct publish).
export async function PUT(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await ctx.params;
    const clientId = new URL(req.url).searchParams.get("clientId");
    const r = await resolve(type, clientId);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });

    const body = (await req.json()) as { items?: unknown };
    const result = validateContent(r.schema, body.items);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

    const file = await getRepoFile(r.repo, r.schema.path);

    // For wrapped files (e.g. calendar.json = { season, races }), keep the other
    // top-level keys and only replace the editable list.
    let content: unknown;
    if (r.schema.listKey) {
      const base =
        file && typeof file.json === "object" && !Array.isArray(file.json)
          ? (file.json as Record<string, unknown>)
          : {};
      content = { ...base, [r.schema.listKey]: result.items };
    } else {
      content = result.items;
    }

    const email = r.requester.emailAddresses[0]?.emailAddress ?? "unknown";
    const name = [r.requester.firstName, r.requester.lastName].filter(Boolean).join(" ") || email;

    await putRepoFile(
      r.repo,
      r.schema.path,
      content,
      `Update ${r.schema.label} via Coglyde dashboard (${name})`,
      file?.sha,
    );
    await notifyTeam(`${name} edited ${r.schema.label} on ${r.repo}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("site-content PUT error:", error);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}
