import { NextResponse } from "next/server";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuthWithRole("admin");
    const body = await req.json();
    const testimonial = await marketingService.updateTestimonial(id, body);
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuthWithRole("admin");
    await marketingService.deleteTestimonial(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}
