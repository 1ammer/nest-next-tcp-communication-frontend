'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserList from '@/components/UserList';
import { getToken } from '@/lib/auth';
import Card, { CardContent } from '@/components/ui/Card';

export default function UsersPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsChecking(false);
      router.replace('/login');
      return;
    }
    setIsAuthorized(true);
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card variant="bordered">
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-300">Checking authorization...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all registered users in the system
        </p>
      </div>
      <UserList />
    </div>
  );
}