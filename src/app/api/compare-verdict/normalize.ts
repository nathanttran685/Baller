import { VERDICT_OUTCOMES, type VerdictOutcome, type VerdictResult } from './types';

const SAFE_DEFAULTS: VerdictResult = {
  leftFeaturePros: [],
  leftFeatureCons: [],
  rightFeaturePros: [],
  rightFeatureCons: [],
  verdict: 'TOO_CLOSE_TO_CALL',
  verdictReasoning: 'Both listings present comparable value.',
  verdictHeadline: 'Too close to call',
};

/**
 * Normalizes a string array: filters non-strings, trims, removes empties, caps at maxLength.
 */
function normalizeStringArray(value: unknown, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxLength);
}

/**
 * Validates that a value is one of the allowed verdict outcomes.
 */
function normalizeVerdict(value: unknown): VerdictOutcome {
  if (typeof value === 'string' && (VERDICT_OUTCOMES as readonly string[]).includes(value)) {
    return value as VerdictOutcome;
  }
  return 'TOO_CLOSE_TO_CALL';
}

/**
 * Parses the raw JSON response from OpenAI into a validated VerdictResult.
 * Returns safe defaults on any parsing failure.
 */
export function parseVerdictResponse(rawContent: string): VerdictResult {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(rawContent) as Record<string, unknown>;
  } catch {
    return { ...SAFE_DEFAULTS };
  }

  return {
    leftFeaturePros: normalizeStringArray(parsed.leftFeaturePros, 3),
    leftFeatureCons: normalizeStringArray(parsed.leftFeatureCons, 3),
    rightFeaturePros: normalizeStringArray(parsed.rightFeaturePros, 3),
    rightFeatureCons: normalizeStringArray(parsed.rightFeatureCons, 3),
    verdict: normalizeVerdict(parsed.verdict),
    verdictReasoning:
      typeof parsed.verdictReasoning === 'string' && parsed.verdictReasoning.trim().length > 0
        ? parsed.verdictReasoning.trim()
        : SAFE_DEFAULTS.verdictReasoning,
    verdictHeadline:
      typeof parsed.verdictHeadline === 'string' && parsed.verdictHeadline.trim().length > 0
        ? parsed.verdictHeadline.trim()
        : SAFE_DEFAULTS.verdictHeadline,
  };
}
