import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getClientRepo } from "@/lib/client-repo";
import { getEditableContentTypes } from "@/lib/capabilities";
import { getSchema, validateContent } from "@/lib/site-content";
import { getRepoFile, putRepoFile } from "@/lib/github-app";
import { notifyTeam } from "@/lib/notify";

// Node runtime: github-app.ts signs a JWT with node:crypto.
export const runtime = "nodejs";

// Resolve the request: who, which schema, which repo, and may they edit it.
async function resolve(type: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized", status: 401 as const };

  const schema = getSchema(type);
  if (!schema) return { error: "Unknown content type.", status: 404 as const };

  if (!getEditableContentTypes(user).includes(type)) {
    return { error: "That editor is not enabled for your account.", status: 403 as const };
  }

  const repo = getClientRepo(user);
  if (!repo) return { error: "No site is linked to your account yet.", status: 400 as const };

  return { user, schema, repo };
}

// GET: current values for the form to load.
export async function GET(_req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await ctx.params;
    const r = await resolve(type);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });

    const file = await getRepoFile(r.repo, r.schema.path);
    const items = Array.isArray(file?.json) ? file.json : [];
    return NextResponse.json({ items });
  } catch (error) {
    console.error("site-content GET error:", error);
    return NextResponse.json({ error: "Could not load this content." }, { status: 500 });
  }
}

// PUT: validate the submitted list and commit it straight to the repo's default
// branch (direct publish). Validation guarantees the JSON stays well-formed.
export async function PUT(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await ctx.params;
    const r = await resolve(type);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: r.status });

    const body = (await req.json()) as { items?: unknown };
    const result = validateContent(r.schema, body.items);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

    const current = await getRepoFile(r.repo, r.schema.path);
    const email = r.user.emailAddresses[0]?.emailAddress ?? "unknown";
    const name = [r.user.firstName, r.user.lastName].filter(Boolean).join(" ") || email;

    await putRepoFile(
      r.repo,
      r.schema.path,
      result.items,
      `Update ${r.schema.label} via Coglyde dashboard (${name})`,
      current?.sha,
    );
    await notifyTeam(`${name} edited ${r.schema.label} on ${r.repo}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("site-content PUT error:", error);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}
