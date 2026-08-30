'use server';

import bcrypt from 'bcryptjs';

import {
  createSession,
  createSignupDraft,
  deleteSession,
  deleteSignupDraft,
} from '@/app/lib/session';

import {
  createUser,
  getUserByEmail,
} from '@/app/lib/users-db';

import { z } from 'zod';

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.'),

  email: z
    .string()
    .trim()
    .email('Enter a valid email address.'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.'),
});

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.'),

  password: z
    .string()
    .min(1, 'Enter your password.'),
});

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type AuthResult =
  | {
      success: true;
      user?: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
      };
    }
  | {
      success: false;
      message?: string;
      fieldErrors?: Record<
        string,
        string[]
      >;
    };

// ─────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────

export async function signup(
  input: {
    name: string;
    email: string;
    password: string;
  }
): Promise<AuthResult> {
  const validated =
    SignupSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors:
        validated.error.flatten()
          .fieldErrors,
    };
  }

  const {
    name,
    email,
    password,
  } = validated.data;

  try {
    // Check whether an account already exists.
    const existingUser =
      await getUserByEmail(email);

    if (existingUser) {
      return {
        success: false,
        message:
          'An account with this email already exists.',
      };
    }

    // Hash the password before putting it
    // into the encrypted temporary signup cookie.
    const passwordHash =
      await bcrypt.hash(password, 10);

    // Store signup progress temporarily.
    //
    // IMPORTANT:
    // This does NOT create a MongoDB user.
    await createSignupDraft({
      draftId: crypto.randomUUID(),

      name,
      email: email.toLowerCase(),

      passwordHash,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      'Signup error:',
      error
    );

    return {
      success: false,
      message:
        'Unable to create your signup session. Please try again.',
    };
  }
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export async function login(
  input: {
    email: string;
    password: string;
  }
): Promise<AuthResult> {
  const validated =
    LoginSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      fieldErrors:
        validated.error.flatten()
          .fieldErrors,
    };
  }

  const {
    email,
    password,
  } = validated.data;

  try {
    const user =
      await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message:
          'Incorrect email or password.',
      };
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatches) {
      return {
        success: false,
        message:
          'Incorrect email or password.',
      };
    }

    // A completed account gets a permanent session.
    await createSession(user.id);

    // Remove any leftover signup draft.
    await deleteSignupDraft();

    return {
      success: true,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error(
      'Login error:',
      error
    );

    return {
      success: false,
      message:
        'Unable to sign in right now. Please try again.',
    };
  }
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────

export async function logout(): Promise<void> {
  await deleteSession();
  await deleteSignupDraft();
}