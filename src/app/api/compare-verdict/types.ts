export const VERDICT_OUTCOMES = ['LEFT_EDGES_AHEAD', 'RIGHT_EDGES_AHEAD', 'TOO_CLOSE_TO_CALL'] as const;
export type VerdictOutcome = (typeof VERDICT_OUTCOMES)[number];

export interface CompareVerdictRequest {
  leftDescription?: string;
  rightDescription?: string;
  leftImageUrl?: string;
  rightImageUrl?: string;
  leftConditionData?: {
    conditionScore?: number;
    conditionLabel?: string;
    topReasons?: string[];
    suggestedOffer?: string;
    negotiationTip?: string;
  };
  rightConditionData?: {
    conditionScore?: number;
    conditionLabel?: string;
    topReasons?: string[];
    suggestedOffer?: string;
    negotiationTip?: string;
  };
  leftPrice?: string;
  rightPrice?: string;
  leftTitle?: string;
  rightTitle?: string;
}

export interface VerdictResult {
  leftFeaturePros: string[];
  leftFeatureCons: string[];
  rightFeaturePros: string[];
  rightFeatureCons: string[];
  verdict: VerdictOutcome;
  verdictReasoning: string;
  verdictHeadline: string;
}

export interface CompareVerdictResponse {
  success: boolean;
  verdict?: VerdictResult;
  error?: string;
}
