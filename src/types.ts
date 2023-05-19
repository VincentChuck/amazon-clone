import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;

type productsResponse = RouterOutput['product']['getBatch'];
export type listedProducts = productsResponse['products'];
export type listedCategories = productsResponse['mergedCategoryTrees'];
