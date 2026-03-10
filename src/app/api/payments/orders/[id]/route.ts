import { NextResponse } from "next/server";
import { PaymentService } from "@/domains/payments/services/payment.service";
import { getSession } from "@/shared/auth/dal";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = new PaymentService();
    const result = await service.getOrder(id);
    
    if (!result) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = session.profile.role === "admin";
    const ownsOrder = result.order.userId === session.user.id;
    
    if (!isAdmin && !ownsOrder) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
