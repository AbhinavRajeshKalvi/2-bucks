export type Category = 'Electronics' | 'Laptops' | 'Vehicles' | 'Appliances' | 'Phones' | 'Gaming';

export interface Product {
  id: string;
  name: string;
  description: string;
  value: number; // in INR
  imageUrl: string;
  category: Category;
  totalSlots: number; // = value (since ₹2/entry, max entries = value/2... actually fixed as value)
  filledSlots: number;
  endsAt: string; // ISO string
  isHot: boolean;
  brand: string;
}

export const ENTRY_PRICE = 2; // ₹2 per entry

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: '256GB Natural Titanium. A17 Pro chip, 48MP camera system, Action button.',
    value: 159900,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    category: 'Phones',
    totalSlots: 79950,
    filledSlots: 71200,
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: true,
    brand: 'Apple',
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    description: 'M3 Pro chip, 18GB RAM, 512GB SSD. Space Black finish.',
    value: 199900,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    category: 'Laptops',
    totalSlots: 99950,
    filledSlots: 54300,
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: true,
    brand: 'Apple',
  },
  {
    id: '3',
    name: 'Royal Enfield Classic 350',
    description: 'Halcyon Black. 349cc single-cylinder engine. ABS equipped.',
    value: 195000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: 'Vehicles',
    totalSlots: 97500,
    filledSlots: 12400,
    endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: false,
    brand: 'Royal Enfield',
  },
  {
    id: '4',
    name: 'Sony PlayStation 5',
    description: 'PS5 Disc Edition with DualSense controller. 825GB SSD.',
    value: 54990,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',
    category: 'Gaming',
    totalSlots: 27495,
    filledSlots: 26100,
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    isHot: true,
    brand: 'Sony',
  },
  {
    id: '5',
    name: 'Samsung 65" QLED 4K TV',
    description: 'QN85B Neo QLED. Quantum HDR 1500, Object Tracking Sound+.',
    value: 149900,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80',
    category: 'Electronics',
    totalSlots: 74950,
    filledSlots: 31200,
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: false,
    brand: 'Samsung',
  },
  {
    id: '6',
    name: 'Dell XPS 15',
    description: 'Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD. OLED touch display.',
    value: 229900,
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    category: 'Laptops',
    totalSlots: 114950,
    filledSlots: 8900,
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: false,
    brand: 'Dell',
  },
  {
    id: '7',
    name: 'Dyson V15 Detect',
    description: 'Cordless vacuum with laser dust detection. Up to 60 min runtime.',
    value: 52900,
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
    category: 'Appliances',
    totalSlots: 26450,
    filledSlots: 19800,
    endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: true,
    brand: 'Dyson',
  },
  {
    id: '8',
    name: 'Samsung Galaxy S24 Ultra',
    description: '12GB RAM, 256GB, Titanium Black. Built-in S Pen. 200MP camera.',
    value: 134999,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    category: 'Phones',
    totalSlots: 67499,
    filledSlots: 41000,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isHot: false,
    brand: 'Samsung',
  },
];

export const recentWinners = [
  { name: 'Priya S.', city: 'Mumbai', product: 'AirPods Pro 2', amount: '₹24,900', time: '2h ago' },
  { name: 'Rahul K.', city: 'Bangalore', product: 'OnePlus 12', amount: '₹64,999', time: '5h ago' },
  { name: 'Anita M.', city: 'Delhi', product: 'Nintendo Switch', amount: '₹29,999', time: '1d ago' },
  { name: 'Vikram P.', city: 'Hyderabad', product: 'Sony WH-1000XM5', amount: '₹29,990', time: '1d ago' },
  { name: 'Sneha R.', city: 'Chennai', product: 'iPad Air 5', amount: '₹59,900', time: '2d ago' },
  { name: 'Arjun D.', city: 'Pune', product: 'Redmi TV 55"', amount: '₹42,999', time: '2d ago' },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getFillPercentage(filled: number, total: number): number {
  return Math.round((filled / total) * 100);
}

export function getTimeRemaining(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return 'Closed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export function getFillColor(pct: number): string {
  if (pct >= 90) return '#E8364F';
  if (pct >= 60) return '#F5C518';
  return '#22C55E';
}
