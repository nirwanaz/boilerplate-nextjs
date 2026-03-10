import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { AppSettings, UserSettings, UpdateUserSettingsInput } from "../entities/settings";

export class SettingsRepository {
  // App Settings
  async getAppSettings(): Promise<AppSettings[]> {
    const data = await db.query.appSettings.findMany({
      orderBy: [schema.appSettings.key]
    });
    return data.map((item) => this.transformAppSettings(item));
  }

  async getAppSetting(key: string): Promise<AppSettings | null> {
    const data = await db.query.appSettings.findFirst({
      where: eq(schema.appSettings.key, key)
    });
    return data ? this.transformAppSettings(data) : null;
  }

  async upsertAppSetting(key: string, value: string): Promise<AppSettings> {
    const existing = await this.getAppSetting(key);
    const id = existing?.id || crypto.randomUUID();

    await db.insert(schema.appSettings)
      .values({ 
        id, 
        key, 
        value, 
        updatedAt: new Date() 
      })
      .onConflictDoUpdate({
        target: schema.appSettings.key,
        set: { value, updatedAt: new Date() }
      });

    return (await this.getAppSetting(key))!;
  }

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const data = await db.query.userSettings.findFirst({
      where: eq(schema.userSettings.userId, userId)
    });
    return data ? this.transformUserSettings(data) : null;
  }

  async upsertUserSettings(
    userId: string,
    input: UpdateUserSettingsInput
  ): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    const id = existing?.id || crypto.randomUUID();

    await db.insert(schema.userSettings)
      .values({ 
        id, 
        userId, 
        ...input, 
        updatedAt: new Date() 
      })
      .onConflictDoUpdate({
        target: schema.userSettings.userId,
        set: { ...input, updatedAt: new Date() }
      });

    return (await this.getUserSettings(userId))!;
  }

  private transformAppSettings(data: typeof schema.appSettings.$inferSelect): AppSettings {
    return {
      ...data,
      updatedAt: data.updatedAt.toISOString(),
      createdAt: data.createdAt.toISOString()
    };
  }

  private transformUserSettings(data: typeof schema.userSettings.$inferSelect): UserSettings {
    return {
      ...data,
      updatedAt: data.updatedAt.toISOString(),
      createdAt: data.createdAt.toISOString()
    };
  }
}
