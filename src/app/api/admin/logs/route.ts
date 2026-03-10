import { NextResponse } from "next/server";
import { getSession } from "@/shared/auth/dal";
import { hasPermission } from "@/shared/auth/rbac";
import { activityLogService } from "@/domains/activity-logs/services/activity-log.service";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !hasPermission(session.profile.role, ["admin"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const logs = await activityLogService.list(limit, offset);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
