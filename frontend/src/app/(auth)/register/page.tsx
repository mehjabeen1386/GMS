// Purpose: Multi-Tenant Contractor Registration Page with Zod Validation
// Path: frontend/src/app/(auth)/register/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Factory, Lock, Mail, User, Building2, Phone, AlertCircle, ArrowRight } from 'lucide-react';

// Validation Schema for Enterprise Registration Input Fields
const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    companyName: z.string().min(3, 'Company or workshop name must be at least 3 characters'),
    email: z.string().email('Please enter a valid business email address'),
    phone: z.string().min(10, 'Please enter a valid 10-digit mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'CONTRACTOR',
      });
      const { user, token } = response.data.data || response.data;

      // Update Zustand Auth Store state and persist local session
      setAuth(user, token);

      // Redirect to dashboard upon successful workspace provisioning
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error response:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Registration failed. This email or company domain may already be registered.';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Factory className="h-10 w-10" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-foreground">
          Register Contractor Workspace
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Provision a dedicated multi-tenant environment for your garment manufacturing unit
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="border border-border bg-card px-4 py-8 shadow-md sm:rounded-xl sm:px-10">
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 flex items-start space-x-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-xs font-medium">{serverError}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Rajesh Kumar"
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Company / Workshop Name Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
                Garment Enterprise Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  {...register('companyName')}
                  type="text"
                  placeholder="Apex Apparel Industries"
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-xs font-medium text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Business Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="admin@apexapparel.com"
                    className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Mobile Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="9876543210"
                    className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Confirm Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Provisioning Workspace...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Provision Contractor Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Quick Login Link */}
          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an enterprise contractor account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}