import { NextResponse } from "next/server";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuthWithRole("admin");
    await marketingService.deleteSeo(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
