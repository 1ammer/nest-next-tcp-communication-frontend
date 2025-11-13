import Link from 'next/link';
import { ArrowLeft, UserCheck } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
            <UserCheck className="text-primary-600 dark:text-primary-300" size={28} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in with your email and password to continue
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
