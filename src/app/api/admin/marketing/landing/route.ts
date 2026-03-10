import { NextResponse } from "next/server";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function PUT(req: Request) {
  try {
    await requireAuthWithRole("admin");
    const body = await req.json();
    
    // items is an array of UpsertLandingContentInput
    await marketingService.updateLandingContent(body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating landing content:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: error instanceof Error && error.message === "Forbidden" ? 403 : 500 }
    );
  }
}
