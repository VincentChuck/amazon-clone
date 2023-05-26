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
    <main className="items-center px-3 my-4">
      <h1 className="text-lg font-bold">{product.name}</h1>
      <div>
        <Image
          alt={`${product.name} product image`}
          src={product.productImage}
          width="0"
          height="0"
          sizes="100vh"
          className="h-auto w-96 m-3"
        />
      </div>
    </main>
  );
}
