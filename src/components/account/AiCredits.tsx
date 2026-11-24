"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkspaceOverview } from "@/lib/gateway/workspace";

const button =
  "rounded-md border border-white/25 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 disabled:opacity-50";
const primary =
  "rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 disabled:opacity-50";
const input =
  "rounded-md border border-white/25 bg-black px-3 py-2 text-sm text-white focus-visible:outline-2";
const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 6,
});
const money = (value: string | number | null | undefined) =>
  value == null ? "—" : dollars.format(Number(value) / 1_000_000);
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

async function request(
  body?: object,
  requestId?: string,
  signal?: AbortSignal,
) {
  const res = await fetch("/api/account/ai", {
    method: body ? "POST" : "GET",
    cache: "no-store",
    signal,
    headers: body
      ? {
          "Content-Type": "application/json",
          ...(requestId ? { "Idempotency-Key": requestId } : {}),
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await res.json();
  if (!res.ok)
    throw new Error(result.error?.message || "Unable to load your workspace.");
  return result;
}

export function AiCredits({
  checkoutReturned = false,
}: {
  checkoutReturned?: boolean;
}) {
  const [workspace, setWorkspace] = useState<WorkspaceOverview | null>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState("10");
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [attempt, setAttempt] = useState(0);
  const checkout = useRef<{ cents: number; id: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    request(undefined, undefined, controller.signal)
      .then((data) => setWorkspace(data.workspace))
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [attempt]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }
  const reload = () => {
    setError("");
    setAttempt((n) => n + 1);
  };
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          AI credits
        </h2>
        {workspace && (
          <p className="mt-1 text-sm text-white/65">{workspace.name}</p>
        )}
      </header>
      {checkoutReturned && workspace && (
        <p role="status" className="text-sm text-white/70">
          Your balance updates when Stripe confirms payment. Refresh recent
          usage to check again.
        </p>
      )}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 text-sm text-white"
        >
          {error}{" "}
          <button className={button} onClick={reload}>
            Refresh
          </button>
        </div>
      )}
      {workspace === undefined && !error && (
        <p role="status" className="text-white/65">
          Loading workspace…
        </p>
      )}
      {workspace === null && (
        <p className="text-white/70">
          No AI workspace is linked to this account. Contact Coglyde to connect
          your workspace.
        </p>
      )}
      {workspace && (
        <>
          <section className="rounded-2xl border border-white/15 bg-white/[0.025] p-5 sm:p-7">
            <h3 className="text-sm text-white/70">Available balance · USD</h3>
            <p className="mt-2 break-all text-4xl font-semibold tracking-tight tabular-nums text-white">
              {money(workspace.availableMicro)}
            </p>
            {workspace.discountBps !== null && (
              <p className="mt-2 text-sm text-white/65">
                Your rate is {workspace.discountBps / 100}% below the provider’s
                direct price.
              </p>
            )}
            {workspace.purchasesEnabled ? (
              <form
                className="mt-5 flex flex-wrap items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void run(async () => {
                    const cents = Math.round(Number(amount) * 100);
                    if (checkout.current?.cents !== cents)
                      checkout.current = { cents, id: crypto.randomUUID() };
                    const { url } = await request(
                      { action: "checkout", cents },
                      checkout.current.id,
                    );
                    window.location.assign(url);
                  });
                }}
              >
                <label className="grid gap-1 text-sm text-white/70">
                  Amount in USD
                  <input
                    className={input + " w-28"}
                    type="number"
                    min="5"
                    max="1000"
                    step=".01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <button className={primary} disabled={busy}>
                  Add credits
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-white/65">
                Credit purchases are paused for this workspace.
              </p>
            )}
          </section>
          <section aria-labelledby="workspace-keys" className="space-y-4">
            <h3
              id="workspace-keys"
              className="text-lg font-semibold text-white"
            >
              API keys
            </h3>
            <p className="text-sm text-white/65">
              Connect your application from its server using a Coglyde key.
            </p>
            <form
              className="flex flex-wrap items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  const key = await request({
                    action: "create",
                    name: name.trim(),
                  });
                  setWorkspace({
                    ...workspace,
                    keys: [
                      { id: key.id, name: key.name, suffix: key.suffix },
                      ...workspace.keys,
                    ],
                  });
                  setSecret(key.secret);
                  setCopied(false);
                  setName("");
                });
              }}
            >
              <label className="grid min-w-0 gap-1 text-sm text-white/70">
                Key name
                <input
                  className={input + " w-full"}
                  placeholder="Coaching portal"
                  required
                  maxLength={64}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button
                className={button}
                disabled={busy || !name.trim() || Boolean(secret)}
              >
                Create key
              </button>
            </form>
            {secret && (
              <div className="space-y-2 rounded-lg bg-white/[0.06] p-4">
                <label className="grid gap-2 text-sm text-white">
                  Save this key now. It is shown once.
                  <input
                    className={input + " w-full font-mono"}
                    readOnly
                    value={secret}
                    onFocus={(e) => e.target.select()}
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    className={button}
                    onClick={() =>
                      void run(async () => {
                        await navigator.clipboard.writeText(secret);
                        setCopied(true);
                      })
                    }
                  >
                    {copied ? "Copied" : "Copy key"}
                  </button>
                  <button className={button} onClick={() => setSecret("")}>
                    Done
                  </button>
                </div>
              </div>
            )}
            <ul className="divide-y divide-white/10">
              {workspace.keys.map((k) => (
                <li
                  key={k.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <span className="min-w-0 break-all text-sm text-white">
                    {k.name}{" "}
                    {k.suffix && (
                      <span className="font-mono text-white/55">
                        ····{k.suffix}
                      </span>
                    )}
                  </span>
                  {confirm === k.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-white/70">
                        Apps using this key will lose access.
                      </span>
                      <button
                        className={button}
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            await request({ action: "revoke", id: k.id });
                            setConfirm("");
                            setSecret("");
                            setWorkspace({
                              ...workspace,
                              keys: workspace.keys.filter(
                                (key) => key.id !== k.id,
                              ),
                            });
                          })
                        }
                      >
                        Confirm revoke
                      </button>
                      <button className={button} onClick={() => setConfirm("")}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className={button} onClick={() => setConfirm(k.id)}>
                      Revoke
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="workspace-usage">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3
                id="workspace-usage"
                className="text-lg font-semibold text-white"
              >
                Recent usage
              </h3>
              <button className={button} disabled={busy} onClick={reload}>
                Refresh
              </button>
            </div>
            {workspace.receipts.length ? (
              <ul className="divide-y divide-white/10">
                {workspace.receipts.map((r) => (
                  <li
                    key={r.id}
                    className="grid gap-2 py-4 sm:grid-cols-2 sm:items-center"
                  >
                    <div>
                      <p className="break-all text-sm font-medium text-white">
                        {r.model}
                      </p>
                      <p className="mt-1 text-xs text-white/65">
                        {date.format(new Date(r.date))} · {r.status}
                      </p>
                    </div>
                    <dl className="grid grid-cols-3 gap-2 text-xs tabular-nums sm:text-right">
                      {[
                        ["Direct", money(r.direct)],
                        ["Your price", money(r.charge)],
                        ["Saved", money(r.savings)],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-white/65">{label}</dt>
                          <dd className="mt-1 break-all text-white">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/65">
                Your first request will appear here.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
