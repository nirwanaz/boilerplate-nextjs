import { SupabaseClient } from "@supabase/supabase-js";
import type { Order, OrderItem, OrderStatus, CheckoutItem } from "../entities/payment";

export class PaymentRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(userId?: string): Promise<Order[]> {
    let builder = this.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      builder = builder.eq("user_id", userId);
    }

    const { data, error } = await builder;
    if (error) throw error;
    return data ?? [];
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByStripeSession(sessionId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async create(input: {
    user_id: string;
    amount: number;
    currency: string;
    stripe_session_id: string;
    status: OrderStatus;
  }): Promise<Order> {
    const { data, error } = await this.supabase
      .from("orders")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createItems(orderId: string, items: CheckoutItem[]): Promise<OrderItem[]> {
    const rows = items.map((item) => ({
      order_id: orderId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { data, error } = await this.supabase
      .from("order_items")
      .insert(rows)
      .select();

    if (error) throw error;
    return data ?? [];
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await this.supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data ?? [];
  }
}
