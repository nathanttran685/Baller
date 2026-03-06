import type { CompareVerdictRequest } from './types';

/**
 * Builds a structured prompt for GPT-4o-mini to compare two marketplace listings
 * and produce feature-level pros/cons plus a verdict.
 */
export function buildCompareVerdictPrompt(request: CompareVerdictRequest): string {
  const leftDesc = request.leftDescription?.trim() || 'No description available';
  const rightDesc = request.rightDescription?.trim() || 'No description available';

  const leftCondition = formatConditionData('Left', request.leftConditionData);
  const rightCondition = formatConditionData('Right', request.rightConditionData);

  const leftContext = [
    request.leftTitle ? `Title: ${request.leftTitle}` : '',
    request.leftPrice ? `Price: ${request.leftPrice}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  const rightContext = [
    request.rightTitle ? `Title: ${request.rightTitle}` : '',
    request.rightPrice ? `Price: ${request.rightPrice}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  return `Compare these two marketplace listings and determine which is the better deal.

## LEFT LISTING
${leftContext ? `${leftContext}\n` : ''}Description: ${leftDesc}
${leftCondition}

## RIGHT LISTING
${rightContext ? `${rightContext}\n` : ''}Description: ${rightDesc}
${rightCondition}

## INSTRUCTIONS

Analyze both listings based on their descriptions, images (if provided), and condition data. Focus on feature-level differences extracted from the descriptions and images. Do NOT repeat price or condition comparisons -- those are handled separately. Instead, identify specific features mentioned in descriptions or visible in images (e.g., "Includes original accessories", "Shows wear on corners", "Has upgraded components").

If neither listing has a clear advantage across price AND condition AND features, return TOO_CLOSE_TO_CALL.

Use a balanced recommendation tone, not aggressive winner language.

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "leftFeaturePros": ["string array, 1-3 items, specific feature advantages of the left listing"],
  "leftFeatureCons": ["string array, 1-3 items, specific feature disadvantages of the left listing"],
  "rightFeaturePros": ["string array, 1-3 items, specific feature advantages of the right listing"],
  "rightFeatureCons": ["string array, 1-3 items, specific feature disadvantages of the right listing"],
  "verdict": "LEFT_EDGES_AHEAD | RIGHT_EDGES_AHEAD | TOO_CLOSE_TO_CALL",
  "verdictReasoning": "2-3 sentences explaining the trade-offs and why one edges ahead or why it's too close",
  "verdictHeadline": "Short phrase summarizing the verdict (e.g., 'Left edges ahead on value')"
}`;
}

function formatConditionData(
  label: string,
  data?: CompareVerdictRequest['leftConditionData'],
): string {
  if (!data) return '';

  const parts: string[] = [];

  if (data.conditionScore !== undefined) {
    parts.push(`Condition Score: ${data.conditionScore}`);
  }
  if (data.conditionLabel) {
    parts.push(`Condition Label: ${data.conditionLabel}`);
  }
  if (data.topReasons && data.topReasons.length > 0) {
    parts.push(`Key Observations: ${data.topReasons.join(', ')}`);
  }
  if (data.suggestedOffer) {
    parts.push(`Suggested Offer: ${data.suggestedOffer}`);
  }
  if (data.negotiationTip) {
    parts.push(`Negotiation Tip: ${data.negotiationTip}`);
  }

  if (parts.length === 0) return '';

  return `${label} Condition Assessment:\n${parts.join('\n')}`;
}
