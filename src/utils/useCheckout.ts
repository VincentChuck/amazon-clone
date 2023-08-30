import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { type CartType } from '~/types';

export function useCheckout() {
  const { push } = useRouter();

  const { mutateAsync: createCheckoutSession } =
    api.stripe.checkout.useMutation();

  return async function (cartItems: CartType) {
    const { checkoutUrl } = await createCheckoutSession(cartItems);

    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  };
}
