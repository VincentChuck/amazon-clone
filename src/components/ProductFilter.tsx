import { createContext, useContext } from 'react';
import Link from 'next/link';
import Icon from '~/components/Icon';
import type { CategoryTree } from '~/types';

type ProductsProps = {
  mergedCategoryTrees: CategoryTree[];
  keyword: string;
  categoryId: number;
};

type HrefObj = {
  pathname: string;
  query: {
    k?: string;
    cid?: number;
  };
};

const HrefContext = createContext<HrefObj>({
  pathname: '/products',
  query: {},
});

export default function ProductFilter({
  mergedCategoryTrees,
  keyword,
  categoryId: selectedCategoryId,
}: ProductsProps) {
  const hrefObj = {
    pathname: '/products',
    query: {
      ...(keyword && { k: keyword }),
    },
  };

  return (
    <HrefContext.Provider value={hrefObj}>
      <div className="hidden w-[20vw] max-w-[360px] flex-shrink-0 flex-col px-1 pr-3 text-sm md:flex">
        <span className="mb-2 font-bold">Department</span>
        {!!selectedCategoryId && (
          <CategoryItem
            name="All Books"
            id={0}
            bold={false}
            isAncestor={true}
          />
        )}
        <ul>
          {mergedCategoryTrees?.map((categoryTree) => {
            return (
              <Category
                key={categoryTree.id}
                categoryTree={categoryTree}
                selectedCategoryId={selectedCategoryId}
                nestLevel={0}
              />
            );
          })}
        </ul>
      </div>
    </HrefContext.Provider>
  );
}

type CategoryProps = {
  categoryTree: CategoryTree;
  selectedCategoryId: number;
  nestLevel: number;
};

function Category({
  categoryTree,
  selectedCategoryId,
  nestLevel,
}: CategoryProps) {
  const isSelected = categoryTree.id === selectedCategoryId;
  const bold = isSelected;
  const isAncestor =
    !!selectedCategoryId &&
    categoryTree &&
    !!categoryTree.children &&
    categoryTree.children?.map((cat) => cat.id).includes(selectedCategoryId) &&
    selectedCategoryId !== categoryTree.id;
  if (isSelected) nestLevel = 0;
  return (
    <li className={`${nestLevel > 1 ? 'hidden' : ''}`}>
      <CategoryItem
        {...{
          name: categoryTree.name,
          id: categoryTree.id,
          bold,
          isAncestor: isAncestor,
        }}
      />
      {categoryTree.children && categoryTree.children.length > 0 && (
        <ul className="pl-2">
          {categoryTree.children.map((category) => {
            return (
              <Category
                key={category.id}
                categoryTree={category}
                selectedCategoryId={selectedCategoryId}
                nestLevel={nestLevel + 1}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}

type CategoryItemProps = {
  name: string;
  id: number;
  bold: boolean;
  isAncestor: boolean;
};

function CategoryItem({ name, id, bold, isAncestor }: CategoryItemProps) {
  const hrefObj = useContext(HrefContext);
  if (id) hrefObj.query.cid = id;
  if (bold) return <span className="font-bold">{name}</span>;
  return (
    <Link href={hrefObj}>
      {isAncestor && (
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
