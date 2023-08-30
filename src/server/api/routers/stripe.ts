import { z } from 'zod';
import { env } from '~/env.mjs';
import { createTRPCRouter, publicProcedure } from '../trpc';
import type { Stripe } from 'stripe';
import { CartSchema, type CartType } from '~/types';

export const stripeRouter = createTRPCRouter({
  checkout: publicProcedure
    .input(
      z.object({
        cart: CartSchema,
        isSingleItem: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input: { cart, isSingleItem } }) => {
      const { prisma, stripe, req } = ctx;

      const productItemIds = Object.keys(cart);

      const baseUrl =
        env.NODE_ENV === 'development'
          ? `http://${req.headers.host ?? 'localhost:3000'}`
          : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

      const productItems = await prisma.productItem.findMany({
        where: {
          id: {
            in: productItemIds,
          },
        },
        include: {
          product: { select: { name: true } },
          variationOption: {
            select: { value: true },
          },
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      productItems.forEach((productItem) => {
        const cartItem = cart[productItem.id] as CartType[string];
        const quantity = cartItem.count;

        line_items.push({
          quantity,
          price_data: {
            currency: 'USD',
            product_data: {
              name: `${productItem.product.name} (${productItem.variationOption.value})`,
            },
            unit_amount: productItem.price.toNumber() * 100 * quantity,
          },
        });
      });

      const order = await prisma.order.create({
        data: {
          isPaid: false,
          orderItems: {
            create: productItems.map((productItem) => ({
              productItem: {
                connect: {
                  id: productItem.id,
                },
              },
              quantity: (cart[productItem.id] as CartType[string]).count,
            })),
          },
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${baseUrl}/checkout/success${
          isSingleItem ? '?singleItem=true' : ''
        }`,
        cancel_url: `${baseUrl}/checkout/error`,
        metadata: {
          orderId: order.id,
        },
      });

      return { checkoutUrl: session.url };
    }),
});
