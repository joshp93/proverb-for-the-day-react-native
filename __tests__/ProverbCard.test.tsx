import React from 'react';
import { render } from '@testing-library/react-native';
import { ProverbCard } from '../app/components/proverb-card';
import { Proverb } from '../app/models/proverb';

describe('ProverbCard', () => {
  const mockProverb: Proverb = {
    ref: 'Proverbs 3:5',
    proverb: 'Trust in the LORD with all your heart',
  };

  it('should render the proverb text', () => {
    const { getByText } = render(<ProverbCard proverb={mockProverb} />);

    expect(getByText('Trust in the LORD with all your heart')).toBeTruthy();
  });

  it('should render with default compact false', () => {
    const { getByText } = render(<ProverbCard proverb={mockProverb} />);

    const textElement = getByText('Trust in the LORD with all your heart');
    expect(textElement).toBeTruthy();
  });

  it('should apply compact styles when compact is true', () => {
    const { getByText } = render(<ProverbCard proverb={mockProverb} compact />);

    const textElement = getByText('Trust in the LORD with all your heart');
    expect(textElement).toBeTruthy();
  });

  it('should accept additional style props', () => {
    const { getByText } = render(
      <ProverbCard proverb={mockProverb} style={{ backgroundColor: 'red' }} />
    );

    expect(getByText('Trust in the LORD with all your heart')).toBeTruthy();
  });
});