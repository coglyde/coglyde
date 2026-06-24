import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/footer/Footer";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getSubscriptionSummary } from "@/lib/stripe-customer";
import { getCapabilities } from "@/lib/capabilities";
import { getClientSite } from "@/lib/client-site";
import { isAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Your account | Coglyde",
};

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const { subscriptions } = await getSubscriptionSummary(user);
  const capabilities = getCapabilities(user, subscriptions);
  const site = getClientSite(user);
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-7xl px-6 pt-28 pb-20 sm:pt-32">
        <AccountDashboard
          subscriptions={subscriptions}
          hasSubscriptions={subscriptions.length > 0}
          capabilities={capabilities}
          userName={userName}
          site={site}
          isAdmin={isAdmin(user)}
        />
      </main>
      <Footer />
    </>
  );
}
