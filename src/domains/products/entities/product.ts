import { z } from "zod";

export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number; // in cents
  currency: string;
  status: ProductStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  price: z.number().int().positive("Price must be positive"),
  currency: z.string().length(3).default("usd"),
  status: z.enum(["active", "inactive"]).default("active"),
  image_url: z.string().url().optional().or(z.literal("")),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().or(z.literal("")),
  price: z.number().int().positive().optional(),
  currency: z.string().length(3).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  image_url: z.string().url().optional().or(z.literal("")),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
