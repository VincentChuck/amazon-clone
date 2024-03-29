import { createTRPCRouter } from '~/server/api/trpc';
import { productRouter } from './routers/product';
import { stripeRouter } from './routers/stripe';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
