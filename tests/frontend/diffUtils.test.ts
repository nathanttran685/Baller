import { computePriceDiff, computeConditionDiff } from '@/src/app/compare/utils/diffUtils';

describe('computePriceDiff', () => {
  it('returns cheaperSide=left when left price is lower', () => {
    const result = computePriceDiff('$650', '$800');
    expect(result).toEqual({
      leftPrice: 650,
      rightPrice: 800,
      difference: 150,
      cheaperSide: 'left',
    });
  });

  it('returns cheaperSide=right when right price is lower', () => {
    const result = computePriceDiff('$800', '$650');
    expect(result).toEqual({
      leftPrice: 800,
      rightPrice: 650,
      difference: 150,
      cheaperSide: 'right',
    });
  });

  it('returns cheaperSide=equal when prices are the same', () => {
    const result = computePriceDiff('$500', '$500');
    expect(result).toEqual({
      leftPrice: 500,
      rightPrice: 500,
      difference: 0,
      cheaperSide: 'equal',
    });
  });

  it('returns null fields when left price is undefined', () => {
    const result = computePriceDiff(undefined, '$500');
    expect(result).toEqual({
      leftPrice: null,
      rightPrice: 500,
      difference: null,
      cheaperSide: null,
    });
  });

  it('treats $0 as invalid (leftPrice=null)', () => {
    const result = computePriceDiff('$0', '$500');
    expect(result).toEqual({
      leftPrice: null,
      rightPrice: 500,
      difference: null,
      cheaperSide: null,
    });
  });

  it('handles comma-formatted prices correctly', () => {
    const result = computePriceDiff('$1,200', '$800');
    expect(result).toEqual({
      leftPrice: 1200,
      rightPrice: 800,
      difference: 400,
      cheaperSide: 'right',
    });
  });

  it('returns all null when both prices are undefined', () => {
    const result = computePriceDiff(undefined, undefined);
    expect(result).toEqual({
      leftPrice: null,
      rightPrice: null,
      difference: null,
      cheaperSide: null,
    });
  });
});

describe('computeConditionDiff', () => {
  it('returns betterSide=left when left score is higher', () => {
    const result = computeConditionDiff(0.9, 'Excellent', 0.6, 'Good');
    expect(result).toEqual({
      leftScore: 0.9,
      rightScore: 0.6,
      leftLabel: 'Excellent',
      rightLabel: 'Good',
      betterSide: 'left',
    });
  });

  it('returns betterSide=right when right score is higher', () => {
    const result = computeConditionDiff(0.5, 'Fair', 0.8, 'Excellent');
    expect(result).toEqual({
      leftScore: 0.5,
      rightScore: 0.8,
      leftLabel: 'Fair',
      rightLabel: 'Excellent',
      betterSide: 'right',
    });
  });

  it('returns betterSide=equal when scores are the same', () => {
    const result = computeConditionDiff(0.7, 'Good', 0.7, 'Good');
    expect(result).toEqual({
      leftScore: 0.7,
      rightScore: 0.7,
      leftLabel: 'Good',
      rightLabel: 'Good',
      betterSide: 'equal',
    });
  });

  it('returns betterSide=null when left score is undefined', () => {
    const result = computeConditionDiff(undefined, undefined, 0.8, 'Excellent');
    expect(result).toEqual({
      leftScore: null,
      rightScore: 0.8,
      leftLabel: null,
      rightLabel: 'Excellent',
      betterSide: null,
    });
  });

  it('returns betterSide=null when right score is undefined', () => {
    const result = computeConditionDiff(0.7, 'Good', undefined, undefined);
    expect(result).toEqual({
      leftScore: 0.7,
      rightScore: null,
      leftLabel: 'Good',
      rightLabel: null,
      betterSide: null,
    });
  });

  it('returns all null when both scores are undefined', () => {
    const result = computeConditionDiff(undefined, undefined, undefined, undefined);
    expect(result).toEqual({
      leftScore: null,
      rightScore: null,
      leftLabel: null,
      rightLabel: null,
      betterSide: null,
    });
  });
});
