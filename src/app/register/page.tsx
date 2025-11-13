import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Register New User
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new account by filling out the form below
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}