'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginDto } from '@/types';
import { setToken } from '@/lib/auth';
import InputField from './ui/InputField';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginDto>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginDto>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginDto> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginDto]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await authService.login(formData);
      if (response.success && response.data) {
        setToken(response.data.accessToken);
        router.replace('/users');
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'invalid email or password';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            fullWidth
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            fullWidth
          />
          {apiError && (
            <div
              className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg"
              role="alert"
            >
              {apiError}
            </div>
          )}
          <Button type="submit" loading={loading} fullWidth size="lg">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
