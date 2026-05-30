import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/Header";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getSubscriptionSummary } from "@/lib/stripe-customer";

export const metadata: Metadata = {
  title: "Your account | Coglyde",
};

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const { subscriptions } = await getSubscriptionSummary(user);
  const hasSubscriptions = subscriptions.length > 0;

  return (
    <>
      <PageAmbientBackground />
      <Header />
      <main className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 pt-32 pb-24 sm:pt-40">
        <header className="mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-400">
            Account Dashboard
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
            Manage your account settings, subscriptions, and reach out to our support team.
          </p>
        </header>

        <AccountDashboard subscriptions={subscriptions} hasSubscriptions={hasSubscriptions} />
      </main>
      <Footer />
    </>
  );
}
