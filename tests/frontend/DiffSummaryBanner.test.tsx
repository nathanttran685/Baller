import { render, screen } from '@testing-library/react';
import { DiffSummaryBanner } from '@/src/app/compare/components/DiffSummaryBanner';
import type { MarketplaceListingApiData, ConditionAssessmentData } from '@/src/app/dashboard/types';

describe('DiffSummaryBanner', () => {
  const leftListing: MarketplaceListingApiData = {
    title: 'MacBook Pro 2021',
    price: '$650',
  };

  const rightListing: MarketplaceListingApiData = {
    title: 'Dell XPS 15',
    price: '$800',
  };

  const leftAssessment: ConditionAssessmentData = {
    conditionScore: 0.9,
    conditionLabel: 'Excellent',
  };

  const rightAssessment: ConditionAssessmentData = {
    conditionScore: 0.6,
    conditionLabel: 'Good',
  };

  it('shows price difference text when prices differ', () => {
    render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={leftAssessment}
        rightAssessment={rightAssessment}
      />
    );

    expect(screen.getByText(/\$150 price difference/i)).toBeInTheDocument();
  });

  it('shows "Same price" when prices are equal', () => {
    render(
      <DiffSummaryBanner
        leftListing={{ ...leftListing, price: '$500' }}
        rightListing={{ ...rightListing, price: '$500' }}
        leftAssessment={leftAssessment}
        rightAssessment={rightAssessment}
      />
    );

    expect(screen.getByText(/same price/i)).toBeInTheDocument();
  });

  it('shows condition comparison when labels differ', () => {
    render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={leftAssessment}
        rightAssessment={rightAssessment}
      />
    );

    expect(screen.getByText(/condition: excellent vs good/i)).toBeInTheDocument();
  });

  it('shows "Same condition" when condition labels are the same', () => {
    render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={{ conditionScore: 0.85, conditionLabel: 'Excellent' }}
        rightAssessment={{ conditionScore: 0.82, conditionLabel: 'Excellent' }}
      />
    );

    expect(screen.getByText(/same condition/i)).toBeInTheDocument();
  });

  it('renders nothing when both listings lack price and condition data', () => {
    const { container } = render(
      <DiffSummaryBanner
        leftListing={{ title: 'Item A' }}
        rightListing={{ title: 'Item B' }}
        leftAssessment={null}
        rightAssessment={null}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('uses neobrutalist styling (border-5, shadow, Anton font)', () => {
    const { container } = render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={leftAssessment}
        rightAssessment={rightAssessment}
      />
    );

    const banner = container.firstChild as HTMLElement;
    expect(banner.className).toContain('border-5');
    expect(banner.className).toContain('border-black');
  });

  it('shows "AT A GLANCE" title', () => {
    render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={leftAssessment}
        rightAssessment={rightAssessment}
      />
    );

    expect(screen.getByText(/at a glance/i)).toBeInTheDocument();
  });

  it('omits condition chip when assessment is null', () => {
    render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={null}
        rightAssessment={null}
      />
    );

    // Should still show price diff but no condition chip
    expect(screen.getByText(/\$150 price difference/i)).toBeInTheDocument();
    expect(screen.queryByText(/condition/i)).not.toBeInTheDocument();
  });

  it('uses neutral tone -- no "better deal" language', () => {
    const { container } = render(
      <DiffSummaryBanner
        leftListing={leftListing}
        rightListing={rightListing}
        leftAssessment={leftAssessment}
        rightAssessment={rightAssessment}
      />
    );

    const text = container.textContent?.toLowerCase() ?? '';
    expect(text).not.toContain('better deal');
    expect(text).not.toContain('best');
    expect(text).not.toContain('winner');
    expect(text).not.toContain('recommend');
  });
});
