import {
  SORTOPTIONS,
  sortOptionsDisplay,
  type SortOption,
} from '~/utils/constants';
import MobileFilterModal from '~/components/MobileFilterModal';

type Props = {
  numberOfResults: number;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
};

export default function MobileFilter({
  numberOfResults,
  sortBy,
  setSortBy,
}: Props) {
  return (
    <div className="flex h-12 shadow-sm shadow-[rgba(17,17,17,.15)] md:hidden">
      <div className="line-clamp-1 grow self-center px-3">
        Over{' '}
        {numberOfResults.toLocaleString(undefined, {
          minimumFractionDigits: 0,
        })}{' '}
        results
      </div>
      <MobileFilterModal />
    </div>
  );
}
