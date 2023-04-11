import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const productRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      include: {
        productItems: {
          include: {
            variationOptions: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    });
    return products.map(({ id, name, productItems }) => {
      // get the cheapest product item
      const { price, variationOptions } = productItems.reduce((prev, curr) => {
        return prev.price.gt(curr.price) ? curr : prev;
      });
      const option = variationOptions[0]?.value || '';
      return { id, name, price: price.toNumber(), option };
    });
  }),
});
