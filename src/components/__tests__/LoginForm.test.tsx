import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  setToken: vi.fn(),
}));

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

import { authService } from '@/services/auth.service';
import { setToken } from '@/lib/auth';

const mockLogin = vi.mocked(authService.login);
const mockSetToken = vi.mocked(setToken);

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    replaceMock.mockClear();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('logs in successfully and redirects to users page', async () => {
    mockLogin.mockResolvedValueOnce({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'mock-token',
        user: {
          id: '1',
          email: 'jane.doe@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'jane.doe@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass123!');

    const submitButton = screen.getByRole('button', { name: /login/i });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'jane.doe@example.com',
        password: 'SecurePass123!',
      });
    });

    expect(mockSetToken).toHaveBeenCalledWith('mock-token');
    expect(replaceMock).toHaveBeenCalledWith('/users');
  });

  it('shows error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'jane.doe@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');

    const submitButton = screen.getByRole('button', { name: /login/i });
    const form = submitButton.closest('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
