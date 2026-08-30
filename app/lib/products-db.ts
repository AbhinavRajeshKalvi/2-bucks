import 'server-only';

import {
  MongoClient,
  Db,
  Collection,
} from 'mongodb';

import crypto from 'crypto';

import type {
  Product,
  Category,
} from './data';

export type StoredProduct = Product & {
  createdAt: string;
  updatedAt: string;
};

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'MONGODB_URI is not defined'
  );
}

const client =
  new MongoClient(uri);

let dbPromise: Promise<Db> | null =
  null;

async function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = client
      .connect()
      .then(() => client.db());
  }

  return dbPromise;
}

async function getProductsCollection(): Promise<
  Collection<StoredProduct>
> {
  const db = await getDb();

  return db.collection<StoredProduct>(
    'products'
  );
}

// ─────────────────────────────────────────────
// GET ALL PRODUCTS
// ─────────────────────────────────────────────

export async function getProducts(): Promise<
  StoredProduct[]
> {
  const products =
    await getProductsCollection();

  return products
    .find(
      {},
      {
        projection: {
          _id: 0,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();
}

// ─────────────────────────────────────────────
// GET PRODUCT BY ID
// ─────────────────────────────────────────────

export async function getProductById(
  id: string
): Promise<StoredProduct | null> {
  const products =
    await getProductsCollection();

  return products.findOne(
    { id },
    {
      projection: {
        _id: 0,
      },
    }
  );
}

// ─────────────────────────────────────────────
// CREATE PRODUCT
// ─────────────────────────────────────────────

export type CreateProductInput = {
  id?: string;

  name: string;
  description: string;
  value: number;
  imageUrl: string;
  category: Category;
  totalSlots: number;
  endsAt: string;
  isHot: boolean;
  brand: string;
};

export async function createProduct(
  input: CreateProductInput
): Promise<StoredProduct> {
  const products =
    await getProductsCollection();

  const now =
    new Date().toISOString();

  const product: StoredProduct = {
    id:
      input.id ??
      crypto.randomUUID(),

    name: input.name.trim(),

    description:
      input.description.trim(),

    value: input.value,

    imageUrl: input.imageUrl,

    category: input.category,

    totalSlots:
      input.totalSlots,

    endsAt: input.endsAt,

    isHot: input.isHot,

    brand: input.brand.trim(),

    createdAt: now,

    updatedAt: now,
  };

  await products.insertOne(
    product
  );

  return product;
}

// ─────────────────────────────────────────────
// UPDATE PRODUCT
// ─────────────────────────────────────────────

export async function updateProduct(
  id: string,
  patch: Partial<CreateProductInput>
): Promise<StoredProduct | null> {
  const products =
    await getProductsCollection();

  const cleanedPatch:
    Partial<CreateProductInput> =
    {
      ...patch,
    };

  if (cleanedPatch.name !== undefined) {
    cleanedPatch.name =
      cleanedPatch.name.trim();
  }

  if (
    cleanedPatch.description !==
    undefined
  ) {
    cleanedPatch.description =
      cleanedPatch.description.trim();
  }

  if (
    cleanedPatch.brand !== undefined
  ) {
    cleanedPatch.brand =
      cleanedPatch.brand.trim();
  }

  const result =
    await products.findOneAndUpdate(
      { id },
      {
        $set: {
          ...cleanedPatch,

          updatedAt:
            new Date().toISOString(),
        },
      },
      {
        returnDocument: 'after',

        projection: {
          _id: 0,
        },
      }
    );

  return result ?? null;
}

// ─────────────────────────────────────────────
// DELETE PRODUCT
// ─────────────────────────────────────────────

export async function deleteProduct(
  id: string
): Promise<boolean> {
  const products =
    await getProductsCollection();

  const result =
    await products.deleteOne({
      id,
    });

  return result.deletedCount === 1;
}