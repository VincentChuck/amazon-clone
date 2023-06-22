import * as Dialog from '@radix-ui/react-dialog';
import Icon from './Icon';

export default function MobileFilterModal() {
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
          <div className="flex h-12 flex-row-reverse items-center border-b-[2px] border-[#e6e6e6] px-[18px]">
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
                {new Array(8).fill(0).map((_item, index) => (
                  <button
                    key={index}
                    className="rounded-lg border border-[rgb(244,244,244)] bg-[#f4f4f4] px-[7px] py-[9px] text-xs font-[500]"
                  >
                    Category {'a'.repeat(index)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col border-b border-[#e6e6e6] pb-3">
              <h3 className="my-3 font-[500]">Sort by</h3>
              <div className="mb-1 flex flex-wrap gap-2">
                {new Array(8).fill(0).map((_item, index) => (
                  <button
                    key={index}
                    className="rounded-lg border border-[rgb(244,244,244)] bg-[#f4f4f4] px-[7px] py-[9px] text-xs font-[500]"
                  >
                    Button {'a'.repeat(index)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button>Clear Filters</button>
            <Dialog.Close asChild>
              <button className="inline-flex h-[35px] items-center justify-center rounded-s bg-[#007185] px-[9px] text-[15px] text-white">
                Show Results
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
