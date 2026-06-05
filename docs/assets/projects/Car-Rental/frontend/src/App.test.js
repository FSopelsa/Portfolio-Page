import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to Felix Car Rental/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders Rent a Car button', () => {
  render(<App />);
  const rentButton = screen.getByText(/Rent a Car/i);
  expect(rentButton).toBeInTheDocument();
});

test('renders Admin Overview button', () => {
  render(<App />);
  const adminButton = screen.getByText(/Admin Overview/i);
  expect(adminButton).toBeInTheDocument();
});