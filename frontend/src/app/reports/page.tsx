// Purpose: Dynamic Factory Reports & Analytics with fallback to Payout Ledger pieces
// Path: frontend/src/app/reports/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Coins,
  Scissors,
  Users,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface ScanLog {
  id: string;
  bundleCode: string;
  orderNumber: string;
  tailorName: string;
  operation: string;
  completedPieces: number;
  rejectedPieces: number;
  pieceValue: number;
  loggedAt: string;
  isDeleted?: boolean;
}

interface PayoutRecord {
  id: string;
  tailorName: string;
  skill: string;
  payPeriodStart: string;
  payPeriodEnd?: string;
  piecesCompleted: number;
  netPayoutAmount: number;
  status: 'PAID' | 'PENDING';
  paidDate?: string;
}

export default function ReportsPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('This Month (July 2026)');

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedScans = localStorage.getItem('soms_production_scans');
      if (savedScans) {
        try {
          setScans(JSON.parse(savedScans));
        } catch (e) {
          console.error('Failed to parse scans', e);
        }
      }

      const savedPayouts = localStorage.getItem('soms_worker_payouts');
      if (savedPayouts) {
        try {
          setPayouts(JSON.parse(savedPayouts));
        } catch (e) {
          console.error('Failed to parse payouts', e);
        }
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading Factory Analytics...</div>
      </div>
    );
  }

  const matchesTimeFilter = (dateStr?: string) => {
    if (!dateStr) return false;
    if (timeFilter.includes('July 2026')) {
      return dateStr.startsWith('2026-07');
    }
    if (timeFilter.includes('August 2026')) {
      return dateStr.startsWith('2026-08');
    }
    if (timeFilter.includes('Last Month')) {
      return dateStr.startsWith('2026-06');
    }
    if (timeFilter.includes('Year to Date')) {
      return dateStr.startsWith('2026');
    }
    return true;
  };

  const activeScans = scans.filter((s) => !s.isDeleted && matchesTimeFilter(s.loggedAt));
  
  const filteredPayouts = payouts.filter((p) => {
    const targetDate = p.payPeriodEnd || p.paidDate || '';
    return matchesTimeFilter(targetDate);
  });

  // If scan logs are empty, fallback to summing pieces from filtered payout records
  const totalProductionOutput = activeScans.length > 0
    ? activeScans.reduce((acc, curr) => acc + (Number(curr.completedPieces) || 0), 0)
    : filteredPayouts.reduce((acc, curr) => acc + (Number(curr.piecesCompleted) || 0), 0);

  const totalPayrollDisbursed = filteredPayouts
    .filter((p) => p.status === 'PAID')
    .reduce((acc, curr) => acc + (Number(curr.netPayoutAmount) || 0), 0);

  const handleExportCSV = () => {
    const csvContent = [
      ['Tailor Name', 'Pay Period End', 'Pieces Completed', 'Net Payout (₹)', 'Status'],
      ...filteredPayouts.map((p) => [
        `"${p.tailorName}"`,
        p.payPeriodEnd || '',
        p.piecesCompleted,
        p.netPayoutAmount,
        p.status,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `factory_payout_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            <BarChart3 className="mr-2.5 h-6 w-6 text-primary" />
            Factory Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyze live production output, piece-rate payroll expenses, and assembly line throughput based on entered logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-semibold focus:border-primary focus:outline-none"
          >
            <option value="This Month (July 2026)">This Month (July 2026)</option>
            <option value="August 2026">August 2026</option>
            <option value="Last Month">Last Month (June 2026)</option>
            <option value="Year to Date">Year to Date (2026)</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Top KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Production Output</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{totalProductionOutput} pcs</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-1">
              <TrendingUp className="mr-1 h-3.5 w-3.5" /> For selected period
            </span>
          </div>
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Scissors className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payroll Disbursed</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">
              ₹{totalPayrollDisbursed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-1">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Paid in selected period
            </span>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
            <Coins className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Scan Logs</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{activeScans.length} records</h3>
            <span className="inline-flex items-center text-xs font-semibold text-muted-foreground mt-1">
              Filtered assembly logs
            </span>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Workers</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{filteredPayouts.length} tailors</h3>
            <span className="inline-flex items-center text-xs font-semibold text-muted-foreground mt-1">
              In filtered ledger
            </span>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Ledger Summary Overview */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Ledger Summary Overview</h3>
          <p className="text-xs text-muted-foreground">Real-time indicators based on your payout ledger activity</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/20">
            <span className="text-sm font-semibold text-foreground">Total Payout Records in Period</span>
            <span className="font-mono text-sm font-bold text-foreground">{filteredPayouts.length} entries</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/20">
            <span className="text-sm font-semibold text-foreground">Pending Payouts Count</span>
            <span className="font-mono text-sm font-bold text-amber-600">
              {filteredPayouts.filter((p) => p.status === 'PENDING').length} entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
