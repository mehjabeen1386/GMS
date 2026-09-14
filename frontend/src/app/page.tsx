// Purpose: Comprehensive Factory Reports & Piece-Rate Payouts Ledger
// Path: frontend/src/app/reports/page.tsx

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpDown,
  RefreshCw 
} from 'lucide-react';

interface PayoutItem {
  id: string;
  workerName: string;
  taskType: string;
  quantity: number;
  amount: number;
  payPeriod?: string;
  status: 'verified' | 'pending' | 'disputed' | 'paid';
  createdAt?: string;
}

type TimeFilter = 'all' | 'today' | 'this_week' | 'this_month';

export default function ReportsPage() {
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/payouts');
      const data = response.data?.data || response.data || [];
      setPayouts(data);
    } catch (err) {
      console.error('Failed to fetch payouts ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const matchesTimeFilter = (dateStr: string): boolean => {
    if (!dateStr) return timeFilter === 'all';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return true; // If string format is custom (e.g. "Week 12")

    const now = new Date();
    
    if (timeFilter === 'today') {
      return date.toDateString() === now.toDateString();
    } else if (timeFilter === 'this_week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      return date >= startOfWeek;
    } else if (timeFilter === 'this_month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    
    return true;
  };

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      // Fix applied here to satisfy TypeScript string requirement
      const targetDate = p.payPeriod ?? '';
      const matchesTime = matchesTimeFilter(targetDate);

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      
      const matchesSearch = 
        p.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTime && matchesStatus && matchesSearch;
    }).sort((a, b) => {
      const dateA = new Date(a.payPeriod || a.createdAt || 0).getTime();
      const dateB = new Date(b.payPeriod || b.createdAt || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [payouts, timeFilter, statusFilter, searchQuery, sortOrder]);

  const totalPayoutAmount = useMemo(() => {
    return filteredPayouts.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredPayouts]);

  const handleExportCSV = () => {
    const headers = ['ID,Worker Name,Task Type,Quantity,Amount,Pay Period,Status\n'];
    const rows = filteredPayouts.map(p => 
      `"${p.id}","${p.workerName}","${p.taskType}",${p.quantity},${p.amount},"${p.payPeriod || ''}","${p.status}"`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `piece_rate_payouts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Piece-Rate Reports & Payout Ledger
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review verified workforce production logs, track piece-rate calculations, and audit financial disbursements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayouts}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">TOTAL FILTERED ENTRIES</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{filteredPayouts.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Matching current filters</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">ACCUMULATED PAYOUT VALUE</p>
          <p className="mt-2 text-3xl font-bold text-foreground">₹{totalPayoutAmount.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Ready for payroll processing</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">LEDGER STATUS</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xl font-bold text-foreground">Synchronized</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Secure multi-tenant node</p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by worker name, task type, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-card">All Time</option>
              <option value="today" className="bg-card">Today</option>
              <option value="this_week" className="bg-card">This Week</option>
              <option value="this_month" className="bg-card">This Month</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-card">All Statuses</option>
              <option value="verified" className="bg-card">Verified</option>
              <option value="pending" className="bg-card">Pending</option>
              <option value="paid" className="bg-card">Paid</option>
              <option value="disputed" className="bg-card">Disputed</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase font-medium">{sortOrder}</span>
          </button>
        </div>
      </div>

      {/* Main Table / List Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <span className="font-semibold text-foreground">
            Ledger Results ({filteredPayouts.length})
          </span>
          <span className="text-xs text-muted-foreground">Showing verified production tasks</span>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm font-medium text-muted-foreground">Loading workforce ledger data...</p>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-2 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-base font-medium text-foreground">No matching payout records found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search query or filter criteria.</p>
            </div>
          ) : (
            filteredPayouts.map((payout) => {
              const statusColors = {
                verified: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                paid: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                disputed: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
              }[payout.status] || 'bg-secondary text-secondary-foreground';

              return (
                <div 
                  key={payout.id} 
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{payout.workerName}</span>
                      <span className="text-xs text-muted-foreground font-mono">({payout.id})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Task: <strong className="text-foreground">{payout.taskType}</strong></span>
                      <span>Qty: <strong className="text-foreground">{payout.quantity} units</strong></span>
                      <span>Period: <strong className="text-foreground">{payout.payPeriod || 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-foreground">₹{payout.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">Piece-rate compensation</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusColors}`}>
                        {payout.status === 'verified' && <CheckCircle2 className="h-3 w-3" />}
                        {payout.status === 'pending' && <Clock className="h-3 w-3" />}
                        {payout.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
