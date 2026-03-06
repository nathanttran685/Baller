import { render, screen } from '@testing-library/react';
import { SimilarListings } from '@/src/app/dashboard/(components)/SimilarListings';

// Mock next/link to render as a plain anchor tag
jest.mock('next/link', () => {
  return ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('SimilarListings Component', () => {
  const mockListings = [
    {
      title: 'MacBook Pro 2020',
      location: 'Seattle, WA',
      price: 800,
      image: 'https://example.com/image1.jpg',
      link: 'https://facebook.com/marketplace/item/123',
    },
    {
      title: 'Dell XPS 13',
      location: 'Bellevue, WA',
      price: 600,
      image: 'https://example.com/image2.jpg',
      link: 'https://facebook.com/marketplace/item/456',
    },
  ];

  it('renders the similar listings heading', () => {
    render(<SimilarListings listings={mockListings} />);
    expect(screen.getByText('SIMILAR LISTINGS')).toBeInTheDocument();
  });

  it('renders all provided listings', () => {
    render(<SimilarListings listings={mockListings} />);
    expect(screen.getByText('MacBook Pro 2020')).toBeInTheDocument();
    expect(screen.getByText('Dell XPS 13')).toBeInTheDocument();
  });

  it('displays listing prices', () => {
    render(<SimilarListings listings={mockListings} />);
    expect(screen.getByText('$800')).toBeInTheDocument();
    expect(screen.getByText('$600')).toBeInTheDocument();
  });

  it('displays listing locations', () => {
    render(<SimilarListings listings={mockListings} />);
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument();
    expect(screen.getByText('Bellevue, WA')).toBeInTheDocument();
  });

  it('renders empty state when no listings provided', () => {
    render(<SimilarListings listings={[]} />);
    expect(screen.getByText('SIMILAR LISTINGS')).toBeInTheDocument();
  });

  describe('ballerUrl wiring', () => {
    it('renders "RUN IN BALLER" for each listing card', () => {
      render(<SimilarListings listings={mockListings} />);
      const buttons = screen.getAllByText('RUN IN BALLER');
      expect(buttons).toHaveLength(2);
    });

    it('renders RUN IN BALLER links with correct href containing encoded Facebook URL', () => {
      render(<SimilarListings listings={mockListings} />);
      const ballerLinks = screen.getAllByRole('link', { name: /run in baller/i });
      expect(ballerLinks).toHaveLength(2);
      expect(ballerLinks[0]).toHaveAttribute(
        'href',
        `/dashboard?listingUrl=${encodeURIComponent('https://facebook.com/marketplace/item/123')}`
      );
      expect(ballerLinks[1]).toHaveAttribute(
        'href',
        `/dashboard?listingUrl=${encodeURIComponent('https://facebook.com/marketplace/item/456')}`
      );
    });
  });
});
