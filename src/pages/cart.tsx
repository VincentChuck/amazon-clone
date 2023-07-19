import Link from 'next/link';
import Image from 'next/image';
import type { CartType } from '~/types';
import { useCartItems } from '~/utils/useCart';
import { useQuantity } from '~/utils/useQuantity';

export default function Cart() {
  const { cartItems, cartTotal } = useCartItems();

  return (
    <div className="w-full bg-[#EAEDED] p-4">
      <div className="bg-white p-5">
        <h1 className="border-b border-[#E7E7E7] text-[28px] font-[400]">
          Shopping Cart
        </h1>
        {Object.keys(cartItems).map((key) => {
          const item = cartItems[key] as CartType[number];
          return <CartItem key={key} item={item} />;
        })}
      </div>
    </div>
  );
}

type CartItemProps = {
  item: CartType[keyof CartType];
};

function CartItem({ item }: CartItemProps) {
  const quantity = useQuantity(item.count);
  const productLink = `/product?pid=${item.productId}`;
  return (
    <div className="flex h-48 p-3">
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
      <div className="flex flex-col py-2 pl-2 pr-1">
        <Link href={productLink}>
          <span className="line-clamp-2 text-lg">{item.name}</span>
        </Link>
        <div className="text-lg font-bold">${item.price}</div>
        <div className="text-xs">
          <span className="font-bold">{item.variationOption}: </span>
          <span>{item.variation}</span>
        </div>
        <div>
          <input
            type="number"
            {...quantity}
            required
            className="w-[40px] rounded-lg border text-center text-base"
          />
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}
