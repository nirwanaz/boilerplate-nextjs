import { z } from "zod";

export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().min(1, "Currency is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
