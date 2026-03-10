import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import type { ActivityLog, CreateActivityLogInput } from "../entities/activity-log";
export class ActivityLogRepository {
  async create(input: CreateActivityLogInput): Promise<ActivityLog> {
    const id = crypto.randomUUID();
    const [row] = await db
      .insert(activityLogs)
      .values({
        id,
        ...input,
        createdAt: new Date(),
      })
      .returning();

    return row as ActivityLog;
  }

  async findAll(limit = 50, offset = 0): Promise<ActivityLog[]> {
    const rows = await db.query.activityLogs.findMany({
      orderBy: [desc(activityLogs.createdAt)],
      limit,
      offset,
      with: {
        user: true,
      },
    });

    return rows as any[];
  }

  async findByUserId(userId: string): Promise<ActivityLog[]> {
    const rows = await db.query.activityLogs.findMany({
      where: eq(activityLogs.userId, userId),
      orderBy: [desc(activityLogs.createdAt)],
    });

    return rows as any[];
  }
}
