import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Product, CreateProductInput, UpdateProductInput } from "../entities/product";

export class ProductRepository {
  async findAll(activeOnly = false): Promise<Product[]> {
    const whereClause = activeOnly ? eq(schema.products.status, "active") : undefined;

    const data = await db.query.products.findMany({
      where: whereClause,
      orderBy: [desc(schema.products.createdAt)]
    });

    return data.map((item) => this.transformProduct(item));
  }

  async findById(id: string): Promise<Product | null> {
    const data = await db.query.products.findFirst({
      where: eq(schema.products.id, id)
    });

    return data ? this.transformProduct(data) : null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const id = crypto.randomUUID();
    await db.insert(schema.products).values({
      id,
      name: input.name,
      description: input.description,
      price: input.price,
      currency: input.currency,
      status: input.status as "active" | "inactive",
      imageUrl: input.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return (await this.findById(id))!;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    await db.update(schema.products)
      .set({ 
        ...input, 
        status: input.status as "active" | "inactive",
        updatedAt: new Date() 
      })
      .where(eq(schema.products.id, id));

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.products).where(eq(schema.products.id, id));
  }

  private transformProduct(data: typeof schema.products.$inferSelect): Product {
    return {
      ...data,
      imageUrl: data.imageUrl || null,
      description: data.description || null,
      createdAt: data.createdAt ? data.createdAt.toISOString() : "",
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : ""
    };
  }
}
