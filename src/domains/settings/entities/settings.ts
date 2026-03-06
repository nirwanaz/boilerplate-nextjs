import { z } from "zod";

export interface AppSettings {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export const updateUserSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().min(2).max(10).optional(),
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
});

export const updateAppSettingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;
export type UpdateAppSettingsInput = z.infer<typeof updateAppSettingsSchema>;
