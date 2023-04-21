import Image from 'next/image';
import { api } from '~/utils/api';

export default function ProductList() {
  const { data, isLoading, isError } = api.product.all.useQuery();
  if (isLoading) return <div>Loading products 🔄</div>;
  if (isError) return <div>Error fetching products ❌</div>;

  const { products, mergedCategoryTrees } = data;

  return (
    <div className="flex justify-center">
      <div className="mr-20 flex w-1/12 flex-col outline">
        <span className="font-bold">Department</span>
        <ul>
          {mergedCategoryTrees?.map((categoryTree) => {
            return (
              <li key={categoryTree.id}>
                <span className="font-bold">{categoryTree.name}</span>
                <ul>
                  {categoryTree.children &&
                    categoryTree.children.map((category) => {
                      return (
                        <li key={category.id} className="pl-2">
                          {category.name}
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-3/5">
        <h1 className="text-xl font-bold">Results</h1>
        <div>
          {products.length
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
      </div>
    </div>
  );
}
