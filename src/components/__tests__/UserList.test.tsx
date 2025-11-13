import { render, screen, waitFor } from '@testing-library/react';
import UserList from '../UserList';

vi.mock('@/services/auth.service', () => ({
  authService: {
    getAllUsers: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  clearToken: vi.fn(),
}));

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

import { authService } from '@/services/auth.service';
import { clearToken } from '@/lib/auth';

const mockGetAllUsers = vi.mocked(authService.getAllUsers);
const mockClearToken = vi.mocked(clearToken);

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    replaceMock.mockClear();
  });

  it('redirects to login on 401 response and clears token', async () => {
    mockGetAllUsers.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    render(<UserList />);

    await waitFor(() => {
      expect(mockClearToken).toHaveBeenCalled();
      expect(replaceMock).toHaveBeenCalledWith('/login');
    });
  });
});
