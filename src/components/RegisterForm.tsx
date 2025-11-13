'use client';

import React, { useState } from 'react';
import { authService } from '@/services/auth.service';
import { RegisterUserDto } from '@/types';
import InputField from './ui/InputField';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import Modal from './ui/Modal';

interface RegisterFormProps {
  /** Custom form title */
  title?: string;
  /** Custom button label */
  submitLabel?: string;
  /** Success message for modal */
  successMessage?: string;
  /** Called on successful registration */
  onSuccess?: (data?: any) => void;
  /** Called when an API error occurs */
  onError?: (error: string) => void;
  /** Called when form is submitted */
  onSubmit?: (data: RegisterUserDto) => void;
  /** Called when any field changes */
  onChange?: (field: string, value: string) => void;
  /** Called when modal is closed */
  onCloseModal?: () => void;
  /** Children for flexible custom content (e.g., checkboxes, terms) */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  title = 'Create New Account',
  submitLabel = 'Register',
  successMessage = 'User registered successfully!',
  onSuccess,
  onError,
  onSubmit,
  onChange,
  onCloseModal,
  children,
  className = '',
}) => {
  const [formData, setFormData] = useState<RegisterUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterUserDto>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterUserDto> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.email)
      newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';

    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterUserDto]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
    onChange?.(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      onSubmit?.(formData);
      const response = await authService.register(formData);
      if (response.success) {
        setShowSuccessModal(true);
        setFormData({ email: '', password: '', firstName: '', lastName: '' });
        onSuccess?.(response.data);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to register user';
      setApiError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onCloseModal?.();
  };

  return (
    <>
      <Card
        variant="bordered"
        padding="lg"
        className={`max-w-md mx-auto p-4 sm:p-6 ${className}`}
        role="form"
        aria-labelledby="register-title"
        aria-describedby={apiError ? 'register-error' : undefined}
      >
        <CardHeader>
          <CardTitle id="register-title" className="text-center text-lg sm:text-xl">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                fullWidth
                aria-required="true"
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                fullWidth
                aria-required="true"
              />
            </div>

            {/* Email */}
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              fullWidth
              aria-required="true"
            />

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Must be at least 8 characters"
              required
              fullWidth
              aria-required="true"
            />

            {/* Slot for custom children */}
            {children}

            {/* Error Message */}
            {apiError && (
              <div
                id="register-error"
                className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg"
                role="alert"
              >
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              aria-label="Submit registration form"
            >
              {submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        title="Success!"
        size="sm"
        aria-label="Registration success modal"
      >
        <div className="text-center">
          <div className="mb-4 text-green-500 flex justify-center" aria-hidden="true">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{successMessage}</p>
          <Button onClick={handleCloseModal} aria-label="Close success modal">
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RegisterForm;
