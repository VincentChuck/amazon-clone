import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MobileFilter from '~/components/MobileFilter';
import ProductFilter from '~/components/ProductFilter';
import ProductList from '~/components/ProductList';
import SortBar from '~/components/SortBar';
import type { CategoryTree } from '~/types';
import { api } from '~/utils/api';
import { RESULTSPERPAGE, type SortOption } from '~/utils/constants';
import { parseRouterParam } from '~/utils/helpers';

export default function Products() {
  const router = useRouter();
  const [pageLoaded, setPageLoaded] = useState(false);

  const { k, cid, page } = router.query;
  const keyword = parseRouterParam(k);
  const categoryId = Number(parseRouterParam(cid));
  const pageParam = Number(parseRouterParam(page)) || 1;
  const pageIndex = pageParam - 1;
  const [sortBy, setSortBy] = useState<SortOption>('');

  useEffect(() => {
    if (!router.isReady) return;
    setPageLoaded(true);
  }, [router.isReady]);

  const details = api.product.getBatchDetails.useQuery(
    {
      ...(keyword && { keyword }),
      ...(categoryId && { categoryId }),
    },
    {
      enabled: pageLoaded,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  let mergedCategoryTrees: CategoryTree[] = [];
  let numberOfResults = 0;

  if (details.data) {
    mergedCategoryTrees = details.data.mergedCategoryTrees;
    numberOfResults = details.data.numberOfResults;
  }

  const skip = pageIndex * RESULTSPERPAGE;
  const productsOnPageIndex = `${skip + 1}-${Math.min(
    skip + RESULTSPERPAGE,
    numberOfResults
  )}`;

  const { data, isLoading, isError, isFetching, isPreviousData } =
    api.product.getBatch.useQuery(
      {
        ...(keyword && { keyword }),
        ...(categoryId && { categoryId }),
        resultPerPage: RESULTSPERPAGE,
        skip,
        ...(sortBy && { sortBy }),
      },
      {
        enabled: pageLoaded,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
      }
    );

  if (isLoading) return <div className="text-center">Loading products 🔄</div>;
  if (isError)
    return <div className="text-center">Error fetching products ❌</div>;

  const { products, hasMore } = data;

  function handleNextPage() {
    if (!isPreviousData && hasMore) {
      void router.push(
        { query: { ...router.query, page: pageParam + 1 } },
        undefined,
        { shallow: true }
      );
    }
  }

  function handlePreviousPage() {
    void router.push(
      { query: { ...router.query, page: pageParam - 1 } },
      undefined,
      { shallow: true }
    );
  }

  return !pageLoaded ? null : (
    <div className="flex-grow">
      <SortBar
        productsOnPageIndex={productsOnPageIndex}
        numberOfResults={numberOfResults}
        keyword={keyword}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MobileFilter
        numberOfResults={numberOfResults}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="mx-3 flex justify-center py-4">
        <div className="flex flex-grow justify-center md:max-w-[1800px]">
          <ProductFilter {...{ mergedCategoryTrees, keyword, categoryId }} />
          <ProductList products={products} />
        </div>
      </div>

      <div className="flex justify-center gap-4 px-3 pb-4">
        <button
          onClick={handlePreviousPage}
          disabled={pageParam === 1 || isFetching}
        >
          Prev page
        </button>
        <span>Page {pageParam}</span>
        <button onClick={handleNextPage} disabled={isPreviousData || !hasMore}>
          Next page
        </button>
      </div>
    </div>
  );
}
