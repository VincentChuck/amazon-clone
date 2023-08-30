import Link from 'next/link';
import Image from 'next/image';
import type { CartType } from '~/types';
import { removeFromCart, useAppDispatch } from '~/reducers/cartReducer';
import { useCartItems } from '~/utils/useCart';
import { useQuantity } from '~/utils/useQuantity';
import { USDollar } from '~/utils/constants';
import Icon from '~/components/Icon';
import emptyCartSvg from 'public/emtpy_cart.svg';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function Cart() {
  const { cartItems, cartTotal } = useCartItems();
  const cartItemKeys = Object.keys(cartItems);

  const { push } = useRouter();

  const { mutateAsync: createCheckoutSession } =
    api.stripe.checkout.useMutation();

  async function onCheckout() {
    const { checkoutUrl } = await createCheckoutSession(cartItems);
    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  }

  if (cartItemKeys.length === 0) {
    return (
      <div className="flex min-h-[500px] w-full flex-col items-center justify-center bg-white md:min-h-[600px]">
        <Head>
          <title>Rainforest Books Shopping Cart</title>
        </Head>
        <div className="relative aspect-square h-72 md:h-96">
          <Image
            alt="Cart is empty"
            priority
            // eslint-disable-next-line
            src={emptyCartSvg}
            fill
            sizes="100vh"
            className="object-contain"
          />
        </div>
        <h1 className="text-center text-2xl font-bold">Your Cart is empty</h1>
        <span className="text-[#565959]">Good stuff goes in here</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col bg-[#EAEDED] md:flex-row-reverse md:p-4">
      <Head>
        <title>Rainforest Books Shopping Cart</title>
      </Head>

      <CheckoutCard
        cartSize={cartItemKeys.length}
        cartTotal={cartTotal}
        onCheckout={onCheckout}
      />

      <div className="bg-white px-2 py-3 md:h-fit md:grow md:px-5">
        <h1 className="hidden border-b border-[#E7E7E7] text-[28px] font-[400] md:flex">
          Shopping Cart
        </h1>
        {cartItemKeys.map((key) => {
          const item = cartItems[key] as CartType[number];
          return (
            <CartItem
              key={key}
              itemId={key}
              item={item}
              cartItems={cartItems}
            />
          );
        })}
        <div className="mb-4 mt-1 hidden justify-end md:flex">
          <CartTotal cartSize={cartItemKeys.length} cartTotal={cartTotal} />
        </div>
      </div>
    </div>
  );
}

type CartItemProps = {
  itemId: keyof CartType;
  item: CartType[keyof CartType];
  cartItems: CartType;
};

function CartItem({ itemId, item, cartItems }: CartItemProps) {
  const productLink = `/product?pid=${item.productId}`;
  return (
    <div className="mb-3 flex flex-col border-[#E7E7E7] bg-[rgba(5,75,89,.03)] px-2 py-3 md:mb-0 md:border-b md:bg-white md:px-3">
      <div className="flex h-40 md:h-56">
        <Link
          href={productLink}
          className="relative h-full w-[160px] shrink-0 md:min-w-[200px] md:max-w-[20%]"
        >
          <Image
            alt={`${item.name} product image`}
            src={item.image}
            fill
            sizes="224px"
            className="object-contain"
          />
        </Link>
        <div className="flex flex-col justify-between py-2 pl-2 pr-1">
          <div className="flex flex-col gap-1">
            <Link href={productLink}>
              <span className="line-clamp-2 md:text-xl">{item.name}</span>
            </Link>
            <div className="text-lg font-bold">
              {USDollar.format(item.price)}
            </div>
            <div className="text-xs">
              <span className="font-bold">{item.variationOption}: </span>
              <span>{item.variation}</span>
            </div>
          </div>
          <div className="hidden md:flex">
            <CartItemActions {...{ itemId, item, cartItems }} />
          </div>
        </div>
      </div>
      <div className="my-2 flex justify-center px-4 md:hidden">
        <CartItemActions {...{ itemId, item, cartItems }} />
      </div>
    </div>
  );
}

function CartItemActions({ itemId, item, cartItems }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { quantity, plusOne, minusOne } = useQuantity(
    itemId,
    item.count,
    cartItems
  );
  return (
    <div className="flex gap-6 md:gap-2">
      <div className="flex h-[33px] rounded-lg shadow-[0_2px_5px_0_rgba(213,217,217,.5)]">
        <button
          onClick={() => {
            return quantity.value === 1
              ? dispatch(removeFromCart(itemId, cartItems))
              : minusOne();
          }}
          className="flex h-[33px] w-[35px] items-center justify-center rounded-l-lg border-y border-l border-[#D5D9D9] bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)]"
        >
          {quantity.value === 1 ? (
            <Icon
              name="trash"
              strokeWidth={1.5}
              className="h-[20px] w-[20px]"
            />
          ) : (
            '-'
          )}
        </button>
        <input
          {...quantity}
          required
          className="h-[33px] w-[54px] border border-[#D5D9D9] text-center text-base"
        />
        <button
          onClick={() => plusOne()}
          disabled={quantity.value === 99}
          className="h-[33px] w-[35px] rounded-r-lg border-y border-r border-[#D5D9D9] bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)] disabled:text-[#f7f8fa]"
        >
          +
        </button>
      </div>
      <button
        onClick={() => dispatch(removeFromCart(itemId, cartItems))}
        className="h-[33px] rounded-lg border border-[#D5D9D9] px-3 text-center text-[13px] shadow-[0_2px_5px_0_rgba(213,217,217,.5)]"
      >
        Delete
      </button>
    </div>
  );
}

type CartTotalProps = {
  cartSize: number;
  cartTotal: number;
};

function CartTotal({ cartSize, cartTotal }: CartTotalProps) {
  return (
    <div className="text-lg">
      <span>Subtotal </span>
      <span>
        ({cartSize} item{cartSize > 1 ? 's' : ''}):{' '}
      </span>
      <span className="font-bold">{USDollar.format(cartTotal)}</span>
    </div>
  );
}

type CheckoutCardProps = CartTotalProps & {
  onCheckout: () => Promise<void>;
};

function CheckoutCard({ cartSize, cartTotal, onCheckout }: CheckoutCardProps) {
  return (
    <div className="h-fit w-full bg-white px-5 pt-5 md:ml-4 md:w-[300px] md:pb-5">
      <CartTotal cartSize={cartSize} cartTotal={cartTotal} />
      <button
        onClick={onCheckout}
        className="border-1 my-5 h-11 w-full rounded-lg border border-[#FCD200] bg-[#FFD814] py-2 text-base md:my-2 md:h-8 md:py-1 md:text-sm"
      >
        Proceed to checkout
      </button>
      <div className="border-b border-[#E7E7E7] md:hidden"></div>
    </div>
  );
}
