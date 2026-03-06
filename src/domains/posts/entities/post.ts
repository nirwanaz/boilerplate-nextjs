import { z } from "zod";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1).max(255).optional(), // Auto-generated if not provided
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500).optional(),
  featured_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  category_ids: z.array(z.string().uuid()).optional().default([]),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  featured_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).optional(),
  category_ids: z.array(z.string().uuid()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
