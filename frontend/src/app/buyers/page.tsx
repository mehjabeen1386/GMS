// Purpose: Buyers and Brand Clients Directory Management Page
// Path: frontend/src/app/buyers/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface Buyer {
  id: string;
  brandName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string;
  totalOrders: number;
  outstandingBalance: number;
  status: 'ACTIVE' | 'INACTIVE';
  joinedDate: string;
}

// Zod Schema for Adding a New Buyer
const createBuyerSchema = z.object({
  brandName: z.string().min(2, 'Brand/Company name is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  gstNumber: z.string().optional(),
  joinedDate: z.string().min(1, 'Onboarding date is required'),
});

type CreateBuyerFormData = z.infer<typeof createBuyerSchema>;

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBuyerFormData>({
    resolver: zodResolver(createBuyerSchema),
    defaultValues: {
      brandName: '',
      contactPerson: '',
      email: '',
      phone: '+91 ',
      gstNumber: '',
      joinedDate: new Date().toISOString().split('T')[0],
    },
  });

  const fetchBuyers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/buyers');
      const data = response.data.data || response.data;
      setBuyers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch buyers, using mock fallback:', err);
      setBuyers([
        {
          id: 'buy-201',
          brandName: 'FabIndia Select',
          contactPerson: 'Meera Rajput',
          email: 'meera.r@fabindia.com',
          phone: '+91 98765 11223',
          gstNumber: '27AABCF1234G1Z2',
          totalOrders: 14,
          outstandingBalance: 125000,
          status: 'ACTIVE',
          joinedDate: '2022-04-12',
        },
        {
          id: 'buy-202',
          brandName: 'Urban Outfitters Sourcing',
          contactPerson: 'Rahul Khanna',
          email: 'rkhanna@urbanoutfitters.in',
          phone: '+91 99887 55443',
          gstNumber: '29BBBCF5678H2Z4',
          totalOrders: 32,
          outstandingBalance: 0,
          status: 'ACTIVE',
          joinedDate: '2021-08-22',
        },
        {
          id: 'buy-203',
          brandName: 'Boutique House Collective',
          contactPerson: 'Anita Desai',
          email: 'anita@boutiquehouse.co.in',
          phone: '+91 91234 66778',
          gstNumber: '24CCCDG9101I3Z5',
          totalOrders: 5,
          outstandingBalance: 45000,
          status: 'ACTIVE',
          joinedDate: '2023-11-05',
        },
        {
          id: 'buy-204',
          brandName: 'Heritage Weaves',
          contactPerson: 'Vikram Singh',
          email: 'vikram@heritageweaves.com',
          phone: '+91 94561 88990',
          gstNumber: '07DDDEH2345J4Z6',
          totalOrders: 2,
          outstandingBalance: 0,
          status: 'INACTIVE',
          joinedDate: '2020-02-14',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const onCreateBuyer = async (data: CreateBuyerFormData) => {
    setServerError(null);
    try {
      await api.post('/buyers', data);
      setIsModalOpen(false);
      reset();
      fetchBuyers();
    } catch (err: any) {
      console.error('Failed to add buyer:', err);
      setServerError(
        err.response?.data?.message || 'Failed to register brand client. Please check inputs.'
      );
    }
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = buyers.reduce((acc, b) => acc + b.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
            <Briefcase className="mr-2 h-6 w-6 text-primary" />
            Brand Clients & Buyers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your B2B clothing brands, contact details, and outstanding receivables.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBuyers}
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
            Add New Client
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Active Brands</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {buyers.filter((b) => b.status === 'ACTIVE').length} clients
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Total Lifetime Orders
          </p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {buyers.reduce((acc, b) => acc + b.totalOrders, 0)} POs
          </p>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-destructive">Accounts Receivable</p>
          <p className="mt-1 flex items-center text-2xl font-extrabold text-destructive">
            ₹{totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search brand, contact person, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Clients</option>
            <option value="INACTIVE">Inactive Clients</option>
          </select>
        </div>
      </div>

      {/* Buyers Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Brand / Client</th>
                <th className="px-4 py-3 font-semibold">Contact Info</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Total Orders</th>
                <th className="px-4 py-3 text-right font-semibold">Outstanding Bal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No brand clients found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 text-foreground">
                        <Building className="h-4 w-4 text-primary opacity-70" />
                        <span className="text-xs font-bold">{buyer.brandName}</span>
                      </div>
                      <p className="ml-6 mt-1 text-[10px] text-muted-foreground">
                        GST: {buyer.gstNumber || 'N/A'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
                      <div className="mt-1 flex items-center space-x-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {buyer.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {buyer.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          buyer.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-zinc-500/10 text-zinc-500'
                        }`}
                      >
                        {buyer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-foreground">
                      {buyer.totalOrders} POs
                    </td>
                    <td className="px-4 py-3 text-right">
                      {buyer.outstandingBalance > 0 ? (
                        <span className="font-mono text-xs font-bold text-destructive">
                          ₹{buyer.outstandingBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-emerald-600">Settled (₹0)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Buyer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">Add New Brand Client</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {serverError && (
              <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onCreateBuyer)} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Brand / Company Name
                </label>
                <input
                  {...register('brandName')}
                  type="text"
                  placeholder="e.g. FabIndia"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.brandName && (
                  <p className="mt-1 text-xs text-destructive">{errors.brandName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Primary Contact Person
                </label>
                <input
                  {...register('contactPerson')}
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-xs text-destructive">{errors.contactPerson.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="contact@brand.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    GST Number (Optional)
                  </label>
                  <input
                    {...register('gstNumber')}
                    type="text"
                    placeholder="27AABC..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.gstNumber && (
                    <p className="mt-1 text-xs text-destructive">{errors.gstNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Onboarding Date
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
                  {isSubmitting ? 'Saving...' : 'Save Brand Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}