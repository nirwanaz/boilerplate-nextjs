import { z } from "zod";

export interface Newsletter {
  id: string;
  subject: string;
  body: string;
  status: "draft" | "sending" | "sent" | "failed";
  sentCount: number;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const createNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Body is required"),
});

export const updateNewsletterSchema = createNewsletterSchema.partial();

export type CreateNewsletterInput = z.infer<typeof createNewsletterSchema>;
export type UpdateNewsletterInput = z.infer<typeof updateNewsletterSchema>;
