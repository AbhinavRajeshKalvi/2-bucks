import { loadEnvConfig } from '@next/env';
import { MongoClient } from 'mongodb';

loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'MONGODB_URI is not defined'
  );
}

const client = new MongoClient(uri);

const products = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description:
      '256GB Natural Titanium. A17 Pro chip, 48MP camera system, Action button.',
    value: 159900,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    category: 'Phones',
    totalSlots: 79950,
    endsAt: '2026-09-02T18:00:00.000Z',
    isHot: true,
    brand: 'Apple',
  },

  {
    id: '2',
    name: 'MacBook Pro 14"',
    description:
      'M3 Pro chip, 18GB RAM, 512GB SSD. Space Black finish.',
    value: 199900,
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    category: 'Laptops',
    totalSlots: 99950,
    endsAt: '2026-09-04T18:00:00.000Z',
    isHot: true,
    brand: 'Apple',
  },

  {
    id: '3',
    name: 'Royal Enfield Classic 350',
    description:
      'Halcyon Black. 349cc single-cylinder engine. ABS equipped.',
    value: 195000,
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: 'Vehicles',
    totalSlots: 97500,
    endsAt: '2026-09-10T18:00:00.000Z',
    isHot: false,
    brand: 'Royal Enfield',
  },

  {
    id: '4',
    name: 'Sony PlayStation 5',
    description:
      'PS5 Disc Edition with DualSense controller. 825GB SSD.',
    value: 54990,
    imageUrl:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',
    category: 'Gaming',
    totalSlots: 27495,
    endsAt: '2026-09-01T06:00:00.000Z',
    isHot: true,
    brand: 'Sony',
  },

  {
    id: '5',
    name: 'Samsung 65" QLED 4K TV',
    description:
      'QN85B Neo QLED. Quantum HDR 1500, Object Tracking Sound+.',
    value: 149900,
    imageUrl:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80',
    category: 'Electronics',
    totalSlots: 74950,
    endsAt: '2026-09-07T18:00:00.000Z',
    isHot: false,
    brand: 'Samsung',
  },

  {
    id: '6',
    name: 'Dell XPS 15',
    description:
      'Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD. OLED touch display.',
    value: 229900,
    imageUrl:
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    category: 'Laptops',
    totalSlots: 114950,
    endsAt: '2026-09-14T18:00:00.000Z',
    isHot: false,
    brand: 'Dell',
  },

  {
    id: '7',
    name: 'Dyson V15 Detect',
    description:
      'Cordless vacuum with laser dust detection. Up to 60 min runtime.',
    value: 52900,
    imageUrl:
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
    category: 'Appliances',
    totalSlots: 26450,
    endsAt: '2026-09-01T18:00:00.000Z',
    isHot: true,
    brand: 'Dyson',
  },

  {
    id: '8',
    name: 'Samsung Galaxy S24 Ultra',
    description:
      '12GB RAM, 256GB, Titanium Black. Built-in S Pen. 200MP camera.',
    value: 134999,
    imageUrl:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    category: 'Phones',
    totalSlots: 67499,
    endsAt: '2026-09-03T18:00:00.000Z',
    isHot: false,
    brand: 'Samsung',
  },
];

async function main() {
  try {
    await client.connect();

    const db = client.db();

    const collection =
      db.collection('products');

    for (const product of products) {
      const existing =
        await collection.findOne({
          id: product.id,
        });

      if (existing) {
        console.log(
          `Already exists: ${product.name}`
        );

        continue;
      }

      const now =
        new Date().toISOString();

      await collection.insertOne({
        ...product,
        createdAt: now,
        updatedAt: now,
      });

      console.log(
        `Created: ${product.name}`
      );
    }

    console.log(
      '\nProduct seeding completed.'
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(
    'Product seeding failed:',
    error
  );

  process.exit(1);
});