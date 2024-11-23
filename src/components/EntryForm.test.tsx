import { render, screen, fireEvent } from '@testing-library/react';
import EntryForm from './entry-form';
import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();
const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

test('renders EntryForm component', () => {
  renderWithClient(<EntryForm />);
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
});

test('allows user to submit the form', async () => {
  const mockCreateEntry = vi.fn().mockResolvedValue(1);
  renderWithClient(<EntryForm />);
  
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
  fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-10-01' } });
  
  fireEvent.click(screen.getByText(/save entry/i));
  
  await waitFor(() => {
    expect(mockCreateEntry).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
      date: '2023-10-01'
    });
  });
});
