// lib/schemas/medicalSpecialty.ts
import { z } from "zod";

export const MedicalSpecialtySchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean().optional().nullable(),
  created_at: z.string().optional().nullable(), // ISO timestamp string
  category: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

export const MedicalSpecialtiesResponseSchema = z.array(MedicalSpecialtySchema);
