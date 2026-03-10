import { NextResponse } from "next/server";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuthWithRole("admin");
    await newsletterService.deleteSubscriber(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
