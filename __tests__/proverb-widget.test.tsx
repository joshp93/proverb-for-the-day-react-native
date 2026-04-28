import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ProverbWidget } from '../app/_components/proverb-widget';
import { Proverb } from '../app/_models/proverb';

const mockProverb: Proverb = {
  proverb: 'A wise man knows himself to be a fool',
  ref: 'Proverbs 12:15',
};

describe('ProverbWidget Component', () => {
  describe('Rendering states', () => {
    it('should render proverb text when data is available', () => {
      render(<ProverbWidget proverb={mockProverb} />);

      expect(screen.getByText(mockProverb.proverb)).toBeTruthy();
      expect(screen.getByText(mockProverb.ref)).toBeTruthy();
    });

    it('should render loading state', () => {
      render(<ProverbWidget loading={true} />);

      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('should render error state', () => {
      render(<ProverbWidget error="Test error" />);

      expect(screen.getByText('Unable to load proverb')).toBeTruthy();
    });

    it('should render empty state when no proverb', () => {
      render(<ProverbWidget proverb={null} />);

      expect(screen.getByText('No proverb available')).toBeTruthy();
    });

    it('should prioritize error state over empty state', () => {
      render(<ProverbWidget proverb={null} error="Test error" />);

      expect(screen.getByText('Unable to load proverb')).toBeTruthy();
    });

    it('should prioritize loading state over proverb display', () => {
      render(<ProverbWidget proverb={mockProverb} loading={true} />);

      expect(screen.getByText('Loading...')).toBeTruthy();
      expect(screen.queryByText(mockProverb.proverb)).toBeFalsy();
    });
  });

  describe('Size variations', () => {
    it('should render with small size', () => {
      const { getByTestId } = render(
        <ProverbWidget proverb={mockProverb} size="small" testID="small-widget" />
      );

      const widget = getByTestId('small-widget');
      expect(widget).toBeTruthy();
    });

    it('should render with medium size (default)', () => {
      const { getByTestId } = render(
        <ProverbWidget proverb={mockProverb} testID="medium-widget" />
      );

      const widget = getByTestId('medium-widget');
      expect(widget).toBeTruthy();
    });

    it('should render with large size', () => {
      const { getByTestId } = render(
        <ProverbWidget proverb={mockProverb} size="large" testID="large-widget" />
      );

      const widget = getByTestId('large-widget');
      expect(widget).toBeTruthy();
    });
  });

  describe('Props handling', () => {
    it('should handle null proverb gracefully', () => {
      render(<ProverbWidget proverb={null} />);

      expect(screen.getByText('No proverb available')).toBeTruthy();
    });

    it('should handle undefined proverb', () => {
      render(<ProverbWidget />);

      expect(screen.getByText('No proverb available')).toBeTruthy();
    });

    it('should handle empty error string', () => {
      render(<ProverbWidget proverb={mockProverb} error="" />);

      expect(screen.getByText(mockProverb.proverb)).toBeTruthy();
    });

    it('should accept custom styles', () => {
      const { getByTestId } = render(
        <ProverbWidget
          proverb={mockProverb}
          style={{ backgroundColor: 'red' }}
          testID="styled-widget"
        />
      );

      const widget = getByTestId('styled-widget');
      expect(widget).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long proverb text', () => {
      const longProverb: Proverb = {
        proverb:
          'A' +
          'B'.repeat(500) +
          'C', // Very long text
        ref: 'Test Reference',
      };

      render(<ProverbWidget proverb={longProverb} />);

      const proverbText = 'A' + 'B'.repeat(500) + 'C';
      expect(screen.getByText(proverbText)).toBeTruthy();
    });

    it('should handle special characters in proverb', () => {
      const specialProverb: Proverb = {
        proverb: 'Test "proverb" with \'quotes\' & special chars!',
        ref: 'Test 123',
      };

      render(<ProverbWidget proverb={specialProverb} />);

      expect(screen.getByText(specialProverb.proverb)).toBeTruthy();
    });

    it('should handle emoji in proverb text', () => {
      const emojiProverb: Proverb = {
        proverb: 'A wise 🧠 mind 💭',
        ref: 'Emoji Reference 📖',
      };

      render(<ProverbWidget proverb={emojiProverb} />);

      expect(screen.getByText(emojiProverb.proverb)).toBeTruthy();
      expect(screen.getByText(emojiProverb.ref)).toBeTruthy();
    });
  });

  describe('Multiple render cycles', () => {
    it('should update from loading to proverb display', () => {
      const { rerender } = render(<ProverbWidget loading={true} />);

      expect(screen.getByText('Loading...')).toBeTruthy();

      rerender(<ProverbWidget proverb={mockProverb} loading={false} />);

      expect(screen.getByText(mockProverb.proverb)).toBeTruthy();
      expect(screen.queryByText('Loading...')).toBeFalsy();
    });

    it('should update from error to proverb display', () => {
      const { rerender } = render(<ProverbWidget error="Error occurred" />);

      expect(screen.getByText('Unable to load proverb')).toBeTruthy();

      rerender(<ProverbWidget proverb={mockProverb} error={null} />);

      expect(screen.getByText(mockProverb.proverb)).toBeTruthy();
    });

    it('should update between different proverbs', () => {
      const anotherProverb: Proverb = {
        proverb: 'Another proverb',
        ref: 'Another Ref',
      };

      const { rerender } = render(<ProverbWidget proverb={mockProverb} />);

      expect(screen.getByText(mockProverb.proverb)).toBeTruthy();

      rerender(<ProverbWidget proverb={anotherProverb} />);

      expect(screen.queryByText(mockProverb.proverb)).toBeFalsy();
      expect(screen.getByText(anotherProverb.proverb)).toBeTruthy();
    });
  });
});
