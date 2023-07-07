import { useAppSelector } from '~/reducers/cartReducer';

export default function Cart() {
  const cart = useAppSelector((state) => state.cart);

  return (
    <div>{cart.length > 0 ? <div>something</div> : <div>nothing</div>}</div>
  );
}
