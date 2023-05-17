type SortBarProps = {
  // pagination: string;
  numberOfProducts: number;
  keyword: string;
};
export default function SortBar({
  // pagination,
  numberOfProducts,
  keyword,
}: SortBarProps) {
  return (
    <div className="mb-2 hidden h-9 w-screen flex-row items-center justify-center text-sm shadow-sm shadow-gray-400 md:flex">
      <div className="flex flex-grow lg:max-w-[1800px]">
        <div className="flex-grow">
          {numberOfProducts} results for
          <span className="font-bold text-amber-700">{` "${keyword}"`}</span>
        </div>
        <div className="mx-4">some box</div>
      </div>
    </div>
  );
}
