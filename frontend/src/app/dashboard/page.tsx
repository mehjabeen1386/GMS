
// Purpose: Clean ERP Dashboard Page with KPI metrics and banner image
// Path: frontend/src/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Scissors, Package, Wallet, 
  Plus, RefreshCw 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import iconImage from '../icon.png';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [workersCount, setWorkersCount] = useState(48);
  const [totalUnpaid, setTotalUnpaid] = useState(184500);

  const loadDashboardData = () => {
    if (typeof window !== 'undefined') {
      const keys = ['soms_tailors', 'tailors', 'workers', 'workforce', 'soms_workforce'];
      let foundWorkers = [];

      for (const key of keys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              foundWorkers = parsed;
              break;
            }
          } catch (e) {}
        }
      }
      if (foundWorkers.length > 0) {
        setWorkersCount(foundWorkers.length);
        const calculatedUnpaid = foundWorkers.reduce((acc, curr) => {
          const bal = Number(String(curr.unpaidBalance || curr.balance || curr.salary || '0').replace(/[^0-9.-]+/g, '')) || 0;
          return acc + bal;
        }, 0);
        if (calculatedUnpaid > 0) setTotalUnpaid(calculatedUnpaid);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadDashboardData();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, Contractor! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is your factory production status and piece-rate ledger summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadDashboardData}
            className="inline-flex items-center rounded-lg border border-input bg-background px-3 py-2 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </button>
          <Link 
            href="/orders" 
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> New Job Order
          </Link>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Job Orders</p>
            <Scissors className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mt-2">12</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">On schedule</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Factory Workforce</p>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mt-2">{workersCount}</h3>
          <p className="text-xs text-muted-foreground mt-1">Active tailors & checkers</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fabric in Stock</p>
            <Package className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mt-2">3,450 m</h3>
          <p className="text-xs text-muted-foreground mt-1">Across active inventory</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Payouts</p>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">₹{totalUnpaid.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-muted-foreground mt-1">Unbilled piece logs</p>
        </div>
      </div>

      {/* Bottom Area with Local icon.png Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center">
        <div className="w-full h-80 relative rounded-xl overflow-hidden bg-muted/20 flex items-center justify-center">
          <Image 
            src={iconImage} 
            alt="Garment Operations Banner" 
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>
    </div>
  );
}