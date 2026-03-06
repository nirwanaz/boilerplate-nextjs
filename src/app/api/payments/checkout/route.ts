import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { PaymentService } from "@/domains/payments/services/payment.service";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { origin } = new URL(request.url);

    const service = new PaymentService(supabase);
    
    // Detect if this is product-based checkout or manual checkout
    const isProductCheckout = body.items?.[0]?.product_id !== undefined;
    
    let url: string;
    if (isProductCheckout) {
      const result = await service.createProductCheckoutSession(
        body,
        `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
        `${origin}/orders/cancel`
      );
      url = result.url;
    } else {
      const result = await service.createCheckoutSession(
        body,
        `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
        `${origin}/orders/cancel`
      );
      url = result.url;
    }

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
