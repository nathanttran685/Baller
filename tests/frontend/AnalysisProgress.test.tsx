import { render, screen } from '@testing-library/react';
import { AnalysisProgress } from '@/src/app/dashboard/(components)/AnalysisProgress';

const STEPS = ['Fetching listing', 'Analyzing condition', 'Finalizing'];

describe('AnalysisProgress Component', () => {
  it('renders the title "Analyzing Listing..."', () => {
    render(<AnalysisProgress currentStep={0} steps={STEPS} />);
    expect(screen.getByText('Analyzing Listing...')).toBeInTheDocument();
  });

  it('renders all three step labels', () => {
    render(<AnalysisProgress currentStep={0} steps={STEPS} />);
    expect(screen.getByText('Fetching listing')).toBeInTheDocument();
    expect(screen.getByText('Analyzing condition')).toBeInTheDocument();
    expect(screen.getByText('Finalizing')).toBeInTheDocument();
  });

  it('renders the correct number of step indicators', () => {
    const { container } = render(<AnalysisProgress currentStep={0} steps={STEPS} />);
    const stepBars = container.querySelectorAll('[data-testid^="step-bar-"]');
    expect(stepBars).toHaveLength(3);
  });

  describe('when currentStep is 0 (first step active)', () => {
    it('shows the first step label as prominent (not gray)', () => {
      render(<AnalysisProgress currentStep={0} steps={STEPS} />);
      const firstLabel = screen.getByText('Fetching listing');
      expect(firstLabel).not.toHaveClass('text-gray-400');
    });

    it('shows the last step label as muted (gray)', () => {
      render(<AnalysisProgress currentStep={0} steps={STEPS} />);
      const lastLabel = screen.getByText('Finalizing');
      expect(lastLabel).toHaveClass('text-gray-400');
    });

    it('shows the first step bar as active (yellow pulsing)', () => {
      const { container } = render(<AnalysisProgress currentStep={0} steps={STEPS} />);
      const firstBar = container.querySelector('[data-testid="step-bar-0"]');
      expect(firstBar).toHaveClass('bg-[#FADF0B]');
      expect(firstBar).toHaveClass('animate-pulse');
    });

    it('shows the last step bar as pending (gray)', () => {
      const { container } = render(<AnalysisProgress currentStep={0} steps={STEPS} />);
      const lastBar = container.querySelector('[data-testid="step-bar-2"]');
      expect(lastBar).toHaveClass('bg-gray-200');
    });
  });

  describe('when currentStep is 1 (second step active)', () => {
    it('shows the first step bar as completed (green)', () => {
      const { container } = render(<AnalysisProgress currentStep={1} steps={STEPS} />);
      const firstBar = container.querySelector('[data-testid="step-bar-0"]');
      expect(firstBar).toHaveClass('bg-[#90EE90]');
    });

    it('shows the second step bar as active (yellow pulsing)', () => {
      const { container } = render(<AnalysisProgress currentStep={1} steps={STEPS} />);
      const secondBar = container.querySelector('[data-testid="step-bar-1"]');
      expect(secondBar).toHaveClass('bg-[#FADF0B]');
      expect(secondBar).toHaveClass('animate-pulse');
    });

    it('shows the third step bar as pending (gray)', () => {
      const { container } = render(<AnalysisProgress currentStep={1} steps={STEPS} />);
      const thirdBar = container.querySelector('[data-testid="step-bar-2"]');
      expect(thirdBar).toHaveClass('bg-gray-200');
    });
  });

  describe('when currentStep is 2 (last step, all complete)', () => {
    it('shows all step labels as prominent (not gray)', () => {
      render(<AnalysisProgress currentStep={2} steps={STEPS} />);
      expect(screen.getByText('Fetching listing')).not.toHaveClass('text-gray-400');
      expect(screen.getByText('Analyzing condition')).not.toHaveClass('text-gray-400');
      expect(screen.getByText('Finalizing')).not.toHaveClass('text-gray-400');
    });

    it('shows all step bars as completed (green)', () => {
      const { container } = render(<AnalysisProgress currentStep={2} steps={STEPS} />);
      const bar0 = container.querySelector('[data-testid="step-bar-0"]');
      const bar1 = container.querySelector('[data-testid="step-bar-1"]');
      const bar2 = container.querySelector('[data-testid="step-bar-2"]');
      expect(bar0).toHaveClass('bg-[#90EE90]');
      expect(bar1).toHaveClass('bg-[#90EE90]');
      expect(bar2).toHaveClass('bg-[#90EE90]');
    });
  });
});
