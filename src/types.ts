import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type productsResponse = RouterOutput['product']['getBatch']['products'];
export type productResponse = RouterOutput['product']['get'];

export type CategoryTree = {
  id: number;
  name: string;
  children?: CategoryTree[];
};
