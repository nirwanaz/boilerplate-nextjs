import { NextResponse } from "next/server";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function GET() {
  try {
    await requireAuthWithRole("admin");
    const seo = await marketingService.getSeoSettings();
    return NextResponse.json(seo);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuthWithRole("admin");
    const body = await req.json();
    const seo = await marketingService.upsertSeo(body);
    return NextResponse.json(seo);
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
