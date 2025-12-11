import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the SupabaseContext
vi.mock('./contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    session: null,
    user: null,
    loading: false
  }),
  SupabaseProvider: ({ children }) => children
}));

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<AppWithRouter />);
    // Just test that the app renders without throwing an error
    expect(document.body).toBeInTheDocument();
  });

  it('shows landing page by default', () => {
    render(<AppWithRouter />);
    // Check for some text that should be on the landing page
    expect(document.querySelector('h1')).toBeInTheDocument();
  });
});