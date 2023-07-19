import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';
import { z } from 'zod';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type ProductsResponse = RouterOutput['product']['getBatch']['products'];

type ProductResponseRaw = RouterOutput['product']['get'];
export type ProductResponse = NonNullable<ProductResponseRaw>;
export type ProductItemResponse = ProductResponse['productItems'][number];

export type VariationArr = {
  variation: string;
  options: Array<
    ProductItemResponse['variationOption'] & Record<'price', number>
  >;
}[];

export type CategoryTree = {
  id: number;
  name: string;
  children?: CategoryTree[];
};

export const CartSchema = z
  .record(
    z.string(),
    z.object({
      productId: z.string(),
      SKU: z.string(),
      count: z.number(),
      name: z.string(),
      price: z.number(),
      image: z.string(),
      variation: z.string(),
      variationOption: z.string(),
    })
  )
  .catch(() => {
    return {};
  });

export type CartType = z.infer<typeof CartSchema>;
