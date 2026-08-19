// // // // // // Purpose: Buyers and Brand Clients Directory Management Page
// // // // // // Path: frontend/src/app/buyers/page.tsx

// // // // // 'use client';

// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { useForm } from 'react-hook-form';
// // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // import * as z from 'zod';
// // // // // import api from '@/lib/api';
// // // // // import {
// // // // //   Briefcase,
// // // // //   Plus,
// // // // //   Search,
// // // // //   Filter,
// // // // //   Phone,
// // // // //   Mail,
// // // // //   Building,
// // // // //   X,
// // // // //   AlertTriangle,
// // // // //   RefreshCw,
// // // // // } from 'lucide-react';

// // // // // interface Buyer {
// // // // //   id: string;
// // // // //   brandName: string;
// // // // //   contactPerson: string;
// // // // //   email: string;
// // // // //   phone: string;
// // // // //   gstNumber: string;
// // // // //   totalOrders: number;
// // // // //   outstandingBalance: number;
// // // // //   status: 'ACTIVE' | 'INACTIVE';
// // // // //   joinedDate: string;
// // // // // }

// // // // // // Zod Schema for Adding a New Buyer
// // // // // const createBuyerSchema = z.object({
// // // // //   brandName: z.string().min(2, 'Brand/Company name is required'),
// // // // //   contactPerson: z.string().min(2, 'Contact person name is required'),
// // // // //   email: z.string().email('Valid email address is required'),
// // // // //   phone: z.string().min(10, 'Valid 10-digit phone number is required'),
// // // // //   gstNumber: z.string().optional(),
// // // // //   joinedDate: z.string().min(1, 'Onboarding date is required'),
// // // // // });

// // // // // type CreateBuyerFormData = z.infer<typeof createBuyerSchema>;

// // // // // export default function BuyersPage() {
// // // // //   const [buyers, setBuyers] = useState<Buyer[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState<boolean>(true);
// // // // //   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
// // // // //   const [searchQuery, setSearchQuery] = useState<string>('');
// // // // //   const [statusFilter, setStatusFilter] = useState<string>('ALL');
// // // // //   const [serverError, setServerError] = useState<string | null>(null);

// // // // //   const {
// // // // //     register,
// // // // //     handleSubmit,
// // // // //     reset,
// // // // //     formState: { errors, isSubmitting },
// // // // //   } = useForm<CreateBuyerFormData>({
// // // // //     resolver: zodResolver(createBuyerSchema),
// // // // //     defaultValues: {
// // // // //       brandName: '',
// // // // //       contactPerson: '',
// // // // //       email: '',
// // // // //       phone: '+91 ',
// // // // //       gstNumber: '',
// // // // //       joinedDate: new Date().toISOString().split('T')[0],
// // // // //     },
// // // // //   });

// // // // //   const fetchBuyers = async () => {
// // // // //     setIsLoading(true);
// // // // //     try {
// // // // //       const response = await api.get('/buyers');
// // // // //       const data = response.data.data || response.data;
// // // // //       setBuyers(Array.isArray(data) ? data : []);
// // // // //     } catch (err) {
// // // // //       console.error('Failed to fetch buyers, using mock fallback:', err);
// // // // //       setBuyers([
// // // // //         {
// // // // //           id: 'buy-201',
// // // // //           brandName: 'FabIndia Select',
// // // // //           contactPerson: 'Meera Rajput',
// // // // //           email: 'meera.r@fabindia.com',
// // // // //           phone: '+91 98765 11223',
// // // // //           gstNumber: '27AABCF1234G1Z2',
// // // // //           totalOrders: 14,
// // // // //           outstandingBalance: 125000,
// // // // //           status: 'ACTIVE',
// // // // //           joinedDate: '2022-04-12',
// // // // //         },
// // // // //         {
// // // // //           id: 'buy-202',
// // // // //           brandName: 'Urban Outfitters Sourcing',
// // // // //           contactPerson: 'Rahul Khanna',
// // // // //           email: 'rkhanna@urbanoutfitters.in',
// // // // //           phone: '+91 99887 55443',
// // // // //           gstNumber: '29BBBCF5678H2Z4',
// // // // //           totalOrders: 32,
// // // // //           outstandingBalance: 0,
// // // // //           status: 'ACTIVE',
// // // // //           joinedDate: '2021-08-22',
// // // // //         },
// // // // //         {
// // // // //           id: 'buy-203',
// // // // //           brandName: 'Boutique House Collective',
// // // // //           contactPerson: 'Anita Desai',
// // // // //           email: 'anita@boutiquehouse.co.in',
// // // // //           phone: '+91 91234 66778',
// // // // //           gstNumber: '24CCCDG9101I3Z5',
// // // // //           totalOrders: 5,
// // // // //           outstandingBalance: 45000,
// // // // //           status: 'ACTIVE',
// // // // //           joinedDate: '2023-11-05',
// // // // //         },
// // // // //         {
// // // // //           id: 'buy-204',
// // // // //           brandName: 'Heritage Weaves',
// // // // //           contactPerson: 'Vikram Singh',
// // // // //           email: 'vikram@heritageweaves.com',
// // // // //           phone: '+91 94561 88990',
// // // // //           gstNumber: '07DDDEH2345J4Z6',
// // // // //           totalOrders: 2,
// // // // //           outstandingBalance: 0,
// // // // //           status: 'INACTIVE',
// // // // //           joinedDate: '2020-02-14',
// // // // //         },
// // // // //       ]);
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchBuyers();
// // // // //   }, []);

// // // // //   const onCreateBuyer = async (data: CreateBuyerFormData) => {
// // // // //     setServerError(null);
// // // // //     try {
// // // // //       await api.post('/buyers', data);
// // // // //       setIsModalOpen(false);
// // // // //       reset();
// // // // //       fetchBuyers();
// // // // //     } catch (err: any) {
// // // // //       console.error('Failed to add buyer:', err);
// // // // //       setServerError(
// // // // //         err.response?.data?.message || 'Failed to register brand client. Please check inputs.'
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   const filteredBuyers = buyers.filter((buyer) => {
// // // // //     const matchesSearch =
// // // // //       buyer.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // //       buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // //       buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
// // // // //     const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;
// // // // //     return matchesSearch && matchesStatus;
// // // // //   });

// // // // //   const totalOutstanding = buyers.reduce((acc, b) => acc + b.outstandingBalance, 0);

// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       {/* Header Banner */}
// // // // //       <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
// // // // //         <div>
// // // // //           <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
// // // // //             <Briefcase className="mr-2 h-6 w-6 text-primary" />
// // // // //             Brand Clients & Buyers
// // // // //           </h1>
// // // // //           <p className="mt-1 text-sm text-muted-foreground">
// // // // //             Manage your B2B clothing brands, contact details, and outstanding receivables.
// // // // //           </p>
// // // // //         </div>
// // // // //         <div className="flex items-center space-x-3">
// // // // //           <button
// // // // //             onClick={fetchBuyers}
// // // // //             disabled={isLoading}
// // // // //             className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
// // // // //             title="Refresh Directory"
// // // // //           >
// // // // //             <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => setIsModalOpen(true)}
// // // // //             className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
// // // // //           >
// // // // //             <Plus className="mr-2 h-4 w-4" />
// // // // //             Add New Client
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Summary KPI Bar */}
// // // // //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// // // // //         <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
// // // // //           <p className="text-xs font-semibold uppercase text-muted-foreground">Active Brands</p>
// // // // //           <p className="mt-1 text-2xl font-extrabold text-foreground">
// // // // //             {buyers.filter((b) => b.status === 'ACTIVE').length} clients
// // // // //           </p>
// // // // //         </div>
// // // // //         <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
// // // // //           <p className="text-xs font-semibold uppercase text-muted-foreground">
// // // // //             Total Lifetime Orders
// // // // //           </p>
// // // // //           <p className="mt-1 text-2xl font-extrabold text-foreground">
// // // // //             {buyers.reduce((acc, b) => acc + b.totalOrders, 0)} POs
// // // // //           </p>
// // // // //         </div>
// // // // //         <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
// // // // //           <p className="text-xs font-semibold uppercase text-destructive">Accounts Receivable</p>
// // // // //           <p className="mt-1 flex items-center text-2xl font-extrabold text-destructive">
// // // // //             ₹{totalOutstanding.toLocaleString()}
// // // // //           </p>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Search and Filters */}
// // // // //       <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
// // // // //         <div className="relative w-full sm:w-80">
// // // // //           <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
// // // // //           <input
// // // // //             type="text"
// // // // //             placeholder="Search brand, contact person, email..."
// // // // //             value={searchQuery}
// // // // //             onChange={(e) => setSearchQuery(e.target.value)}
// // // // //             className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //           />
// // // // //         </div>
// // // // //         <div className="flex w-full items-center space-x-2 sm:w-auto">
// // // // //           <Filter className="h-4 w-4 text-muted-foreground" />
// // // // //           <select
// // // // //             value={statusFilter}
// // // // //             onChange={(e) => setStatusFilter(e.target.value)}
// // // // //             className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
// // // // //           >
// // // // //             <option value="ALL">All Statuses</option>
// // // // //             <option value="ACTIVE">Active Clients</option>
// // // // //             <option value="INACTIVE">Inactive Clients</option>
// // // // //           </select>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Buyers Table */}
// // // // //       <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
// // // // //         <div className="overflow-x-auto">
// // // // //           <table className="w-full text-left text-sm">
// // // // //             <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
// // // // //               <tr>
// // // // //                 <th className="px-4 py-3 font-semibold">Brand / Client</th>
// // // // //                 <th className="px-4 py-3 font-semibold">Contact Info</th>
// // // // //                 <th className="px-4 py-3 text-center font-semibold">Status</th>
// // // // //                 <th className="px-4 py-3 text-right font-semibold">Total Orders</th>
// // // // //                 <th className="px-4 py-3 text-right font-semibold">Outstanding Bal</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody className="divide-y divide-border">
// // // // //               {filteredBuyers.length === 0 ? (
// // // // //                 <tr>
// // // // //                   <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
// // // // //                     No brand clients found matching your search criteria.
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ) : (
// // // // //                 filteredBuyers.map((buyer) => (
// // // // //                   <tr key={buyer.id} className="transition-colors hover:bg-muted/30">
// // // // //                     <td className="px-4 py-3">
// // // // //                       <div className="flex items-center space-x-2 text-foreground">
// // // // //                         <Building className="h-4 w-4 text-primary opacity-70" />
// // // // //                         <span className="text-xs font-bold">{buyer.brandName}</span>
// // // // //                       </div>
// // // // //                       <p className="ml-6 mt-1 text-[10px] text-muted-foreground">
// // // // //                         GST: {buyer.gstNumber || 'N/A'}
// // // // //                       </p>
// // // // //                     </td>
// // // // //                     <td className="px-4 py-3 text-xs">
// // // // //                       <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
// // // // //                       <div className="mt-1 flex items-center space-x-3 text-[11px] text-muted-foreground">
// // // // //                         <span className="flex items-center">
// // // // //                           <Phone className="mr-1 h-3 w-3" />
// // // // //                           {buyer.phone}
// // // // //                         </span>
// // // // //                         <span className="flex items-center">
// // // // //                           <Mail className="mr-1 h-3 w-3" />
// // // // //                           {buyer.email}
// // // // //                         </span>
// // // // //                       </div>
// // // // //                     </td>
// // // // //                     <td className="px-4 py-3 text-center">
// // // // //                       <span
// // // // //                         className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
// // // // //                           buyer.status === 'ACTIVE'
// // // // //                             ? 'bg-emerald-500/10 text-emerald-600'
// // // // //                             : 'bg-zinc-500/10 text-zinc-500'
// // // // //                         }`}
// // // // //                       >
// // // // //                         {buyer.status}
// // // // //                       </span>
// // // // //                     </td>
// // // // //                     <td className="px-4 py-3 text-right font-mono text-xs text-foreground">
// // // // //                       {buyer.totalOrders} POs
// // // // //                     </td>
// // // // //                     <td className="px-4 py-3 text-right">
// // // // //                       {buyer.outstandingBalance > 0 ? (
// // // // //                         <span className="font-mono text-xs font-bold text-destructive">
// // // // //                           ₹{buyer.outstandingBalance.toLocaleString()}
// // // // //                         </span>
// // // // //                       ) : (
// // // // //                         <span className="font-mono text-xs text-emerald-600">Settled (₹0)</span>
// // // // //                       )}
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))
// // // // //               )}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Onboard Buyer Modal */}
// // // // //       {isModalOpen && (
// // // // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
// // // // //           <div className="w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
// // // // //             <div className="flex items-center justify-between border-b border-border pb-4">
// // // // //               <h2 className="text-lg font-bold text-foreground">Add New Brand Client</h2>
// // // // //               <button
// // // // //                 onClick={() => setIsModalOpen(false)}
// // // // //                 className="text-muted-foreground hover:text-foreground"
// // // // //               >
// // // // //                 <X className="h-5 w-5" />
// // // // //               </button>
// // // // //             </div>

// // // // //             {serverError && (
// // // // //               <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
// // // // //                 <AlertTriangle className="h-4 w-4" />
// // // // //                 <span>{serverError}</span>
// // // // //               </div>
// // // // //             )}

// // // // //             <form onSubmit={handleSubmit(onCreateBuyer)} className="space-y-4">
// // // // //               <div>
// // // // //                 <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
// // // // //                   Brand / Company Name
// // // // //                 </label>
// // // // //                 <input
// // // // //                   {...register('brandName')}
// // // // //                   type="text"
// // // // //                   placeholder="e.g. FabIndia"
// // // // //                   className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //                 />
// // // // //                 {errors.brandName && (
// // // // //                   <p className="mt-1 text-xs text-destructive">{errors.brandName.message}</p>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div>
// // // // //                 <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
// // // // //                   Primary Contact Person
// // // // //                 </label>
// // // // //                 <input
// // // // //                   {...register('contactPerson')}
// // // // //                   type="text"
// // // // //                   placeholder="Full Name"
// // // // //                   className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //                 />
// // // // //                 {errors.contactPerson && (
// // // // //                   <p className="mt-1 text-xs text-destructive">{errors.contactPerson.message}</p>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// // // // //                 <div>
// // // // //                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
// // // // //                     Email Address
// // // // //                   </label>
// // // // //                   <input
// // // // //                     {...register('email')}
// // // // //                     type="email"
// // // // //                     placeholder="contact@brand.com"
// // // // //                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //                   />
// // // // //                   {errors.email && (
// // // // //                     <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
// // // // //                   )}
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
// // // // //                     Phone Number
// // // // //                   </label>
// // // // //                   <input
// // // // //                     {...register('phone')}
// // // // //                     type="text"
// // // // //                     placeholder="+91 9876543210"
// // // // //                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //                   />
// // // // //                   {errors.phone && (
// // // // //                     <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
// // // // //                   )}
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// // // // //                 <div>
// // // // //                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
// // // // //                     GST Number (Optional)
// // // // //                   </label>
// // // // //                   <input
// // // // //                     {...register('gstNumber')}
// // // // //                     type="text"
// // // // //                     placeholder="27AABC..."
// // // // //                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //                   />
// // // // //                   {errors.gstNumber && (
// // // // //                     <p className="mt-1 text-xs text-destructive">{errors.gstNumber.message}</p>
// // // // //                   )}
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
// // // // //                     Onboarding Date
// // // // //                   </label>
// // // // //                   <input
// // // // //                     {...register('joinedDate')}
// // // // //                     type="date"
// // // // //                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
// // // // //                   />
// // // // //                   {errors.joinedDate && (
// // // // //                     <p className="mt-1 text-xs text-destructive">{errors.joinedDate.message}</p>
// // // // //                   )}
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="flex items-center justify-end space-x-3 border-t border-border pt-4">
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={() => setIsModalOpen(false)}
// // // // //                   className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
// // // // //                 >
// // // // //                   Cancel
// // // // //                 </button>
// // // // //                 <button
// // // // //                   type="submit"
// // // // //                   disabled={isSubmitting}
// // // // //                   className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
// // // // //                 >
// // // // //                   {isSubmitting ? 'Saving...' : 'Save Brand Client'}
// // // // //                 </button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // Purpose: Buyers / Brand Clients Page with Full Add, Edit, and Delete CRUD Operations
// // // // // Path: frontend/src/app/buyers/page.tsx

// // // // 'use client';

// // // // import React, { useState } from 'react';
// // // // import { 
// // // //   Building2, 
// // // //   Plus, 
// // // //   Search, 
// // // //   RefreshCw, 
// // // //   MoreVertical, 
// // // //   Edit3, 
// // // //   Trash2, 
// // // //   X, 
// // // //   CheckCircle2, 
// // // //   Phone, 
// // // //   Mail, 
// // // //   FileText 
// // // // } from 'lucide-react';

// // // // interface Buyer {
// // // //   id: string;
// // // //   brand: string;
// // // //   gst: string;
// // // //   contactPerson: string;
// // // //   phone: string;
// // // //   email: string;
// // // //   status: 'ACTIVE' | 'INACTIVE';
// // // //   totalOrders: number;
// // // //   outstandingBal: string;
// // // // }

// // // // const initialBuyers: Buyer[] = [
// // // //   {
// // // //     id: '1',
// // // //     brand: 'FabIndia Select',
// // // //     gst: '27AABCF1234G1Z2',
// // // //     contactPerson: 'Meera Rajput',
// // // //     phone: '+91 98765 11223',
// // // //     email: 'meera.r@fabindia.com',
// // // //     status: 'ACTIVE',
// // // //     totalOrders: 14,
// // // //     outstandingBal: '₹125,000',
// // // //   },
// // // //   {
// // // //     id: '2',
// // // //     brand: 'Urban Outfitters Sourcing',
// // // //     gst: '29BBBCF5678H2Z4',
// // // //     contactPerson: 'Rahul Khanna',
// // // //     phone: '+91 99887 55443',
// // // //     email: 'rkhanna@urbanoutfitters.in',
// // // //     status: 'ACTIVE',
// // // //     totalOrders: 32,
// // // //     outstandingBal: 'Settled (₹0)',
// // // //   },
// // // //   {
// // // //     id: '3',
// // // //     brand: 'Boutique House Collective',
// // // //     gst: '24CCCDG9101I3Z5',
// // // //     contactPerson: 'Anita Desai',
// // // //     phone: '+91 91234 66778',
// // // //     email: 'anita@boutiquehouse.co.in',
// // // //     status: 'ACTIVE',
// // // //     totalOrders: 5,
// // // //     outstandingBal: '₹45,000',
// // // //   },
// // // //   {
// // // //     id: '4',
// // // //     brand: 'Heritage Weaves',
// // // //     gst: '07DDDEH2345J4Z6',
// // // //     contactPerson: 'Vikram Singh',
// // // //     phone: '+91 94561 88990',
// // // //     email: 'vikram@heritageweaves.com',
// // // //     status: 'INACTIVE',
// // // //     totalOrders: 2,
// // // //     outstandingBal: 'Settled (₹0)',
// // // //   },
// // // // ];

// // // // export default function BuyersPage() {
// // // //   const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [statusFilter, setStatusFilter] = useState('ALL');

// // // //   // Modal States
// // // //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// // // //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// // // //   const [currentBuyer, setCurrentBuyer] = useState<Buyer | null>(null);

// // // //   // Form Input States
// // // //   const [formData, setFormData] = useState({
// // // //     brand: '',
// // // //     gst: '',
// // // //     contactPerson: '',
// // // //     phone: '',
// // // //     email: '',
// // // //     status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
// // // //     totalOrders: 0,
// // // //     outstandingBal: 'Settled (₹0)',
// // // //   });

// // // //   // Handle Add Submit
// // // //   const handleAddSubmit = (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     const newBuyer: Buyer = {
// // // //       id: Date.now().toString(),
// // // //       ...formData,
// // // //     };
// // // //     setBuyers([newBuyer, ...buyers]);
// // // //     setIsAddModalOpen(false);
// // // //     resetForm();
// // // //   };

// // // //   // Handle Edit Open
// // // //   const openEditModal = (buyer: Buyer) => {
// // // //     setCurrentBuyer(buyer);
// // // //     setFormData({
// // // //       brand: buyer.brand,
// // // //       gst: buyer.gst,
// // // //       contactPerson: buyer.contactPerson,
// // // //       phone: buyer.phone,
// // // //       email: buyer.email,
// // // //       status: buyer.status,
// // // //       totalOrders: buyer.totalOrders,
// // // //       outstandingBal: buyer.outstandingBal,
// // // //     });
// // // //     setIsEditModalOpen(true);
// // // //   };

// // // //   // Handle Edit Submit
// // // //   const handleEditSubmit = (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     if (!currentBuyer) return;

// // // //     setBuyers(buyers.map((b) => (b.id === currentBuyer.id ? { ...b, ...formData } : b)));
// // // //     setIsEditModalOpen(false);
// // // //     setCurrentBuyer(null);
// // // //     resetForm();
// // // //   };

// // // //   // Handle Delete
// // // //   const handleDelete = (id: string) => {
// // // //     if (confirm('Are you sure you want to delete this client?')) {
// // // //       setBuyers(buyers.filter((b) => b.id !== id));
// // // //     }
// // // //   };

// // // //   const resetForm = () => {
// // // //     setFormData({
// // // //       brand: '',
// // // //       gst: '',
// // // //       contactPerson: '',
// // // //       phone: '',
// // // //       email: '',
// // // //       status: 'ACTIVE',
// // // //       totalOrders: 0,
// // // //       outstandingBal: 'Settled (₹0)',
// // // //     });
// // // //   };

// // // //   // Filtered Buyers
// // // //   const filteredBuyers = buyers.filter((buyer) => {
// // // //     const matchesSearch = 
// // // //       buyer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //       buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //       buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
// // // //     const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;

// // // //     return matchesSearch && matchesStatus;
// // // //   });

// // // //   // Metrics calculation
// // // //   const activeCount = buyers.filter(b => b.status === 'ACTIVE').length;
// // // //   const totalOrdersSum = buyers.reduce((acc, curr) => acc + curr.totalOrders, 0);

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       {/* Top Banner Header */}
// // // //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-6 border border-border shadow-sm">
// // // //         <div className="flex items-center space-x-4">
// // // //           <div className="rounded-xl bg-primary/10 p-3 text-primary">
// // // //             <Building2 className="h-8 w-8" />
// // // //           </div>
// // // //           <div>
// // // //             <h1 className="text-xl font-bold text-foreground">Brand Clients & Buyers</h1>
// // // //             <p className="text-xs text-muted-foreground mt-0.5">
// // // //               Manage your B2B clothing brands, contact details, and outstanding receivables.
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //         <div className="flex items-center gap-3">
// // // //           <button 
// // // //             onClick={() => setBuyers([...initialBuyers])}
// // // //             className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
// // // //             title="Reset/Refresh Data"
// // // //           >
// // // //             <RefreshCw className="h-4 w-4" />
// // // //           </button>
// // // //           <button
// // // //             onClick={() => { resetForm(); setIsAddModalOpen(true); }}
// // // //             className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
// // // //           >
// // // //             <Plus className="h-4 w-4" />
// // // //             <span>Add New Client</span>
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Metrics Row */}
// // // //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// // // //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
// // // //           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Brands</p>
// // // //           <p className="text-2xl font-bold text-foreground mt-2">{activeCount} clients</p>
// // // //         </div>
// // // //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
// // // //           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Lifetime Orders</p>
// // // //           <p className="text-2xl font-bold text-foreground mt-2">{totalOrdersSum} POs</p>
// // // //         </div>
// // // //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm bg-destructive/5 border-destructive/20">
// // // //           <p className="text-xs font-medium text-destructive uppercase tracking-wider">Accounts Receivable</p>
// // // //           <p className="text-2xl font-bold text-destructive mt-2">₹170,000</p>
// // // //         </div>
// // // //       </div>

// // // //       {/* Search & Filters */}
// // // //       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
// // // //         <div className="relative flex-1 max-w-md">
// // // //           <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search brand, contact person, email..."
// // // //             value={searchQuery}
// // // //             onChange={(e) => setSearchQuery(e.target.value)}
// // // //             className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// // // //           />
// // // //         </div>
// // // //         <select
// // // //           value={statusFilter}
// // // //           onChange={(e) => setStatusFilter(e.target.value)}
// // // //           className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// // // //         >
// // // //           <option value="ALL">All Statuses</option>
// // // //           <option value="ACTIVE">Active Only</option>
// // // //           <option value="INACTIVE">Inactive Only</option>
// // // //         </select>
// // // //       </div>

// // // //       {/* Buyers Table */}
// // // //       <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
// // // //         <div className="overflow-x-auto">
// // // //           <table className="w-full text-left border-collapse">
// // // //             <thead>
// // // //               <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
// // // //                 <th className="py-3 px-6">Brand / Client</th>
// // // //                 <th className="py-3 px-6">Contact Info</th>
// // // //                 <th className="py-3 px-6">Status</th>
// // // //                 <th className="py-3 px-6">Total Orders</th>
// // // //                 <th className="py-3 px-6">Outstanding Bal</th>
// // // //                 <th className="py-3 px-6 text-right">Actions</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody className="divide-y divide-border text-xs">
// // // //               {filteredBuyers.length > 0 ? (
// // // //                 filteredBuyers.map((buyer) => (
// // // //                   <tr key={buyer.id} className="hover:bg-muted/20 transition-colors">
// // // //                     <td className="py-4 px-6">
// // // //                       <div className="flex items-center space-x-3">
// // // //                         <div className="rounded-lg bg-primary/10 p-2 text-primary">
// // // //                           <Building2 className="h-4 w-4" />
// // // //                         </div>
// // // //                         <div>
// // // //                           <p className="font-bold text-foreground">{buyer.brand}</p>
// // // //                           <p className="text-[10px] text-muted-foreground">GST: {buyer.gst}</p>
// // // //                         </div>
// // // //                       </div>
// // // //                     </td>
// // // //                     <td className="py-4 px-6">
// // // //                       <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
// // // //                       <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
// // // //                         <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {buyer.phone}</span>
// // // //                         <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {buyer.email}</span>
// // // //                       </div>
// // // //                     </td>
// // // //                     <td className="py-4 px-6">
// // // //                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
// // // //                         buyer.status === 'ACTIVE' 
// // // //                           ? 'bg-emerald-500/10 text-emerald-600' 
// // // //                           : 'bg-muted text-muted-foreground'
// // // //                       }`}>
// // // //                         {buyer.status}
// // // //                       </span>
// // // //                     </td>
// // // //                     <td className="py-4 px-6 font-semibold text-foreground">
// // // //                       {buyer.totalOrders} POs
// // // //                     </td>
// // // //                     <td className="py-4 px-6 font-semibold">
// // // //                       <span className={buyer.outstandingBal.includes('Settled') ? 'text-emerald-600' : 'text-destructive'}>
// // // //                         {buyer.outstandingBal}
// // // //                       </span>
// // // //                     </td>
// // // //                     <td className="py-4 px-6 text-right">
// // // //                       <div className="flex items-center justify-end gap-2">
// // // //                         <button
// // // //                           onClick={() => openEditModal(buyer)}
// // // //                           className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
// // // //                           title="Edit Client"
// // // //                         >
// // // //                           <Edit3 className="h-3.5 w-3.5" />
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => handleDelete(buyer.id)}
// // // //                           className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
// // // //                           title="Delete Client"
// // // //                         >
// // // //                           <Trash2 className="h-3.5 w-3.5" />
// // // //                         </button>
// // // //                       </div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))
// // // //               ) : (
// // // //                 <tr>
// // // //                   <td colSpan={6} className="py-8 text-center text-muted-foreground">
// // // //                     No clients found matching your search.
// // // //                   </td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </div>

// // // //       {/* ADD / EDIT MODAL COMPONENT */}
// // // //       {(isAddModalOpen || isEditModalOpen) && (
// // // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // // //           <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
// // // //             <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
// // // //               <h2 className="text-sm font-bold text-foreground">
// // // //                 {isAddModalOpen ? 'Add New Client / Brand' : 'Edit Client Details'}
// // // //               </h2>
// // // //               <button 
// // // //                 onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
// // // //                 className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
// // // //               >
// // // //                 <X className="h-4 w-4" />
// // // //               </button>
// // // //             </div>

// // // //             <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
// // // //               <div>
// // // //                 <label className="block text-xs font-medium text-foreground mb-1">Brand / Client Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   required
// // // //                   placeholder="e.g. Zara Sourcing"
// // // //                   value={formData.brand}
// // // //                   onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
// // // //                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                 />
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-4">
// // // //                 <div>
// // // //                   <label className="block text-xs font-medium text-foreground mb-1">GST Number</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     required
// // // //                     placeholder="27AABCF..."
// // // //                     value={formData.gst}
// // // //                     onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
// // // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="block text-xs font-medium text-foreground mb-1">Status</label>
// // // //                   <select
// // // //                     value={formData.status}
// // // //                     onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
// // // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                   >
// // // //                     <option value="ACTIVE">ACTIVE</option>
// // // //                     <option value="INACTIVE">INACTIVE</option>
// // // //                   </select>
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <label className="block text-xs font-medium text-foreground mb-1">Contact Person Name</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   required
// // // //                   placeholder="e.g. Rohit Sharma"
// // // //                   value={formData.contactPerson}
// // // //                   onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
// // // //                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                 />
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-4">
// // // //                 <div>
// // // //                   <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     required
// // // //                     placeholder="+91 ..."
// // // //                     value={formData.phone}
// // // //                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// // // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
// // // //                   <input
// // // //                     type="email"
// // // //                     required
// // // //                     placeholder="name@brand.com"
// // // //                     value={formData.email}
// // // //                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-4">
// // // //                 <div>
// // // //                   <label className="block text-xs font-medium text-foreground mb-1">Total Orders (POs)</label>
// // // //                   <input
// // // //                     type="number"
// // // //                     value={formData.totalOrders}
// // // //                     onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
// // // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="block text-xs font-medium text-foreground mb-1">Outstanding Balance</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="e.g. ₹50,000 or Settled (₹0)"
// // // //                     value={formData.outstandingBal}
// // // //                     onChange={(e) => setFormData({ ...formData, outstandingBal: e.target.value })}
// // // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
// // // //                   className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button
// // // //                   type="submit"
// // // //                   className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
// // // //                 >
// // // //                   {isAddModalOpen ? 'Save Client' : 'Update Changes'}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


// // // // Purpose: Buyers / Brand Clients Page with Dynamic Calculations and CRUD
// // // // Path: frontend/src/app/buyers/page.tsx

// // // 'use client';

// // // import React, { useState } from 'react';
// // // import { 
// // //   Building2, 
// // //   Plus, 
// // //   Search, 
// // //   RefreshCw, 
// // //   Edit3, 
// // //   Trash2, 
// // //   X, 
// // //   Phone, 
// // //   Mail 
// // // } from 'lucide-react';

// // // interface Buyer {
// // //   id: string;
// // //   brand: string;
// // //   gst: string;
// // //   contactPerson: string;
// // //   phone: string;
// // //   email: string;
// // //   status: 'ACTIVE' | 'INACTIVE';
// // //   totalOrders: number;
// // //   outstandingBal: string;
// // // }

// // // const initialBuyers: Buyer[] = [
// // //   {
// // //     id: '1',
// // //     brand: 'FabIndia Select',
// // //     gst: '27AABCF1234G1Z2',
// // //     contactPerson: 'Meera Rajput',
// // //     phone: '+91 98765 11223',
// // //     email: 'meera.r@fabindia.com',
// // //     status: 'ACTIVE',
// // //     totalOrders: 14,
// // //     outstandingBal: '₹125,000',
// // //   },
// // //   {
// // //     id: '2',
// // //     brand: 'Urban Outfitters Sourcing',
// // //     gst: '29BBBCF5678H2Z4',
// // //     contactPerson: 'Rahul Khanna',
// // //     phone: '+91 99887 55443',
// // //     email: 'rkhanna@urbanoutfitters.in',
// // //     status: 'ACTIVE',
// // //     totalOrders: 32,
// // //     outstandingBal: 'Settled (₹0)',
// // //   },
// // //   {
// // //     id: '3',
// // //     brand: 'Boutique House Collective',
// // //     gst: '24CCCDG9101I3Z5',
// // //     contactPerson: 'Anita Desai',
// // //     phone: '+91 91234 66778',
// // //     email: 'anita@boutiquehouse.co.in',
// // //     status: 'ACTIVE',
// // //     totalOrders: 5,
// // //     outstandingBal: '₹45,000',
// // //   },
// // //   {
// // //     id: '4',
// // //     brand: 'Heritage Weaves',
// // //     gst: '07DDDEH2345J4Z6',
// // //     contactPerson: 'Vikram Singh',
// // //     phone: '+91 94561 88990',
// // //     email: 'vikram@heritageweaves.com',
// // //     status: 'INACTIVE',
// // //     totalOrders: 2,
// // //     outstandingBal: 'Settled (₹0)',
// // //   },
// // // ];

// // // export default function BuyersPage() {
// // //   const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('ALL');

// // //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// // //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// // //   const [currentBuyer, setCurrentBuyer] = useState<Buyer | null>(null);

// // //   const [formData, setFormData] = useState({
// // //     brand: '',
// // //     gst: '',
// // //     contactPerson: '',
// // //     phone: '',
// // //     email: '',
// // //     status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
// // //     totalOrders: 0,
// // //     outstandingBal: 'Settled (₹0)',
// // //   });

// // //   const handleAddSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     const newBuyer: Buyer = {
// // //       id: Date.now().toString(),
// // //       ...formData,
// // //     };
// // //     setBuyers([newBuyer, ...buyers]);
// // //     setIsAddModalOpen(false);
// // //     resetForm();
// // //   };

// // //   const openEditModal = (buyer: Buyer) => {
// // //     setCurrentBuyer(buyer);
// // //     setFormData({
// // //       brand: buyer.brand,
// // //       gst: buyer.gst,
// // //       contactPerson: buyer.contactPerson,
// // //       phone: buyer.phone,
// // //       email: buyer.email,
// // //       status: buyer.status,
// // //       totalOrders: buyer.totalOrders,
// // //       outstandingBal: buyer.outstandingBal,
// // //     });
// // //     setIsEditModalOpen(true);
// // //   };

// // //   const handleEditSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!currentBuyer) return;

// // //     setBuyers(buyers.map((b) => (b.id === currentBuyer.id ? { ...b, ...formData } : b)));
// // //     setIsEditModalOpen(false);
// // //     setCurrentBuyer(null);
// // //     resetForm();
// // //   };

// // //   const handleDelete = (id: string) => {
// // //     if (confirm('Are you sure you want to delete this client?')) {
// // //       setBuyers(buyers.filter((b) => b.id !== id));
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setFormData({
// // //       brand: '',
// // //       gst: '',
// // //       contactPerson: '',
// // //       phone: '',
// // //       email: '',
// // //       status: 'ACTIVE',
// // //       totalOrders: 0,
// // //       outstandingBal: 'Settled (₹0)',
// // //     });
// // //   };

// // //   const filteredBuyers = buyers.filter((buyer) => {
// // //     const matchesSearch = 
// // //       buyer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //       buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //       buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
// // //     const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;
// // //     return matchesSearch && matchesStatus;
// // //   });

// // //   // Dynamic Metrics
// // //   const activeCount = buyers.filter(b => b.status === 'ACTIVE').length;
// // //   const totalOrdersSum = buyers.reduce((acc, curr) => acc + curr.totalOrders, 0);
  
// // //   const totalReceivable = buyers.reduce((acc, curr) => {
// // //     if (curr.outstandingBal.includes('Settled') || !curr.outstandingBal) return acc;
// // //     const cleanNum = parseInt(curr.outstandingBal.replace(/[^0-9]/g, ''), 10) || 0;
// // //     return acc + cleanNum;
// // //   }, 0);

// // //   return (
// // //     <div className="space-y-6">
// // //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-6 border border-border shadow-sm">
// // //         <div className="flex items-center space-x-4">
// // //           <div className="rounded-xl bg-primary/10 p-3 text-primary">
// // //             <Building2 className="h-8 w-8" />
// // //           </div>
// // //           <div>
// // //             <h1 className="text-xl font-bold text-foreground">Brand Clients & Buyers</h1>
// // //             <p className="text-xs text-muted-foreground mt-0.5">
// // //               Manage your B2B clothing brands, contact details, and outstanding receivables.
// // //             </p>
// // //           </div>
// // //         </div>
// // //         <div className="flex items-center gap-3">
// // //           <button 
// // //             onClick={() => setBuyers([...initialBuyers])}
// // //             className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
// // //             title="Reset Data"
// // //           >
// // //             <RefreshCw className="h-4 w-4" />
// // //           </button>
// // //           <button
// // //             onClick={() => { resetForm(); setIsAddModalOpen(true); }}
// // //             className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
// // //           >
// // //             <Plus className="h-4 w-4" />
// // //             <span>Add New Client</span>
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Metrics Row (Now Fully Dynamic) */}
// // //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// // //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
// // //           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Brands</p>
// // //           <p className="text-2xl font-bold text-foreground mt-2">{activeCount} clients</p>
// // //         </div>
// // //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
// // //           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Lifetime Orders</p>
// // //           <p className="text-2xl font-bold text-foreground mt-2">{totalOrdersSum} POs</p>
// // //         </div>
// // //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm bg-destructive/5 border-destructive/20">
// // //           <p className="text-xs font-medium text-destructive uppercase tracking-wider">Accounts Receivable</p>
// // //           <p className="text-2xl font-bold text-destructive mt-2">
// // //             ₹{totalReceivable.toLocaleString('en-IN')}
// // //           </p>
// // //         </div>
// // //       </div>

// // //       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
// // //         <div className="relative flex-1 max-w-md">
// // //           <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
// // //           <input
// // //             type="text"
// // //             placeholder="Search brand, contact person, email..."
// // //             value={searchQuery}
// // //             onChange={(e) => setSearchQuery(e.target.value)}
// // //             className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// // //           />
// // //         </div>
// // //         <select
// // //           value={statusFilter}
// // //           onChange={(e) => setStatusFilter(e.target.value)}
// // //           className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// // //         >
// // //           <option value="ALL">All Statuses</option>
// // //           <option value="ACTIVE">Active Only</option>
// // //           <option value="INACTIVE">Inactive Only</option>
// // //         </select>
// // //       </div>

// // //       <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full text-left border-collapse">
// // //             <thead>
// // //               <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
// // //                 <th className="py-3 px-6">Brand / Client</th>
// // //                 <th className="py-3 px-6">Contact Info</th>
// // //                 <th className="py-3 px-6">Status</th>
// // //                 <th className="py-3 px-6">Total Orders</th>
// // //                 <th className="py-3 px-6">Outstanding Bal</th>
// // //                 <th className="py-3 px-6 text-right">Actions</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-border text-xs">
// // //               {filteredBuyers.length > 0 ? (
// // //                 filteredBuyers.map((buyer) => (
// // //                   <tr key={buyer.id} className="hover:bg-muted/20 transition-colors">
// // //                     <td className="py-4 px-6">
// // //                       <div className="flex items-center space-x-3">
// // //                         <div className="rounded-lg bg-primary/10 p-2 text-primary">
// // //                           <Building2 className="h-4 w-4" />
// // //                         </div>
// // //                         <div>
// // //                           <p className="font-bold text-foreground">{buyer.brand}</p>
// // //                           <p className="text-[10px] text-muted-foreground">GST: {buyer.gst}</p>
// // //                         </div>
// // //                       </div>
// // //                     </td>
// // //                     <td className="py-4 px-6">
// // //                       <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
// // //                       <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
// // //                         <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {buyer.phone}</span>
// // //                         <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {buyer.email}</span>
// // //                       </div>
// // //                     </td>
// // //                     <td className="py-4 px-6">
// // //                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
// // //                         buyer.status === 'ACTIVE' 
// // //                           ? 'bg-emerald-500/10 text-emerald-600' 
// // //                           : 'bg-muted text-muted-foreground'
// // //                       }`}>
// // //                         {buyer.status}
// // //                       </span>
// // //                     </td>
// // //                     <td className="py-4 px-6 font-semibold text-foreground">
// // //                       {buyer.totalOrders} POs
// // //                     </td>
// // //                     <td className="py-4 px-6 font-semibold">
// // //                       <span className={buyer.outstandingBal.includes('Settled') ? 'text-emerald-600' : 'text-destructive'}>
// // //                         {buyer.outstandingBal}
// // //                       </span>
// // //                     </td>
// // //                     <td className="py-4 px-6 text-right">
// // //                       <div className="flex items-center justify-end gap-2">
// // //                         <button
// // //                           onClick={() => openEditModal(buyer)}
// // //                           className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
// // //                         >
// // //                           <Edit3 className="h-3.5 w-3.5" />
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDelete(buyer.id)}
// // //                           className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
// // //                         >
// // //                           <Trash2 className="h-3.5 w-3.5" />
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan={6} className="py-8 text-center text-muted-foreground">
// // //                     No clients found matching your search.
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </div>

// // //       {(isAddModalOpen || isEditModalOpen) && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // //           <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
// // //             <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
// // //               <h2 className="text-sm font-bold text-foreground">
// // //                 {isAddModalOpen ? 'Add New Client / Brand' : 'Edit Client Details'}
// // //               </h2>
// // //               <button 
// // //                 onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
// // //                 className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
// // //               >
// // //                 <X className="h-4 w-4" />
// // //               </button>
// // //             </div>

// // //             <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
// // //               <div>
// // //                 <label className="block text-xs font-medium text-foreground mb-1">Brand / Client Name</label>
// // //                 <input
// // //                   type="text"
// // //                   required
// // //                   value={formData.brand}
// // //                   onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
// // //                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                 />
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-xs font-medium text-foreground mb-1">GST Number</label>
// // //                   <input
// // //                     type="text"
// // //                     required
// // //                     value={formData.gst}
// // //                     onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
// // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-xs font-medium text-foreground mb-1">Status</label>
// // //                   <select
// // //                     value={formData.status}
// // //                     onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
// // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                   >
// // //                     <option value="ACTIVE">ACTIVE</option>
// // //                     <option value="INACTIVE">INACTIVE</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label className="block text-xs font-medium text-foreground mb-1">Contact Person Name</label>
// // //                 <input
// // //                   type="text"
// // //                   required
// // //                   value={formData.contactPerson}
// // //                   onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
// // //                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                 />
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
// // //                   <input
// // //                     type="text"
// // //                     required
// // //                     value={formData.phone}
// // //                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
// // //                   <input
// // //                     type="email"
// // //                     required
// // //                     value={formData.email}
// // //                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-xs font-medium text-foreground mb-1">Total Orders (POs)</label>
// // //                   <input
// // //                     type="number"
// // //                     value={formData.totalOrders}
// // //                     onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
// // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-xs font-medium text-foreground mb-1">Outstanding Balance</label>
// // //                   <input
// // //                     type="text"
// // //                     placeholder="e.g. ₹50,000 or Settled (₹0)"
// // //                     value={formData.outstandingBal}
// // //                     onChange={(e) => setFormData({ ...formData, outstandingBal: e.target.value })}
// // //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
// // //                   className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
// // //                 >
// // //                   {isAddModalOpen ? 'Save Client' : 'Update Changes'}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // Purpose: Buyers / Brand Clients Page with LocalStorage Persistence
// // // Path: frontend/src/app/buyers/page.tsx

// // 'use client';

// // import React, { useState, useEffect } from 'react';
// // import { 
// //   Building2, 
// //   Plus, 
// //   Search, 
// //   RefreshCw, 
// //   Edit3, 
// //   Trash2, 
// //   X, 
// //   Phone, 
// //   Mail 
// // } from 'lucide-react';

// // interface Buyer {
// //   id: string;
// //   brand: string;
// //   gst: string;
// //   contactPerson: string;
// //   phone: string;
// //   email: string;
// //   status: 'ACTIVE' | 'INACTIVE';
// //   totalOrders: number;
// //   outstandingBal: string;
// // }

// // const initialBuyers: Buyer[] = [
// //   {
// //     id: '1',
// //     brand: 'FabIndia Select',
// //     gst: '27AABCF1234G1Z2',
// //     contactPerson: 'Meera Rajput',
// //     phone: '+91 98765 11223',
// //     email: 'meera.r@fabindia.com',
// //     status: 'ACTIVE',
// //     totalOrders: 14,
// //     outstandingBal: '₹125,000',
// //   },
// //   {
// //     id: '2',
// //     brand: 'Urban Outfitters Sourcing',
// //     gst: '29BBBCF5678H2Z4',
// //     contactPerson: 'Rahul Khanna',
// //     phone: '+91 99887 55443',
// //     email: 'rkhanna@urbanoutfitters.in',
// //     status: 'ACTIVE',
// //     totalOrders: 32,
// //     outstandingBal: 'Settled (₹0)',
// //   },
// //   {
// //     id: '3',
// //     brand: 'Boutique House Collective',
// //     gst: '24CCCDG9101I3Z5',
// //     contactPerson: 'Anita Desai',
// //     phone: '+91 91234 66778',
// //     email: 'anita@boutiquehouse.co.in',
// //     status: 'ACTIVE',
// //     totalOrders: 5,
// //     outstandingBal: '₹45,000',
// //   },
// //   {
// //     id: '4',
// //     brand: 'Heritage Weaves',
// //     gst: '07DDDEH2345J4Z6',
// //     contactPerson: 'Vikram Singh',
// //     phone: '+91 94561 88990',
// //     email: 'vikram@heritageweaves.com',
// //     status: 'INACTIVE',
// //     totalOrders: 2,
// //     outstandingBal: 'Settled (₹0)',
// //   },
// // ];

// // export default function BuyersPage() {
// //   // LocalStorage se data load karna, agar na ho toh initialBuyers use karna
// //   const [buyers, setBuyers] = useState<Buyer[]>(() => {
// //     if (typeof window !== 'undefined') {
// //       const savedBuyers = localStorage.getItem('erp_buyers_list');
// //       if (savedBuyers) {
// //         try {
// //           return JSON.parse(savedBuyers);
// //         } catch (e) {
// //           console.error('Error parsing saved buyers:', e);
// //         }
// //       }
// //     }
// //     return initialBuyers;
// //   });

// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('ALL');

// //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// //   const [currentBuyer, setCurrentBuyer] = useState<Buyer | null>(null);

// //   const [formData, setFormData] = useState({
// //     brand: '',
// //     gst: '',
// //     contactPerson: '',
// //     phone: '',
// //     email: '',
// //     status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
// //     totalOrders: 0,
// //     outstandingBal: 'Settled (₹0)',
// //   });

// //   // Jab bhi buyers change ho, localStorage mein save ho jaye
// //   useEffect(() => {
// //     localStorage.setItem('erp_buyers_list', JSON.stringify(buyers));
// //   }, [buyers]);

// //   const handleAddSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const newBuyer: Buyer = {
// //       id: Date.now().toString(),
// //       ...formData,
// //     };
// //     setBuyers([newBuyer, ...buyers]);
// //     setIsAddModalOpen(false);
// //     resetForm();
// //   };

// //   const openEditModal = (buyer: Buyer) => {
// //     setCurrentBuyer(buyer);
// //     setFormData({
// //       brand: buyer.brand,
// //       gst: buyer.gst,
// //       contactPerson: buyer.contactPerson,
// //       phone: buyer.phone,
// //       email: buyer.email,
// //       status: buyer.status,
// //       totalOrders: buyer.totalOrders,
// //       outstandingBal: buyer.outstandingBal,
// //     });
// //     setIsEditModalOpen(true);
// //   };

// //   const handleEditSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!currentBuyer) return;

// //     setBuyers(buyers.map((b) => (b.id === currentBuyer.id ? { ...b, ...formData } : b)));
// //     setIsEditModalOpen(false);
// //     setCurrentBuyer(null);
// //     resetForm();
// //   };

// //   const handleDelete = (id: string) => {
// //     if (confirm('Are you sure you want to delete this client?')) {
// //       setBuyers(buyers.filter((b) => b.id !== id));
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       brand: '',
// //       gst: '',
// //       contactPerson: '',
// //       phone: '',
// //       email: '',
// //       status: 'ACTIVE',
// //       totalOrders: 0,
// //       outstandingBal: 'Settled (₹0)',
// //     });
// //   };

// //   const filteredBuyers = buyers.filter((buyer) => {
// //     const matchesSearch = 
// //       buyer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
// //     const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;
// //     return matchesSearch && matchesStatus;
// //   });

// //   // Dynamic Metrics Calculations
// //   const activeCount = buyers.filter(b => b.status === 'ACTIVE').length;
// //   const totalOrdersSum = buyers.reduce((acc, curr) => acc + curr.totalOrders, 0);
  
// //   const totalReceivable = buyers.reduce((acc, curr) => {
// //     if (curr.outstandingBal.includes('Settled') || !curr.outstandingBal) return acc;
// //     const cleanNum = parseInt(curr.outstandingBal.replace(/[^0-9]/g, ''), 10) || 0;
// //     return acc + cleanNum;
// //   }, 0);

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-6 border border-border shadow-sm">
// //         <div className="flex items-center space-x-4">
// //           <div className="rounded-xl bg-primary/10 p-3 text-primary">
// //             <Building2 className="h-8 w-8" />
// //           </div>
// //           <div>
// //             <h1 className="text-xl font-bold text-foreground">Brand Clients & Buyers</h1>
// //             <p className="text-xs text-muted-foreground mt-0.5">
// //               Manage your B2B clothing brands, contact details, and outstanding receivables.
// //             </p>
// //           </div>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <button 
// //             onClick={() => {
// //               setBuyers(initialBuyers);
// //               localStorage.removeItem('erp_buyers_list');
// //             }}
// //             className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
// //             title="Reset to Default Data"
// //           >
// //             <RefreshCw className="h-4 w-4" />
// //           </button>
// //           <button
// //             onClick={() => { resetForm(); setIsAddModalOpen(true); }}
// //             className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
// //           >
// //             <Plus className="h-4 w-4" />
// //             <span>Add New Client</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Metrics Row */}
// //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
// //           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Brands</p>
// //           <p className="text-2xl font-bold text-foreground mt-2">{activeCount} clients</p>
// //         </div>
// //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
// //           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Lifetime Orders</p>
// //           <p className="text-2xl font-bold text-foreground mt-2">{totalOrdersSum} POs</p>
// //         </div>
// //         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm bg-destructive/5 border-destructive/20">
// //           <p className="text-xs font-medium text-destructive uppercase tracking-wider">Accounts Receivable</p>
// //           <p className="text-2xl font-bold text-destructive mt-2">
// //             ₹{totalReceivable.toLocaleString('en-IN')}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Search and Filters */}
// //       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
// //         <div className="relative flex-1 max-w-md">
// //           <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
// //           <input
// //             type="text"
// //             placeholder="Search brand, contact person, email..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //           />
// //         </div>
// //         <select
// //           value={statusFilter}
// //           onChange={(e) => setStatusFilter(e.target.value)}
// //           className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
// //         >
// //           <option value="ALL">All Statuses</option>
// //           <option value="ACTIVE">Active Only</option>
// //           <option value="INACTIVE">Inactive Only</option>
// //         </select>
// //       </div>

// //       {/* Table Section */}
// //       <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left border-collapse">
// //             <thead>
// //               <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
// //                 <th className="py-3 px-6">Brand / Client</th>
// //                 <th className="py-3 px-6">Contact Info</th>
// //                 <th className="py-3 px-6">Status</th>
// //                 <th className="py-3 px-6">Total Orders</th>
// //                 <th className="py-3 px-6">Outstanding Bal</th>
// //                 <th className="py-3 px-6 text-right">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-border text-xs">
// //               {filteredBuyers.length > 0 ? (
// //                 filteredBuyers.map((buyer) => (
// //                   <tr key={buyer.id} className="hover:bg-muted/20 transition-colors">
// //                     <td className="py-4 px-6">
// //                       <div className="flex items-center space-x-3">
// //                         <div className="rounded-lg bg-primary/10 p-2 text-primary">
// //                           <Building2 className="h-4 w-4" />
// //                         </div>
// //                         <div>
// //                           <p className="font-bold text-foreground">{buyer.brand}</p>
// //                           <p className="text-[10px] text-muted-foreground">GST: {buyer.gst}</p>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-6">
// //                       <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
// //                       <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
// //                         <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {buyer.phone}</span>
// //                         <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {buyer.email}</span>
// //                       </div>
// //                     </td>
// //                     <td className="py-4 px-6">
// //                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
// //                         buyer.status === 'ACTIVE' 
// //                           ? 'bg-emerald-500/10 text-emerald-600' 
// //                           : 'bg-muted text-muted-foreground'
// //                       }`}>
// //                         {buyer.status}
// //                       </span>
// //                     </td>
// //                     <td className="py-4 px-6 font-semibold text-foreground">
// //                       {buyer.totalOrders} POs
// //                     </td>
// //                     <td className="py-4 px-6 font-semibold">
// //                       <span className={buyer.outstandingBal.includes('Settled') ? 'text-emerald-600' : 'text-destructive'}>
// //                         {buyer.outstandingBal}
// //                       </span>
// //                     </td>
// //                     <td className="py-4 px-6 text-right">
// //                       <div className="flex items-center justify-end gap-2">
// //                         <button
// //                           onClick={() => openEditModal(buyer)}
// //                           className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
// //                         >
// //                           <Edit3 className="h-3.5 w-3.5" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(buyer.id)}
// //                           className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
// //                         >
// //                           <Trash2 className="h-3.5 w-3.5" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan={6} className="py-8 text-center text-muted-foreground">
// //                     No clients found matching your search.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Add / Edit Modal */}
// //       {(isAddModalOpen || isEditModalOpen) && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
// //             <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
// //               <h2 className="text-sm font-bold text-foreground">
// //                 {isAddModalOpen ? 'Add New Client / Brand' : 'Edit Client Details'}
// //               </h2>
// //               <button 
// //                 onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
// //                 className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
// //               >
// //                 <X className="h-4 w-4" />
// //               </button>
// //             </div>

// //             <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
// //               <div>
// //                 <label className="block text-xs font-medium text-foreground mb-1">Brand / Client Name</label>
// //                 <input
// //                   type="text"
// //                   required
// //                   value={formData.brand}
// //                   onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
// //                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-foreground mb-1">GST Number</label>
// //                   <input
// //                     type="text"
// //                     required
// //                     value={formData.gst}
// //                     onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
// //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-foreground mb-1">Status</label>
// //                   <select
// //                     value={formData.status}
// //                     onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
// //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                   >
// //                     <option value="ACTIVE">ACTIVE</option>
// //                     <option value="INACTIVE">INACTIVE</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-medium text-foreground mb-1">Contact Person Name</label>
// //                 <input
// //                   type="text"
// //                   required
// //                   value={formData.contactPerson}
// //                   onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
// //                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
// //                   <input
// //                     type="text"
// //                     required
// //                     value={formData.phone}
// //                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
// //                   <input
// //                     type="email"
// //                     required
// //                     value={formData.email}
// //                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-foreground mb-1">Total Orders (POs)</label>
// //                   <input
// //                     type="number"
// //                     value={formData.totalOrders}
// //                     onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
// //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-foreground mb-1">Outstanding Balance</label>
// //                   <input
// //                     type="text"
// //                     placeholder="e.g. ₹50,000 or Settled (₹0)"
// //                     value={formData.outstandingBal}
// //                     onChange={(e) => setFormData({ ...formData, outstandingBal: e.target.value })}
// //                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
// //                 <button
// //                   type="button"
// //                   onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
// //                   className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
// //                 >
// //                   {isAddModalOpen ? 'Save Client' : 'Update Changes'}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // Purpose: Buyers / Brand Clients Page with Hydration-Safe LocalStorage Persistence
// // Path: frontend/src/app/buyers/page.tsx

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//   Building2, 
//   Plus, 
//   Search, 
//   RefreshCw, 
//   Edit3, 
//   Trash2, 
//   X, 
//   Phone, 
//   Mail 
// } from 'lucide-react';

// interface Buyer {
//   id: string;
//   brand: string;
//   gst: string;
//   contactPerson: string;
//   phone: string;
//   email: string;
//   status: 'ACTIVE' | 'INACTIVE';
//   totalOrders: number;
//   outstandingBal: string;
// }

// const initialBuyers: Buyer[] = [
//   {
//     id: '1',
//     brand: 'FabIndia Select',
//     gst: '27AABCF1234G1Z2',
//     contactPerson: 'Meera Rajput',
//     phone: '+91 98765 11223',
//     email: 'meera.r@fabindia.com',
//     status: 'ACTIVE',
//     totalOrders: 14,
//     outstandingBal: '₹125,000',
//   },
//   {
//     id: '2',
//     brand: 'Urban Outfitters Sourcing',
//     gst: '29BBBCF5678H2Z4',
//     contactPerson: 'Rahul Khanna',
//     phone: '+91 99887 55443',
//     email: 'rkhanna@urbanoutfitters.in',
//     status: 'ACTIVE',
//     totalOrders: 32,
//     outstandingBal: 'Settled (₹0)',
//   },
//   {
//     id: '3',
//     brand: 'Boutique House Collective',
//     gst: '24CCCDG9101I3Z5',
//     contactPerson: 'Anita Desai',
//     phone: '+91 91234 66778',
//     email: 'anita@boutiquehouse.co.in',
//     status: 'ACTIVE',
//     totalOrders: 5,
//     outstandingBal: '₹45,000',
//   },
//   {
//     id: '4',
//     brand: 'Heritage Weaves',
//     gst: '07DDDEH2345J4Z6',
//     contactPerson: 'Vikram Singh',
//     phone: '+91 94561 88990',
//     email: 'vikram@heritageweaves.com',
//     status: 'INACTIVE',
//     totalOrders: 2,
//     outstandingBal: 'Settled (₹0)',
//   },
// ];

// export default function BuyersPage() {
//   // Hydration error fix: Start with initialBuyers, then load from localStorage on mount
//   const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
//   const [isClient, setIsClient] = useState(false);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('ALL');

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentBuyer, setCurrentBuyer] = useState<Buyer | null>(null);

//   const [formData, setFormData] = useState({
//     brand: '',
//     gst: '',
//     contactPerson: '',
//     phone: '',
//     email: '',
//     status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
//     totalOrders: 0,
//     outstandingBal: 'Settled (₹0)',
//   });

//   // Component mount hone par localStorage se data load karna
//   useEffect(() => {
//     setIsClient(true);
//     const savedBuyers = localStorage.getItem('erp_buyers_list');
//     if (savedBuyers) {
//       try {
//         setBuyers(JSON.parse(savedBuyers));
//       } catch (e) {
//         console.error('Error parsing saved buyers:', e);
//       }
//     }
//   }, []);

//   // Jab bhi buyers change ho, localStorage mein save ho jaye
//   useEffect(() => {
//     if (isClient) {
//       localStorage.setItem('erp_buyers_list', JSON.stringify(buyers));
//     }
//   }, [buyers, isClient]);

//   const handleAddSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newBuyer: Buyer = {
//       id: Date.now().toString(),
//       ...formData,
//     };
//     setBuyers([newBuyer, ...buyers]);
//     setIsAddModalOpen(false);
//     resetForm();
//   };

//   const openEditModal = (buyer: Buyer) => {
//     setCurrentBuyer(buyer);
//     setFormData({
//       brand: buyer.brand,
//       gst: buyer.gst,
//       contactPerson: buyer.contactPerson,
//       phone: buyer.phone,
//       email: buyer.email,
//       status: buyer.status,
//       totalOrders: buyer.totalOrders,
//       outstandingBal: buyer.outstandingBal,
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleEditSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentBuyer) return;

//     setBuyers(buyers.map((b) => (b.id === currentBuyer.id ? { ...b, ...formData } : b)));
//     setIsEditModalOpen(false);
//     setCurrentBuyer(null);
//     resetForm();
//   };

//   const handleDelete = (id: string) => {
//     if (confirm('Are you sure you want to delete this client?')) {
//       setBuyers(buyers.filter((b) => b.id !== id));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       brand: '',
//       gst: '',
//       contactPerson: '',
//       phone: '',
//       email: '',
//       status: 'ACTIVE',
//       totalOrders: 0,
//       outstandingBal: 'Settled (₹0)',
//     });
//   };

//   const filteredBuyers = buyers.filter((buyer) => {
//     const matchesSearch = 
//       buyer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       buyer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesStatus = statusFilter === 'ALL' || buyer.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Dynamic Metrics Calculations
//   const activeCount = buyers.filter(b => b.status === 'ACTIVE').length;
//   const totalOrdersSum = buyers.reduce((acc, curr) => acc + curr.totalOrders, 0);
  
//   const totalReceivable = buyers.reduce((acc, curr) => {
//     if (curr.outstandingBal.includes('Settled') || !curr.outstandingBal) return acc;
//     const cleanNum = parseInt(curr.outstandingBal.replace(/[^0-9]/g, ''), 10) || 0;
//     return acc + cleanNum;
//   }, 0);

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-6 border border-border shadow-sm">
//         <div className="flex items-center space-x-4">
//           <div className="rounded-xl bg-primary/10 p-3 text-primary">
//             <Building2 className="h-8 w-8" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-foreground">Brand Clients & Buyers</h1>
//             <p className="text-xs text-muted-foreground mt-0.5">
//               Manage your B2B clothing brands, contact details, and outstanding receivables.
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={() => {
//               setBuyers(initialBuyers);
//               localStorage.removeItem('erp_buyers_list');
//             }}
//             className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
//             title="Reset to Default Data"
//           >
//             <RefreshCw className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => { resetForm(); setIsAddModalOpen(true); }}
//             className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
//           >
//             <Plus className="h-4 w-4" />
//             <span>Add New Client</span>
//           </button>
//         </div>
//       </div>

//       {/* Metrics Row */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
//           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Brands</p>
//           <p className="text-2xl font-bold text-foreground mt-2">{activeCount} clients</p>
//         </div>
//         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
//           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Lifetime Orders</p>
//           <p className="text-2xl font-bold text-foreground mt-2">{totalOrdersSum} POs</p>
//         </div>
//         <div className="rounded-2xl bg-card p-5 border border-border shadow-sm bg-destructive/5 border-destructive/20">
//           <p className="text-xs font-medium text-destructive uppercase tracking-wider">Accounts Receivable</p>
//           <p className="text-2xl font-bold text-destructive mt-2">
//             ₹{totalReceivable.toLocaleString('en-IN')}
//           </p>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search brand, contact person, email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//         >
//           <option value="ALL">All Statuses</option>
//           <option value="ACTIVE">Active Only</option>
//           <option value="INACTIVE">Inactive Only</option>
//         </select>
//       </div>

//       {/* Table Section */}
//       <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
//                 <th className="py-3 px-6">Brand / Client</th>
//                 <th className="py-3 px-6">Contact Info</th>
//                 <th className="py-3 px-6">Status</th>
//                 <th className="py-3 px-6">Total Orders</th>
//                 <th className="py-3 px-6">Outstanding Bal</th>
//                 <th className="py-3 px-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border text-xs">
//               {filteredBuyers.length > 0 ? (
//                 filteredBuyers.map((buyer) => (
//                   <tr key={buyer.id} className="hover:bg-muted/20 transition-colors">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-3">
//                         <div className="rounded-lg bg-primary/10 p-2 text-primary">
//                           <Building2 className="h-4 w-4" />
//                         </div>
//                         <div>
//                           <p className="font-bold text-foreground">{buyer.brand}</p>
//                           <p className="text-[10px] text-muted-foreground">GST: {buyer.gst}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <p className="font-semibold text-foreground">{buyer.contactPerson}</p>
//                       <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
//                         <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {buyer.phone}</span>
//                         <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {buyer.email}</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
//                         buyer.status === 'ACTIVE' 
//                           ? 'bg-emerald-500/10 text-emerald-600' 
//                           : 'bg-muted text-muted-foreground'
//                       }`}>
//                         {buyer.status}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6 font-semibold text-foreground">
//                       {buyer.totalOrders} POs
//                     </td>
//                     <td className="py-4 px-6 font-semibold">
//                       <span className={buyer.outstandingBal.includes('Settled') ? 'text-emerald-600' : 'text-destructive'}>
//                         {buyer.outstandingBal}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => openEditModal(buyer)}
//                           className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//                         >
//                           <Edit3 className="h-3.5 w-3.5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(buyer.id)}
//                           className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="py-8 text-center text-muted-foreground">
//                     No clients found matching your search.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add / Edit Modal */}
//       {(isAddModalOpen || isEditModalOpen) && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
//             <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
//               <h2 className="text-sm font-bold text-foreground">
//                 {isAddModalOpen ? 'Add New Client / Brand' : 'Edit Client Details'}
//               </h2>
//               <button 
//                 onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
//                 className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-xs font-medium text-foreground mb-1">Brand / Client Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.brand}
//                   onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
//                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-foreground mb-1">GST Number</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.gst}
//                     onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
//                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-foreground mb-1">Status</label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
//                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                   >
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-foreground mb-1">Contact Person Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.contactPerson}
//                   onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
//                   className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
//                   <input
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-foreground mb-1">Total Orders (POs)</label>
//                   <input
//                     type="number"
//                     value={formData.totalOrders}
//                     onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
//                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-foreground mb-1">Outstanding Balance</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. ₹50,000 or Settled (₹0)"
//                     value={formData.outstandingBal}
//                     onChange={(e) => setFormData({ ...formData, outstandingBal: e.target.value })}
//                     className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
//                 <button
//                   type="button"
//                   onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
//                   className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
//                 >
//                   {isAddModalOpen ? 'Save Client' : 'Update Changes'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


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

const initialBuyers: Buyer[] = [
  {
    id: '1',
    brand: 'FabIndia Select',
    gst: '27AABCF1234G1Z2',
    contactPerson: 'Meera Rajput',
    phone: '+91 98765 11223',
    email: 'meera.r@fabindia.com',
    status: 'ACTIVE',
    totalOrders: 14,
    outstandingBal: '₹125,000',
  },
  {
    id: '2',
    brand: 'Urban Outfitters Sourcing',
    gst: '29BBBCF5678H2Z4',
    contactPerson: 'Rahul Khanna',
    phone: '+91 99887 55443',
    email: 'rkhanna@urbanoutfitters.in',
    status: 'ACTIVE',
    totalOrders: 32,
    outstandingBal: 'Settled (₹0)',
  },
  {
    id: '3',
    brand: 'Boutique House Collective',
    gst: '24CCCDG9101I3Z5',
    contactPerson: 'Anita Desai',
    phone: '+91 91234 66778',
    email: 'anita@boutiquehouse.co.in',
    status: 'ACTIVE',
    totalOrders: 5,
    outstandingBal: '₹45,000',
  },
  {
    id: '4',
    brand: 'Heritage Weaves',
    gst: '07DDDEH2345J4Z6',
    contactPerson: 'Vikram Singh',
    phone: '+91 94561 88990',
    email: 'vikram@heritageweaves.com',
    status: 'INACTIVE',
    totalOrders: 2,
    outstandingBal: 'Settled (₹0)',
  },
];

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
  const [isMounted, setIsMounted] = useState(false); // Flash fix karne ke liye

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

  // LocalStorage se data load karna aur mounting confirm karna
  useEffect(() => {
    const savedBuyers = localStorage.getItem('erp_buyers_list');
    if (savedBuyers) {
      try {
        setBuyers(JSON.parse(savedBuyers));
      } catch (e) {
        console.error('Error parsing saved buyers:', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Jab bhi buyers change ho, localStorage mein save ho jaye
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('erp_buyers_list', JSON.stringify(buyers));
    }
  }, [buyers, isMounted]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBuyer: Buyer = {
      id: Date.now().toString(),
      ...formData,
    };
    setBuyers([newBuyer, ...buyers]);
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBuyer) return;

    setBuyers(buyers.map((b) => (b.id === currentBuyer.id ? { ...b, ...formData } : b)));
    setIsEditModalOpen(false);
    setCurrentBuyer(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setBuyers(buyers.filter((b) => b.id !== id));
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
            onClick={() => {
              setBuyers(initialBuyers);
              localStorage.removeItem('erp_buyers_list');
            }}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
            title="Reset to Default Data"
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