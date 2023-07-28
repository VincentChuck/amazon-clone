import * as ToggleGroup from '@radix-ui/react-toggle-group';
import Icon from './Icon';
import * as Separator from '@radix-ui/react-separator';

type ProductsPaginationProps = {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleJumpPage: (page: number) => void;
  lastPage: number;
  page: number;
  isFetching: boolean;
  hasMore: boolean;
  isPreviousData: boolean;
};

const toggleGroupItemClasses = `flex h-12 sm:min-w-[48px] px-[1.8vw] sm:px-3 w-auto items-center justify-center bg-white text-[14px] leading-4 first:rounded-l-lg first:sm:min-w-[69px] last:rounded-r-lg last:sm:min-w-[69px] focus:z-10 focus:bg-[#f5f6f6] focus:outline-none hover:bg-[#f5f6f6] data-[disabled]:hover:bg-white data-[disabled]:text-[#6f7373] data-[state=on]:shadow-[0_0_0_2px] data-[state=on]:z-10`;

export default function ProductsPagination({
  handlePreviousPage,
  handleNextPage,
  handleJumpPage,
  lastPage,
  page,
  isFetching,
  hasMore,
  isPreviousData,
}: ProductsPaginationProps) {
  return (
    <div className="mb-4 flex items-center justify-center">
      <ToggleGroup.Root
        className="flex h-[50px] items-center justify-center space-x-px rounded-lg border border-[#d5d9d9] shadow-[0_1px_2px_0px_rgba(0,0,0,.1)]"
        type="single"
        value={page.toString()}
        aria-label="Pagination"
        disabled={isFetching}
      >
        <ToggleGroup.Item
          className={toggleGroupItemClasses}
          value="previous"
          aria-label="Previous page"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <Icon
            name="chevron_left"
            strokeWidth={4}
            className="mr-2 mt-[0.5px] h-4 w-4"
          />
          Previous
        </ToggleGroup.Item>
        <Separator.Root
          className="mx-[15px] h-8 w-px bg-[#d5d9d9]"
          decorative
          orientation="vertical"
        />

        <PageItem page={1} handleJumpPage={handleJumpPage} />

        {lastPage > 2 && (
          <PaginationMiddle {...{ page, lastPage, handleJumpPage }} />
        )}

        {lastPage > 1 && (
          <PageItem page={lastPage} handleJumpPage={handleJumpPage} />
        )}

        <Separator.Root
          className="mx-[15px] h-8 w-px bg-[#d5d9d9]"
          decorative
          orientation="vertical"
        />
        <ToggleGroup.Item
          className={toggleGroupItemClasses}
          value="next"
          aria-label="Next page"
          onClick={handleNextPage}
          disabled={isPreviousData || !hasMore}
        >
          Next
          <Icon
            name="chevron_right"
            strokeWidth={4}
            className="ml-2 mt-[0.5px] h-4 w-4"
          />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
}

type PageItemProps = {
  page: number | '...';
  handleJumpPage: (page: number) => void;
};

function PageItem({ page, handleJumpPage }: PageItemProps) {
  return (
    <ToggleGroup.Item
      className={toggleGroupItemClasses}
      value={page.toString()}
      aria-label={
        typeof page === 'number' ? `Page ${page}` : 'Pagination ellipsis'
      }
      onClick={() => (typeof page === 'number' ? handleJumpPage(page) : null)}
      disabled={typeof page !== 'number'}
    >
      {page}
    </ToggleGroup.Item>
  );
}

type PaginationMiddleProps = {
  page: number;
  lastPage: number;
  handleJumpPage: (page: number) => void;
};

function PaginationMiddle({
  page,
  lastPage,
  handleJumpPage,
}: PaginationMiddleProps) {
  if (lastPage <= 5) {
    const pageArr = new Array(lastPage - 2).fill(0).map((_, i) => i + 2);

    return pageArr.map((page) => {
      return (
        <PageItem page={page} key={page} handleJumpPage={handleJumpPage} />
      );
    });
  } else {
    let pageArr: Array<number> = [];
    pageArr.push(...[page - 1, page, page + 1]);
    if (page === 1) pageArr.push(3);
    if (page === lastPage) pageArr.push(lastPage - 2);
    pageArr = pageArr
      .filter((page) => page > 1 && page < lastPage)
      .sort((a, b) => a - b);

    const pageArrWithGap: Array<number | '...'> = pageArr;
    if ((pageArrWithGap[0] as number) > 2) pageArrWithGap.unshift('...');
    if ((pageArrWithGap[pageArrWithGap.length - 1] as number) < lastPage - 1)
      pageArrWithGap.push('...');

    return pageArrWithGap.map((page, ind) => (
      <PageItem page={page} key={ind} handleJumpPage={handleJumpPage} />
    ));
  }
}
