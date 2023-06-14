import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { parseRouterParam } from '~/utils/helpers';
import ProductDetails from '~/components/ProductDetails';
import type { ProductItemResponse, VariationArr } from '~/types';

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

  // product items are sorted by price desc
  const defaultActive = productItems.at(-1) as ProductItemResponse;

  const variationRaw = product.productItems.map((item) => {
    const variation = item.variationOption.variation.variationName;
    const variationOption = item.variationOption;
    const price = item.price;
    return { variation, variationOption, price };
  });

  const variations = [...new Set(variationRaw.map((item) => item.variation))];

  const variationArr: VariationArr = [];

  variations.forEach((variation) => {
    variationArr.push({
      variation,
      options: variationRaw
        .filter((item) => item.variation === variation)
        .map((item) => {
          return { ...item.variationOption, price: item.price };
        }),
    });
  });

  return !pageLoaded ? null : (
    <div className="flex w-screen flex-grow justify-center">
      <ProductDetails {...{ product, variationArr, defaultActive }} />
    </div>
  );
}
