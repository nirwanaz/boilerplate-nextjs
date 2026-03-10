import { z } from "zod";

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: "active" | "unsubscribed";
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export const createSubscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(100).optional(),
  source: z.string().max(100).optional().default("website"),
});

export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>;
