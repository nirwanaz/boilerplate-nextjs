import { z } from "zod";

export interface LandingContent {
  id: string;
  section: string;
  key: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const upsertLandingContentSchema = z.object({
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
  sortOrder: z.number().int().default(0),
});

export type UpsertLandingContentInput = z.infer<typeof upsertLandingContentSchema>;
