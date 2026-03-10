import { z } from "zod";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
}

export interface CheckoutItem {
  name: string;
  quantity: number;
  unitPrice: number; // in cents
}

// Manual checkout with custom items
export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().int().positive(),
    })
  ).min(1, "At least one item is required"),
  currency: z.string().length(3).default("usd"),
});

// Product-based checkout (new)
export const productCheckoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "At least one item is required"),
  currency: z.string().length(3).default("usd"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductCheckoutInput = z.infer<typeof productCheckoutSchema>;
