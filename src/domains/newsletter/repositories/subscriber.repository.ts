import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { Subscriber, CreateSubscriberInput } from "../entities/subscriber";

export class SubscriberRepository {
  async findAll(): Promise<Subscriber[]> {
    const data = await db.query.subscribers.findMany({
      orderBy: [desc(schema.subscribers.subscribedAt)],
    });
    return data.map((r) => this.transform(r));
  }

  async findActive(): Promise<Subscriber[]> {
    const data = await db.query.subscribers.findMany({
      where: eq(schema.subscribers.status, "active"),
      orderBy: [desc(schema.subscribers.subscribedAt)],
    });
    return data.map((r) => this.transform(r));
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const data = await db.query.subscribers.findFirst({
      where: eq(schema.subscribers.email, email),
    });
    return data ? this.transform(data) : null;
  }

  async findById(id: string): Promise<Subscriber | null> {
    const data = await db.query.subscribers.findFirst({
      where: eq(schema.subscribers.id, id),
    });
    return data ? this.transform(data) : null;
  }

  async create(input: CreateSubscriberInput): Promise<Subscriber> {
    const id = crypto.randomUUID();
    await db.insert(schema.subscribers).values({
      id,
      email: input.email,
      name: input.name || null,
      source: input.source || "website",
    });
    return (await this.findById(id))!;
  }

  async unsubscribe(id: string): Promise<void> {
    await db.update(schema.subscribers)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(eq(schema.subscribers.id, id));
  }

  async resubscribe(id: string): Promise<void> {
    await db.update(schema.subscribers)
      .set({ status: "active", unsubscribedAt: null })
      .where(eq(schema.subscribers.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.subscribers).where(eq(schema.subscribers.id, id));
  }

  async countActive(): Promise<number> {
    const data = await db.query.subscribers.findMany({
      where: eq(schema.subscribers.status, "active"),
      columns: { id: true },
    });
    return data.length;
  }

  private transform(data: typeof schema.subscribers.$inferSelect): Subscriber {
    return {
      ...data,
      subscribedAt: data.subscribedAt instanceof Date ? data.subscribedAt.toISOString() : (data.subscribedAt as any),
      unsubscribedAt: data.unsubscribedAt instanceof Date ? data.unsubscribedAt.toISOString() : data.unsubscribedAt as any,
    };
  }
}
