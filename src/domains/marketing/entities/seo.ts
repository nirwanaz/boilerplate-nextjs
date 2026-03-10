import { z } from "zod";

export interface SeoSetting {
  id: string;
  pagePath: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  keywords: string | null;
  createdAt: string;
  updatedAt: string;
}

export const upsertSeoSchema = z.object({
  pagePath: z.string().min(1, "Page path is required"),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
  keywords: z.string().max(500).optional().or(z.literal("")),
});

export type UpsertSeoInput = z.infer<typeof upsertSeoSchema>;
