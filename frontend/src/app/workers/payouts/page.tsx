
// Purpose: Worker Piece-Rate Payout Ledger with Add, Edit, Delete & LocalStorage Sync
// Path: frontend/src/app/workers/payouts/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface PayoutRecord {
  id: string;
  tailorName: string;
  skill: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  piecesCompleted: number;
  netPayoutAmount: number;
  status: 'PAID' | 'PENDING';
  paidDate?: string;
}

export default function WorkerPayoutsPage() {
  const defaultPayouts: PayoutRecord[] = [
    {
      id: 'pay-1',
      tailorName: 'Ramesh Verma',
      skill: 'Senior Tailor',
      payPeriodStart: '2026-07-13',
      payPeriodEnd: '2026-07-19',
      piecesCompleted: 450,
      netPayoutAmount: 14500,
      status: 'PAID',
      paidDate: '2026-08-19',
    },
    {
      id: 'pay-2',
      tailorName: 'Sunita Devi',
      skill: 'Collar Specialist',
      payPeriodStart: '2026-07-13',
      payPeriodEnd: '2026-07-19',
      piecesCompleted: 380,
      netPayoutAmount: 12800,
      status: 'PAID',
      paidDate: '2026-08-19',
    },
    {
      id: 'pay-3',
      tailorName: 'Amit Patel',
      skill: 'Button Hole & Bartack',
      payPeriodStart: '2026-07-13',
      payPeriodEnd: '2026-07-19',
      piecesCompleted: 520,
      netPayoutAmount: 18200,
      status: 'PAID',
      paidDate: '2026-07-20',
    },
    {
      id: 'pay-4',
      tailorName: 'Priya Sharma',
      skill: 'Quality Checker',
      payPeriodStart: '2026-07-13',
      payPeriodEnd: '2026-07-19',
      piecesCompleted: 610,
      netPayoutAmount: 9400,
      status: 'PAID',
      paidDate: '2026-07-20',
    },
  ];

  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tailorName: '',
    skill: 'Senior Tailor',
    payPeriodStart: '2026-07-13',
    payPeriodEnd: '2026-07-19',
    piecesCompleted: '',
    netPayoutAmount: '',
    status: 'PENDING' as 'PAID' | 'PENDING',
    paidDate: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soms_worker_payouts');
      if (saved) {
        try {
          setPayouts(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse payouts local storage', e);
          setPayouts(defaultPayouts);
        }
      } else {
        setPayouts(defaultPayouts);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('soms_worker_payouts', JSON.stringify(payouts));
    }
  }, [payouts, isMounted]);

  // Handle Delete
  const handleDelete = (id: string) => {
    setPayouts((prev) => prev.filter((p) => p.id !== id));
  };

  // Handle Submit (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Edit mode
      setPayouts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                tailorName: formData.tailorName,
                skill: formData.skill,
                payPeriodStart: formData.payPeriodStart,
                payPeriodEnd: formData.payPeriodEnd,
                piecesCompleted: Number(formData.piecesCompleted) || 0,
                netPayoutAmount: Number(formData.netPayoutAmount) || 0,
                status: formData.status,
                paidDate: formData.status === 'PAID' ? (formData.paidDate || new Date().toISOString().split('T')[0]) : undefined,
              }
            : p
        )
      );
    } else {
      // Add mode
      const newRecord: PayoutRecord = {
        id: `pay-${Date.now()}`,
        tailorName: formData.tailorName,
        skill: formData.skill,
        payPeriodStart: formData.payPeriodStart,
        payPeriodEnd: formData.payPeriodEnd,
        piecesCompleted: Number(formData.piecesCompleted) || 0,
        netPayoutAmount: Number(formData.netPayoutAmount) || 0,
        status: formData.status,
        paidDate: formData.status === 'PAID' ? (formData.paidDate || new Date().toISOString().split('T')[0]) : undefined,
      };
      setPayouts([newRecord, ...payouts]);
    }

    closeModal();
  };

  const openEditModal = (record: PayoutRecord) => {
    setEditingId(record.id);
    setFormData({
      tailorName: record.tailorName,
      skill: record.skill,
      payPeriodStart: record.payPeriodStart,
      payPeriodEnd: record.payPeriodEnd,
      piecesCompleted: record.piecesCompleted.toString(),
      netPayoutAmount: record.netPayoutAmount.toString(),
      status: record.status,
      paidDate: record.paidDate || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      tailorName: '',
      skill: 'Senior Tailor',
      payPeriodStart: '2026-07-13',
      payPeriodEnd: '2026-07-19',
      piecesCompleted: '',
      netPayoutAmount: '',
      status: 'PENDING',
      paidDate: '',
    });
  };

  // Calculate total pending disbursements
  const totalPendingDisbursements = payouts
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.netPayoutAmount, 0);

  const filteredPayouts = payouts.filter((p) => {
    const matchesSearch =
      p.tailorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading Payout Ledger...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/workers"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Workers Directory
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            <span className="mr-2">₹</span> Worker Piece-Rate Payout Ledger
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Process weekly salary disbursements and piece-rate earnings for factory tailors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Payout Record
          </button>
          <div className="rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm text-right">
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">Total Pending Disbursements</span>
            <span className="text-lg font-bold text-foreground">
              ₹{totalPendingDisbursements.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tailor name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Payout Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Tailor Name</th>
                <th className="px-4 py-3 font-semibold">Pay Period</th>
                <th className="px-4 py-3 font-semibold">Pieces Completed</th>
                <th className="px-4 py-3 font-semibold">Net Payout Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action / Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No payout records found. Click "+ Add Payout Record" to add one.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-bold text-foreground text-sm">{record.tailorName}</span>
                      <p className="text-[11px] text-muted-foreground">{record.skill}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {record.payPeriodStart} to {record.payPeriodEnd}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                      {record.piecesCompleted} pcs
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-600">
                      ₹{record.netPayoutAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      {record.status === 'PAID' ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground mr-2">
                          {record.status === 'PAID' ? `Paid on ${record.paidDate || 'N/A'}` : 'Pending Disbursement'}
                        </span>
                        <button
                          onClick={() => openEditModal(record)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Edit Payout"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="rounded p-1 text-destructive hover:bg-destructive/10"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingId ? 'Edit Payout Record' : 'Add New Payout Record'}
              </h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Tailor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Verma"
                  value={formData.tailorName}
                  onChange={(e) => setFormData({ ...formData, tailorName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Skill / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Tailor"
                  value={formData.skill}
                  onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Pay Period Start</label>
                  <input
                    type="date"
                    value={formData.payPeriodStart}
                    onChange={(e) => setFormData({ ...formData, payPeriodStart: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Pay Period End</label>
                  <input
                    type="date"
                    value={formData.payPeriodEnd}
                    onChange={(e) => setFormData({ ...formData, payPeriodEnd: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Pieces Completed</label>
                  <input
                    type="number"
                    placeholder="450"
                    value={formData.piecesCompleted}
                    onChange={(e) => setFormData({ ...formData, piecesCompleted: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Net Payout Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="14500"
                    value={formData.netPayoutAmount}
                    onChange={(e) => setFormData({ ...formData, netPayoutAmount: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'PAID' | 'PENDING' })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
                {formData.status === 'PAID' && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Paid Date</label>
                    <input
                      type="date"
                      value={formData.paidDate}
                      onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                      required={formData.status === 'PAID'}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {editingId ? 'Update Payout' : 'Save Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}