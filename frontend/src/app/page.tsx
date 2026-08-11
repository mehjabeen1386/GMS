// Purpose: Root Application Entry Landing Page & Client Auth Redirection Router
// Path: frontend/src/app/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Factory, ArrowRight, ShieldCheck, Cpu, Wallet, Layers } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground">Initializing Garment ERP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Factory className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Garment ERP</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Cpu className="h-3.5 w-3.5" />
            <span>Garment Production OS</span>
          </div>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
            Precision Control for Garment Manufacturing & Piece-Rate Payroll
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Streamline fabric inventory tracking, automate job order assignments, monitor floor operations in real-time.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
            >
              <span>Launch Contractor Workspace</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground sm:w-auto"
            >
              Log In to Portal
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-border bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="w-fit rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Fabric & Order Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor fabric consumption per garment unit, optimize material cutting efficiency, and track job orders.
                </p>
              </div>
              <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="w-fit rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Piece-Rate Payroll</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate wages based on completed task quantities. Post approved payouts directly into double-entry accounts.
                </p>
              </div>
              <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="w-fit rounded-lg bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Multi-Tenant Security</h3>
                <p className="text-sm text-muted-foreground">
                  Strict contractor data isolation enforced via JWT claims and tenant-scoped database indices across service nodes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Garment ERP. All rights reserved. Enterprise Garment Manufacturing Software.</p>
      </footer>
    </div>
  );
}