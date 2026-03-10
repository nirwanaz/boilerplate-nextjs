import { NextResponse } from "next/server";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import { requireAuthWithRole } from "@/shared/auth/dal";
import { z } from "zod";

export async function GET() {
  try {
    await requireAuthWithRole("admin");
    const testimonials = await marketingService.getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAuthWithRole("admin");
    const body = await req.json();
    const testimonial = await marketingService.createTestimonial(body);
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}
