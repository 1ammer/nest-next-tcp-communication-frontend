import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';

vi.mock('@/services/auth.service', () => ({
  authService: {
    register: vi.fn(),
  },
}));

import { authService } from '@/services/auth.service';

const mockRegister = vi.mocked(authService.register);

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', {
      name: /submit registration form/i,
    });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits form and shows success modal on success response', async () => {
    mockRegister.mockResolvedValueOnce({
      success: true,
      message: 'User registered successfully',
      data: {
        id: '1',
        email: 'jane.doe@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane.doe@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');

    const submitButton = screen.getByRole('button', {
      name: /submit registration form/i,
    });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'jane.doe@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Doe',
      });
    });

    expect(
      await screen.findByText(/user registered successfully!/i),
    ).toBeInTheDocument();
  });

  it('shows api error message when registration fails', async () => {
    mockRegister.mockRejectedValueOnce(
      new Error('Registration failed. Please try again later.'),
    );

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane.doe@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');

    const submitButton = screen.getByRole('button', {
      name: /submit registration form/i,
    });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(
      await screen.findByText(/failed to register user/i),
    ).toBeInTheDocument();
  });
});
