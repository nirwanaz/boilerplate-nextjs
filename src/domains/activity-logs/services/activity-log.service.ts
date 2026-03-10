import { ActivityLogRepository } from "../repositories/activity-log.repository";
import type { ActivityLog, CreateActivityLogInput } from "../entities/activity-log";
import { getSession } from "@/shared/auth/dal";
import { headers } from "next/headers";

export class ActivityLogService {
  private repository: ActivityLogRepository;

  constructor() {
    this.repository = new ActivityLogRepository();
  }

  async record(input: Omit<CreateActivityLogInput, "userId" | "ipAddress" | "userAgent">): Promise<ActivityLog> {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const headerList = await headers();
    const ipAddress = headerList.get("x-forwarded-for") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";

    return this.repository.create({
      ...input,
      userId: session.user.id,
      ipAddress,
      userAgent,
    });
  }

  async list(limit = 50, offset = 0): Promise<ActivityLog[]> {
    return this.repository.findAll(limit, offset);
  }
}

// Export a singleton instance for easy use across services
export const activityLogService = new ActivityLogService();
