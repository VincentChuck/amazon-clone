import type { listedCategories } from '~/types';
import Link from 'next/link';
import Icon from '~/components/Icon';

type ProductsProps = {
  mergedCategoryTrees: listedCategories;
  keyword: string;
  categoryId: number;
};

export default function ProductFilter({
  mergedCategoryTrees,
  keyword,
}: ProductsProps) {
  const keywordParam = keyword ? `k=${keyword}&` : '';

  return (
    <div>
      <div className="hidden w-auto flex-col px-1 pr-20 outline md:flex">
        <span className="text-sm font-bold">Department</span>
        <ul>
          {mergedCategoryTrees?.map((categoryTree) => {
            return (
              <li key={categoryTree.id}>
                <Link
                  href={`/products?${keywordParam}cid=${categoryTree.id}`}
                  className="text-sm font-bold"
                >
                  <Icon
                    name="chevron_left"
                    strokeWidth={2.5}
                    className="inline h-3 w-3"
                  />
                  <span>{categoryTree.name}</span>
                </Link>
                <ul>
                  {categoryTree.children &&
                    categoryTree.children.map((category) => {
                      return (
                        <li key={category.id} className="pl-2 text-sm">
                          <Link
                            href={`/products?${keywordParam}cid=${category.id}`}
                          >
                            {category.name}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
