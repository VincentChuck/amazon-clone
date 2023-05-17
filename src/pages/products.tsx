import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductFilter from '~/components/ProductFilter';
import ProductList from '~/components/ProductList';
import SortBar from '~/components/SortBar';
import { api } from '~/utils/api';

export default function Products() {
  const router = useRouter();
  const [pageLoaded, setPageLoaded] = useState(false);

  function parseParam(k: unknown): string {
    if (typeof k === 'string') return k;
    if (Array.isArray(k) && typeof k[0] === 'string') return k[0];
    return '';
  }

  useEffect(() => {
    if (!router.isReady) return;
    setPageLoaded(true);
  }, [router.isReady]);

  const { k, cid } = router.query;

  const keyword = parseParam(k);
  const categoryId = Number(parseParam(cid));

  const { data, isLoading, isError } = api.product.products.useQuery(
    {
      ...(keyword && { keyword }),
      ...(categoryId && { categoryId }),
    },
    { enabled: pageLoaded, refetchOnWindowFocus: false }
  );

  if (isLoading) return <div className="text-center">Loading products 🔄</div>;
  if (isError)
    return <div className="text-center">Error fetching products ❌</div>;

  const { products, mergedCategoryTrees } = data;

  return (
    <main>
      <SortBar numberOfProducts={products.length} keyword={keyword} />

      <div className="mx-3 flex justify-center py-4">
        <div className="flex flex-grow justify-center lg:max-w-[1800px]">
          <ProductFilter {...{ mergedCategoryTrees, keyword, categoryId }} />
          <ProductList products={products} />
        </div>
      </div>
    </main>
  );
}
