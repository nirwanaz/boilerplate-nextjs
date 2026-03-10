import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import type { LandingContent, UpsertLandingContentInput } from "../entities/landing-content";

export class LandingContentRepository {
  async findAll(): Promise<LandingContent[]> {
    const data = await db.query.landingContent.findMany({
      orderBy: [asc(schema.landingContent.section), asc(schema.landingContent.sortOrder)],
    });
    return data.map((r) => this.transform(r));
  }

  async findBySection(section: string): Promise<LandingContent[]> {
    const data = await db.query.landingContent.findMany({
      where: eq(schema.landingContent.section, section),
      orderBy: [asc(schema.landingContent.sortOrder)],
    });
    return data.map((r) => this.transform(r));
  }

  async findBySectionAndKey(section: string, key: string): Promise<LandingContent | null> {
    const data = await db.query.landingContent.findFirst({
      where: and(
        eq(schema.landingContent.section, section),
        eq(schema.landingContent.key, key)
      ),
    });
    return data ? this.transform(data) : null;
  }

  async upsert(input: UpsertLandingContentInput): Promise<LandingContent> {
    const existing = await this.findBySectionAndKey(input.section, input.key);
    if (existing) {
      await db.update(schema.landingContent)
        .set({ value: input.value, sortOrder: input.sortOrder, updatedAt: new Date() })
        .where(eq(schema.landingContent.id, existing.id));
      return (await this.findBySectionAndKey(input.section, input.key))!;
    }
    const id = crypto.randomUUID();
    await db.insert(schema.landingContent).values({
      id,
      section: input.section,
      key: input.key,
      value: input.value,
      sortOrder: input.sortOrder,
    });
    return (await this.findBySectionAndKey(input.section, input.key))!;
  }

  async bulkUpsert(items: UpsertLandingContentInput[]): Promise<void> {
    for (const item of items) {
      await this.upsert(item);
    }
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.landingContent).where(eq(schema.landingContent.id, id));
  }

  private transform(data: typeof schema.landingContent.$inferSelect): LandingContent {
    return {
      ...data,
      createdAt: data.createdAt ? data.createdAt.toISOString() : "",
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : "",
    };
  }
}
