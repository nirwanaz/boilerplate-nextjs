import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { SettingsService } from "@/domains/settings/services/settings.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const service = new SettingsService(supabase);
    const settings = await service.getAppSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const service = new SettingsService(supabase);
    const setting = await service.updateAppSetting(body);
    return NextResponse.json(setting);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message.includes("Forbidden") || message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
