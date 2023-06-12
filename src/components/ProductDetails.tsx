import Image from 'next/image';
import { useState } from 'react';
import type {
  ProductItemResponse,
  VariationArr,
  productResponse,
} from '~/types';

type Props = {
  product: productResponse;
  variationArr: VariationArr;
  defaultActive: ProductItemResponse;
};

export default function ProductDetails({
  product,
  variationArr,
  defaultActive,
}: Props) {
  const [active, setActive] = useState<ProductItemResponse>(defaultActive);

  function setActiveVariation(variationId: string) {
    setActive(
      product.productItems.find(
        (item) => item.variationOptionId === variationId
      ) as ProductItemResponse
    );
  }

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
            <div>{active.price.toString()}</div>
            <span className="font-bold">About this item</span>
            <div>{product.description}</div>
            {variationArr.map((variation) => {
              return (
                <div key={variation.variation} className="my-2">
                  <span>{variation.variation}: </span>
                  <div className="flex gap-2">
                    {variation.options.map((option) => {
                      const isActive = active.variationOptionId === option.id;
                      return (
                        <button
                          key={option.id}
                          className={`${
                            isActive ? 'outline-[#FFA41C]' : 'outline-gray-300'
                          } my-2 p-1 text-sm font-bold outline outline-1`}
                          onClick={() => setActiveVariation(option.id)}
                        >
                          {option.value}
                        </button>
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
        <div>{active.price.toString()}</div>
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
