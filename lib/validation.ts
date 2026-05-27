import { z } from "zod";

// ─── Onboarding ────────────────────────────────────────────────────

export const onboardingSchema = z.object({
  fullName:   z.string().min(2, "Full name must be at least 2 characters").max(80),
  discipline: z.string().optional(),
  org:        z.string().max(100).optional(),
  country:    z.string().max(60).optional(),
  topics:     z.array(z.string()).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

// ─── Password change ───────────────────────────────────────────────

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordInput = z.infer<typeof passwordSchema>;

// ─── Profile settings ──────────────────────────────────────────────

export const profileSettingsSchema = z.object({
  full_name:    z.string().min(2, "Name must be at least 2 characters").max(80).or(z.literal("")),
  job_title:    z.string().max(100).optional(),
  organisation: z.string().max(100).optional(),
  country:      z.string().max(60).optional(),
  linkedin_url: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .or(z.literal(""))
    .optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
