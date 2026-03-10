import { NextResponse } from "next/server";
import { SettingsService } from "@/domains/settings/services/settings.service";

export async function GET() {
  try {
    const service = new SettingsService();
    const settings = await service.getUserSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const service = new SettingsService();
    const settings = await service.updateUserSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
