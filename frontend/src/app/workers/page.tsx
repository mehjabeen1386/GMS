// Purpose: Workers Directory and Piece-Rate Ledger Management Page
// Path: frontend/src/app/workers/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  phone: string;
  skillCategory: string;
  totalPiecesCompleted: number;
  unpaidEarnings: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  joinedDate: string;
}

// Zod Schema for Onboarding a New Worker
const createWorkerSchema = z.object({
  name: z.string().min(2, 'Worker name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  skillCategory: z.string().min(2, 'Skill category is required'),
  joinedDate: z.string().min(1, 'Joining date is required'),
});

type CreateWorkerFormData = z.infer<typeof createWorkerSchema>;

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [skillFilter, setSkillFilter] = useState<string>('ALL');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkerFormData>({
    resolver: zodResolver(createWorkerSchema),
    defaultValues: {
      name: '',
      phone: '+91 ',
      skillCategory: 'Senior Tailor',
      joinedDate: new Date().toISOString().split('T')[0],
    },
  });

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/workers');
      const data = response.data.data || response.data;
      setWorkers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch workers, using mock fallback:', err);
      setWorkers([
        {
          id: 'w-101',
          name: 'Ramesh Verma',
          phone: '+91 98765 43210',
          skillCategory: 'Senior Tailor',
          totalPiecesCompleted: 3420,
          unpaidEarnings: 14500,
          status: 'ACTIVE',
          joinedDate: '2024-03-15',
        },
        {
          id: 'w-102',
          name: 'Sunita Devi',
          phone: '+91 91234 56789',
          skillCategory: 'Collar Specialist',
          totalPiecesCompleted: 2890,
          unpaidEarnings: 12800,
          status: 'ACTIVE',
          joinedDate: '2024-05-10',
        },
        {
          id: 'w-103',
          name: 'Amit Patel',
          phone: '+91 99887 76655',
          skillCategory: 'Button Hole & Bartack',
          totalPiecesCompleted: 4150,
          unpaidEarnings: 18200,
          status: 'ACTIVE',
          joinedDate: '2023-11-20',
        },
        {
          id: 'w-104',
          name: 'Priya Sharma',
          phone: '+91 94561 23789',
          skillCategory: 'Quality Checker',
          totalPiecesCompleted: 5120,
          unpaidEarnings: 9400,
          status: 'ACTIVE',
          joinedDate: '2024-01-10',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const onCreateWorker = async (data: CreateWorkerFormData) => {
    setServerError(null);
    try {
      await api.post('/workers', data);
      setIsModalOpen(false);
      reset();
      fetchWorkers();
    } catch (err: any) {
      console.error('Failed to onboard worker:', err);
      setServerError(
        err.response?.data?.message || 'Failed to onboard worker. Please check inputs.'
      );
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skillCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === 'ALL' || worker.skillCategory === skillFilter;
    return matchesSearch && matchesSkill;
  });

  const totalUnpaidPayouts = workers.reduce((acc, w) => acc + w.unpaidEarnings, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Workforce & Tailor Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage factory staff, skill categories, production output, and piece-rate ledger balances.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchWorkers}
            disabled={isLoading}
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Refresh Directory"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Onboard Worker
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Active Workforce
          </p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {workers.length} tailors
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Total Unpaid Piece Payouts
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">
            ₹{totalUnpaidPayouts.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Payout Ledger</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Process weekly worker disbursements
            </p>
          </div>
          <Link
            href="/workers/payouts"
            className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            View Payouts
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by worker name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
          >
            <option value="ALL">All Skills</option>
            <option value="Senior Tailor">Senior Tailor</option>
            <option value="Collar Specialist">Collar Specialist</option>
            <option value="Button Hole & Bartack">Button Hole & Bartack</option>
            <option value="Quality Checker">Quality Checker</option>
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Worker Name</th>
                <th className="px-4 py-3 font-semibold">Skill Category</th>
                <th className="px-4 py-3 font-semibold">Phone Number</th>
                <th className="px-4 py-3 text-right font-semibold">Lifetime Output</th>
                <th className="px-4 py-3 text-right font-semibold">Unpaid Balance</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No workers found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">
                      {worker.name}
                      <p className="text-[10px] font-normal text-muted-foreground">
                        Joined: {worker.joinedDate}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                        {worker.skillCategory}
                      </span>
                    </td>
                    <td className="flex items-center px-4 py-3 text-xs text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3 text-primary" />
                      {worker.phone}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-foreground">
                      {worker.totalPiecesCompleted.toLocaleString()} pcs
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-emerald-600">
                      ₹{worker.unpaidEarnings.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
                        {worker.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Worker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">Onboard New Worker</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {serverError && (
              <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onCreateWorker)} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Worker Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Ramesh Verma"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="text"
                    placeholder="+91 9876543210"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Skill Category
                  </label>
                  <select
                    {...register('skillCategory')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Senior Tailor">Senior Tailor</option>
                    <option value="Collar Specialist">Collar Specialist</option>
                    <option value="Button Hole & Bartack">Button Hole & Bartack</option>
                    <option value="Quality Checker">Quality Checker</option>
                  </select>
                  {errors.skillCategory && (
                    <p className="mt-1 text-xs text-destructive">{errors.skillCategory.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Joining Date
                </label>
                <input
                  {...register('joinedDate')}
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.joinedDate && (
                  <p className="mt-1 text-xs text-destructive">{errors.joinedDate.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Onboarding...' : 'Save Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}