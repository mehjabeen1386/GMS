
// Purpose: Workforce & Tailor Directory with View Payouts option removed
// Path: frontend/src/app/workers/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, Phone, RefreshCw, Trash2, X, CheckCircle2 } from 'lucide-react';

export default function WorkerManagementPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState(false);
  
  // Modal state for adding a worker
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const loadWorkers = () => {
    setIsRefreshing(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soms_tailors') || localStorage.getItem('soms_workforce');
      if (saved) {
        try {
          setWorkers(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse workers', e);
        }
      } else {
        const initial = [
          { id: '1', name: 'Ramesh Verma', skill: 'Senior Tailor', phone: '+91 98765 43210', joined: '2024-03-15', lifetimeOutput: '3,420 pcs', unpaidBalance: '₹14,500', status: 'ACTIVE' },
          { id: '2', name: 'Sunita Devi', skill: 'Collar Specialist', phone: '+91 91234 56789', joined: '2024-05-10', lifetimeOutput: '2,890 pcs', unpaidBalance: '₹12,800', status: 'ACTIVE' },
          { id: '3', name: 'Amit Patel', skill: 'Button Hole & Bartack', phone: '+91 99887 76655', joined: '2023-11-20', lifetimeOutput: '4,150 pcs', unpaidBalance: '₹18,200', status: 'ACTIVE' },
          { id: '4', name: 'Priya Sharma', skill: 'Quality Checker', phone: '+91 94561 23789', joined: '2024-01-10', lifetimeOutput: '5,120 pcs', unpaidBalance: '₹9,400', status: 'ACTIVE' }
        ];
        setWorkers(initial);
        localStorage.setItem('soms_tailors', JSON.stringify(initial));
      }
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMsg(true);
      setTimeout(() => setRefreshMsg(false), 2000);
    }, 400);
  };

  useEffect(() => {
    setIsMounted(true);
    loadWorkers();
  }, []);

  if (!isMounted) return null;

  // Handle Add Worker
  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSkill || !newPhone) {
      alert('Please fill in all required fields.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const newWorkerEntry = {
      id: Date.now().toString(),
      name: newName,
      skill: newSkill,
      phone: newPhone,
      joined: currentDate,
      lifetimeOutput: '0 pcs',
      unpaidBalance: newBalance ? `₹${Number(newBalance).toLocaleString('en-IN')}` : '₹0',
      status: 'ACTIVE'
    };

    const updatedWorkers = [newWorkerEntry, ...workers];
    setWorkers(updatedWorkers);
    localStorage.setItem('soms_tailors', JSON.stringify(updatedWorkers));

    // Reset form and close modal
    setNewName('');
    setNewSkill('');
    setNewPhone('');
    setNewBalance('');
    setIsModalOpen(false);
  };

  // Handle Delete Worker
  const handleDeleteWorker = (id: string) => {
    if (confirm('Are you sure you want to delete this worker?')) {
      const updatedWorkers = workers.filter((w) => (w.id || w.phone) !== id);
      setWorkers(updatedWorkers);
      localStorage.setItem('soms_tailors', JSON.stringify(updatedWorkers));
    }
  };

  const filteredWorkers = workers.filter(w => 
    (w.name || w.workerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.skill || w.skillCategory || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnpaid = workers.reduce((acc, curr) => {
    const bal = Number(String(curr.unpaidBalance || curr.balance || '0').replace(/[^0-9.-]+/g, '')) || 0;
    return acc + bal;
  }, 0);

  return (
    <div className="space-y-6 p-6 relative">
      {/* Refresh Success Toast Message */}
      {refreshMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white shadow-lg transition-all animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">Data refreshed successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            <Users className="mr-2.5 h-6 w-6 text-primary" />
            Workforce & Tailor Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage factory staff, skill categories, production output, and piece-rate ledger balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadWorkers}
            className="inline-flex items-center rounded-lg border border-input bg-background px-3 py-2 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Onboard Worker
          </button>
        </div>
      </div>

      {/* Summary Cards (View Payouts option removed) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Workforce</p>
          <h3 className="text-2xl font-bold text-foreground mt-1">{workers.length} tailors</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Unpaid Piece Payouts</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{totalUnpaid.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      {/* Search Bar & Table */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by worker name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Skill Category</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Lifetime Output</th>
                  <th className="p-4">Unpaid Balance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      No workers found. Click "+ Onboard Worker" to add your first data entry!
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((w, idx) => (
                    <tr key={w.id || idx} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{w.name || w.workerName}</div>
                        <div className="text-xs text-muted-foreground">Joined: {w.joined || '2026-01-01'}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md text-xs bg-secondary font-medium text-secondary-foreground">
                          {w.skill || w.skillCategory}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs flex items-center gap-1.5 pt-5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {w.phone || w.phoneNumber}
                      </td>
                      <td className="p-4 font-semibold">{w.lifetimeOutput || '0 pcs'}</td>
                      <td className="p-4 font-mono font-bold text-emerald-600">{w.unpaidBalance || '₹0'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-600 font-semibold">
                          {w.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteWorker(w.id || w.phone)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10 cursor-pointer"
                          title="Delete Worker"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Onboard Worker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">Onboard New Worker</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddWorker} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Worker Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammad Rashid"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Skill Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Tailor / Collar Specialist"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Initial Unpaid Balance (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}