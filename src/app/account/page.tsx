import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getSubscriptionSummary } from "@/lib/stripe-customer";
import { getCapabilities } from "@/lib/capabilities";

export const metadata: Metadata = {
  title: "Your account | Coglyde",
};

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const { subscriptions } = await getSubscriptionSummary(user);
  const capabilities = getCapabilities(user);

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? "";

  // A dedicated dashboard shell: the sidebar is the nav, no marketing chrome.
  return (
    <AccountDashboard
      subscriptions={subscriptions}
      hasSubscriptions={subscriptions.length > 0}
      capabilities={capabilities}
      userName={userName}
      userEmail={userEmail}
    />
  );
}
