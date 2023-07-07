import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { CartSchema, type Cart } from '~/types';

const initialState: Cart = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(_state, action: PayloadAction<Cart>) {
      return action.payload;
    },
    updateItem(state, action: PayloadAction<Cart[number]>) {
      const updatedItem = action.payload;
      return state.map((a) => (a.id === updatedItem.id ? updatedItem : a));
    },
    removeItem(state, action: PayloadAction<Cart[number]>) {
      const itemToRemove = action.payload;
      return state.filter((a) => a.id !== itemToRemove.id);
    },
    addItem(state, action: PayloadAction<Cart[number]>) {
      const newItem = action.payload;
      state.push(newItem);
    },
  },
});

export const { setCart, addItem, updateItem, removeItem } = cartSlice.actions;

export default cartSlice.reducer;

function getLocalCart() {
  const cartStorageJSON = window.localStorage.getItem('CART');
  const cartStorage = CartSchema.parse(cartStorageJSON);
  return cartStorage;
}

function setLocalCart(cart: Cart) {
  window.localStorage.setItem('CART', JSON.stringify(cart));
}

export { getLocalCart, setLocalCart };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
