import { SupabaseClient } from "@supabase/supabase-js";
import { ProductRepository } from "../repositories/product.repository";
import { createProductSchema, updateProductSchema } from "../entities/product";
import type { CreateProductInput, UpdateProductInput, Product } from "../entities/product";
import { requireRole } from "@/shared/auth/rbac";

export class ProductService {
  private repository: ProductRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new ProductRepository(supabase);
  }

  async list(activeOnly = false): Promise<Product[]> {
    return this.repository.findAll(activeOnly);
  }

  async getById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async create(input: CreateProductInput): Promise<Product> {
    // Only admins can create products
    await requireRole(this.supabase, ["admin"]);
    
    const validated = createProductSchema.parse(input);
    return this.repository.create(validated);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    // Only admins can update products
    await requireRole(this.supabase, ["admin"]);

    const product = await this.repository.findById(id);
    if (!product) throw new Error("Product not found");

    const validated = updateProductSchema.parse(input);
    return this.repository.update(id, validated);
  }

  async delete(id: string): Promise<void> {
    // Only admins can delete products
    await requireRole(this.supabase, ["admin"]);

    const product = await this.repository.findById(id);
    if (!product) throw new Error("Product not found");

    return this.repository.delete(id);
  }
}
