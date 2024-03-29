import * as Dialog from '@radix-ui/react-dialog';
import Icon from './Icon';
import {
  type Dispatch,
  type SetStateAction,
  useState,
  createContext,
  useContext,
} from 'react';
import {
  type SortOption,
  SORTOPTIONS,
  SORTOPTIONSDISPLAY,
} from '~/utils/constants';
import type { CategoryTree } from '~/types';
import Link from 'next/link';

type Props = {
  sortBy: SortOption;
  mergedCategoryTrees: CategoryTree[];
  categoryId: number;
  applyMobileFilter: (sortOption?: SortOption, cid?: number) => void;
  keyword: string;
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

export default function MobileFilterModal(props: Props) {
  const [tempSortBy, setTempSortBy] = useState<SortOption>(props.sortBy);
  const [tempCat, setTempCat] = useState<number>(props.categoryId);

  function resetFilter() {
    setTempSortBy(props.sortBy);
    setTempCat(props.categoryId);
  }

  function clearFilter() {
    setTempSortBy(SORTOPTIONS[0]);
    setTempCat(0);
  }

  const hrefObj = {
    pathname: '/products',
    query: {
      ...(props.keyword && { k: props.keyword }),
    },
  };

  return (
    <HrefContext.Provider value={hrefObj}>
      <Dialog.Root onOpenChange={resetFilter}>
        <Dialog.Trigger asChild>
          <button className="inline-flex h-full items-center justify-center border-l border-[#e6e6e6] bg-white p-3 px-[15px] text-sm leading-none text-[#007185]">
            Filters
            <Icon
              name="chevron_down"
              strokeWidth={5}
              className="ml-1 h-2.5 w-2.5"
            />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-20 bg-blackA9 data-[state=closed]:animate-overlayHide data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="fixed bottom-0 z-20 h-auto max-h-[65%] w-full overflow-y-auto rounded-t-xl bg-white focus:outline-none data-[state=closed]:animate-contentHide data-[state=open]:animate-contentShow">
            <div className="flex h-12 items-center justify-between border-b border-[#e7e7e7] px-[18px]">
              <span className="text-[15px] font-[500]">Filters</span>
              <Dialog.Close asChild>
                <span className="text-[15px] font-[500] text-[#007185]">
                  Cancel
                </span>
              </Dialog.Close>
            </div>

            <div className="mb-[68px] px-3">
              <div className="flex flex-col border-b border-[#e6e6e6] pb-3">
                <h3 className="my-3 font-[500]">
                  Categories {tempCat ? '(1)' : ''}
                </h3>
                <CategoryTreeComponent
                  mergedCategoryTrees={props.mergedCategoryTrees}
                  selectedCategoryId={props.categoryId}
                  tempCat={tempCat}
                  setTempCat={setTempCat}
                />
              </div>

              <div className="flex flex-col pb-3">
                <h3 className="my-3 font-[500]">Sort by</h3>
                <div className="mb-1 flex flex-wrap gap-2">
                  {SORTOPTIONS.map((item) => {
                    const isActive = item === tempSortBy;
                    return (
                      <button
                        key={`SORT-${item}`}
                        className={`rounded-lg border ${
                          isActive
                            ? 'border-[#c7e4e8] bg-[#e7f4f5] text-[#007185]'
                            : 'border-[#f4f4f4] bg-[#f4f4f4]'
                        } px-[7px] py-[9px] text-xs font-[500]`}
                        onClick={() => setTempSortBy(item)}
                      >
                        {SORTOPTIONSDISPLAY[item]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 flex h-[68px] w-full items-center justify-between border border-[#e6e6e6] bg-white p-[10px]">
              <button
                className="mx-[5px] mb-[8px] inline-flex h-[38px] items-center justify-center rounded-lg border border-[#f1f1f1] bg-white px-[9px] py-[6px] text-[13px] text-[#007185]"
                onClick={clearFilter}
              >
                Clear Filters
              </button>
              <Dialog.Close asChild>
                <button
                  className="mx-[5px] mb-[8px] inline-flex h-[38px] items-center justify-center rounded-lg border border-[#007185] bg-[#007185] px-[9px] py-[6px] text-[13px] text-white"
                  onClick={() => props.applyMobileFilter(tempSortBy, tempCat)}
                >
                  Apply Filters
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </HrefContext.Provider>
  );
}

type CategoryTreeProps = {
  mergedCategoryTrees: CategoryTree[];
  selectedCategoryId: number;
  tempCat: number;
  setTempCat: Dispatch<SetStateAction<number>>;
};

function CategoryTreeComponent({
  mergedCategoryTrees,
  selectedCategoryId,
  tempCat,
  setTempCat,
}: CategoryTreeProps) {
  if (selectedCategoryId) {
    const path: CategoryTree[] = [];
    let cat: CategoryTree | null = mergedCategoryTrees[0] as CategoryTree;
    while (cat) {
      path.push(cat);
      if (!cat.children || cat.children.length < 1 || !cat.children[0]) {
        if (cat.id === selectedCategoryId) {
          path.pop();
        }
        cat = null;
      } else if (cat.id === selectedCategoryId) {
        cat = null;
      } else {
        cat = cat.children[0];
      }
    }

    return (
      <div>
        <CategoryPath path={path} />
        <CategoryDisplay
          categoryTree={[path.at(-1) as CategoryTree]}
          tempCat={tempCat}
          setTempCat={setTempCat}
        />
      </div>
    );
  } else {
    return (
      <div>
        <CategoryDisplay
          categoryTree={mergedCategoryTrees}
          tempCat={tempCat}
          setTempCat={setTempCat}
        />
      </div>
    );
  }
}

type CategoryPathProps = {
  path: CategoryTree[];
};

function CategoryPath({ path }: CategoryPathProps) {
  const hrefObj = useContext(HrefContext);
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1">
      <Dialog.Close asChild>
        <Link href={hrefObj} className="text-[13px] font-[500]">
          All Books
        </Link>
      </Dialog.Close>
      <span className="text-[13px] font-[500]"> &gt; </span>
      {path.map((cat, ind) => {
        const currHrefObj = structuredClone(hrefObj);
        currHrefObj.query.cid = cat.id;
        return (
          <span key={cat.id} className="text-[13px] font-[500]">
            <Dialog.Close asChild>
              <Link href={currHrefObj}>{cat.name}</Link>
            </Dialog.Close>
            {`${ind !== path.length - 1 ? ' > ' : ''}`}
          </span>
        );
      })}
    </div>
  );
}

type CategoryDisplayProps = {
  categoryTree: CategoryTree[];
  tempCat: number;
  setTempCat: Dispatch<SetStateAction<number>>;
};

function CategoryDisplay({
  categoryTree,
  tempCat,
  setTempCat,
}: CategoryDisplayProps) {
  return (
    <div>
      {categoryTree.map((categoryTree) => {
        return (
          <div key={categoryTree.id}>
            <span className="mb-1 inline-block py-1 text-[13px] font-[500]">
              {categoryTree.name}
            </span>
            <div className="mb-1 flex flex-wrap gap-2">
              <button
                key={categoryTree.id}
                className={`rounded-lg border ${
                  categoryTree.id === tempCat
                    ? 'border-[#c7e4e8] bg-[#e7f4f5] text-[#007185]'
                    : 'border-[#f4f4f4] bg-[#f4f4f4]'
                } min-w-[44px] px-[7px] py-[9px] text-xs font-[500]`}
                onClick={() =>
                  setTempCat((prev) => {
                    return prev === categoryTree.id ? 0 : categoryTree.id;
                  })
                }
              >
                All
              </button>
              {categoryTree.children &&
                categoryTree.children.map((child) => {
                  const isActive = child.id === tempCat;
                  return (
                    <button
                      key={child.id}
                      className={`rounded-lg border ${
                        isActive
                          ? 'border-[#c7e4e8] bg-[#e7f4f5] text-[#007185]'
                          : 'border-[#f4f4f4] bg-[#f4f4f4]'
                      } px-[7px] py-[9px] text-xs font-[500]`}
                      onClick={() =>
                        setTempCat((prev) => {
                          return prev === child.id ? 0 : child.id;
                        })
                      }
                    >
                      {child.name}
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
