import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Order, OrderItem, OrderStatus, CheckoutItem } from "../entities/payment";

export class PaymentRepository {
  async findAll(userId?: string): Promise<Order[]> {
    const whereClause = userId ? eq(schema.orders.userId, userId) : undefined;

    const data = await db.query.orders.findMany({
      where: whereClause,
      orderBy: [desc(schema.orders.createdAt)]
    });

    return data.map((item) => this.transformOrder(item));
  }

  async findById(id: string): Promise<Order | null> {
    const data = await db.query.orders.findFirst({
      where: eq(schema.orders.id, id)
    });

    return data ? this.transformOrder(data) : null;
  }

  async findByStripeSession(sessionId: string): Promise<Order | null> {
    const data = await db.query.orders.findFirst({
      where: eq(schema.orders.stripeSessionId, sessionId)
    });

    return data ? this.transformOrder(data) : null;
  }

  async create(input: {
    userId: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: OrderStatus;
  }): Promise<Order> {
    const id = crypto.randomUUID();
    await db.insert(schema.orders).values({
      id,
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      stripeSessionId: input.stripeSessionId,
      status: input.status as "pending" | "paid" | "failed" | "refunded",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return (await this.findById(id))!;
  }

  async createItems(orderId: string, items: CheckoutItem[]): Promise<OrderItem[]> {
    const itemIds: string[] = [];
    
    // Drizzle doesn't return all inserted rows with .select() on all drivers easily in a batch sometimes depending on the setup, 
    // but Neon should support returning. However, to keep it simple and safe:
    const values = items.map((item) => {
      const id = crypto.randomUUID();
      itemIds.push(id);
      return {
        id,
        orderId: orderId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        createdAt: new Date(),
      };
    });

    await db.insert(schema.orderItems).values(values);

    return this.getOrderItems(orderId);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await db.update(schema.orders)
      .set({ 
        status: status as "pending" | "paid" | "failed" | "refunded", 
        updatedAt: new Date() 
      })
      .where(eq(schema.orders.id, id));

    return (await this.findById(id))!;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const data = await db.query.orderItems.findMany({
      where: eq(schema.orderItems.orderId, orderId)
    });

    return data.map((item) => this.transformOrderItem(item));
  }

  private transformOrder(data: typeof schema.orders.$inferSelect): Order {
    return {
      ...data,
      updatedAt: data.updatedAt.toISOString(),
      createdAt: data.createdAt.toISOString()
    };
  }

  private transformOrderItem(data: typeof schema.orderItems.$inferSelect): OrderItem {
    return {
      ...data,
      createdAt: data.createdAt.toISOString()
    };
  }
}
