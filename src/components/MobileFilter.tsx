import { type SortOption } from '~/utils/constants';
import MobileFilterModal from '~/components/MobileFilterModal';
import type { CategoryTree } from '~/types';

type Props = {
  numberOfResults: number;
  sortBy: SortOption;
  mergedCategoryTrees: CategoryTree[];
  categoryId: number;
  handleMobileFilter: (sortOption?: SortOption, cid?: number) => void;
};

export default function MobileFilter(props: Props) {
  const { numberOfResults, ...modalProps } = props;
  return (
    <div className="flex h-12 shadow-sm shadow-[rgba(17,17,17,.15)] md:hidden">
      <div className="line-clamp-1 grow self-center px-3 text-sm">
        Over{' '}
        {numberOfResults.toLocaleString(undefined, {
          minimumFractionDigits: 0,
        })}{' '}
        results
      </div>
      <MobileFilterModal {...modalProps} />
    </div>
  );
}
