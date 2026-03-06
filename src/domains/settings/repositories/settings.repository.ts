import { SupabaseClient } from "@supabase/supabase-js";
import type { AppSettings, UserSettings, UpdateUserSettingsInput } from "../entities/settings";

export class SettingsRepository {
  constructor(private supabase: SupabaseClient) {}

  // App Settings
  async getAppSettings(): Promise<AppSettings[]> {
    const { data, error } = await this.supabase
      .from("app_settings")
      .select("*")
      .order("key");

    if (error) throw error;
    return data ?? [];
  }

  async getAppSetting(key: string): Promise<AppSettings | null> {
    const { data, error } = await this.supabase
      .from("app_settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async upsertAppSetting(key: string, value: string): Promise<AppSettings> {
    const { data, error } = await this.supabase
      .from("app_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await this.supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async upsertUserSettings(
    userId: string,
    input: UpdateUserSettingsInput
  ): Promise<UserSettings> {
    const { data, error } = await this.supabase
      .from("user_settings")
      .upsert(
        { user_id: userId, ...input, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
