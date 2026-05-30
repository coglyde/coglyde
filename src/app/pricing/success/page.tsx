import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { ManageBillingButton } from "@/components/billing/ManageBillingButton";

export const metadata: Metadata = {
  title: "Welcome aboard | Coglyde",
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-violet-400/40 bg-violet-500/10 text-violet-200">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-7 w-7"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>

        <h1 className="mt-8 max-w-[34rem] text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
          You are all set
        </h1>
        <p className="mt-5 max-w-[34rem] text-pretty text-base leading-relaxed text-white/60">
          Your subscription is active and a receipt is on its way to your inbox.
          Our team will reach out shortly to kick things off.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/account"
            className="rounded-2xl bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Go to your account
          </Link>
          <ManageBillingButton />
        </div>
      </main>
    </>
  );
}
