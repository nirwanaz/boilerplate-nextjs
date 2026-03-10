import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import type { Testimonial, CreateTestimonialInput, UpdateTestimonialInput } from "../entities/testimonial";

export class TestimonialRepository {
  async findAll(): Promise<Testimonial[]> {
    const data = await db.query.testimonials.findMany({
      orderBy: [asc(schema.testimonials.sortOrder), desc(schema.testimonials.createdAt)],
    });
    return data.map((r) => this.transform(r));
  }

  async findPublished(): Promise<Testimonial[]> {
    const data = await db.query.testimonials.findMany({
      where: eq(schema.testimonials.isPublished, true),
      orderBy: [asc(schema.testimonials.sortOrder)],
    });
    return data.map((r) => this.transform(r));
  }

  async findById(id: string): Promise<Testimonial | null> {
    const data = await db.query.testimonials.findFirst({
      where: eq(schema.testimonials.id, id),
    });
    return data ? this.transform(data) : null;
  }

  async create(input: CreateTestimonialInput): Promise<Testimonial> {
    const id = crypto.randomUUID();
    await db.insert(schema.testimonials).values({
      id,
      name: input.name,
      title: input.title,
      quote: input.quote,
      avatarUrl: input.avatarUrl || null,
      rating: input.rating,
      sortOrder: input.sortOrder,
      isPublished: input.isPublished,
    });
    return (await this.findById(id))!;
  }

  async update(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
    await db.update(schema.testimonials)
      .set({ ...input, avatarUrl: input.avatarUrl || null, updatedAt: new Date() })
      .where(eq(schema.testimonials.id, id));
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  }

  private transform(data: typeof schema.testimonials.$inferSelect): Testimonial {
    return {
      ...data,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : (data.createdAt as any),
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : (data.updatedAt as any),
    };
  }
}
