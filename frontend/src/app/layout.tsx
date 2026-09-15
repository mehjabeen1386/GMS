
// Purpose: Root Layout wrapping all pages with Navbar and Sidebar
// Path: frontend/src/app/layout.tsx

'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login ya Register page par Navbar/Sidebar nahi dikhega
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname?.includes('/login') || pathname?.includes('/register');

  if (isAuthPage) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col bg-muted/10">
          {/* Top Navbar */}
          <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Sidebar with all page links */}
            <Sidebar 
              isOpen={mobileMenuOpen} 
              onClose={() => setMobileMenuOpen(false)} 
            />

            {/* Main Content Area (Yeh har page ka content yahan load karega) */}
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}