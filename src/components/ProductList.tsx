import { api } from '~/utils/api';

export default function ProductList() {
  const { data: products, isLoading, isError } = api.product.all.useQuery();
  if (isLoading) return <div>Loading products 🔄</div>;
  if (isError) return <div>Error fetching products ❌</div>;
  return (
    <div>
      {products.length
        ? products.map((product) => (
            <div key={product.id}>
              <h1>{product.name}</h1>
              <div>{product.price}</div>
              <div>{product.option}</div>
            </div>
          ))
        : 'Something went wrong. Refresh the page to try again.'}
    </div>
  );
}
