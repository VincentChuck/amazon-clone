import Image from 'next/image';
import type { productResponse } from '~/types';

type Props = {
  product: productResponse;
};

export default function ProductDetails({ product }: Props) {
  if (!product) return <div className="text-center">Product not found ☹️</div>;

  const variationRaw = product.productItems.map((item) => {
    const variation = item.variationOption.variation.variationName;
    const variationOption = item.variationOption.value;
    return { variation, variationOption };
  });

  const variations = [...new Set(variationRaw.map((item) => item.variation))];

  type VariationArr = {
    variation: string;
    options: string[];
  }[];

  const variationArr: VariationArr = [];

  variations.forEach((variation) => {
    variationArr.push({
      variation,
      options: variationRaw
        .filter((item) => item.variation === variation)
        .map((item) => item.variationOption),
    });
  });

  return (
    <div className="grid h-full w-full grid-cols-1 p-3 md:max-w-[1500px] md:grid-cols-3 md:py-8 lg:grid-cols-[384px_auto_244px]">
      <h1 className="my-2 text-sm md:hidden">{product.name}</h1>
      <div className="relative h-96 w-full bg-gray-100 md:aspect-square md:h-auto">
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
            {variationArr.map((variation) => {
              return (
                <div key={variation.variation}>
                  <span className="font-bold">{variation.variation}</span>
                  <div>
                    {variation.options.map((option) => {
                      return (
                        <div key={`${variation.variation}-${option}`}>
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
  );
}
