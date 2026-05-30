import Link from "next/link";

// Shown on /account when the signed-in user has no subscriptions yet.
export function AccountEmptyState() {
  return (
    <div className="rounded-[1.25rem] border border-white/15 bg-white/[0.02] p-10 text-center backdrop-blur-[3px]">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        No active plans yet
      </h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-white/55">
        Pick a plan to keep your site cared for, climbing in search and running
        on autopilot. You can change or cancel anytime.
      </p>
      <Link
        href="/pricing"
        className="mt-6 inline-block rounded-2xl bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-white/90"
      >
        Browse plans
      </Link>
    </div>
  );
}
