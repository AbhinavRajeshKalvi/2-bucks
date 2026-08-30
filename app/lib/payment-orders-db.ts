import 'server-only';

import {
  MongoClient,
  Db,
  Collection,
} from 'mongodb';

import crypto from 'crypto';

export type PaymentOrderStatus =
  | 'created'
  | 'paid'
  | 'failed'
  | 'cancelled';

export type StoredPaymentOrder = {
  id: string;

  userId: string;
  productId: string;

  quantity: number;
  amount: number;

  razorpayOrderId: string;
  razorpayPaymentId?: string;

  status: PaymentOrderStatus;

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

async function getPaymentOrdersCollection(): Promise<
  Collection<StoredPaymentOrder>
> {
  const db = await getDb();

  return db.collection<StoredPaymentOrder>(
    'payment-orders'
  );
}

// ─────────────────────────────────────────────
// CREATE PAYMENT ORDER RECORD
// ─────────────────────────────────────────────

export async function createPaymentOrderRecord(
  input: {
    userId: string;
    productId: string;
    quantity: number;
    amount: number;
    razorpayOrderId: string;
  }
): Promise<StoredPaymentOrder> {
  const orders =
    await getPaymentOrdersCollection();

  const now =
    new Date().toISOString();

  const order: StoredPaymentOrder = {
    id: crypto.randomUUID(),

    userId: input.userId,
    productId: input.productId,

    quantity: input.quantity,
    amount: input.amount,

    razorpayOrderId:
      input.razorpayOrderId,

    status: 'created',

    createdAt: now,
    updatedAt: now,
  };

  await orders.insertOne(order);

  return order;
}

// ─────────────────────────────────────────────
// GET BY RAZORPAY ORDER ID
// ─────────────────────────────────────────────

export async function getPaymentOrderByRazorpayId(
  razorpayOrderId: string
): Promise<StoredPaymentOrder | null> {
  const orders =
    await getPaymentOrdersCollection();

  return orders.findOne({
    razorpayOrderId,
  });
}

// ─────────────────────────────────────────────
// MARK AS PAID
// ─────────────────────────────────────────────

export async function markPaymentOrderPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<StoredPaymentOrder | null> {
  const orders =
    await getPaymentOrdersCollection();

  const result =
    await orders.findOneAndUpdate(
      { razorpayOrderId },
      {
        $set: {
          status: 'paid',
          razorpayPaymentId,
          updatedAt:
            new Date().toISOString(),
        },
      },
      {
        returnDocument: 'after',
      }
    );

  return result ?? null;
}

// ─────────────────────────────────────────────
// MARK AS FAILED
// ─────────────────────────────────────────────

export async function markPaymentOrderFailed(
  razorpayOrderId: string
): Promise<void> {
  const orders =
    await getPaymentOrdersCollection();

  await orders.updateOne(
    { razorpayOrderId },
    {
      $set: {
        status: 'failed',
        updatedAt:
          new Date().toISOString(),
      },
    }
  );
}