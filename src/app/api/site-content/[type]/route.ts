import { NextRequest, NextResponse } from "next/server";
import { resolveSubject, loadSchemas, allowedSchemas } from "@/lib/site-content-access";
import { validateContent, type ContentSchema } from "@/lib/site-content";
import { getRepoFile, putRepoFile } from "@/lib/github-app";
import { notifyTeam } from "@/lib/notify";

// Node runtime: github-app.ts signs a JWT with node:crypto.
export const runtime = "nodejs";

type Ready = {
  repo: string;
  schema: ContentSchema;
  requesterName: string;
};

// Resolve the subject, load their repo schema, and find the requested type the
// requester is allowed to edit.
async function ready(type: string, clientId: string | null): Promise<Ready | { error: string; status: number }> {
  const access = await resolveSubject(clientId);
  if ("error" in access) return access;

  const schemas = await loadSchemas(access.repo);
  const schema = allowedSchemas(access, schemas).find((s) => s.key === type);
  if (!schema) return { error: "That editor is not available for this site.", status: 404 };

  const email = access.requester.emailAddresses[0]?.emailAddress ?? "unknown";
  const requesterName =
    [access.requester.firstName, access.requester.lastName].filter(Boolean).join(" ") || email;

  return { repo: access.repo, schema, requesterName };
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
    const r = await ready(type, clientId);
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
    const r = await ready(type, clientId);
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

    await putRepoFile(
      r.repo,
      r.schema.path,
      content,
      `Update ${r.schema.label} via Coglyde dashboard (${r.requesterName})`,
      file?.sha,
    );
    await notifyTeam(`${r.requesterName} edited ${r.schema.label} on ${r.repo}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("site-content PUT error:", error);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}
