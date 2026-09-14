// Purpose: User Login Page Component with Zod Schema Validation & Session Token Storage
// Path: frontend/src/app/(auth)/login/page.tsx

'use client';

import React, { Suspense } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Factory, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

// Validation Schema for Login Input Fields
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isExpired = searchParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, token, accessToken } = response.data.data || response.data;
      const sessionToken = token || accessToken;
      
      // Update Zustand Auth Store state and local storage
      setAuth(user, sessionToken);
      
      // Redirect to dashboard upon successful session creation
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error response:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Invalid email or password. Please check your credentials and try again.';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Factory className="h-10 w-10" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-foreground">
          Sign in to Garment ERP
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enterprise Garment Production & Piece-Rate Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-border bg-card px-4 py-8 shadow-md sm:rounded-xl sm:px-10">
          {/* Session Expiration Warning Alert */}
          {isExpired && (
            <div className="mb-6 flex items-start space-x-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-xs font-medium">
                Your session has expired. Please log in again to continue accessing your contractor workspace.
              </p>
            </div>
          )}

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 flex items-start space-x-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-xs font-medium">{serverError}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="contractor@garment.com"
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Quick Registration Redirect Link */}
          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an enterprise contractor account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Register Workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
