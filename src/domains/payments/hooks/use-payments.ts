"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { Order, CheckoutInput } from "../entities/payment";

const ORDERS_KEY = ["orders"];

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ORDERS_KEY,
    queryFn: async () => {
      const res = await fetch("/api/payments/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: async () => {
      const res = await fetch(`/api/payments/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (input: CheckoutInput) => {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create checkout");
      }
      const data = await res.json();
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
      return data;
    },
  });
}

export function useRefundOrder() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch("/api/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to refund order");
      }
      return res.json();
    },
  });
}
