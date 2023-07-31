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
  setSortBy(sortOption: SortOption): void;
};

export default function SortBar({
  // pagination,
  productsOnPageIndex,
  numberOfResults,
  keyword,
  sortBy,
  setSortBy,
}: SortBarProps) {
  const numberOfResultsFormated = numberOfResults.toLocaleString(undefined, {
    minimumFractionDigits: 0,
  });

  return (
    <div className="mb-2 hidden h-9 w-screen flex-row items-center justify-center text-sm shadow-sm shadow-gray-400 md:flex">
      <div className="flex flex-grow px-3 lg:max-w-[1800px]">
        <div className="flex-grow">
          {numberOfResults > 0 ? (
            <span>
              {productsOnPageIndex} of over {numberOfResultsFormated}
            </span>
          ) : (
            <span>{numberOfResultsFormated}</span>
          )}
          <span> results for </span>
          <span className="font-bold text-amber-700">{`"${keyword}"`}</span>
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
