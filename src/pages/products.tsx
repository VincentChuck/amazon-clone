import { useRouter } from 'next/router';
import ProductList from '~/components/ProductList';
import { api } from '~/utils/api';

export default function Products() {
  const router = useRouter();
  const { k } = router.query;

  function parseK(k: unknown): string {
    if (typeof k === 'string') return k;
    if (Array.isArray(k) && typeof k[0] === 'string') return k[0];
    return '';
  }

  const keyword = parseK(k);

  const { data, isLoading, isError } = api.product.products.useQuery({
    keyword,
  });

  if (isLoading) return <div>Loading products 🔄</div>;
  if (isError) return <div>Error fetching products ❌</div>;

  const { products, mergedCategoryTrees } = data;

  return (
    <div>
      <ProductList {...{ products, mergedCategoryTrees }} />
    </div>
  );
}
