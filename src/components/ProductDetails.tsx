import Image from 'next/image';
import { useState } from 'react';
import type {
  ProductItemResponse,
  VariationArr,
  productResponse,
} from '~/types';
import Icon from './Icon';

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
    <div className="grid h-full w-full grid-cols-1 p-3.5 md:max-w-[1500px] md:grid-cols-3 md:py-8 lg:grid-cols-[384px_auto_244px]">
      <h1 className="my-2 text-sm text-[#565959] md:hidden">{product.name}</h1>
      <div className="relative h-96 w-full md:aspect-square md:h-auto md:bg-gray-100">
        <Image
          alt={`${product.name} product image`}
          src={product.productImage}
          fill
          sizes="100vh"
          className="object-contain"
        />
      </div>

      <div className="hidden flex-grow p-1 px-2 md:block">
        <h1 className="my-2 text-2xl">{product.name}</h1>
        <div className="flex items-center">
          <div className="m-2 flex-grow">
            <div className="flex align-top text-sm">
              <span>$</span>
              <span className="relative -top-1 text-3xl">
                {active.price.toString().split('.')[0]}
              </span>
              <span>{active.price.toString().split('.')[1]}</span>
            </div>
            {variationArr.map((variation) => {
              return (
                <div key={variation.variation} className="my-2">
                  <span className="text-sm">
                    {variation.variation}:{' '}
                    <span className="font-bold">
                      {active.variationOption.value}
                    </span>
                  </span>
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
            <span className="font-bold">About this item</span>
            <div>{product.description}</div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        {variationArr.map((variation) => {
          return (
            <div key={variation.variation} className="mt-4">
              <span>
                {variation.variation}:{' '}
                <span className="font-bold">
                  {active.variationOption.value}
                </span>
              </span>
              <div className="flex overflow-x-auto py-4 pl-[2px]">
                {[...variation.options].reverse().map((option) => {
                  const isActive = active.variationOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      className={`${
                        isActive ? 'outline-[#FFA41C]' : 'outline-gray-300'
                      } my-2 mr-4 flex h-28 w-36 shrink-0 flex-col rounded-md text-sm outline outline-1`}
                      onClick={() => setActiveVariation(option.id)}
                    >
                      <div className="flex w-full grow flex-col text-left">
                        <div className="flex h-10 items-center bg-[#FCF8F7] p-2 font-bold">
                          <span>{option.value}</span>
                        </div>
                        <div className="flex grow flex-col p-2 ">
                          <div className="flex align-top text-xs">
                            <span>$</span>
                            <span className="relative -top-1 text-base">
                              {option.price.toString().split('.')[0]}
                            </span>
                            <span>{option.price.toString().split('.')[1]}</span>
                          </div>
                          <div>In Stock</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-3 flex h-fit flex-col outline-1 outline-gray-300 md:px-4 md:py-8 md:outline">
        <div className="flex align-top text-sm">
          <span>$</span>
          <span className="relative -top-1 text-3xl">
            {active.price.toString().split('.')[0]}
          </span>
          <span>{active.price.toString().split('.')[1]}</span>
        </div>
        <div className="my-1 flex items-center">
          <Icon
            name="location"
            strokeWidth={1.5}
            className="mr-2 inline h-5 w-5"
          />
          <span className="text-[#007185] md:text-xs">
            Deliver to Seattle 98121
          </span>
        </div>
        <div className="text-lg text-[#007600]">In Stock</div>
        <div className="items-center">
          <button className="my-2 h-11 w-full rounded-3xl bg-[#FFD814] py-2 text-base outline outline-1 outline-[#FCD200] md:h-8 md:py-1 md:text-sm">
            Add to Cart
          </button>
          <button className="my-2 h-11 w-full rounded-3xl bg-[#FFA41C] py-2 text-base outline outline-1 outline-[#FF8F00] md:h-8 md:py-1 md:text-sm">
            Buy Now
          </button>
        </div>
      </div>

      <div className="my-3 md:hidden">
        <span className="text-lg font-bold">Features & details</span>
        <div>{product.description}</div>
      </div>
    </div>
  );
}
