import React from 'react';
import { render, screen } from '@testing-library/react';
import RentCarForm from './RentCarForm';

test('renders RentCarForm component', () => {
  render(<RentCarForm />);
  const rentButton = screen.getByText(/Rent Car/i);
  expect(rentButton).toBeInTheDocument();
});