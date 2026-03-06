import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { PaymentService } from "@/domains/payments/services/payment.service";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { order_id } = await request.json();

    // Verify admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const service = new PaymentService(supabase);
    const order = await service.refundOrder(order_id);
    
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
