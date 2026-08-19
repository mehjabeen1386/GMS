
// Purpose: Sidebar Navigation Component with folder-matching links
// Path: frontend/src/components/layout/Sidebar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Scissors, 
  ClipboardList, 
  Factory, 
  BarChart3, 
  Settings as SettingsIcon, 
  UserCheck 
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Buyers', href: '/buyers', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Scissors },
  { name: 'Orders', href: '/orders', icon: ClipboardList },
  { name: 'Production', href: '/production', icon: Factory },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Workers', href: '/workers', icon: UserCheck },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-card p-4 flex flex-col justify-between shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } top-16 md:top-0`}>
        <div className="space-y-6">
          <nav className="space-y-1 mt-4 md:mt-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3 py-2 border-t border-border text-xs text-muted-foreground">
          <p>Garment ERP Operations</p>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}