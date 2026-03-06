import { computeConditionDiff } from '../utils/diffUtils';
import {
  space,
  b5,
  roundedXl,
} from '../../consts';

interface ConditionComparisonProps {
  leftScore?: number;
  leftLabel?: string;
  rightScore?: number;
  rightLabel?: string;
}

function getConditionColor(score: number): string {
  if (score >= 0.8) return 'bg-[#00FF00]';
  if (score >= 0.6) return 'bg-[#FADF0B]';
  if (score >= 0.4) return 'bg-[#FF6600]';
  return 'bg-[#FF0000]';
}

export function ConditionComparison({
  leftScore,
  leftLabel,
  rightScore,
  rightLabel,
}: ConditionComparisonProps) {
  const diff = computeConditionDiff(leftScore, leftLabel, rightScore, rightLabel);

  // If neither side has a score, don't render
  if (diff.leftScore === null && diff.rightScore === null) return null;

  return (
    <div className="grid grid-cols-2 gap-6" data-testid="condition-comparison">
      {/* Left Condition */}
      <div>
        {diff.leftScore !== null && diff.leftLabel !== null ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className={`${space} text-sm font-bold uppercase`}>{diff.leftLabel}</span>
              <span className={`${space} text-sm font-bold`}>{Math.round(diff.leftScore * 100)}%</span>
            </div>
            <div className={`h-4 w-full ${b5} ${roundedXl} bg-gray-200 overflow-hidden`}>
              <div
                className={`h-full ${getConditionColor(diff.leftScore)} transition-all duration-500`}
                style={{ width: `${Math.round(diff.leftScore * 100)}%` }}
              />
            </div>
          </>
        ) : (
          <span className={`${space} text-sm font-bold text-gray-400`}>N/A</span>
        )}
      </div>

      {/* Right Condition */}
      <div>
        {diff.rightScore !== null && diff.rightLabel !== null ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className={`${space} text-sm font-bold uppercase`}>{diff.rightLabel}</span>
              <span className={`${space} text-sm font-bold`}>{Math.round(diff.rightScore * 100)}%</span>
            </div>
            <div className={`h-4 w-full ${b5} ${roundedXl} bg-gray-200 overflow-hidden`}>
              <div
                className={`h-full ${getConditionColor(diff.rightScore)} transition-all duration-500`}
                style={{ width: `${Math.round(diff.rightScore * 100)}%` }}
              />
            </div>
          </>
        ) : (
          <span className={`${space} text-sm font-bold text-gray-400`}>N/A</span>
        )}
      </div>
    </div>
  );
}
