import { SettingsRepository } from "../repositories/settings.repository";
import { updateUserSettingsSchema, updateAppSettingsSchema } from "../entities/settings";
import type { AppSettings, UserSettings, UpdateUserSettingsInput, UpdateAppSettingsInput } from "../entities/settings";
import { hasPermission } from "@/shared/auth/rbac";
import { getSession } from "@/shared/auth/dal";

export class SettingsService {
  private repository: SettingsRepository;

  constructor() {
    this.repository = new SettingsRepository();
  }

  // App Settings (admin only for write)
  async getAppSettings(): Promise<AppSettings[]> {
    return this.repository.getAppSettings();
  }

  async updateAppSetting(input: UpdateAppSettingsInput): Promise<AppSettings> {
    const session = await getSession();
    if (!session || !hasPermission(session.profile.role, "admin")) {
      throw new Error("Unauthorized");
    }

    const validated = updateAppSettingsSchema.parse(input);
    return this.repository.upsertAppSetting(validated.key, validated.value);
  }

  // User Settings
  async getUserSettings(): Promise<UserSettings | null> {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    return this.repository.getUserSettings(session.user.id);
  }

  async updateUserSettings(input: UpdateUserSettingsInput): Promise<UserSettings> {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const validated = updateUserSettingsSchema.parse(input);
    return this.repository.upsertUserSettings(session.user.id, validated);
  }
}
