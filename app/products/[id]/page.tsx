import { getEntryCount } from '@/app/lib/entries-db';
import { getProductById } from '@/app/lib/products-db';
import ProductPageClient from './ProductPageClient';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product =
    await getProductById(id);

  if (!product) {
    return (
      <ProductPageClient
        product={null}
        filled={0}
      />
    );
  }

  const filled =
    await getEntryCount(product.id);

  return (
    <ProductPageClient
      product={product}
      filled={filled}
    />
  );
}