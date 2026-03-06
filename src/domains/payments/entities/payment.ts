import { z } from "zod";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface CheckoutItem {
  name: string;
  quantity: number;
  unit_price: number; // in cents
}

// Manual checkout with custom items
export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().int().positive(),
      unit_price: z.number().int().positive(),
    })
  ).min(1, "At least one item is required"),
  currency: z.string().length(3).default("usd"),
});

// Product-based checkout (new)
export const productCheckoutSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "At least one item is required"),
  currency: z.string().length(3).default("usd"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductCheckoutInput = z.infer<typeof productCheckoutSchema>;
