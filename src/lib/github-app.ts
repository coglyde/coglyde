import { createSign } from "node:crypto";

// Minimal, dependency-free GitHub App client. Authenticates as the
// `coglyde-content-ops` App (JWT signed with the App private key), exchanges
// that for a short-lived installation token, and exposes the few calls the
// dashboard needs: create a content-request issue and list them with status.
// The content agent (OpenClaw) is what acts on the issues; this side only files
// and reads them, so the API surface stays tiny.

const API = "https://api.github.com";
const API_VERSION = "2022-11-28";

export const CONTENT_REQUEST_LABEL = "content-request";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var ${name}`);
  return value;
}

function privateKeyPem(): string {
  // Stored base64-encoded so the multi-line PEM survives a single env line.
  return Buffer.from(required("GITHUB_APP_PRIVATE_KEY_BASE64"), "base64").toString("utf8");
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// A ~9 minute App JWT (GitHub allows max 10). iat is backdated 30s to tolerate
// clock skew.
function appJwt(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({ iat: now - 30, exp: now + 540, iss: required("GITHUB_APP_ID") }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  return `${header}.${payload}.${base64Url(signer.sign(privateKeyPem()))}`;
}

// Installation tokens last an hour; cache and reuse until shortly before expiry.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function installationToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 60_000) {
    return cachedToken.token;
  }
  const installationId = required("GITHUB_APP_INSTALLATION_ID");
  const res = await fetch(`${API}/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${appJwt()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub installation token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { token: string; expires_at: string };
  cachedToken = { token: data.token, expiresAt: new Date(data.expires_at).getTime() };
  return data.token;
}

async function gh(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await installationToken();
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
      ...(init.headers ?? {}),
    },
  });
}

export type CreatedIssue = { number: number; url: string };

export async function createContentRequestIssue(
  repo: string,
  title: string,
  body: string,
): Promise<CreatedIssue> {
  // Unknown labels are created automatically by GitHub on first use.
  const res = await gh(`/repos/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels: [CONTENT_REQUEST_LABEL] }),
  });
  if (!res.ok) {
    throw new Error(`GitHub create issue failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { number: number; html_url: string };
  return { number: data.number, url: data.html_url };
}

export type ContentRequest = {
  number: number;
  title: string;
  url: string;
  state: "open" | "closed";
  createdAt: string;
};

export async function listContentRequests(repo: string): Promise<ContentRequest[]> {
  const res = await gh(
    `/repos/${repo}/issues?labels=${CONTENT_REQUEST_LABEL}&state=all&per_page=50`,
  );
  if (!res.ok) {
    throw new Error(`GitHub list issues failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as Array<{
    number: number;
    title: string;
    html_url: string;
    state: "open" | "closed";
    created_at: string;
    pull_request?: unknown;
  }>;
  // The issues endpoint also returns PRs; drop them.
  return data
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      createdAt: issue.created_at,
    }));
}
