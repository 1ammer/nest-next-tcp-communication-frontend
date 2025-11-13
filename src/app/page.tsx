'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { UserPlus, Users, CheckCircle } from 'lucide-react';
import { AUTH_EVENT_NAME, getToken } from '@/lib/auth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const updateAuthState = () => setIsAuthenticated(!!getToken());
    updateAuthState();

    window.addEventListener('storage', updateAuthState);
    window.addEventListener(AUTH_EVENT_NAME, updateAuthState);

    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener(AUTH_EVENT_NAME, updateAuthState);
    };
  }, []);

  const features = useMemo(
    () => [
      {
        icon: UserPlus,
        title: 'User Registration',
        description: 'Create new user accounts with validated forms',
      },
      {
        icon: Users,
        title: 'User Management',
        description: 'View and manage all registered users',
      },
      {
        icon: CheckCircle,
        title: 'Modern UI',
        description: 'Responsive design with dark mode support',
      },
    ],
    [],
  );

  const tabContent = useMemo(
    () => [
      {
        id: 'about',
        label: 'About',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              This is a full-stack application built with NestJS (backend) and
              Next.js (frontend). It demonstrates modern web development practices
              including microservices architecture, TypeScript, and responsive
              design.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>NestJS monorepo with TCP microservices</li>
              <li>PostgreSQL with TypeORM</li>
              <li>Next.js 14+ with App Router</li>
              <li>TailwindCSS for styling</li>
              <li>Reusable UI component library</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'features',
        label: 'Features',
        content: (
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <feature.icon className="text-primary-500 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: 'tech',
        label: 'Tech Stack',
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Backend
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• NestJS</li>
                <li>• PostgreSQL</li>
                <li>• TypeORM</li>
                <li>• TCP Microservices</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Frontend
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Next.js 14</li>
                <li>• React 18</li>
                <li>• TailwindCSS</li>
                <li>• TypeScript</li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [features],
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Task Assessment
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Full-Stack User Management Application
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated && (
            <Link href="/register">
              <Button size="lg" variant="primary">
                <UserPlus size={20} className="mr-2" />
                Register User
              </Button>
            </Link>
          )}
          <Link href="/users">
            <Button size="lg" variant={isAuthenticated ? 'primary' : 'outline'}>
              <Users size={20} className="mr-2" />
              View Users
            </Button>
          </Link>
        </div>
      </div>

      <Card variant="bordered" padding="lg" className="mb-8">
        <Tabs tabs={tabContent} variant="pills" fullWidth />
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} variant="elevated" padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <feature.icon className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}