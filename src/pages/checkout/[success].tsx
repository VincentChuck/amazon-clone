import type { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Icon from '~/components/Icon';
import { emptyCart, useAppDispatch } from '~/reducers/cartReducer';
import { parseRouterParam } from '~/utils/helpers';

export default function Checkout({
  checkoutSuccessful,
}: {
  checkoutSuccessful: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (checkoutSuccessful && typeof window !== 'undefined') {
      dispatch(emptyCart());
    }
  }, [checkoutSuccessful, dispatch]);

  const title = `${
    checkoutSuccessful ? 'Checkout Successful' : 'Checkout Unsuccessful'
  }`;

  return (
    <div className="flex grow justify-center pt-20">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          {checkoutSuccessful ? (
            <Icon
              name="success"
              strokeWidth={2}
              className="h-8 w-8 stroke-green-400 "
            />
          ) : (
            <Icon
              name="error"
              strokeWidth={2}
              className="h-8 w-8 stroke-red-400 "
            />
          )}
          <span className="text-xl font-[600]">{`${
            checkoutSuccessful ? 'Payment Successful' : 'Payment Unsuccessful'
          }`}</span>
        </div>
        <span>{`${
          checkoutSuccessful
            ? 'Thank you! We have received your payment'
            : 'Please try again'
        }`}</span>
        <button
          onClick={() => router.push(`${checkoutSuccessful ? '/' : '/cart'}`)}
          className="border-1 my-4 h-11 w-full rounded-3xl border border-[#FCD200] bg-[#FFD814] py-2 text-base md:h-8 md:py-1 md:text-sm"
        >
          Back to {`${checkoutSuccessful ? 'shop' : 'cart'}`}
        </button>
      </div>
    </div>
  );
}

export function getStaticPaths() {
  return {
    paths: [
      { params: { success: 'success' } },
      { params: { success: 'error' } },
    ],
    fallback: false,
  };
}

export function getStaticProps(ctx: GetStaticPropsContext) {
  const { params } = ctx;

  const success = params?.success;
  const checkoutSuccessful = parseRouterParam(success) === 'success';

  return { props: { checkoutSuccessful } };
}
