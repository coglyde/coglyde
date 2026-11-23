import type Stripe from "stripe";
import { deposit } from "./ledger";

export async function processGatewayPayment(event: Stripe.Event) {
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  )
    return false;
  const session = event.data.object;
  if (session.metadata?.product !== "gateway_credit") return false;
  if (session.payment_status !== "paid") return true;
  if (
    session.mode !== "payment" ||
    session.currency !== "usd" ||
    !session.amount_total ||
    !session.metadata.gateway_client
  )
    throw Error("Unexpected gateway payment");
  await deposit(
    session.metadata.gateway_client,
    "stripe:" + session.id,
    session.amount_total * 10000,
  );
  return true;
}
