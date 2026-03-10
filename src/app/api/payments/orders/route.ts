import { NextResponse } from "next/server";
import { PaymentService } from "@/domains/payments/services/payment.service";
import { getSession } from "@/shared/auth/dal";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = new PaymentService();
    const orders = await service.listOrders(session.user.id);
    return NextResponse.json(orders);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
