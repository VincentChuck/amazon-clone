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

    return products.map(({ id, name, productImage, productItems }) => {
      const cheapestItem = productItems.reduce((prev, curr) => {
        return prev.price.gt(curr.price) ? curr : prev;
      });
      const { price, variationOptions } = cheapestItem;
      const option = variationOptions[0]?.value || '';
      const product = {
        id,
        name,
        productImage,
        price: price.toNumber(),
        option,
      };
      return product;
    });
  }),
});
