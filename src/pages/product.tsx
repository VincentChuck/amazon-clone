import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { parseRouterParam } from '~/utils/helpers';
import ProductDetails from '~/components/ProductDetails';

export default function Product() {
  const router = useRouter();
  const [pageLoaded, setPageLoaded] = useState(false);

  const { pid } = router.query;
  const productId = parseRouterParam(pid);

  // const [itemIndex, setItemIndex] = useState<number>();

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

  const productItems = product?.productItems;

  if (!product || !productItems || productItems.length === 0)
    return <div className="text-center">Product not found ☹️</div>;

  return !pageLoaded ? null : (
    <div className="flex w-screen flex-grow justify-center">
      <ProductDetails product={product} />
    </div>
  );
}
