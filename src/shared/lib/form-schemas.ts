import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter")
      .transform((v) => v.trim()),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid")
      .transform((v) => v.trim().toLowerCase()),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Profile Schema ──────────────────────────────────────────────

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .transform((v) => v.trim()),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ─── General Settings Schema ─────────────────────────────────────

export const siteNameSchema = z.object({
  siteName: z
    .string()
    .min(1, "Nama situs wajib diisi")
    .max(100, "Nama situs maksimal 100 karakter")
    .transform((v) => v.trim()),
});

export type SiteNameInput = z.infer<typeof siteNameSchema>;
