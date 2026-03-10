import { z } from "zod";

export const activityLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string().nullable().optional(),
  details: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  createdAt: z.date(),
});

export type ActivityLog = z.infer<typeof activityLogSchema>;

export const createActivityLogSchema = activityLogSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateActivityLogInput = z.infer<typeof createActivityLogSchema>;
