import { useState } from 'react';
import { updateItemQuantity, useAppDispatch } from '~/reducers/cartReducer';
import type { CartType } from '~/types';

export function useQuantity(itemId: string, val: number, cart: CartType) {
  const [value, setValue] = useState<number | ''>(val);
  const dispatch = useAppDispatch();

  function parseChange(target: number, change = 0) {
    let outputNum: number;

    outputNum = target + change;
    if (outputNum < 1) outputNum = 1;
    if (outputNum > 99) {
      outputNum = Math.trunc(outputNum / 10);
    }

    return outputNum;
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    if (input === '') {
      setValue('');
      return;
    }

    if (/[^0-9]/.test(input)) {
      setValue(Number(input.replace(/[^0-9]/g, '')));
      return;
    }

    const parsedValue = parseChange(Number(input));
    setValue(parsedValue);
    dispatch(updateItemQuantity(itemId, parsedValue, cart));
  }

  function onBlur() {
    if (value === '') {
      setValue(1);
      dispatch(updateItemQuantity(itemId, 1, cart));
    }
  }

  function plusOne() {
    const parsedValue = parseChange(Number(value), 1);
    setValue(parsedValue);
    dispatch(updateItemQuantity(itemId, parsedValue, cart));
  }

  function minusOne() {
    const parsedValue = parseChange(Number(value), -1);
    setValue(parsedValue);
    dispatch(updateItemQuantity(itemId, parsedValue, cart));
  }

  return {
    quantity: {
      value,
      onChange,
      onBlur,
    },
    plusOne,
    minusOne,
  };
}
