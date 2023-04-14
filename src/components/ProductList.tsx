import Image from 'next/image';
import { api } from '~/utils/api';

export default function ProductList() {
  const { data: products, isLoading, isError } = api.product.all.useQuery();
  if (isLoading) return <div>Loading products 🔄</div>;
  if (isError) return <div>Error fetching products ❌</div>;
  return (
    <div>
      {products.length
        ? products.map((product) => {
            return (
              <div key={product.id} className="flex flex-col items-start">
                <h1>{product.name}</h1>
                <div className="relative h-56 w-56">
                  <Image
                    alt={`${product.name} product image`}
                    src={product.productImage}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>{product.price}</div>
                <div>{product.option}</div>
              </div>
            );
          })
        : 'Something went wrong. Refresh the page to try again.'}
    </div>
  );
}
