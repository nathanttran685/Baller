export interface PriceDiff {
  leftPrice: number | null;
  rightPrice: number | null;
  difference: number | null;
  cheaperSide: 'left' | 'right' | 'equal' | null;
}

export interface ConditionDiff {
  leftScore: number | null;
  rightScore: number | null;
  leftLabel: string | null;
  rightLabel: string | null;
  betterSide: 'left' | 'right' | 'equal' | null;
}

/**
 * Parse a price string like "$650", "$1,200" into a number.
 * Returns null if the string is undefined, empty, or parses to 0/NaN.
 */
function parsePrice(price: string | undefined): number | null {
  if (!price) return null;
  const stripped = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(stripped);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

/**
 * Compute the price difference between two listings.
 * Returns null for difference/cheaperSide when either price is unavailable.
 */
export function computePriceDiff(
  leftPriceStr: string | undefined,
  rightPriceStr: string | undefined,
): PriceDiff {
  const leftPrice = parsePrice(leftPriceStr);
  const rightPrice = parsePrice(rightPriceStr);

  if (leftPrice === null || rightPrice === null) {
    return { leftPrice, rightPrice, difference: null, cheaperSide: null };
  }

  const difference = Math.abs(leftPrice - rightPrice);
  let cheaperSide: 'left' | 'right' | 'equal';

  if (leftPrice < rightPrice) {
    cheaperSide = 'left';
  } else if (rightPrice < leftPrice) {
    cheaperSide = 'right';
  } else {
    cheaperSide = 'equal';
  }

  return { leftPrice, rightPrice, difference, cheaperSide };
}

/**
 * Compute the condition difference between two listings.
 * Returns null for betterSide when either score is unavailable.
 */
export function computeConditionDiff(
  leftScore: number | undefined,
  leftLabel: string | undefined,
  rightScore: number | undefined,
  rightLabel: string | undefined,
): ConditionDiff {
  const ls = leftScore ?? null;
  const rs = rightScore ?? null;
  const ll = leftLabel ?? null;
  const rl = rightLabel ?? null;

  if (ls === null || rs === null) {
    return { leftScore: ls, rightScore: rs, leftLabel: ll, rightLabel: rl, betterSide: null };
  }

  let betterSide: 'left' | 'right' | 'equal';
  if (ls > rs) {
    betterSide = 'left';
  } else if (rs > ls) {
    betterSide = 'right';
  } else {
    betterSide = 'equal';
  }

  return { leftScore: ls, rightScore: rs, leftLabel: ll, rightLabel: rl, betterSide };
}
