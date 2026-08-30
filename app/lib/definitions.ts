import { z } from 'zod';

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Name must be at least 2 characters.' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ error: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters.' }),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ error: 'Please enter a valid email address.' }),
  password: z.string().min(1, { error: 'Password is required.' }),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// Public-safe user shape — never includes the password hash.
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResult =
  | { success: true; user: SafeUser }
  | {
      success: false;
      message?: string;
      fieldErrors?: Partial<Record<'name' | 'email' | 'password', string[]>>;
    };
