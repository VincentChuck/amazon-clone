import type { productsResponse } from '~/types';
import Image from 'next/image';
import Link from 'next/link';

type ProductsProps = {
  products: productsResponse;
};

export default function ProductList({ products }: ProductsProps) {
  return (
    <section className="mx-4 w-full flex-grow outline">
      <h1 className="text-xl font-bold">Results</h1>
      <div>
        {products && products.length
          ? products.map((product) => {
              const productLink = `/product?pid=${product.id}`;
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-start outline"
                >
                  <Link href={productLink}>
                    <h1>{product.name}</h1>
                  </Link>
                  <div className="relative h-56 w-56">
                    <Link href={productLink}>
                      <Image
                        alt={`${product.name} product image`}
                        src={product.productImage}
                        fill
                        sizes="224px"
                        className="object-contain"
                      />
                    </Link>
                  </div>
                  <div>{product.price}</div>
                  <div>{product.option}</div>
                </div>
              );
            })
          : 'No results'}
      </div>
    </section>
  );
}
