import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { SeoSetting, UpsertSeoInput } from "../entities/seo";

export class SeoRepository {
  async findAll(): Promise<SeoSetting[]> {
    const data = await db.query.seoSettings.findMany({
      orderBy: [desc(schema.seoSettings.updatedAt)],
    });
    return data.map((r) => this.transform(r));
  }

  async findByPath(pagePath: string): Promise<SeoSetting | null> {
    const data = await db.query.seoSettings.findFirst({
      where: eq(schema.seoSettings.pagePath, pagePath),
    });
    return data ? this.transform(data) : null;
  }

  async upsert(input: UpsertSeoInput): Promise<SeoSetting> {
    const id = crypto.randomUUID();
    await db
      .insert(schema.seoSettings)
      .values({
        id,
        pagePath: input.pagePath,
        metaTitle: input.metaTitle || null,
        metaDescription: input.metaDescription || null,
        ogImage: input.ogImage || null,
        keywords: input.keywords || null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.seoSettings.pagePath,
        set: {
          metaTitle: input.metaTitle || null,
          metaDescription: input.metaDescription || null,
          ogImage: input.ogImage || null,
          keywords: input.keywords || null,
          updatedAt: new Date(),
        },
      });

    return (await this.findByPath(input.pagePath))!;
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.seoSettings).where(eq(schema.seoSettings.id, id));
  }

  private transform(data: typeof schema.seoSettings.$inferSelect): SeoSetting {
    return {
      ...data,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : (data.createdAt as any),
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : (data.updatedAt as any),
    };
  }
}
