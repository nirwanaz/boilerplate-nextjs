import { NextResponse } from "next/server";
import { PaymentService } from "@/domains/payments/services/payment.service";
import { getSession } from "@/shared/auth/dal";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const service = new PaymentService();
    const order = await service.refundOrder(orderId);
    
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
