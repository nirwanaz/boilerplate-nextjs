import { ProductRepository } from "../repositories/product.repository";
import { createProductSchema, updateProductSchema } from "../entities/product";
import type { CreateProductInput, UpdateProductInput, Product } from "../entities/product";
import { hasPermission } from "@/shared/auth/rbac";
import { getSession } from "@/shared/auth/dal";
import { activityLogService } from "@/domains/activity-logs/services/activity-log.service";

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async list(activeOnly = false): Promise<Product[]> {
    if (!activeOnly) {
      const session = await getSession();
      if (!session || !hasPermission(session.profile.role, ["admin"])) {
        throw new Error("Forbidden");
      }
    }
    return this.repository.findAll(activeOnly);
  }

  async getById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const session = await getSession();
    if (!session || !hasPermission(session.profile.role, ["admin"])) {
      throw new Error("Forbidden");
    }
    
    const validated = createProductSchema.parse(input);
    const product = await this.repository.create(validated);

    await activityLogService.record({
      action: "CREATE_PRODUCT",
      entityType: "product",
      entityId: product.id,
      details: JSON.stringify({ name: product.name }),
    });

    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const session = await getSession();
    if (!session || !hasPermission(session.profile.role, ["admin"])) {
      throw new Error("Forbidden");
    }

    const product = await this.repository.findById(id);
    if (!product) throw new Error("Product not found");

    const validated = updateProductSchema.parse(input);
    const updated = await this.repository.update(id, validated);

    await activityLogService.record({
      action: "UPDATE_PRODUCT",
      entityType: "product",
      entityId: id,
      details: JSON.stringify({ name: updated.name, changes: validated }),
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const session = await getSession();
    if (!session || !hasPermission(session.profile.role, ["admin"])) {
      throw new Error("Forbidden");
    }

    const product = await this.repository.findById(id);
    if (!product) throw new Error("Product not found");

    await this.repository.delete(id);

    await activityLogService.record({
      action: "DELETE_PRODUCT",
      entityType: "product",
      entityId: id,
      details: JSON.stringify({ name: product.name }),
    });
  }
}
