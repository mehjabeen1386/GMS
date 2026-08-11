// // Purpose: Job Orders Management Page with Modal Creation Form & Progress Tracking
// // Path: frontend/src/app/orders/page.tsx

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import api from '@/lib/api';
// import {
//   Scissors,
//   Plus,
//   Search,
//   Filter,
//   Calendar,
//   X,
//   AlertCircle,
//   RefreshCw,
//   Eye,
// } from 'lucide-react';

// interface JobOrder {
//   id: string;
//   orderNumber: string;
//   clientName: string;
//   styleName: string;
//   quantity: number;
//   completedQuantity: number;
//   status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
//   startDate: string;
//   dueDate: string;
// }

// // Zod Schema for Creating a New Job Order
// const createOrderSchema = z.object({
//   orderNumber: z.string().min(3, 'Order number is required'),
//   clientName: z.string().min(2, 'Client name is required'),
//   styleName: z.string().min(2, 'Garment style is required'),
//   quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
//   fabricType: z.string().min(2, 'Fabric type is required'),
//   consumptionPerPieceMeters: z.coerce.number().min(0.1, 'Consumption is required'),
//   startDate: z.string().min(1, 'Start date is required'),
//   dueDate: z.string().min(1, 'Due date is required'),
// });

// type CreateOrderFormData = z.infer<typeof createOrderSchema>;


// export default function JobOrdersPage() {
//   const [orders, setOrders] = useState<JobOrder[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateOrderFormData>({
//     resolver: zodResolver(createOrderSchema),
//     defaultValues: {
//       orderNumber: `JO-2026-${Math.floor(100 + Math.random() * 900)}`,
//       clientName: '',
//       styleName: '',
//       quantity: 100,
//       startDate: new Date().toISOString().split('T')[0],
//       dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     },
//   });

//   const fetchOrders = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get('/orders');
//       const rawData = response.data?.data || response.data?.orders || response.data;
//       const list = Array.isArray(rawData) ? rawData : rawData?.items || [];

//       const formattedOrders: JobOrder[] = list.map((item: any) => ({
//         id: item._id || item.id || `ord-${Math.random()}`,
//         orderNumber: item.orderNumber || item.jobOrderNumber || 'JO-2026-000',
//         clientName: item.clientName || item.client || item.companyName || 'Mohammad',
//         styleName: item.styleName || item.garmentType || item.style || item.garmentStyle || 'Men formal shirt',
//         quantity: item.quantity || item.totalQuantity || item.targetQuantity || 100,
//         completedQuantity: item.completedQuantity || item.producedQuantity || 0,
//         status: item.status || 'PENDING',
//         startDate: item.startDate ? String(item.startDate).split('T')[0] : '2026-08-07',
//         dueDate: item.dueDate
//           ? String(item.dueDate).split('T')[0]
//           : item.targetDeliveryDate
//           ? String(item.targetDeliveryDate).split('T')[0]
//           : '2026-08-21',
//       }));

//       setOrders(formattedOrders);
//     } catch (err) {
//       console.error('Failed to fetch orders:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const onCreateOrder = async (data: CreateOrderFormData) => {
//     setServerError(null);
//     try {
//       const payload = {
//         orderNumber: data.orderNumber,
//         jobOrderNumber: data.orderNumber,
//         clientName: data.clientName,
//         styleName: data.styleName,
//         style: data.styleName,
//         garmentStyle: data.styleName,
//         quantity: Number(data.quantity),
//         totalQuantity: Number(data.quantity),
//         targetQuantity: Number(data.quantity),
//         startDate: new Date(data.startDate).toISOString(),
//         dueDate: new Date(data.dueDate).toISOString(),
//         targetDeliveryDate: new Date(data.dueDate).toISOString(),
//         status: 'PENDING',
//       };

//       await api.post('/orders', payload);
//       setIsModalOpen(false);
//       reset({
//         orderNumber: `JO-2026-${Math.floor(100 + Math.random() * 900)}`,
//         clientName: '',
//         styleName: '',
//         quantity: 100,
//         startDate: new Date().toISOString().split('T')[0],
//         dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//       });
//       fetchOrders();
//     } catch (err: any) {
//       console.error('Failed to create order:', err);
//       const apiMsg = err.response?.data?.message || err.response?.data?.error;
//       setServerError(
//         typeof apiMsg === 'string'
//           ? apiMsg
//           : 'Failed to create job order. Please check inputs or inspect backend console.'
//       );
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.styleName.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Header Banner */}
//       <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
//         <div>
//           <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
//             <Scissors className="mr-2 h-6 w-6 text-primary" />
//             Job Orders Management
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Track garment production orders, target quantities, and fulfillment progress.
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={fetchOrders}
//             disabled={isLoading}
//             className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
//             title="Refresh Orders"
//           >
//             <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//           </button>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Create Job Order
//           </button>
//         </div>
//       </div>

//       {/* Filter and Search Bar */}
//       <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search by order #, client, or style..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//           />
//         </div>
//         <div className="flex w-full items-center space-x-2 sm:w-auto">
//           <Filter className="h-4 w-4 text-muted-foreground" />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48"
//           >
//             <option value="ALL">All Statuses</option>
//             <option value="PENDING">Pending</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="COMPLETED">Completed</option>
//             <option value="CANCELLED">Cancelled</option>
//           </select>
//         </div>
//       </div>

//       {/* Orders Grid */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredOrders.length === 0 ? (
//           <div className="col-span-full rounded-xl border border-border bg-card py-12 text-center">
//             <Scissors className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
//             <p className="text-base font-semibold text-foreground">No Job Orders Found</p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Try adjusting your search query or status filter.
//             </p>
//           </div>
//         ) : (
//           filteredOrders.map((order) => {
//             const progress = order.quantity > 0 ? Math.round((order.completedQuantity / order.quantity) * 100) : 0;
//             return (
//               <div
//                 key={order.id}
//                 className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
//                       {order.orderNumber}
//                     </span>
//                     <h3 className="mt-1.5 text-base font-bold text-foreground">{order.styleName}</h3>
//                     <p className="text-xs text-muted-foreground">{order.clientName}</p>
//                   </div>
//                   <span
//                     className={`rounded-full px-2.5 py-1 text-xs font-medium ${
//                       order.status === 'COMPLETED'
//                         ? 'bg-emerald-500/10 text-emerald-600'
//                         : order.status === 'IN_PROGRESS'
//                         ? 'bg-blue-500/10 text-blue-600'
//                         : 'bg-amber-500/10 text-amber-600'
//                     }`}
//                   >
//                     {order.status.replace('_', ' ')}
//                   </span>
//                 </div>

//                 {/* Completion Progress Bar */}
//                 <div>
//                   <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
//                     <span>Progress</span>
//                     <span className="font-semibold text-foreground">
//                       {order.completedQuantity} / {order.quantity} pcs ({progress}%)
//                     </span>
//                   </div>
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-border">
//                     <div
//                       className="h-2 rounded-full bg-primary transition-all duration-300"
//                       style={{ width: `${Math.min(progress, 100)}%` }}
//                     />
//                   </div>
//                 </div>

//                 {/* Timeline & Detail Button */}
//                 <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
//                   <div className="flex items-center space-x-1">
//                     <Calendar className="h-3.5 w-3.5" />
//                     <span>Due: {order.dueDate}</span>
//                   </div>
//                   <Link
//                     href={`/orders/${order.id || (order as any)._id}`}
//                     className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
//                   >
//                     View Details <Eye className="ml-1 h-3.5 w-3.5" />
//                   </Link>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Create Order Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
//             <div className="flex items-center justify-between border-b border-border pb-4">
//               <h2 className="text-lg font-bold text-foreground">Create Production Job Order</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {serverError && (
//               <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
//                 <AlertCircle className="h-4 w-4 flex-shrink-0" />
//                 <span>{serverError}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit(onCreateOrder)} className="space-y-4">
//               <div>
//                 <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
//                   Job Order Number
//                 </label>
//                 <input
//                   {...register('orderNumber')}
//                   type="text"
//                   className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                 />
//                 {errors.orderNumber && (
//                   <p className="mt-1 text-xs text-destructive">{errors.orderNumber.message}</p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
//                     Client Name
//                   </label>
//                   <input
//                     {...register('clientName')}
//                     type="text"
//                     placeholder="Raymond Ltd"
//                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                   {errors.clientName && (
//                     <p className="mt-1 text-xs text-destructive">{errors.clientName.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
//                     Garment Style
//                   </label>
//                   <input
//                     {...register('styleName')}
//                     type="text"
//                     placeholder="Men Cotton Shirt"
//                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                   {errors.styleName && (
//                     <p className="mt-1 text-xs text-destructive">{errors.styleName.message}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
//                   Target Quantity (Pieces)
//                 </label>
//                 <input
//                   {...register('quantity')}
//                   type="number"
//                   className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                 />
//                 {errors.quantity && (
//                   <p className="mt-1 text-xs text-destructive">{errors.quantity.message}</p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
//                     Start Date
//                   </label>
//                   <input
//                     {...register('startDate')}
//                     type="date"
//                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                   {errors.startDate && (
//                     <p className="mt-1 text-xs text-destructive">{errors.startDate.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
//                     Target Delivery Date
//                   </label>
//                   <input
//                     {...register('dueDate')}
//                     type="date"
//                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                   {errors.dueDate && (
//                     <p className="mt-1 text-xs text-destructive">{errors.dueDate.message}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center justify-end space-x-3 border-t border-border pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Creating...' : 'Create Order'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// Purpose: Job Orders Management Page with Modal Creation Form & Progress Tracking
// Path: frontend/src/app/orders/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import {
  Scissors,
  Plus,
  Search,
  Filter,
  Calendar,
  X,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface JobOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  styleName: string;
  quantity: number;
  completedQuantity: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  dueDate: string;
}

// Zod Schema for Creating a New Job Order
const createOrderSchema = z.object({
  orderNumber: z.string().min(3, 'Order number is required'),
  clientName: z.string().min(2, 'Client name is required'),
  styleName: z.string().min(2, 'Garment style is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  fabricType: z.string().min(2, 'Fabric type is required'),
  consumptionPerPieceMeters: z.coerce.number().min(0.1, 'Consumption is required'),
  startDate: z.string().min(1, 'Start date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

export default function JobOrdersPage() {
  const [orders, setOrders] = useState<JobOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      orderNumber: `JO-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: '',
      styleName: '',
      quantity: 100,
      fabricType: '100% Cotton Poplin',
      consumptionPerPieceMeters: 1.5,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/orders');
      const rawData = response.data?.data || response.data?.orders || response.data;
      const list = Array.isArray(rawData) ? rawData : rawData?.items || [];

      const formattedOrders: JobOrder[] = list.map((item: any) => ({
        id: item._id || item.id || `ord-${Math.random()}`,
        orderNumber: item.orderNumber || item.jobOrderNumber || 'JO-2026-000',
        clientName: item.clientName || item.client || item.companyName || 'Mohammad',
        styleName: item.styleName || item.garmentType || item.style || item.garmentStyle || 'Men formal shirt',
        quantity: item.quantity || item.totalQuantity || item.targetQuantity || 100,
        completedQuantity: item.completedQuantity || item.producedQuantity || 0,
        status: item.status || 'PENDING',
        startDate: item.startDate ? String(item.startDate).split('T')[0] : '2026-08-07',
        dueDate: item.dueDate
          ? String(item.dueDate).split('T')[0]
          : item.targetDeliveryDate
          ? String(item.targetDeliveryDate).split('T')[0]
          : '2026-08-21',
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onCreateOrder = async (data: CreateOrderFormData) => {
    setServerError(null);
    try {
      const payload = {
        orderNumber: data.orderNumber,
        clientName: data.clientName,
        styleName: data.styleName,
        quantity: Number(data.quantity),
        fabricDetails: {
          type: data.fabricType,
          consumptionPerPieceMeters: Number(data.consumptionPerPieceMeters),
          totalRequiredMeters: Number(data.quantity) * Number(data.consumptionPerPieceMeters),
        },
        startDate: new Date(data.startDate).toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        status: 'PENDING',
      };

      await api.post('/orders', payload);
      setIsModalOpen(false);
      reset({
        orderNumber: `JO-2026-${Math.floor(100 + Math.random() * 900)}`,
        clientName: '',
        styleName: '',
        quantity: 100,
        fabricType: '100% Cotton Poplin',
        consumptionPerPieceMeters: 1.5,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      fetchOrders();
    } catch (err: any) {
      console.error('Failed to create order:', err);
      const apiMsg = err.response?.data?.message || err.response?.data?.error;
      setServerError(
        typeof apiMsg === 'string'
          ? apiMsg
          : 'Failed to create job order. Please check inputs or inspect backend console.'
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.styleName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
            <Scissors className="mr-2 h-6 w-6 text-primary" />
            Job Orders Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track garment production orders, target quantities, and fulfillment progress.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Refresh Orders"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job Order
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order #, client, or style..."
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
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border bg-card py-12 text-center">
            <Scissors className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-base font-semibold text-foreground">No Job Orders Found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const progress = order.quantity > 0 ? Math.round((order.completedQuantity / order.quantity) * 100) : 0;
            return (
              <div
                key={order.id}
                className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                      {order.orderNumber}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-foreground">{order.styleName}</h3>
                    <p className="text-xs text-muted-foreground">{order.clientName}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      order.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : order.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Completion Progress Bar */}
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-semibold text-foreground">
                      {order.completedQuantity} / {order.quantity} pcs ({progress}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Timeline & Detail Button */}
                <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {order.dueDate}</span>
                  </div>
                  <Link
                    href={`/orders/${order.id || (order as any)._id}`}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                  >
                    View Details <Eye className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">Create Production Job Order</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {serverError && (
              <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onCreateOrder)} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Job Order Number
                </label>
                <input
                  {...register('orderNumber')}
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.orderNumber && (
                  <p className="mt-1 text-xs text-destructive">{errors.orderNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Client Name
                  </label>
                  <input
                    {...register('clientName')}
                    type="text"
                    placeholder="Raymond Ltd"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.clientName && (
                    <p className="mt-1 text-xs text-destructive">{errors.clientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Garment Style
                  </label>
                  <input
                    {...register('styleName')}
                    type="text"
                    placeholder="Men Cotton Shirt"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.styleName && (
                    <p className="mt-1 text-xs text-destructive">{errors.styleName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Target Quantity (Pieces)
                </label>
                <input
                  {...register('quantity')}
                  type="number"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.quantity && (
                  <p className="mt-1 text-xs text-destructive">{errors.quantity.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Fabric Type / Description
                  </label>
                  <input
                    {...register('fabricType')}
                    type="text"
                    placeholder="100% Cotton Poplin"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.fabricType && (
                    <p className="mt-1 text-xs text-destructive">{errors.fabricType.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Consumption (Meters / Piece)
                  </label>
                  <input
                    {...register('consumptionPerPieceMeters')}
                    type="number"
                    step="0.1"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.consumptionPerPieceMeters && (
                    <p className="mt-1 text-xs text-destructive">{errors.consumptionPerPieceMeters.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Start Date
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-destructive">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Target Delivery Date
                  </label>
                  <input
                    {...register('dueDate')}
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-xs text-destructive">{errors.dueDate.message}</p>
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
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}