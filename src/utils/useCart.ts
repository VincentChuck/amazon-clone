import { useEffect, useState } from 'react';
import { useAppSelector } from '~/reducers/cartReducer';
import { type CartType } from '~/types';

export const useCartItems = () => {
  const cart = useAppSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState<CartType>({});
  const cartTotal = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.count,
    0
  );

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  return { cartItems, cartTotal, cartCount };
};
