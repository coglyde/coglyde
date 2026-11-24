import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  ownedWorkspace,
  workspaceOverview,
  createWorkspaceKey,
  revokeWorkspaceKey,
} from "@/lib/gateway/workspace";
import { GatewayError, errorResponse } from "@/lib/gateway/ledger";
import { creditCheckout } from "@/lib/gateway/checkout";
import { readJson, nonce } from "@/lib/gateway/http";

async function owner() {
  const user = await currentUser();
  if (!user) throw new GatewayError(401, "Sign in to view your workspace.");
  const primary = user.primaryEmailAddress;
  return ownedWorkspace(
    user.id,
    primary?.verification?.status === "verified"
      ? primary.emailAddress
      : undefined,
  );
}

const respond = (data: unknown) =>
  Response.json(data, { headers: { "Cache-Control": "private, no-store" } });

export async function GET() {
  try {
    const workspace = await owner();
    return respond({
      workspace: await workspaceOverview(workspace),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

const operation = z.discriminatedUnion("action", [
  z.strictObject({
    action: z.literal("create"),
    name: z.string().trim().min(1).max(64),
  }),
  z.strictObject({
    action: z.literal("revoke"),
    id: z.union([z.uuid(), z.literal("original")]),
  }),
  z.strictObject({
    action: z.literal("checkout"),
    cents: z.int().min(500).max(100000),
  }),
]);
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw new GatewayError(
        403,
        "Open your Coglyde account to make this change.",
      );
    const workspace = await owner();
    const input = operation.safeParse(await readJson(request, 1024));
    if (!input.success)
      throw new GatewayError(400, "Check the details and try again.");
    const data = input.data;
    if (data.action === "checkout")
      return respond({
        url: await creditCheckout(
          workspace.client_id,
          data.cents,
          nonce(request),
        ),
      });
    if (data.action === "create")
      return respond(await createWorkspaceKey(workspace.client_id, data.name));
    await revokeWorkspaceKey(workspace.client_id, data.id);
    return respond({ revoked: true });
  } catch (error) {
    return errorResponse(error);
  }
}
