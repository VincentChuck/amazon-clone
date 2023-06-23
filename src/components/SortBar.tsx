import {
  SORTOPTIONS,
  SORTOPTIONSDISPLAY,
  type SortOption,
} from '~/utils/constants';

type SortBarProps = {
  productsOnPageIndex: string;
  numberOfResults: number;
  keyword: string;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
};

export default function SortBar({
  // pagination,
  productsOnPageIndex,
  numberOfResults,
  keyword,
  sortBy,
  setSortBy,
}: SortBarProps) {
  return (
    <div className="mb-2 hidden h-9 w-screen flex-row items-center justify-center text-sm shadow-sm shadow-gray-400 md:flex">
      <div className="flex flex-grow px-3 lg:max-w-[1800px]">
        <div className="flex-grow">
          {productsOnPageIndex} of over{' '}
          {numberOfResults.toLocaleString(undefined, {
            minimumFractionDigits: 0,
          })}{' '}
          results for
          <span className="font-bold text-amber-700">{` "${keyword}"`}</span>
        </div>
        <div className="mx-3">
          <span>Sort by: </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-md border"
          >
            {SORTOPTIONS.map((option) => (
              <option key={option} value={option}>
                {SORTOPTIONSDISPLAY[option]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
