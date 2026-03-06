import { ArrowUp, ArrowDown } from 'lucide-react';
import { computePriceDiff } from '../utils/diffUtils';
import {
  space,
  anton,
  b5,
  shadow4,
  roundedXl,
} from '../../consts';

interface PriceComparisonProps {
  leftPrice: string | undefined;
  rightPrice: string | undefined;
}

export function PriceComparison({ leftPrice, rightPrice }: PriceComparisonProps) {
  const diff = computePriceDiff(leftPrice, rightPrice);

  // Don't render if we can't compare
  if (diff.leftPrice === null || diff.rightPrice === null) return null;

  const leftIsCheaper = diff.cheaperSide === 'left';
  const rightIsCheaper = diff.cheaperSide === 'right';
  const isEqual = diff.cheaperSide === 'equal';

  return (
    <div className="flex items-center justify-between gap-4" data-testid="price-comparison">
      {/* Left Price */}
      <div className={`bg-white ${b5} ${shadow4} ${roundedXl} px-4 py-2 flex items-center gap-2`}>
        {!isEqual && (
          leftIsCheaper
            ? <ArrowDown className="size-5 text-[#00FF00]" strokeWidth={3} />
            : <ArrowUp className="size-5 text-[#FF0000]" strokeWidth={3} />
        )}
        <span className={`${anton} text-xl text-black`}>{leftPrice}</span>
      </div>

      {/* Difference Badge */}
      <div className={`bg-[#FADF0B] ${b5} ${shadow4} ${roundedXl} px-4 py-2`}>
        <span className={`${space} text-sm font-bold`}>
          {isEqual ? 'Same price' : `$${diff.difference!.toLocaleString()} difference`}
        </span>
      </div>

      {/* Right Price */}
      <div className={`bg-white ${b5} ${shadow4} ${roundedXl} px-4 py-2 flex items-center gap-2`}>
        {!isEqual && (
          rightIsCheaper
            ? <ArrowDown className="size-5 text-[#00FF00]" strokeWidth={3} />
            : <ArrowUp className="size-5 text-[#FF0000]" strokeWidth={3} />
        )}
        <span className={`${anton} text-xl text-black`}>{rightPrice}</span>
      </div>
    </div>
  );
}
