'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Users, UserPlus, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './ui/Button';
import { AUTH_EVENT_NAME, clearToken, getToken } from '@/lib/auth';

interface NavbarProps {
  /** Optional brand name to display */
  brandName?: string;
  /** Link destination for the brand/logo */
  brandHref?: string;
  /** Add custom links dynamically */
  customLinks?: { href: string; label: string; icon?: React.ElementType }[];
  /** Callback when logout is clicked */
  onLogout?: () => void;
  /** Callback when theme toggle is clicked */
  onThemeToggle?: () => void;
  /** Allow inserting extra elements (e.g., search, user avatar) */
  children?: React.ReactNode;
  /** Additional className overrides */
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  brandName = 'TaskApp',
  brandHref = '/',
  customLinks,
  onLogout,
  onThemeToggle,
  children,
  className = '',
}) => {
  const pathname = usePathname();
  const router = useRouter();
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

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    onLogout?.();
    router.push('/login');
  };

  // Default links
  const defaultLinks = [{ href: '/', label: 'Home', icon: null }];
  if (!isAuthenticated) defaultLinks.push({ href: '/register', label: 'Register', icon: UserPlus });
  if (isAuthenticated) defaultLinks.push({ href: '/users', label: 'Users', icon: Users });
  else defaultLinks.push({ href: '/login', label: 'Login', icon: LogIn });

  const links = customLinks ?? defaultLinks;

  return (
    <nav
      className={cn(
        'bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section: brand + nav links */}
          <div className="flex items-center space-x-8">
            <Link
              href={brandHref}
              className="text-xl font-bold text-primary-600 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md"
              aria-label={brandName}
            >
              {brandName}
            </Link>

            {/* Navigation links (desktop only) */}
            <div className="hidden md:flex space-x-4">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400',
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && <Icon size={18} aria-hidden="true" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right section: children + actions */}
          <div className="flex items-center gap-3">
            {children}

            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:inline-flex"
                aria-label="Logout"
              >
                <LogOut size={16} className="mr-2" aria-hidden="true" />
                Logout
              </Button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md p-2"
                aria-label="Logout"
              >
                <LogOut size={20} aria-hidden="true" />
              </button>
            )}

            <ThemeToggle onClick={onThemeToggle} aria-label="Toggle theme" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
