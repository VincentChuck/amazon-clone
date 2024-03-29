import type { ProductsResponse } from '~/types';
import Image from 'next/image';
import Link from 'next/link';

type ProductsProps = {
  products: ProductsResponse;
};

export default function ProductList({ products }: ProductsProps) {
  return (
    <section className="mx-1 w-full flex-grow md:mx-4">
      <h1 className="mb-1 text-xl font-bold">Results</h1>
      <div>
        {products && products.length
          ? products.map((product) => {
              const productLink = `/product?pid=${product.id}`;
              return (
                <div
                  key={product.id}
                  className="border-1 mb-2 flex h-60 items-start border border-[#F5F5F5]"
                >
                  <Link
                    href={productLink}
                    className="relative h-full w-[42%] shrink-0 bg-[#F8F8F8] md:min-w-[200px] md:max-w-[20%] md:grow"
                  >
                    <Image
                      alt={`${product.name} product image`}
                      src={product.productImage}
                      fill
                      sizes="224px"
                      className="object-contain"
                      priority
                    />
                  </Link>
                  <div className="flex flex-col py-2 pl-2 pr-1">
                    <Link href={productLink}>
                      <span className="line-clamp-3 text-lg">
                        {product.name}
                      </span>
                    </Link>
                    <div className="my-2 flex align-top text-sm">
                      <span>$</span>
                      <span className="relative -top-1 text-3xl">
                        {product.price.toString().split('.')[0]}
                      </span>
                      <span>{product.price.toString().split('.')[1]}</span>
                    </div>
                    <div className="text-xs">Ships to Seattle 98121</div>
                  </div>
                </div>
              );
            })
          : 'No results'}
      </div>
    </section>
  );
}
