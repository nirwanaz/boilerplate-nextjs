import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { PaymentService } from "@/domains/payments/services/payment.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = new PaymentService(supabase);
    const orders = await service.listOrders(user.id);
    return NextResponse.json(orders);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
