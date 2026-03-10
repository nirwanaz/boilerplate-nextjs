import { NextResponse } from "next/server";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuthWithRole("admin");
    const result = await newsletterService.sendNewsletter(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
