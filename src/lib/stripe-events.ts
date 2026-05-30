import type Stripe from "stripe";
import { notifyTeam } from "./notify";
import { linkStripeCustomerToUser } from "./stripe-customer";

// Formats a Stripe amount (in cents) as a currency string.
function money(amount: number | null | undefined, currency: string | null): string {
  if (amount == null) return "an unknown amount";
  return (amount / 100).toLocaleString(undefined, {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  });
}

// Routes the events we care about. We notify the team only on the moments worth
// a ping (new sale, cancellation, failed payment) and log everything else so it
// stays useful without becoming noisy. Stripe sends many event types; anything
// not handled here is simply acknowledged.
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Make sure the Stripe customer is linked to the Clerk user, even if the
      // checkout was somehow created without a pre-existing customer. Requires
      // CLERK_SECRET_KEY; skipped (with a log) when it is absent.
      const clerkUserId =
        session.client_reference_id ?? session.metadata?.clerkUserId ?? null;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      if (clerkUserId && customerId && process.env.CLERK_SECRET_KEY) {
        try {
          await linkStripeCustomerToUser(clerkUserId, customerId);
        } catch (err) {
          console.error("[stripe webhook] failed to link customer to user:", err);
        }
      }

      const who =
        session.customer_details?.email ?? session.customer_email ?? "a new customer";
      await notifyTeam(
        `New subscription started by ${who} (${money(session.amount_total, session.currency)}).`,
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await notifyTeam(`Subscription ${subscription.id} was canceled.`);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const who = invoice.customer_email ?? "a customer";
      await notifyTeam(
        `Payment failed: ${money(invoice.amount_due, invoice.currency)} from ${who}. Follow up needed.`,
      );
      break;
    }

    // Routine events we record but do not ping the team about.
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "invoice.paid":
      break;

    default:
      break;
  }

  console.log(`[stripe webhook] handled ${event.type}`);
}
