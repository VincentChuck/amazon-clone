import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductFilter from '~/components/ProductFilter';
import ProductList from '~/components/ProductList';
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

  if (isLoading) return <div>Loading products 🔄</div>;
  if (isError) return <div>Error fetching products ❌</div>;

  const { products, mergedCategoryTrees } = data;

  return (
    <div>
      <div className="mb-2 hidden h-9 w-screen flex-row items-center justify-center text-sm shadow-sm shadow-black md:flex">
        <div className="flex flex-grow lg:max-w-[1800px]">
          <div className="mx-4 flex-grow">
            {products.length} results for
            <span className="font-bold text-amber-700">{` "${keyword}"`}</span>
          </div>
          <div className="mx-4">some box</div>
        </div>
      </div>

      <div className="mx-3 flex justify-center pt-4">
        <ProductFilter {...{ mergedCategoryTrees, keyword, categoryId }} />
        <ProductList products={products} />
      </div>
    </div>
  );
}
