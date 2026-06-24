import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
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

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const me = await currentUser();
  const admin = isAdmin(me);

  const sp = await searchParams;
  const viewAs = typeof sp.viewAs === "string" ? sp.viewAs : null;

  // Admins can view the dashboard exactly as a client sees it. Everyone else
  // (and admins with no viewAs) just see their own.
  let subject = me;
  let impersonating: { id: string; name: string } | null = null;
  if (admin && viewAs) {
    try {
      const target = await (await clerkClient()).users.getUser(viewAs);
      subject = target;
      impersonating = {
        id: target.id,
        name:
          [target.firstName, target.lastName].filter(Boolean).join(" ") ||
          target.emailAddresses[0]?.emailAddress ||
          "Client",
      };
    } catch {
      // unknown id: fall back to the admin's own dashboard
    }
  }

  const { subscriptions } = await getSubscriptionSummary(subject);
  const capabilities = getCapabilities(subject, subscriptions);
  const site = getClientSite(subject);
  const userName = [subject?.firstName, subject?.lastName].filter(Boolean).join(" ");

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
          isAdmin={admin && !impersonating}
          impersonating={impersonating}
        />
      </main>
      <Footer />
    </>
  );
}
