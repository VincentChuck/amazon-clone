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

const initialState: CartType = {};

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
    updateItem(state, action: PayloadAction<CartType[number]>) {
      const updatedItem = action.payload;
      state = { ...state, updatedItem };
      return state;
    },
    removeItem(state, action: PayloadAction<CartType[number]>) {
      const itemToRemove = action.payload;
      state = { ...state, itemToRemove };
      return state;
    },
  },
});

export const { setCart, addItem, updateItem, removeItem } = cartSlice.actions;

export default cartSlice.reducer;

function getLocalCart() {
  const cartStorageJSON = window.localStorage.getItem('CART');
  if (cartStorageJSON) {
    const cartStorage = CartSchema.parse(JSON.parse(cartStorageJSON));
    console.log('get local cart', cartStorage);
    return cartStorage;
  } else {
    return {};
  }
}

function setLocalCart(cart: CartType) {
  window.localStorage.setItem('CART', JSON.stringify(cart));
  console.log('set local cart');
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
    console.log(`added ${item.SKU} to cart`);
  };
}

export { getLocalCart, setLocalCart, addToCart };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
