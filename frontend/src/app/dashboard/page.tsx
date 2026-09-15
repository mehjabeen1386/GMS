
// Purpose: Clean ERP Dashboard Page with KPI metrics and banner image
// Path: frontend/src/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Scissors,
  Package,
  Wallet,
  Plus,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import iconImage from '../icon.png';
import AIAdvisorWidget from './AIAdvisorWidget';
import api from '@/lib/api';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [workersCount, setWorkersCount] = useState(0);
  const [fabricInStock, setFabricInStock] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      const data = response.data?.data ?? response.data ?? {};

      setActiveOrdersCount(Number(data.activeOrdersCount ?? 0));
      setWorkersCount(Number(data.factoryWorkforce ?? 0));
      setFabricInStock(Number(data.fabricInStock ?? 0));
      setTotalUnpaid(Number(data.pendingPayouts ?? 0));
      return;
    } catch (error) {
      console.warn('Dashboard summary endpoint unavailable, falling back to direct aggregate calls:', error);
    }

    const [ordersResult, workersResult, inventoryResult] = await Promise.allSettled([
      api.get('/orders?limit=1000'),
      api.get('/workers?limit=1000'),
      api.get('/inventory/rolls'),
    ]);

    if (ordersResult.status === 'fulfilled') {
      const responseData = ordersResult.value.data?.data ?? ordersResult.value.data;
      const orders = Array.isArray(responseData)
        ? responseData
        : responseData?.orders || responseData?.items || [];
      setActiveOrdersCount(
        orders.filter((order: any) => !['COMPLETED', 'CANCELLED'].includes(order.status)).length,
      );
    }

    if (workersResult.status === 'fulfilled') {
      const responseData = workersResult.value.data?.data ?? workersResult.value.data;
      const workers = Array.isArray(responseData)
        ? responseData
        : responseData?.workers || responseData?.items || [];
      const activeWorkers = workers.filter(
        (worker: any) => worker.status === undefined || worker.status === 'ACTIVE',
      );
      setWorkersCount(activeWorkers.length);
      setTotalUnpaid(
        activeWorkers.reduce((total: number, worker: any) => {
          const amount = worker.unpaidBalance ?? worker.pendingPayout ?? worker.balance ?? 0;
          return total + (Number(String(amount).replace(/[^0-9.-]+/g, '')) || 0);
        }, 0),
      );
    }

    if (inventoryResult.status === 'fulfilled') {
      const responseData = inventoryResult.value.data?.data ?? inventoryResult.value.data;
      const rolls = Array.isArray(responseData) ? responseData : [];
      setFabricInStock(
        rolls
          .filter((roll: any) => !roll.isDeleted)
          .reduce((total: number, roll: any) => total + (Number(roll.remainingMeters) || 0), 0),
      );
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
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </button>

          <Link
            href="/orders"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-colors cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Job Order
          </Link>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Active Job Orders */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Job Orders
            </p>
            <Scissors className="h-4 w-4 text-primary" />
          </div>

          <h3 className="text-3xl font-bold text-foreground mt-2">
            {activeOrdersCount}
          </h3>

          <p className="text-xs text-emerald-600 font-medium mt-1">
            On schedule
          </p>
        </div>

        {/* Factory Workforce */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Factory Workforce
            </p>
            <Users className="h-4 w-4 text-primary" />
          </div>

          <h3 className="text-3xl font-bold text-foreground mt-2">
            {workersCount}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            Active tailors & checkers
          </p>
        </div>

        {/* Fabric in Stock */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fabric in Stock
            </p>
            <Package className="h-4 w-4 text-primary" />
          </div>

          <h3 className="text-3xl font-bold text-foreground mt-2">
            {fabricInStock.toLocaleString('en-IN')} m
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            Across active inventory
          </p>
        </div>

        {/* Pending Payouts */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Payouts
            </p>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>

          <h3 className="text-3xl font-bold text-emerald-600 mt-2">
            ₹{totalUnpaid.toLocaleString('en-IN')}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            Unbilled piece logs
          </p>
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

      {/* AI Advisor Widget */}
      <AIAdvisorWidget />

    </div>
  );
}
