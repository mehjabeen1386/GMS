// Purpose: Root App Router Layout, Meta Configuration & React Query Provider Envelope
// Path: frontend/src/app/layout.tsx
import React from 'react'; import type { Metadata } from 'next'; import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';
const inter = Inter({   subsets: ['latin'],   variable: '--font-sans',
  display: 'swap' });
export const metadata: Metadata = {
  title: 'Garmint ERP - Garment Manufacturing Management System',
  description: 'Enterprise Cloud ERP for Garment Contractors, Fabric Tracking, Job Orders, and Piece-Rate Payroll',   keywords: ['Garment Manufacturing', 'Textile ERP', 'Job Order Management', 'Piece-Rate Payroll', 'Fabric Tracking'
  authors: [{ name: 'Garmint Engineering Team' }] };
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {   return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased custom-scrollbar">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
