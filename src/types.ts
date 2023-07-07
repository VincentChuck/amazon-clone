import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';
import type { Decimal } from '@prisma/client/runtime';
import { z } from 'zod';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type productsResponse = RouterOutput['product']['getBatch']['products'];

type productResponseRaw = RouterOutput['product']['get'];
export type productResponse = NonNullable<productResponseRaw>;
export type ProductItemResponse = productResponse['productItems'][number];

export type VariationArr = {
  variation: string;
  options: Array<
    ProductItemResponse['variationOption'] & Record<'price', Decimal>
  >;
}[];

export type CategoryTree = {
  id: number;
  name: string;
  children?: CategoryTree[];
};

export const CartSchema = z
  .object({
    id: z.string(),
    productId: z.string(),
    SKU: z.string(),
    count: z.number(),
  })
  .array()
  .catch(() => []);

export type Cart = z.infer<typeof CartSchema>;
