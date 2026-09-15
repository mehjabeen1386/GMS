

// Purpose: Buyers / Brand Clients Page with Zero-Flash LocalStorage Persistence
// Path: frontend/src/app/buyers/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  X, 
  Phone, 
  Mail,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface Buyer {
  id: string;
  brand: string;
  gst: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalOrders: number;
  outstandingBal: string;
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState<Buyer | null>(null);

  const [formData, setFormData] = useState({
    brand: '',
    gst: '',
    contactPerson: '',
    phone: '',
    email: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    totalOrders: 0,
    outstandingBal: 'Settled (₹0)',
  });

  const fetchBuyers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/buyers');
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setBuyers(data as Buyer[]);
    } catch (error) {
      setBuyers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
    setIsMounted(true);
  }, []);


  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBuyer: Buyer = {
      id: Date.now().toString(),
      ...formData,
    };

    try {
      const response = await api.post('/buyers', newBuyer);
      const savedBuyer = response.data?.data || newBuyer;
      setBuyers((current) => [savedBuyer, ...current]);
    } catch (error) {
      setBuyers((current) => [newBuyer, ...current]);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const openEditModal = (buyer: Buyer) => {
    setCurrentBuyer(buyer);
    setFormData({
      brand: buyer.brand,
      gst: buyer.gst,
      contactPerson: buyer.contactPerson,
      phone: buyer.phone,
      email: buyer.email,
      status: buyer.status,
      totalOrders: buyer.totalOrders,
      outstandingBal: buyer.outstandingBal,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBuyer) return;

    const updated = buyers.map((b) => (b.id === currentBuyer.id ? { ...b, ...formData } : b));

    try {
      await api.put(`/buyers/${currentBuyer.id}`, formData);
    } catch (error) {
      console.warn('Buyer update failed.');
    }

    setBuyers(updated);
    setIsEditModalOpen(false);
    setCurrentBuyer(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/buyers/${id}`);
      } catch (error) {
        console.warn('Buyer delete failed.');
      }

      const next = buyers.filter((b) => b.id !== id);
      setBuyers(next);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      gst: '',
      contactPerson: '',
      phone: '',
      email: '',
      status: 'ACTIVE',
      totalOrders: 0,
      outstandingBal: 'Settled (₹0)',
    });
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch = 
      buyer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic Metrics Calculations
  const activeCount = buyers.filter(b => b.status === 'ACTIVE').length;
  const totalOrdersSum = buyers.reduce((acc, curr) => acc + curr.totalOrders, 0);
  
  const totalReceivable = buyers.reduce((acc, curr) => {
    if (curr.outstandingBal.includes('Settled') || !curr.outstandingBal) return acc;
    const cleanNum = parseInt(curr.outstandingBal.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + cleanNum;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-6 border border-border shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Brand Clients & Buyers</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your B2B clothing brands, contact details, and outstanding receivables.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchBuyers}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Brands</p>
          <p className="text-2xl font-bold text-foreground mt-2">{activeCount} clients</p>
        </div>
        <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Lifetime Orders</p>
          <p className="text-2xl font-bold text-foreground mt-2">{totalOrdersSum} POs</p>
        </div>
        <div className="rounded-2xl bg-card p-5 border border-border shadow-sm bg-destructive/5 border-destructive/20">
          <p className="text-xs font-medium text-destructive uppercase tracking-wider">Accounts Receivable</p>
          <p className="text-2xl font-bold text-destructive mt-2">
            ₹{totalReceivable.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search brand, contact person, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active Only</option>
          <option value="INACTIVE">Inactive Only</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-6">Brand / Client</th>
                <th className="py-3 px-6">Contact Info</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Total Orders</th>
                <th className="py-3 px-6">Outstanding Bal</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {!isMounted ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Loading clients...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBuyers.length > 0 ? (
                filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{buyer.brand}</p>
                          <p className="text-[10px] text-muted-foreground">GST: {buyer.gst}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {buyer.phone}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {buyer.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        buyer.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-foreground">
                      {buyer.totalOrders} POs
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className={buyer.outstandingBal.includes('Settled') ? 'text-emerald-600' : 'text-destructive'}>
                        {buyer.outstandingBal}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(buyer)}
                          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(buyer.id)}
                          className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No clients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
              <h2 className="text-sm font-bold text-foreground">
                {isAddModalOpen ? 'Add New Client / Brand' : 'Edit Client Details'}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Brand / Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">GST Number</label>
                  <input
                    type="text"
                    required
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Contact Person Name</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Total Orders (POs)</label>
                  <input
                    type="number"
                    value={formData.totalOrders}
                    onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Outstanding Balance</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000 or Settled (₹0)"
                    value={formData.outstandingBal}
                    onChange={(e) => setFormData({ ...formData, outstandingBal: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  {isAddModalOpen ? 'Save Client' : 'Update Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}