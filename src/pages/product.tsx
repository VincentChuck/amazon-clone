import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { parseRouterParam } from '~/utils/helpers';

export default function Product() {
  const router = useRouter();
  const [pageLoaded, setPageLoaded] = useState(false);

  const { pid } = router.query;
  const productId = parseRouterParam(pid);

  useEffect(() => {
    if (!router.isReady) return;
    setPageLoaded(true);
  }, [router.isReady]);

  const {
    data: product,
    isLoading,
    isError,
  } = api.product.get.useQuery(
    { id: productId },
    {
      enabled: pageLoaded,
      refetchOnWindowFocus: false,
    }
  );

  if (!pageLoaded || isLoading)
    return <div className="text-center">Loading product 🔄</div>;

  if (isError)
    return <div className="text-center">Error fetching product ❌</div>;

  if (!product) return <div className="text-center">Product not found ☹️</div>;

  return !pageLoaded ? null : (
    <div className="flex justify-center">
      <div className="my-8 grid grid-cols-1 px-3 md:max-w-[1500px] md:grid-cols-[384px_auto_244px]">
        <h1 className="my-2 text-lg font-bold md:hidden">{product.name}</h1>
        <div className="flex shrink-0 justify-center">
          <Image
            alt={`${product.name} product image`}
            src={product.productImage}
            width="0"
            height="0"
            sizes="100vh"
            className="h-72 w-auto md:h-auto md:w-96"
          />
        </div>

        <div className="md:flex-grow">
          <h1 className="my-2 text-lg font-bold">{product.name}</h1>
          <div className="flex items-center">
            <div className="m-2 hidden flex-grow p-1 outline md:block">
              <div>{product.productItems.length}</div>
              <span className="font-bold">About this item</span>
              <div>{product.description}</div>
            </div>
          </div>
        </div>

        <div className="m-2 flex flex-col p-1 outline outline-gray-300">
          <div>{product.productItems.length}</div>
          <div className="items-center">
            <button className="my-2 w-full rounded-lg outline">
              Add to cart
            </button>
            <button className="my-2 w-full rounded-lg outline">Buy now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
