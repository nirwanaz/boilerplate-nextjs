import { SupabaseClient } from "@supabase/supabase-js";
import { SettingsRepository } from "../repositories/settings.repository";
import { updateUserSettingsSchema, updateAppSettingsSchema } from "../entities/settings";
import type { AppSettings, UserSettings, UpdateUserSettingsInput, UpdateAppSettingsInput } from "../entities/settings";
import { requireRole } from "@/shared/auth/rbac";

export class SettingsService {
  private repository: SettingsRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new SettingsRepository(supabase);
  }

  // App Settings (admin only for write)
  async getAppSettings(): Promise<AppSettings[]> {
    return this.repository.getAppSettings();
  }

  async updateAppSetting(input: UpdateAppSettingsInput): Promise<AppSettings> {
    const validated = updateAppSettingsSchema.parse(input);
    await requireRole(this.supabase, "admin");
    return this.repository.upsertAppSetting(validated.key, validated.value);
  }

  // User Settings
  async getUserSettings(): Promise<UserSettings | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return this.repository.getUserSettings(user.id);
  }

  async updateUserSettings(input: UpdateUserSettingsInput): Promise<UserSettings> {
    const validated = updateUserSettingsSchema.parse(input);
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return this.repository.upsertUserSettings(user.id, validated);
  }
}
