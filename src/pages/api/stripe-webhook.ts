import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';
import type Stripe from 'stripe';
import { buffer } from 'micro';
import { stripe } from '~/server/stripe/client';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig as string,
        webhookSecret
      );
    } catch (err: unknown) {
      let errorMessage = 'Webhook Error';
      if (err instanceof Error) {
        errorMessage += ': ' + err.message;
      }
      console.log(errorMessage);
      res.status(400).send(errorMessage);
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    console.log(session.id, 'created');

    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(', ');

    if (event.type === 'checkout.session.completed') {
      const order = await prisma.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          name: session?.customer_details?.name || '',
          address: addressString,
          phone: session?.customer_details?.phone || '',
        },
        include: {
          orderItems: {
            include: { productItem: true },
          },
        },
      });

      const orderItems = order.orderItems;

      await Promise.all(
        orderItems.map(async (orderItem) => {
          await prisma.productItem.update({
            where: { id: orderItem.productItemId },
            data: {
              quantityInStock: {
                decrement: orderItem.quantity,
              },
            },
          });
        })
      );
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
