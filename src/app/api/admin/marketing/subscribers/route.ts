import { NextResponse } from "next/server";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import { requireAuthWithRole } from "@/shared/auth/dal";

export async function GET() {
  try {
    await requireAuthWithRole("admin");
    const subscribers = await newsletterService.getSubscribers();
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const subscriber = await newsletterService.subscribe(body);
    return NextResponse.json(subscriber);
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
