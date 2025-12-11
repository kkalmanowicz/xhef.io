import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';

const NavigationWithRouter = () => (
  <BrowserRouter>
    <Navigation />
  </BrowserRouter>
);

describe('Navigation Component', () => {
  it('renders navigation elements', () => {
    render(<NavigationWithRouter />);

    // Check for the logo text
    expect(screen.getByText('Xhef.io')).toBeInTheDocument();

    // Check for navigation links
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('has sign in and join buttons', () => {
    render(<NavigationWithRouter />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Join Early Access')).toBeInTheDocument();
  });
});
