import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EntryForm from '../src/components/entry-form';
import { expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import React from 'react';

vi.mock('@tanstack/react-router', () => ({
  useRouter: vi.fn().mockReturnValue({
    navigate: vi.fn(),
  }),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

const queryClient = new QueryClient();
const renderWithClient = (ui: ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>, {

    }
  );
};

test('renders EntryForm component', () => {
  renderWithClient(<EntryForm />);
  const form = screen.getByText('Start time');
  const input_1 = screen.getByRole('textbox', { name: /title/i });
  expect(form).toBeInTheDocument();
});

test('allows user to submit the form', async () => {
  const user = userEvent.setup();
  const mockCreateEntry = vi.fn().mockResolvedValue(1);
  renderWithClient(<EntryForm />);
  
  await user.type(screen.getByLabelText(/title/i), 'Test Title');
  await user.type(screen.getByLabelText(/description/i), 'Test Description');
  await user.type(screen.getByLabelText(/date/i), '2023-10-01');
  
  await user.click(screen.getByText(/save entry/i));
  
  await waitFor(() => {
    expect(mockCreateEntry).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
      date: '2023-10-01'
    });
  });
});
