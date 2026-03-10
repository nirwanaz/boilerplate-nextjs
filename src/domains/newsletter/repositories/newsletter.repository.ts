import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Newsletter, CreateNewsletterInput, UpdateNewsletterInput } from "../entities/newsletter";

export class NewsletterRepository {
  async findAll(): Promise<Newsletter[]> {
    const data = await db.query.newsletters.findMany({
      orderBy: [desc(schema.newsletters.createdAt)],
    });
    return data.map((r) => this.transform(r));
  }

  async findById(id: string): Promise<Newsletter | null> {
    const data = await db.query.newsletters.findFirst({
      where: eq(schema.newsletters.id, id),
    });
    return data ? this.transform(data) : null;
  }

  async create(input: CreateNewsletterInput): Promise<Newsletter> {
    const id = crypto.randomUUID();
    await db.insert(schema.newsletters).values({
      id,
      subject: input.subject,
      body: input.body,
    });
    return (await this.findById(id))!;
  }

  async update(id: string, input: UpdateNewsletterInput): Promise<Newsletter> {
    await db.update(schema.newsletters)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(schema.newsletters.id, id));
    return (await this.findById(id))!;
  }

  async markSending(id: string): Promise<void> {
    await db.update(schema.newsletters)
      .set({ status: "sending", updatedAt: new Date() })
      .where(eq(schema.newsletters.id, id));
  }

  async markSent(id: string, count: number): Promise<void> {
    await db.update(schema.newsletters)
      .set({ status: "sent", sentCount: count, sentAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.newsletters.id, id));
  }

  async markFailed(id: string): Promise<void> {
    await db.update(schema.newsletters)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(schema.newsletters.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.newsletters).where(eq(schema.newsletters.id, id));
  }

  private transform(data: typeof schema.newsletters.$inferSelect): Newsletter {
    return {
      ...data,
      sentAt: data.sentAt instanceof Date ? data.sentAt.toISOString() : data.sentAt as any,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : (data.createdAt as any),
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : (data.updatedAt as any),
    };
  }
}
