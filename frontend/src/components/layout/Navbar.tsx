// Purpose: Top Navigation Bar Header Component with User Controls & Tenant Identity
// Path: frontend/src/components/layout/Navbar.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Factory,
  User,
  LogOut,
  Bell,
  Menu,
  ChevronDown,
  Building2,
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
// Extract display values safely
const rawUser = user as any;
const displayName = rawUser?.fullName || rawUser?.name || 'User';
const displayEmail = rawUser?.email || '';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur support-[backdrop-filter]:bg-card/75">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu Toggle & Brand Identity */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Factory className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight text-foreground">
                Garment ERP
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Garment Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Tenant Badge, Notifications & Profile Dropdown */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* User Role Badge */}
          {user?.role && (
            <div className="hidden items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary sm:inline-flex">
              {user.role}
            </div>
          )}

          {/* Notification Bell Action Button */}
          <button
            type="button"
            className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="View Alerts"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-destructive" />
          </button>

          {/* Profile Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 rounded-lg p-1.5 transition-colors hover:bg-muted focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden flex-col text-left lg:flex">
                <span className="line-clamp-1 text-xs font-semibold text-foreground">
                  {displayName}
                </span>
                <span className="line-clamp-1 text-[10px] text-muted-foreground">
                  {displayEmail}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu Box */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-56 divide-y divide-border rounded-md border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5">
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-foreground">
                      {displayName}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {displayEmail}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Account Settings
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-xs text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
