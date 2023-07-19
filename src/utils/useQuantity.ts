import { useState } from 'react';

export function useQuantity(val: number) {
  const [value, setValue] = useState<number | string>(val);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let ctrlValue = Math.floor(Number(event.target.value)) || '';
    if (typeof ctrlValue === 'number' && ctrlValue < 0) ctrlValue = 0;
    if (typeof ctrlValue === 'number' && ctrlValue > 99)
      ctrlValue = Math.trunc(ctrlValue / 10);
    setValue(ctrlValue);
  };

  const onBlur = () => {
    if (value === '') setValue(1);
  };

  return {
    value,
    onChange,
    onBlur,
  };
}
