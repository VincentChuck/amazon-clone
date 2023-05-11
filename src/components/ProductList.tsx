import type { listedProducts } from '~/types';
import Image from 'next/image';

type ProductsProps = {
  products: listedProducts;
};

export default function ProductList({ products }: ProductsProps) {
  return (
    <section className="mx-4 w-screen max-w-screen-xl outline">
      <h1 className="text-xl font-bold">Results</h1>
      <div>
        {products && products.length
          ? products.map((product) => {
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-start outline"
                >
                  <h1>{product.name}</h1>
                  <div className="relative h-56 w-56">
                    <Image
                      alt={`${product.name} product image`}
                      src={product.productImage}
                      fill
                      sizes="224px"
                      className="object-contain"
                    />
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
