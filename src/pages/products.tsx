import { useRouter } from 'next/router';
import ProductFilter from '~/components/ProductFilter';
import ProductList from '~/components/ProductList';
import { api } from '~/utils/api';

export default function Products() {
  const router = useRouter();
  const { k, cid } = router.query;

  function parseParam(k: unknown): string {
    if (typeof k === 'string') return k;
    if (Array.isArray(k) && typeof k[0] === 'string') return k[0];
    return '';
  }

  const keyword = parseParam(k);
  const categoryId = Number(parseParam(cid));

  const { data, isLoading, isError } = api.product.products.useQuery({
    ...(keyword && { keyword }),
    ...(categoryId && { categoryId }),
  });

  if (isLoading) return <div>Loading products 🔄</div>;
  if (isError) return <div>Error fetching products ❌</div>;

  const { products, mergedCategoryTrees } = data;

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-2 hidden h-9 w-screen flex-row items-center justify-center text-sm shadow-sm shadow-black md:flex">
        <div className="flex flex-grow lg:max-w-[1800px]">
          <div className="mx-4 flex-grow">
            {products.length} results for
            <span className="font-bold text-amber-700">{` "${keyword}"`}</span>
          </div>
          <div className="mx-4">some box</div>
        </div>
      </div>
      <div className="flex justify-center">
        <ProductFilter
          mergedCategoryTrees={mergedCategoryTrees}
          keyword={keyword}
        />
        <ProductList products={products} />
      </div>
    </div>
  );
}
