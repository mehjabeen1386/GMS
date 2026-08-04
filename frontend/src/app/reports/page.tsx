// Purpose: Advanced Factory Reports & Analytics Dashboard Page
// Path: frontend/src/app/reports/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  BarChart3,
  TrendingUp,
  Download,
  IndianRupee,
  Scissors,
  Users,
  Briefcase,
} from 'lucide-react';

interface ReportSummary {
  totalProductionPieces: number;
  totalPayrollDisbursed: number;
  totalFabricConsumedMeters: number;
  totalReceivables: number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportSummary>({
    totalProductionPieces: 14850,
    totalPayrollDisbursed: 1250000,
    totalFabricConsumedMeters: 18200,
    totalReceivables: 170000,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>('THIS_MONTH');

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/reports?range=${timeRange}`);
      if (response.data && response.data.data) {
        setReportData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics, using mock fallback:', err);
    } fontFinally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Production Pieces', reportData.totalProductionPieces],
      ['Total Payroll Disbursed (INR)', reportData.totalPayrollDisbursed],
      ['Total Fabric Consumed (Meters)', reportData.totalFabricConsumedMeters],
      ['Total Accounts Receivable (INR)', reportData.totalReceivables],
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `factory_report_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Factory Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyze production output, piece-rate payroll expenses, fabric yields, and receivables.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="THIS_MONTH">This Month (July 2026)</option>
            <option value="LAST_MONTH">Last Month (June 2026)</option>
            <option value="QUARTERLY">Q2 2026</option>
            <option value="YEARLY">Year 2026</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Production Output
            </p>
            <Scissors className="h-5 w-5 text-primary opacity-80" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-foreground">
            {reportData.totalProductionPieces.toLocaleString()} pcs
          </p>
          <p className="flex items-center text-xs font-medium text-emerald-600">
            <TrendingUp className="mr-1 h-3 w-3" /> +12.4% vs previous period
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Payroll Disbursed
            </p>
            <IndianRupee className="h-5 w-5 text-emerald-600 opacity-80" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-emerald-600">
            ₹{reportData.totalPayrollDisbursed.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Piece-rate worker wages paid</p>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Fabric Consumed
            </p>
            <Briefcase className="h-5 w-5 text-blue-600 opacity-80" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-blue-600">
            {reportData.totalFabricConsumedMeters.toLocaleString()} m
          </p>
          <p className="text-xs text-muted-foreground">Total rolls cut on floor</p>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Accounts Receivable
            </p>
            <Users className="h-5 w-5 text-amber-600 opacity-80" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-amber-600">
            ₹{reportData.totalReceivables.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Pending from brand buyers</p>
        </div>
      </div>

      {/* Detailed Insights Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">Top Performing Operations</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-sm font-semibold text-foreground">Collar Stitching</span>
              <span className="font-mono text-sm font-bold text-foreground">4,200 pcs</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-sm font-semibold text-foreground">Sleeve Hemming</span>
              <span className="font-mono text-sm font-bold text-foreground">3,850 pcs</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-sm font-semibold text-foreground">Button Hole & Bartack</span>
              <span className="font-mono text-sm font-bold text-foreground">3,120 pcs</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">Fabric Efficiency & Yield</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-sm font-semibold text-foreground">Average Marker Utilization</span>
              <span className="font-mono text-sm font-bold text-emerald-600">89.4%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-sm font-semibold text-foreground">Estimated Wastage</span>
              <span className="font-mono text-sm font-bold text-foreground">4.2%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-sm font-semibold text-foreground">Active Rolls in Ledger</span>
              <span className="font-mono text-sm font-bold text-foreground">18 rolls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}