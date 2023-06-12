import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type productsResponse = RouterOutput['product']['getBatch']['products'];

type productResponseRaw = RouterOutput['product']['get'];
export type productResponse = NonNullable<productResponseRaw>;
export type ProductItemResponse = productResponse['productItems'][number];

export type VariationArr = {
  variation: string;
  options: ProductItemResponse['variationOption'][];
}[];

export type CategoryTree = {
  id: number;
  name: string;
  children?: CategoryTree[];
};
