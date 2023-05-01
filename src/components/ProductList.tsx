import type { listedProducts, listedCategories } from '~/types';
import Image from 'next/image';

type ProductsProps = {
  products: listedProducts;
  mergedCategoryTrees: listedCategories;
};

export default function ProductList({
  products,
  mergedCategoryTrees,
}: ProductsProps) {
  return (
    <div className="flex justify-center">
      {/* results filter */}
      <section className="mr-20 hidden w-auto flex-col outline md:flex">
        <span className=" font-bold">Department</span>
        <ul>
          {mergedCategoryTrees?.map((categoryTree) => {
            return (
              <li key={categoryTree.id}>
                <span className=" font-bold">{categoryTree.name}</span>
                <ul>
                  {categoryTree.children &&
                    categoryTree.children.map((category) => {
                      return (
                        <li key={category.id} className=" pl-2">
                          {category.name}
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      {/* results */}
      <section className="w-3/5">
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
    </div>
  );
}
