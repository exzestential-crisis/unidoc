// lib/schemas/doctor-profile.ts
import { z } from "zod";

// Define the subscription tier enum based on your USER-DEFINED type
export const SubscriptionTierSchema = z.enum([
  "free",
  "basic",
  "premium",
  "enterprise",
]);

export const UserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  gender: z.string().nullable().optional(), // Add gender if you're selecting it
});

export const EducationSchema = z
  .object({
    degree: z.string().optional().nullable(),
    institution: z.string().optional().nullable(),
    year: z.number().optional().nullable(),
    field: z.string().optional().nullable(),
  })
  .array()
  .optional()
  .nullable();

export const CertificationSchema = z
  .object({
    name: z.string().optional().nullable(),
    issuer: z.string().optional().nullable(),
    year: z.number().optional().nullable(),
    expiry: z.string().optional().nullable(),
  })
  .array()
  .optional()
  .nullable();

export const LanguagesSpokenSchema = z.string().array().optional().nullable();

export const VerificationDocumentsSchema = z
  .object({
    license: z.string().optional().nullable(),
    degree: z.string().optional().nullable(),
    certificates: z.string().array().optional().nullable(),
  })
  .optional()
  .nullable();

export const DoctorProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable().optional(),
  specialization_id: z.string().uuid().nullable().optional(),
  license_number: z.string().optional().nullable(),
  years_experience: z.number().int().nullable().optional(),
  consultation_fee: z.number().nullable().optional(),
  education: EducationSchema.optional().nullable(),
  certifications: CertificationSchema.optional().nullable(),
  languages_spoken: LanguagesSpokenSchema.optional().nullable(),
  bio: z.string().nullable().optional(),
  is_verified: z.boolean().nullable().optional(),
  verification_documents: VerificationDocumentsSchema.optional().nullable(),
  rating_average: z.number().nullable().optional(),
  total_reviews: z.number().int().nullable().optional(),
  total_appointments: z.number().int().nullable().optional(),
  subscription_tier: SubscriptionTierSchema.nullable().optional(),
  subscription_expires_at: z.string().nullable().optional(),
  is_accepting_patients: z.boolean().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  // ADD THIS LINE - this is what was missing!
  users: UserSchema.nullable().optional(),
});

// Array of doctor profiles
export const DoctorProfilesResponseSchema = z.array(DoctorProfileSchema);

// Export types
export type DoctorProfile = z.infer<typeof DoctorProfileSchema>;
export type DoctorProfilesResponse = z.infer<
  typeof DoctorProfilesResponseSchema
>;
export type User = z.infer<typeof UserSchema>; // Add this export
export type SubscriptionTier = z.infer<typeof SubscriptionTierSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type VerificationDocuments = z.infer<typeof VerificationDocumentsSchema>;
