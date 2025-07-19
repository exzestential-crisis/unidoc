import { z } from "zod";

export const GenderEnum = z.enum([
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]); // adjust to your actual enum
export const UserTypeEnum = z.enum(["admin", "user", "guest", "doctor"]); // adjust to your actual enum

export const userSchema = z.object({
  id: z.string().uuid(),

  email: z.string().email(),
  phone: z.string().optional().nullable(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  encrypted_password: z.string().optional().nullable(),

  profile_image_url: z.string().url().optional().nullable(),

  raw_app_meta_data: z.unknown().optional().nullable(),
  raw_user_meta_data: z.unknown().optional().nullable(),

  is_super_admin: z.boolean().optional().nullable(),
  is_sso_user: z.boolean().default(false),
  is_anonymous: z.boolean().default(false),
  is_verified: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),

  gender: GenderEnum.optional().nullable(),
  user_type: UserTypeEnum,

  date_of_birth: z.string().optional().nullable(), // or z.date() if you convert it beforehand

  email_change_confirm_status: z.number().int().optional().default(0),

  created_at: z.string().optional().nullable(), // or z.date()
  updated_at: z.string().optional().nullable(),

  last_login: z.string().optional().nullable(),
  confirmation_sent_at: z.string().optional().nullable(),
  recovery_sent_at: z.string().optional().nullable(),
  email_change_sent_at: z.string().optional().nullable(),
  last_sign_in_at: z.string().optional().nullable(),
  phone_confirmed_at: z.string().optional().nullable(),
  phone_change_sent_at: z.string().optional().nullable(),
  confirmed_at: z.string().optional().nullable(),
  banned_until: z.string().optional().nullable(),
  reauthentication_sent_at: z.string().optional().nullable(),
  deleted_at: z.string().optional().nullable(),

  email_confirmed_at: z.string().optional().nullable(),
  invited_at: z.string().optional().nullable(),

  email_change_token_current: z.string().optional().nullable().default(""),
  email_change_token_new: z.string().optional().nullable(),
  confirmation_token: z.string().optional().nullable(),
  reauthentication_token: z.string().optional().nullable().default(""),
  recovery_token: z.string().optional().nullable(),

  phone_change: z.string().optional().nullable().default(""),
  phone_change_token: z.string().optional().nullable().default(""),

  email_change: z.string().optional().nullable(),

  aud: z.string().optional().nullable(),
  role: z.string().optional().nullable(),

  instance_id: z.string().uuid().optional().nullable(),
});

export type User = z.infer<typeof userSchema>;
