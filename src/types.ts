import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;
type listedProducts = RouterOutput['product']['all'];

export type listedProduct = listedProducts[number];
