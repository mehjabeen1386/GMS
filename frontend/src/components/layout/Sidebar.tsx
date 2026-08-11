// Purpose: Collapsible Navigation Sidebar with Active Route Highlighting & Role Navigation
// Path: frontend/src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Scissors,
  ClipboardList,
  Building2,
  Wallet,
  BarChart3,
  Users,
  Settings,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Array<'CONTRACTOR' | 'SUPER_ADMIN' | 'WORKER'>;
}

// Updated paths to match app folder structure directly:
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Fabric Inventory',
    href: '/inventory',
    icon: Scissors,
    roles: ['CONTRACTOR', 'SUPER_ADMIN'],
  },
  {
    title: 'Job Orders',
    href: '/orders',
    icon: ClipboardList,
  },
  {
    title: 'Workshops',
    href: '/production',
    icon: Building2,
    roles: ['CONTRACTOR', 'SUPER_ADMIN'],
  },
  {
    title: 'Piece-Rate Payroll',
    href: '/workers/payouts',
    icon: Wallet,
    roles: ['CONTRACTOR', 'SUPER_ADMIN'],
  },
  {
    title: 'Reports & Audits',
    href: '/reports',
    icon: BarChart3,
    roles: ['CONTRACTOR', 'SUPER_ADMIN'],
  },
  {
    title: 'Worker Management',
    href: '/workers',
    icon: Users,
    roles: ['CONTRACTOR', 'SUPER_ADMIN'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userRole = user?.role || 'CONTRACTOR';

  // Filter navigation links based on active user role permissions
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container - Mobile: Fixed Drawer | Desktop: Sticky Layout Column */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6 lg:hidden">
          <span className="font-bold text-foreground">Navigation Menu</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close Navigation Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Navigation Links List */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1.5">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              // Exact match for root items or nested match
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="border-t border-border bg-muted/30 p-4">
          <div className="flex items-center space-x-3 rounded-md border border-border bg-card px-2 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-muted-foreground">
              Production System v1.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}