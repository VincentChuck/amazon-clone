import Link from 'next/link';
import Image from 'next/image';
import type { CartType } from '~/types';
import { removeFromCart, useAppDispatch } from '~/reducers/cartReducer';
import { useCartItems } from '~/utils/useCart';
import { useQuantity } from '~/utils/useQuantity';
import { USDollar } from '~/utils/constants';

export default function Cart() {
  const { cartItems, cartTotal } = useCartItems();
  const cartItemKeys = Object.keys(cartItems);

  return (
    <div className="w-full bg-[#EAEDED] p-4">
      <div className="bg-white p-5">
        <h1 className="border-b border-[#E7E7E7] text-[28px] font-[400]">
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
        <div className="mb-4 mt-1 flex justify-end">
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
  const dispatch = useAppDispatch();
  const { quantity, plusOne, minusOne } = useQuantity(
    itemId,
    item.count,
    cartItems
  );
  const productLink = `/product?pid=${item.productId}`;
  return (
    <div className="flex h-48 border-b border-[#E7E7E7] p-3">
      <div className="relative h-full w-[42%] shrink-0 md:min-w-[200px] md:max-w-[20%] md:grow">
        <Link href={productLink}>
          <Image
            alt={`${item.name} product image`}
            src={item.image}
            fill
            sizes="224px"
            className="object-contain"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-between py-2 pl-2 pr-1">
        <div className="flex flex-col gap-1">
          <Link href={productLink}>
            <span className="line-clamp-2 text-xl">{item.name}</span>
          </Link>
          <div className="text-lg font-bold">{USDollar.format(item.price)}</div>
          <div className="text-xs">
            <span className="font-bold">{item.variationOption}: </span>
            <span>{item.variation}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="round-lg h-[33px] shadow-[0_2px_5px_0_rgba(213,217,217,.5)]">
            <button
              onClick={() => minusOne()}
              disabled={quantity.value === 1}
              className="h-[33px] w-[35px] rounded-l-lg border-y border-l border-[#D5D9D9] bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)]"
            >
              -
            </button>
            <input
              {...quantity}
              required
              className="h-[33px] w-[54px] border border-[#D5D9D9] text-center text-base"
            />
            <button
              onClick={() => plusOne()}
              disabled={quantity.value === 99}
              className="h-[33px] w-[35px] rounded-r-lg border-y border-r border-[#D5D9D9] bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)]"
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
      </div>
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
