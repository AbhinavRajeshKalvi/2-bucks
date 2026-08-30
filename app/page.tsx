import { getEntryCounts } from './lib/entries-db';
import { getProducts } from './lib/products-db';
import HomePageClient from './components/HomePageClient';

export default async function HomePage() {
  const [products, entryCounts] =
    await Promise.all([
      getProducts(),
      getEntryCounts(),
    ]);

  return (
    <HomePageClient
      products={products}
      entryCounts={entryCounts}
    />
  );
}