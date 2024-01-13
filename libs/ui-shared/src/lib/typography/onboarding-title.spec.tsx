import { render, screen } from '@testing-library/react';
import { OnBoardingTitle } from './onboarding-title';
import React from 'react';
import '@testing-library/jest-dom';

describe('OnBoardingTitle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <OnBoardingTitle>Hello World!</OnBoardingTitle>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display the children text', () => {
    render(<OnBoardingTitle>Hello World</OnBoardingTitle>);
    const element = screen.getByText('Hello World');
    expect(element).toBeDefined();
  });

  it('should apply default color class', () => {
    render(<OnBoardingTitle>Hello World</OnBoardingTitle>);
    const element = screen.getByText('Hello World');
    expect(element).toHaveClass('text-white');
  });

  it('should apply custom color class', () => {
    render(
      <OnBoardingTitle color="text-blue-500">Hello World</OnBoardingTitle>
    );
    const element = screen.getByText('Hello World');
    expect(element).toHaveClass('text-blue-500');
  });

  it('should apply custom styles', () => {
    render(
      <OnBoardingTitle styles="custom-style">Hello World</OnBoardingTitle>
    );
    const element = screen.getByText('Hello World');
    expect(element).toHaveClass('custom-style');
  });

  it('should pass additional props to the h1 element', () => {
    render(<OnBoardingTitle id="testId">Hello World</OnBoardingTitle>);
    const element = screen.getByText('Hello World');
    expect(element).toHaveAttribute('id', 'testId');
  });
});
