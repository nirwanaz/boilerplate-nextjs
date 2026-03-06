import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { PaymentService } from "@/domains/payments/services/payment.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = new PaymentService(supabase);
    const result = await service.getOrder(id);
    
    if (!result) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify user owns this order or is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    const isAdmin = profile?.role === "admin";
    const ownsOrder = result.order.user_id === user.id;
    
    if (!isAdmin && !ownsOrder) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
