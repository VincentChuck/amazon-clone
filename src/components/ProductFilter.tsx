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
  categoryId: selectedCategoryId,
}: ProductsProps) {
  const keywordParam = keyword ? `k=${keyword}&` : '';
  const baseUrl = `/products?${keywordParam}`;

  return (
    <div>
      <div className="hidden w-auto flex-shrink-0 flex-col whitespace-nowrap px-1 pr-20 text-sm outline md:flex">
        <span className="mb-2 font-bold">Department</span>
        {!!selectedCategoryId && (
          <CategoryItem
            name="Any Department"
            url={baseUrl}
            bold={false}
            goUp={true}
          />
        )}
        <CategoryTree
          {...{ mergedCategoryTrees, baseUrl, selectedCategoryId }}
        />
      </div>
    </div>
  );
}

type CategoryTreeProps = {
  mergedCategoryTrees: listedCategories;
  baseUrl: string;
  selectedCategoryId: number;
};

function CategoryTree({
  mergedCategoryTrees,
  baseUrl,
  selectedCategoryId,
}: CategoryTreeProps) {
  return (
    <ul>
      {mergedCategoryTrees?.map((categoryTree) => {
        return (
          <Category
            key={categoryTree.id}
            categoryTree={categoryTree}
            baseUrl={baseUrl}
            selectedCategoryId={selectedCategoryId}
          />
        );
      })}
    </ul>
  );
}

type CategoryProps = {
  categoryTree: listedCategories[number];
  baseUrl: string;
  selectedCategoryId: number;
};

function Category({
  categoryTree,
  baseUrl,
  selectedCategoryId,
}: CategoryProps) {
  const bold = categoryTree.id === selectedCategoryId;
  const goUp =
    !!selectedCategoryId &&
    categoryTree &&
    !!categoryTree.children &&
    categoryTree.children.length > 0 &&
    selectedCategoryId !== categoryTree.id;
  return (
    <li key={categoryTree.id}>
      <CategoryItem
        {...{
          name: categoryTree.name,
          url: `${baseUrl}cid=${categoryTree.id}`,
          bold,
          goUp,
        }}
      />
      <ul className="pl-2">
        {categoryTree.children &&
          categoryTree.children.map((category) => {
            return (
              <Category
                key={category.id}
                categoryTree={category}
                baseUrl={baseUrl}
                selectedCategoryId={selectedCategoryId}
              />
            );
          })}
      </ul>
    </li>
  );
}

type CategoryItemProps = {
  name: string;
  url: string;
  bold: boolean;
  goUp: boolean;
};

function CategoryItem({ name, url, bold, goUp }: CategoryItemProps) {
  if (bold) return <span className="font-bold">{name}</span>;
  return (
    <Link href={url}>
      {goUp && (
        <Icon
          name="chevron_left"
          strokeWidth={2.5}
          className="inline h-3 w-3"
        />
      )}
      <span>{name}</span>
    </Link>
  );
}
