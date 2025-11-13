'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { User } from '@/types';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import { Users, RefreshCw, AlertCircle } from 'lucide-react';
import { clearToken } from '@/lib/auth';

interface UserListProps {
  /** Optional callback triggered when users are fetched successfully */
  onUsersFetched?: (users: User[]) => void;
  /** Optional callback for error handling */
  onError?: (error: string) => void;
  /** Allows passing children (e.g., custom header actions) */
  children?: React.ReactNode;
  /** Custom class name for container */
  className?: string;
}

const UserList: React.FC<UserListProps> = ({
  onUsersFetched,
  onError,
  children,
  className = '',
}) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
        onUsersFetched?.(response.data);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        clearToken();
        router.replace('/login');
        return;
      }
      const errorMessage = err?.response?.data?.message || 'Failed to fetch users';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router, onUsersFetched, onError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <Card variant="bordered" aria-busy="true" aria-live="polite">
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-primary-500" size={32} aria-hidden="true" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading users...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <Card variant="bordered" role="alert" aria-live="assertive">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} aria-hidden="true" />
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchUsers} variant="primary" aria-label="Try fetching users again">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ Empty state
  if (users.length === 0) {
    return (
      <Card variant="bordered" aria-live="polite">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="text-gray-400 mb-4" size={48} aria-hidden="true" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No users found</p>
            <Button onClick={fetchUsers} variant="outline" aria-label="Refresh user list">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ Main list rendering
  return (
    <div className={`space-y-4 ${className}`} aria-live="polite">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" aria-label="Registered Users">
          Registered Users ({users.length})
        </h2>
        <div className="flex gap-2 items-center">
          {children}
          <Button onClick={fetchUsers} variant="outline" size="sm" aria-label="Refresh user list">
            <RefreshCw size={16} className="mr-2" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Card variant="bordered" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" role="table">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    role="row"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden grid gap-4" role="list">
        {users.map((user) => (
          <Card key={user.id} variant="bordered" role="listitem">
            <CardHeader>
              <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Registered:</span>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserList;
