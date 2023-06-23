import * as Dialog from '@radix-ui/react-dialog';
import Icon from './Icon';
import { useState } from 'react';
import {
  type SortOption,
  SORTOPTIONS,
  SORTOPTIONSDISPLAY,
} from '~/utils/constants';
import type { CategoryTree } from '~/types';

type Props = {
  sortBy: SortOption;
  mergedCategoryTrees: CategoryTree[];
  categoryId: number;
  handleMobileFilter: (sortOption?: SortOption, cid?: number) => void;
};

export default function MobileFilterModal(props: Props) {
  const [tempSortBy, setTempSortBy] = useState<SortOption>(props.sortBy);
  const [tempCat, setTempCat] = useState<string>();
  // function handleClose() {}

  return (
    <Dialog.Root>
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
        <Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=closed]:animate-overlayHide data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed bottom-0 h-auto w-full rounded-t-xl bg-white focus:outline-none data-[state=closed]:animate-contentHide data-[state=open]:animate-contentShow">
          <div className="flex h-12 items-center justify-between border-b border-[#e7e7e7] px-[18px]">
            <span className="text-[15px] font-[500]">Filters</span>
            <Dialog.Close asChild>
              <span className="text-[15px] font-[500] text-[#007185]">
                Close
              </span>
            </Dialog.Close>
          </div>

          <div className="px-3">
            <div className="flex flex-col border-b border-[#e6e6e6] pb-3">
              <h3 className="my-3 font-[500]">Categories</h3>
              <div className="mb-1 flex flex-wrap gap-2">
                {new Array(8).fill(0).map((_item, index) => {
                  const isActive =
                    index.toString() === (tempCat?.split('-')[1] || '0');
                  return (
                    <button
                      key={index}
                      className={`rounded-lg border ${
                        isActive
                          ? 'border-[#c7e4e8] bg-[#e7f4f5] text-[#007185]'
                          : 'border-[#f4f4f4] bg-[#f4f4f4]'
                      } px-[7px] py-[9px] text-xs font-[500]`}
                      onClick={() => setTempCat(`cat-${index}`)}
                    >
                      Category {'a'.repeat(index)}
                    </button>
                  );
                })}
              </div>
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

          <div className="flex h-auto items-center justify-between border border-[#e6e6e6] p-[10px]">
            <button className="mx-[5px] mb-[8px] inline-flex h-[38px] items-center justify-center rounded-lg border border-[#f1f1f1] bg-white px-[9px] py-[6px] text-[13px] text-[#007185]">
              Clear Filters
            </button>
            <Dialog.Close asChild>
              <button
                className="mx-[5px] mb-[8px] inline-flex h-[38px] items-center justify-center rounded-lg border border-[#007185] bg-[#007185] px-[9px] py-[6px] text-[13px] text-white"
                onClick={() => null}
              >
                Show Results
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}