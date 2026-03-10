import { z } from "zod";

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl: string | null;
  rating: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  quote: z.string().min(1, "Quote is required").max(1000),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5).default(5),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
