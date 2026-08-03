// Purpose: Authenticated Dashboard Shell Layout Component with Route Guarding
// Path: frontend/src/app/dashboard/layout.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Hydrate auth session state on client-side mount
  useEffect(() => {
    initializeAuth();
    setIsHydrated(true);
  }, [initializeAuth]);

  // Protect dashboard routes against unauthenticated access
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(`/login?expired=true&redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isAuthenticated, router, pathname]);

  // Auto-close mobile drawer when switching routes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Render full-page loading indicator during initial hydration check
  if (!isHydrated || (!isAuthenticated && isHydrated)) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Loading Workspace...</p>
            <p className="mt-1 text-xs text-muted-foreground">Verifying security credentials</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header Navbar */}
      <Navbar onMobileMenuToggle={() => setIsMobileOpen((prev) => !prev)} />

      {/* Body Area with Sidebar and Main Page Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        {/* Dynamic Main Dashboard Content */}
        <main className="custom-scrollbar flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}