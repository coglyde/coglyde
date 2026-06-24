import { NextRequest, NextResponse } from "next/server";
import { resolveSubject, loadSchemas, allowedSchemas } from "@/lib/site-content-access";

// Node runtime: the access helper signs a GitHub App JWT with node:crypto.
export const runtime = "nodejs";

// GET: the content types (full schemas) the requester may edit for this site,
// so the dashboard can render a form per type. ?clientId for admins.
export async function GET(req: NextRequest) {
  try {
    const clientId = new URL(req.url).searchParams.get("clientId");
    const access = await resolveSubject(clientId);
    if ("error" in access) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }
    const schemas = await loadSchemas(access.repo);
    return NextResponse.json({ types: allowedSchemas(access, schemas) });
  } catch (error) {
    console.error("site-content index GET error:", error);
    return NextResponse.json({ error: "Could not load editable sections." }, { status: 500 });
  }
}
