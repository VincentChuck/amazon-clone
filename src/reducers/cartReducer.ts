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
// import type { Decimal } from '@prisma/client/runtime';

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
  },
});

export const { setCart, addItem, removeItem } = cartSlice.actions;

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
  const cartItemContent = {
    productId: item.productId,
    SKU: item.SKU,
    count,
    name: `${product.name} (${item.variationOption.value})`,
    price: item.price,
    image: item.itemImage || product.productImage,
    variation: item.variationOption.value,
    variationOption: item.variationOption.variation.variationName,
  };

  const itemInCart = cart[item.id];
  if (itemInCart) {
    cartItemContent.count = itemInCart.count + count;
  }

  const cartItem: CartType = {
    [item.id]: cartItemContent,
  };

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

// TODO: validate if productItem is still in stock

export { addToCart, updateItemQuantity, removeFromCart };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
