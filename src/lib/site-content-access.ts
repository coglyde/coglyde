import { currentUser, clerkClient, type User } from "@clerk/nextjs/server";
import { getClientRepo } from "./client-repo";
import { getEditableContentTypes } from "./capabilities";
import { isAdmin } from "./admin";
import { getRepoFile } from "./github-app";
import { parseSchemas, SCHEMA_FILE, type ContentSchema } from "./site-content";

export type Subject = { requester: User; subject: User; repo: string; admin: boolean };
export type AccessFailure = { error: string; status: 400 | 401 | 403 | 404 };

// Resolve who is editing and whose site. A client acts on their own repo; an
// admin may target any client via clientId.
export async function resolveSubject(clientId: string | null): Promise<Subject | AccessFailure> {
  const requester = await currentUser();
  if (!requester) return { error: "Unauthorized", status: 401 };

  if (clientId) {
    if (!isAdmin(requester)) return { error: "Forbidden.", status: 403 };
    const subject = await (await clerkClient()).users.getUser(clientId);
    const repo = getClientRepo(subject);
    if (!repo) return { error: "That client has no linked site.", status: 400 };
    return { requester, subject, repo, admin: true };
  }

  const repo = getClientRepo(requester);
  if (!repo) return { error: "No site is linked to your account yet.", status: 400 };
  return { requester, subject: requester, repo, admin: false };
}

/** The content types declared in the client's repo (content/_schema.json). */
export async function loadSchemas(repo: string): Promise<ContentSchema[]> {
  const file = await getRepoFile(repo, SCHEMA_FILE);
  return file ? parseSchemas(file.json) : [];
}

// Types the subject may edit: the repo types they're enabled for
// (editableContent). When an admin views as a client, this stays faithful to
// what that client actually sees, since `subject` is the client.
export function allowedSchemas(access: Subject, schemas: ContentSchema[]): ContentSchema[] {
  const enabled = new Set(getEditableContentTypes(access.subject));
  return schemas.filter((schema) => enabled.has(schema.key));
}
