import { SupabaseClient } from "@supabase/supabase-js";
import type { Product, CreateProductInput, UpdateProductInput } from "../entities/product";

export class ProductRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(activeOnly = false): Promise<Product[]> {
    let builder = this.supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (activeOnly) {
      builder = builder.eq("status", "active");
    }

    const { data, error } = await builder;
    if (error) throw error;
    return data ?? [];
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
