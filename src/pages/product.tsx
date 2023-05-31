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
    <div className="flex w-screen justify-center">
      <div className="grid w-full grid-cols-1 p-3 md:max-w-[1500px] md:grid-cols-[384px_auto_244px] md:py-8">
        <h1 className="my-2 text-sm md:hidden">{product.name}</h1>
        <div className="relative h-72 w-full bg-gray-100 md:h-96 md:w-96">
          <Image
            alt={`${product.name} product image`}
            src={product.productImage}
            fill
            sizes="100vh"
            className="object-contain"
          />
        </div>

        <div className="hidden flex-grow px-2 md:block">
          <h1 className="my-2 text-lg font-bold">{product.name}</h1>
          <div className="flex items-center">
            <div className="m-2 flex-grow p-1">
              <div>{product.productItems.length}</div>
              <span className="font-bold">About this item</span>
              <div>{product.description}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4 py-8 outline-1 outline-gray-300 md:outline">
          <div>{product.productItems.length}</div>
          <div className="items-center">
            <button className="my-2 w-full rounded-3xl py-2 text-lg outline md:py-1 md:text-base">
              Add to cart
            </button>
            <button className="my-2 w-full rounded-3xl py-2 text-lg outline md:py-1 md:text-base">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
