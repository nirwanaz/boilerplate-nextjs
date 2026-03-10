import { NextResponse } from "next/server";
import { stripe } from "@/shared/lib/stripe/server";
import { PaymentService } from "@/domains/payments/services/payment.service";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const service = new PaymentService();
    await service.handleWebhookCheckoutComplete(session.id);
  }

  return NextResponse.json({ received: true });
}
