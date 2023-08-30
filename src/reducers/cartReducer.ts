import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {
  CartSchema,
  type ProductResponse,
  type CartType,
  type ProductItemResponse,
} from '~/types';
import { makeCartItem } from '~/utils/helpers';

const initialState: CartType = getLocalCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(_state, action: PayloadAction<CartType>) {
      return action.payload;
    },
    addItem(state, action: PayloadAction<CartType>) {
      const newItem = action.payload;
      state = { ...state, ...newItem };
      return state;
    },
    removeItem(state, action: PayloadAction<keyof CartType>) {
      const itemToRemoveId = action.payload;
      delete state[itemToRemoveId];
      return state;
    },
    emptyCartState() {
      return {};
    },
  },
});

export const { setCart, addItem, removeItem, emptyCartState } =
  cartSlice.actions;

export default cartSlice.reducer;

function getLocalCart() {
  if (typeof window === 'undefined') return {};

  const cartStorageJSON = window.localStorage.getItem('CART');
  if (!cartStorageJSON) return {};

  const cartStorage = CartSchema.parse(JSON.parse(cartStorageJSON));
  return cartStorage;
}

function setLocalCart(cart: CartType) {
  window.localStorage.setItem('CART', JSON.stringify(cart));
}

function addToCart(
  item: ProductItemResponse,
  count: number,
  product: ProductResponse,
  cart: CartType
) {
  let finalCount = count;

  const itemInCart = cart[item.id];
  if (itemInCart) {
    finalCount += itemInCart.count;
  }

  const cartItem = makeCartItem(item, finalCount, product);

  return function (dispatch: AppDispatch) {
    dispatch(addItem(cartItem));
    setLocalCart({ ...cart, ...cartItem });
  };
}

function removeFromCart(itemId: keyof CartType, cart: CartType) {
  const updatedCart = { ...cart };
  delete updatedCart[itemId];
  return function (dispatch: AppDispatch) {
    dispatch(removeItem(itemId));
    setLocalCart(updatedCart);
  };
}

function updateItemQuantity(
  itemId: keyof CartType,
  count: number,
  cart: CartType
) {
  const updatedCart = {
    ...cart,
    [itemId]: { ...(cart[itemId] as CartType[keyof CartType]), count },
  };
  return function (dispatch: AppDispatch) {
    dispatch(setCart(updatedCart));
    setLocalCart(updatedCart);
  };
}

function emptyCart() {
  return function (dispatch: AppDispatch) {
    dispatch(emptyCartState());
    setLocalCart({});
  };
}

// TODO: validate if productItem is still in stock

export { addToCart, updateItemQuantity, removeFromCart, emptyCart };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
