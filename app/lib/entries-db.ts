import 'server-only';

import {
  MongoClient,
  Db,
  Collection,
} from 'mongodb';

import crypto from 'crypto';

export type EntryStatus =
  | 'paid'
  | 'refunded'
  | 'cancelled';

export type StoredEntry = {
  id: string;

  userId: string;
  productId: string;

  quantity: number;
  amount: number;

  razorpayOrderId: string;
  razorpayPaymentId?: string;

  status: EntryStatus;

  createdAt: string;
  updatedAt: string;
};

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'MONGODB_URI is not defined'
  );
}

const client = new MongoClient(uri);

let dbPromise: Promise<Db> | null = null;

async function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = client
      .connect()
      .then(() => client.db());
  }

  return dbPromise;
}

async function getEntriesCollection(): Promise<
  Collection<StoredEntry>
> {
  const db = await getDb();

  return db.collection<StoredEntry>(
    'entries'
  );
}

// ─────────────────────────────────────────────
// GET TOTAL PAID ENTRIES FOR A PRODUCT
// ─────────────────────────────────────────────

export async function getEntryCount(
  productId: string
): Promise<number> {
  const entries =
    await getEntriesCollection();

  const result =
    await entries
      .aggregate<{ total: number }>([
        {
          $match: {
            productId,
            status: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$quantity',
            },
          },
        },
      ])
      .toArray();

  return result[0]?.total ?? 0;
}

// ─────────────────────────────────────────────
// GET ALL COUNTS
// ─────────────────────────────────────────────

export async function getEntryCounts(): Promise<
  Record<string, number>
> {
  const entries =
    await getEntriesCollection();

  const results =
    await entries
      .aggregate<{
        _id: string;
        total: number;
      }>([
        {
          $match: {
            status: 'paid',
          },
        },
        {
          $group: {
            _id: '$productId',
            total: {
              $sum: '$quantity',
            },
          },
        },
      ])
      .toArray();

  return Object.fromEntries(
    results.map((item) => [
      item._id,
      item.total,
    ])
  );
}

// ─────────────────────────────────────────────
// CREATE ENTRY
// ─────────────────────────────────────────────

export async function createEntry(
  input: {
    userId: string;
    productId: string;
    quantity: number;
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }
): Promise<StoredEntry> {
  const entries =
    await getEntriesCollection();

  // Prevent the same Razorpay payment
  // from creating entries twice.
  const existing =
    await entries.findOne({
      razorpayPaymentId:
        input.razorpayPaymentId,
    });

  if (existing) {
    return existing;
  }

  const now =
    new Date().toISOString();

  const entry: StoredEntry = {
    id: crypto.randomUUID(),

    userId: input.userId,
    productId: input.productId,

    quantity: input.quantity,
    amount: input.amount,

    razorpayOrderId:
      input.razorpayOrderId,

    razorpayPaymentId:
      input.razorpayPaymentId,

    status: 'paid',

    createdAt: now,
    updatedAt: now,
  };

  await entries.insertOne(entry);

  return entry;
}

// ─────────────────────────────────────────────
// GET USER ENTRIES
// ─────────────────────────────────────────────

export async function getEntriesByUserId(
  userId: string
): Promise<StoredEntry[]> {
  const entries =
    await getEntriesCollection();

  return entries
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

// ─────────────────────────────────────────────
// GET ENTRIES FOR A PRODUCT
// ─────────────────────────────────────────────

export async function getEntriesByProductId(
  productId: string
): Promise<StoredEntry[]> {
  const entries =
    await getEntriesCollection();

  return entries
    .find({
      productId,
      status: 'paid',
    })
    .sort({ createdAt: -1 })
    .toArray();
}