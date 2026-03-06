import { render, screen } from '@testing-library/react';
import { ComparisonColumn } from '@/src/app/compare/components/ComparisonColumn';
import type { MarketplaceListingApiData, ConditionAssessmentData } from '@/src/app/dashboard/types';

describe('ComparisonColumn', () => {
  const baseListing: MarketplaceListingApiData = {
    itemId: '123',
    title: 'MacBook Pro 2021',
    price: '$1,200',
    images: ['https://example.com/photo.jpg'],
    location: 'Seattle, WA',
    listingDate: '2 days ago',
    description: 'Great laptop for sale',
    similarListings: [
      { title: 'Similar MacBook', location: 'Portland', price: 1100, image: 'https://example.com/s1.jpg', link: 'https://facebook.com/marketplace/item/999' },
    ],
  };

  const baseAssessment: ConditionAssessmentData = {
    conditionScore: 0.85,
    conditionLabel: 'Excellent',
    modelAccuracy: '92',
    topReasons: ['Well maintained', 'No visible scratches', 'Original packaging'],
    suggestedOffer: '$1,050',
    negotiationTip: 'Mention the minor wear on the keyboard.',
  };

  it('renders listing image, title, and price', () => {
    render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="left"
      />
    );

    expect(screen.getByAltText('MacBook Pro 2021')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 2021')).toBeInTheDocument();
    expect(screen.getByText('$1,200')).toBeInTheDocument();
  });

  it('renders condition badge with score and label', () => {
    render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="left"
      />
    );

    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders suggested offer, market value, and model accuracy stats', () => {
    render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="left"
      />
    );

    expect(screen.getByText('$1,050')).toBeInTheDocument();
    expect(screen.getByText('$1,150')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('renders "Why This Price?" reasons list', () => {
    render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="left"
      />
    );

    expect(screen.getByText(/why this price/i)).toBeInTheDocument();
    expect(screen.getByText('Well maintained')).toBeInTheDocument();
    expect(screen.getByText('No visible scratches')).toBeInTheDocument();
    expect(screen.getByText('Original packaging')).toBeInTheDocument();
  });

  it('renders negotiation tip', () => {
    render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="left"
      />
    );

    expect(screen.getByText('Mention the minor wear on the keyboard.')).toBeInTheDocument();
  });

  it('uses neobrutalist design tokens (border-5 border-black, shadow)', () => {
    const { container } = render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="left"
      />
    );

    const column = container.querySelector('[data-testid="comparison-column-left"]');
    expect(column).toBeInTheDocument();
    expect(column?.className).toContain('border-5');
    expect(column?.className).toContain('border-black');
  });

  describe('condition badge color coding', () => {
    it('uses green for score >= 0.8', () => {
      const { container } = render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, conditionScore: 0.85, conditionLabel: 'Excellent' }}
          marketValue="$1,150"
          side="left"
        />
      );

      const badge = container.querySelector('[data-testid="condition-badge"]');
      expect(badge?.className).toContain('bg-[#00FF00]');
    });

    it('uses yellow for score >= 0.6 and < 0.8', () => {
      const { container } = render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, conditionScore: 0.7, conditionLabel: 'Good' }}
          marketValue="$1,150"
          side="left"
        />
      );

      const badge = container.querySelector('[data-testid="condition-badge"]');
      expect(badge?.className).toContain('bg-[#FADF0B]');
    });

    it('uses orange for score >= 0.4 and < 0.6', () => {
      const { container } = render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, conditionScore: 0.5, conditionLabel: 'Fair' }}
          marketValue="$1,150"
          side="left"
        />
      );

      const badge = container.querySelector('[data-testid="condition-badge"]');
      expect(badge?.className).toContain('bg-[#FF6600]');
    });

    it('uses red for score < 0.4', () => {
      const { container } = render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, conditionScore: 0.2, conditionLabel: 'Poor' }}
          marketValue="$1,150"
          side="left"
        />
      );

      const badge = container.querySelector('[data-testid="condition-badge"]');
      expect(badge?.className).toContain('bg-[#FF0000]');
    });
  });

  describe('handles missing optional data gracefully', () => {
    it('renders without condition data when no conditionScore', () => {
      render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, conditionScore: undefined, conditionLabel: undefined }}
          marketValue="$1,150"
          side="right"
        />
      );

      expect(screen.getByText('MacBook Pro 2021')).toBeInTheDocument();
      expect(screen.queryByTestId('condition-badge')).not.toBeInTheDocument();
    });

    it('renders without topReasons when none provided', () => {
      render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, topReasons: undefined }}
          marketValue="$1,150"
          side="left"
        />
      );

      expect(screen.getByText('MacBook Pro 2021')).toBeInTheDocument();
    });

    it('renders without negotiation tip when not provided', () => {
      render(
        <ComparisonColumn
          listing={baseListing}
          assessment={{ ...baseAssessment, negotiationTip: undefined }}
          marketValue="$1,150"
          side="left"
        />
      );

      expect(screen.getByText('MacBook Pro 2021')).toBeInTheDocument();
    });

    it('renders with null assessment', () => {
      render(
        <ComparisonColumn
          listing={baseListing}
          assessment={null}
          marketValue="$1,150"
          side="left"
        />
      );

      expect(screen.getByText('MacBook Pro 2021')).toBeInTheDocument();
      expect(screen.getByText('$1,200')).toBeInTheDocument();
    });
  });

  it('sets correct data-testid for side identification', () => {
    const { container } = render(
      <ComparisonColumn
        listing={baseListing}
        assessment={baseAssessment}
        marketValue="$1,150"
        side="right"
      />
    );

    expect(container.querySelector('[data-testid="comparison-column-right"]')).toBeInTheDocument();
  });
});
