import Head from 'next/head';
import { useRouter } from 'next/router';
import MobileFilter from '~/components/MobileFilter';
import ProductFilter from '~/components/ProductFilter';
import ProductList from '~/components/ProductList';
import ProductsPagination from '~/components/ProductsPagination';
import SortBar from '~/components/SortBar';
import type { CategoryTree } from '~/types';
import { api } from '~/utils/api';
import { RESULTSPERPAGE, type SortOption } from '~/utils/constants';
import {
  getCategoryObject,
  parseCidParam,
  parseRouterParam,
  parseSort,
} from '~/utils/helpers';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';

export default function Products(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();

  const {
    query: { k, cid, page },
    parsedParams: { keyword, categoryId, pageParam, sortBy },
    currCategory,
    skip,
    getBatchObj,
    getBatchDetailsObj,
  } = props;

  function setSortBy(sortOption: SortOption) {
    void router.push(
      {
        query: {
          ...(k && { k }),
          ...(cid && { cid }),
          ...(page && { page }),
          ...(sortOption && { sort: sortOption }),
        },
      },
      undefined
    );
    window.scrollTo({ top: 0 });
  }

  const details = api.product.getBatchDetails.useQuery(getBatchDetailsObj, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  let mergedCategoryTrees: CategoryTree[] = [];
  let numberOfResults = 0;
  let categoryLevel = 1;

  if (details.data) {
    mergedCategoryTrees = details.data.mergedCategoryTrees;
    numberOfResults = details.data.numberOfResults;
    categoryLevel = details.data.categoryLevel ?? 1;
  }

  const productsOnPageIndex = `${skip + 1}-${Math.min(
    skip + RESULTSPERPAGE,
    numberOfResults
  )}`;

  const { data, isLoading, isError, isFetching, isPreviousData } =
    api.product.getBatch.useQuery(getBatchObj, {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    });

  if (isLoading) return <div className="text-center">Loading products 🔄</div>;
  if (isError)
    return <div className="text-center">Error fetching products ❌</div>;

  const { products, hasMore } = data;

  function handleNextPage() {
    if (!isPreviousData && hasMore) {
      void router.push(
        { query: { ...router.query, page: pageParam + 1 } },
        undefined
      );
      window.scrollTo({ top: 0 });
    }
  }

  function handlePreviousPage() {
    void router.push(
      { query: { ...router.query, page: pageParam - 1 } },
      undefined
    );
    window.scrollTo({ top: 0 });
  }

  function handleJumpPage(page: number) {
    void router.push({ query: { ...router.query, page } }, undefined);
    window.scrollTo({ top: 0 });
  }

  function applyMobileFilter(
    sortOption?: SortOption,
    categoryIdOption?: number
  ) {
    if (typeof categoryIdOption === 'number') {
      const cleanQuery = {
        ...(k && { k }),
        ...(page && { page }),
        ...(categoryIdOption && { cid: categoryIdOption }),
        ...(sortOption && { sort: sortOption }),
      };
      void router.push({ query: cleanQuery }, undefined);
    }
  }

  const lastPage = Math.ceil(numberOfResults / RESULTSPERPAGE);

  const title = `Rainforest Books: ${keyword ? keyword : currCategory}`;

  return (
    <div className="flex flex-grow flex-col">
      <Head>
        <title>{title}</title>
      </Head>
      <SortBar
        {...{
          productsOnPageIndex,
          numberOfResults,
          keyword,
          sortBy,
          setSortBy,
        }}
      />

      <MobileFilter
        {...{
          numberOfResults,
          mergedCategoryTrees,
          keyword,
          categoryId,
          sortBy,
          applyMobileFilter,
        }}
      />

      <main className="mx-3 flex flex-grow flex-col items-center py-4">
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
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  const { k, cid, page, sort } = ctx.query;

  const keyword = parseRouterParam(k);
  const categoryId = parseCidParam(cid);
  const pageParam = Number(parseRouterParam(page)) || 1;
  const sortBy = parseSort(sort);

  const parsedParams = { keyword, categoryId, pageParam, sortBy };

  const pageIndex = pageParam - 1;
  const skip = pageIndex * RESULTSPERPAGE;

  const currCategoryObject = getCategoryObject(categoryId);
  let currCategory = '';
  if (categoryId === 0) {
    currCategory = 'All Books';
  } else {
    currCategory = currCategoryObject?.categoryName ?? '';
  }

  const getBatchObj = {
    ...(keyword && { keyword }),
    ...(categoryId && { categoryId }),
    resultPerPage: RESULTSPERPAGE,
    skip,
    ...(sortBy && { sortBy }),
  };

  const getBatchDetailsObj = {
    ...(keyword && { keyword }),
    ...(categoryId && { categoryId }),
  };

  await Promise.all([
    ssg.product.getBatch.prefetch(getBatchObj),
    ssg.product.getBatchDetails.prefetch(getBatchDetailsObj),
  ]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query: { ...ctx.query },
      currCategory,
      skip,
      parsedParams,
      getBatchObj,
      getBatchDetailsObj,
    },
  };
};
