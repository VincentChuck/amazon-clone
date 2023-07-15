import { useAppSelector } from '~/reducers/cartReducer';
import type { CartType } from '~/types';

export default function Cart() {
  const cart = useAppSelector((state) => state.cart);
  console.log(cart);

  return (
    <div>
      {Object.keys(cart).length > 0 ? (
        <div>
          <h1>Shopping Cart</h1>
          {Object.keys(cart).map((key) => {
            const item = cart[key] as CartType[number];
            return <div key={key}>{item.SKU}</div>;
          })}
        </div>
      ) : (
        <div>nothing</div>
      )}
    </div>
  );
}
