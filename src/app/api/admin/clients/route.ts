import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getClientRepo } from "@/lib/client-repo";
import { getClientSite } from "@/lib/client-site";
import { getEditableContentTypes } from "@/lib/capabilities";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

// Admin-only: every client that has a linked site repo, for the "All sites"
// view. No DB; we read it from Clerk users' privateMetadata.
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data } = await (await clerkClient()).users.getUserList({
      limit: 200,
      orderBy: "-created_at",
    });

    const sites = data
      .map((u) => {
        const repo = getClientRepo(u);
        if (!repo) return null;
        const site = getClientSite(u);
        const email = u.emailAddresses[0]?.emailAddress ?? "";
        return {
          id: u.id,
          name: [u.firstName, u.lastName].filter(Boolean).join(" ") || email || u.id,
          email,
          repo,
          siteUrl: site.url,
          siteName: site.name,
          editableContent: getEditableContentTypes(u),
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return NextResponse.json({ sites });
  } catch (error) {
    console.error("admin/clients GET error:", error);
    return NextResponse.json({ error: "Could not load client sites." }, { status: 500 });
  }
}
