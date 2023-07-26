import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MobileFilter from '~/components/MobileFilter';
import ProductFilter from '~/components/ProductFilter';
import ProductList from '~/components/ProductList';
import ProductsPagination from '~/components/ProductsPagination';
import SortBar from '~/components/SortBar';
import type { CategoryTree } from '~/types';
import { api } from '~/utils/api';
import {
  RESULTSPERPAGE,
  SORTOPTIONS,
  type SortOption,
} from '~/utils/constants';
import { parseRouterParam } from '~/utils/helpers';

export default function Products() {
  const router = useRouter();
  const [pageLoaded, setPageLoaded] = useState(false);

  const { k, cid, page } = router.query;
  const keyword = parseRouterParam(k);
  const categoryId = Number(parseRouterParam(cid));
  const pageParam = Number(parseRouterParam(page)) || 1;
  const pageIndex = pageParam - 1;
  const [sortBy, setSortBy] = useState<SortOption>(SORTOPTIONS[0]);

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

  const categoryLevel = details.data?.categoryLevel;

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
      window.scrollTo({ top: 0 });
    }
  }

  function handlePreviousPage() {
    void router.push(
      { query: { ...router.query, page: pageParam - 1 } },
      undefined,
      { shallow: true }
    );
    window.scrollTo({ top: 0 });
  }

  function handleJumpPage(page: number) {
    void router.push({ query: { ...router.query, page } }, undefined, {
      shallow: true,
    });
    window.scrollTo({ top: 0 });
  }

  function applyMobileFilter(
    sortOption?: SortOption,
    categoryIdOption?: number
  ) {
    if (sortOption) setSortBy(sortOption);

    if (typeof categoryIdOption === 'number') {
      const cleanQuery = {
        ...(keyword && { k: keyword }),
        ...(categoryIdOption && { cid: categoryIdOption }),
      };
      void router.push({ query: cleanQuery }, undefined, {
        shallow: true,
      });
    }
  }

  const lastPage = Math.ceil(numberOfResults / RESULTSPERPAGE);

  return !pageLoaded ? null : (
    <div className="flex flex-grow flex-col">
      <SortBar
        productsOnPageIndex={productsOnPageIndex}
        numberOfResults={numberOfResults}
        keyword={keyword}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MobileFilter
        {...{
          numberOfResults,
          mergedCategoryTrees,
          categoryId,
          sortBy,
          applyMobileFilter,
          keyword,
        }}
      />

      <div className="mx-3 flex flex-grow flex-col items-center py-4">
        <div className="flex w-full flex-grow justify-center md:max-w-[1800px]">
          <ProductFilter
            {...{ mergedCategoryTrees, keyword, categoryId, categoryLevel }}
          />
          <ProductList products={products} />
        </div>

        <ProductsPagination
          {...{
            handlePreviousPage,
            handleNextPage,
            handleJumpPage,
            lastPage,
            isFetching,
            hasMore,
            isPreviousData,
          }}
          page={pageParam}
        />
      </div>
    </div>
  );
}
