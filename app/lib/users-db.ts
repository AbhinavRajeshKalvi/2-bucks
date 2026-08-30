import 'server-only';

import { MongoClient, Db, Collection } from 'mongodb';
import crypto from 'crypto';

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;

  phone?: string;
  phoneVerifiedAt?: string;

  aadhaarLast4?: string;
  aadhaarSubmittedAt?: string;

  aadhaarFrontPublicId?: string;
  aadhaarBackPublicId?: string;

  selfieSubmittedAt?: string;
  selfiePublicId?: string;

  createdAt: string;
};

export type SignupDraft = {
  id: string;

  name: string;
  email: string;
  passwordHash: string;

  createdAt: string;
  expiresAt: Date;

  phone?: string;
  phoneVerifiedAt?: string;

  aadhaarLast4?: string;
  aadhaarSubmittedAt?: string;

  aadhaarFrontPublicId?: string;
  aadhaarBackPublicId?: string;

  selfieSubmittedAt?: string;
  selfiePublicId?: string;
};

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(uri);

let dbPromise: Promise<Db> | null = null;

async function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => client.db());
  }

  return dbPromise;
}

async function getUsersCollection(): Promise<
  Collection<StoredUser>
> {
  const db = await getDb();
  return db.collection<StoredUser>('users');
}

async function getSignupDraftsCollection(): Promise<
  Collection<SignupDraft>
> {
  const db = await getDb();
  return db.collection<SignupDraft>('signup-drafts');
}

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────

export async function getUserByEmail(
  email: string
): Promise<StoredUser | null> {
  const users = await getUsersCollection();

  return users.findOne({
    email: email.trim().toLowerCase(),
  });
}

export async function getUserById(
  id: string
): Promise<StoredUser | null> {
  const users = await getUsersCollection();

  return users.findOne({ id });
}

export async function createUser(
  input: Omit<StoredUser, 'id' | 'createdAt'>
): Promise<StoredUser> {
  const users = await getUsersCollection();

  const normalizedEmail =
    input.email.trim().toLowerCase();

  const existing =
    await users.findOne({
      email: normalizedEmail,
    });

  if (existing) {
    throw new Error('EMAIL_TAKEN');
  }

  const newUser: StoredUser = {
    ...input,

    id: crypto.randomUUID(),

    email: normalizedEmail,

    createdAt:
      new Date().toISOString(),
  };

  await users.insertOne(newUser);

  return newUser;
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<StoredUser, 'id'>>
): Promise<StoredUser | null> {
  const users = await getUsersCollection();

  const result = await users.findOneAndUpdate(
    { id },
    { $set: patch },
    { returnDocument: 'after' }
  );

  return result ?? null;
}

// ─────────────────────────────────────────────
// SIGNUP DRAFTS
// ─────────────────────────────────────────────

export async function createSignupDraft(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<SignupDraft> {
  const drafts = await getSignupDraftsCollection();

  const now = new Date();

  const draft: SignupDraft = {
    id: crypto.randomUUID(),

    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,

    createdAt: now.toISOString(),

    // Draft expires after 30 minutes.
    expiresAt: new Date(
      now.getTime() + 30 * 60 * 1000
    ),
  };

  await drafts.insertOne(draft);

  return draft;
}

export async function getSignupDraft(
  id: string
): Promise<SignupDraft | null> {
  const drafts = await getSignupDraftsCollection();

  const draft = await drafts.findOne({ id });

  if (!draft) {
    return null;
  }

  // Don't allow expired drafts to continue.
  if (draft.expiresAt.getTime() < Date.now()) {
    await drafts.deleteOne({ id });
    return null;
  }

  return draft;
}

export async function updateSignupDraft(
  id: string,
  patch: Partial<Omit<SignupDraft, 'id'>>
): Promise<SignupDraft | null> {
  const drafts = await getSignupDraftsCollection();

  const result = await drafts.findOneAndUpdate(
    { id },
    { $set: patch },
    { returnDocument: 'after' }
  );

  return result ?? null;
}

export async function deleteSignupDraft(
  id: string
): Promise<void> {
  const drafts = await getSignupDraftsCollection();

  await drafts.deleteOne({ id });
}