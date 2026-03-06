import type { MarketplaceListingApiData, ConditionAssessmentData } from '../../dashboard/types';
import { computePriceDiff, computeConditionDiff } from '../utils/diffUtils';
import {
  anton,
  space,
  b5,
  shadow4,
  shadow6,
  roundedXl,
} from '../../consts';

interface DiffSummaryBannerProps {
  leftListing: MarketplaceListingApiData;
  rightListing: MarketplaceListingApiData;
  leftAssessment: ConditionAssessmentData | null;
  rightAssessment: ConditionAssessmentData | null;
}

export function DiffSummaryBanner({
  leftListing,
  rightListing,
  leftAssessment,
  rightAssessment,
}: DiffSummaryBannerProps) {
  const priceDiff = computePriceDiff(leftListing.price, rightListing.price);
  const conditionDiff = computeConditionDiff(
    leftAssessment?.conditionScore,
    leftAssessment?.conditionLabel,
    rightAssessment?.conditionScore,
    rightAssessment?.conditionLabel,
  );

  const hasPriceData = priceDiff.leftPrice !== null && priceDiff.rightPrice !== null;
  const hasConditionData = conditionDiff.leftLabel !== null && conditionDiff.rightLabel !== null;

  // Nothing to show
  if (!hasPriceData && !hasConditionData) return null;

  return (
    <div className={`${b5} ${roundedXl} bg-white p-6 ${shadow6} mx-auto max-w-6xl`}>
      <h3 className={`${anton} text-2xl uppercase mb-4`}>At a Glance</h3>

      <div className="flex flex-wrap items-center gap-3">
        {/* Price chip */}
        {hasPriceData && (
          priceDiff.cheaperSide === 'equal' ? (
            <div className={`bg-[#90EE90] ${b5} ${roundedXl} px-4 py-2 ${shadow4}`}>
              <span className={`${space} text-sm font-bold`}>Same price</span>
            </div>
          ) : (
            <div className={`bg-[#90EE90] ${b5} ${roundedXl} px-4 py-2 ${shadow4}`}>
              <span className={`${space} text-sm font-bold`}>
                ${priceDiff.difference!.toLocaleString()} price difference
              </span>
            </div>
          )
        )}

        {/* Condition chip */}
        {hasConditionData && (
          conditionDiff.leftLabel === conditionDiff.rightLabel ? (
            <div className={`bg-[#FADF0B] ${b5} ${roundedXl} px-4 py-2 ${shadow4}`}>
              <span className={`${space} text-sm font-bold`}>Same condition</span>
            </div>
          ) : (
            <div className={`bg-[#FADF0B] ${b5} ${roundedXl} px-4 py-2 ${shadow4}`}>
              <span className={`${space} text-sm font-bold`}>
                Condition: {conditionDiff.leftLabel} vs {conditionDiff.rightLabel}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
