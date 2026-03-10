import { NextResponse } from "next/server";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function GET() {
  try {
    await requireAuthWithRole("admin");
    const newsletters = await newsletterService.getNewsletters();
    return NextResponse.json(newsletters);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuthWithRole("admin");
    const body = await req.json();
    const newsletter = await newsletterService.createNewsletter(body);
    return NextResponse.json(newsletter);
  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
