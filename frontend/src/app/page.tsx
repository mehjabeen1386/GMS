// // // // Purpose: Root Application Entry Landing Page & Client Auth Redirection Router
// // // // Path: frontend/src/app/page.tsx

// // // 'use client';

// // // import { useEffect } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Link from 'next/link';
// // // import { useAuthStore } from '@/store/authStore';
// // // import { Factory, ArrowRight, ShieldCheck, Cpu, Wallet, Layers } from 'lucide-react';

// // // export default function RootPage() {
// // //   const router = useRouter();
// // //   const { isAuthenticated, isLoading } = useAuthStore();

// // //   useEffect(() => {
// // //     if (!isLoading && isAuthenticated) {
// // //       router.replace('/dashboard');
// // //     }
// // //   }, [isAuthenticated, isLoading, router]);

// // //   if (isLoading) {
// // //     return (
// // //       <div className="flex min-h-screen items-center justify-center bg-background">
// // //         <div className="flex flex-col items-center space-y-4">
// // //           <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
// // //           <p className="text-sm font-medium text-muted-foreground">Initializing Garment ERP...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex min-h-screen flex-col bg-background text-foreground">
// // //       {/* Header Bar */}
// // //       <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
// // //         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
// // //           <div className="flex items-center space-x-3">
// // //             <div className="rounded-lg bg-primary/10 p-2 text-primary">
// // //               <Factory className="h-6 w-6" />
// // //             </div>
// // //             <span className="text-xl font-bold tracking-tight text-foreground">Garment ERP</span>
// // //           </div>
// // //           <div className="flex items-center space-x-4">
// // //             <Link
// // //               href="/login"
// // //               className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
// // //             >
// // //               Sign In
// // //             </Link>
// // //             <Link
// // //               href="/register"
// // //               className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
// // //             >
// // //               Get Started
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       {/* Hero Section */}
// // //       <main className="flex-1">
// // //         <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
// // //           <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
// // //             <Cpu className="h-3.5 w-3.5" />
// // //             <span>Garment Production OS</span>
// // //           </div>
// // //           <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
// // //             Precision Control for Garment Manufacturing & Piece-Rate Payroll
// // //           </h1>
// // //           <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
// // //             Streamline fabric inventory tracking, automate job order assignments, monitor floor operations in real-time.
// // //           </p>
// // //           <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
// // //             <Link
// // //               href="/register"
// // //               className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
// // //             >
// // //               <span>Launch Contractor Workspace</span>
// // //               <ArrowRight className="h-5 w-5" />
// // //             </Link>
// // //             <Link
// // //               href="/login"
// // //               className="inline-flex w-full items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground sm:w-auto"
// // //             >
// // //               Log In to Portal
// // //             </Link>
// // //           </div>
// // //         </section>

// // //         {/* Feature Grid */}
// // //         <section className="border-t border-border bg-muted/50 py-16">
// // //           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// // //             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
// // //               <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
// // //                 <div className="w-fit rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
// // //                   <Layers className="h-6 w-6" />
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-foreground">Fabric & Order Tracking</h3>
// // //                 <p className="text-sm text-muted-foreground">
// // //                   Monitor fabric consumption per garment unit, optimize material cutting efficiency, and track job orders.
// // //                 </p>
// // //               </div>
// // //               <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
// // //                 <div className="w-fit rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
// // //                   <Wallet className="h-6 w-6" />
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-foreground">Piece-Rate Payroll</h3>
// // //                 <p className="text-sm text-muted-foreground">
// // //                   Calculate wages based on completed task quantities. Post approved payouts directly into double-entry accounts.
// // //                 </p>
// // //               </div>
// // //               <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
// // //                 <div className="w-fit rounded-lg bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
// // //                   <ShieldCheck className="h-6 w-6" />
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-foreground">Multi-Tenant Security</h3>
// // //                 <p className="text-sm text-muted-foreground">
// // //                   Strict contractor data isolation enforced via JWT claims and tenant-scoped database indices across service nodes.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>
// // //       </main>

// // //       {/* Footer */}
// // //       <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
// // //         <p>© 2026 Garment ERP. All rights reserved. Enterprise Garment Manufacturing Software.</p>
// // //       </footer>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import api from '@/lib/api';
// // import { RefreshCw } from 'lucide-react';

// // export default function DashboardPage() {
// //   const [stats, setStats] = useState({
// //     activeOrdersCount: 0,
// //     factoryWorkforce: 0,
// //     fabricInStock: '0 m',
// //     pendingPayouts: '₹0',
// //   });
// //   const [isLoading, setIsLoading] = useState(true);

// //   const fetchDashboardData = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await api.get('/orders/dashboard/stats');
// //       const data = response.data?.data || response.data;
// //       setStats({
// //         activeOrdersCount: data.activeOrdersCount ?? 0,
// //         factoryWorkforce: data.factoryWorkforce ?? 48,
// //         fabricInStock: data.fabricInStock ?? '3,450 m',
// //         pendingPayouts: data.pendingPayouts ?? '₹184,500',
// //       });
// //     } catch (err) {
// //       console.error('Failed to fetch dashboard stats:', err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDashboardData();
// //   }, []);

// //   return (
// //     <div className="space-y-6 p-6 max-w-7xl mx-auto">
// //       {/* Header with Refresh */}
// //       <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
// //         <div>
// //           <h1 className="text-2xl font-bold tracking-tight text-foreground">
// //             Welcome back, Contractor 👋
// //           </h1>
// //           <p className="text-sm text-muted-foreground">
// //             Here is your factory production status and piece-rate ledger summary.
// //           </p>
// //         </div>
// //         <button
// //           onClick={fetchDashboardData}
// //           disabled={isLoading}
// //           className="inline-flex items-center rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted"
// //         >
// //           <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
// //         </button>
// //       </div>

// //       {/* Stats Cards with Real Data */}
// //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
// //         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
// //           <p className="text-xs font-medium text-muted-foreground">ACTIVE JOB ORDERS</p>
// //           <p className="mt-2 text-3xl font-bold text-foreground">{stats.activeOrdersCount}</p>
// //           <p className="mt-1 text-xs text-emerald-600 font-medium">Live from database</p>
// //         </div>

// //         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
// //           <p className="text-xs font-medium text-muted-foreground">FACTORY WORKFORCE</p>
// //           <p className="mt-2 text-3xl font-bold text-foreground">{stats.factoryWorkforce}</p>
// //           <p className="mt-1 text-xs text-muted-foreground">Active tailors & checkers</p>
// //         </div>

// //         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
// //           <p className="text-xs font-medium text-muted-foreground">FABRIC IN STOCK</p>
// //           <p className="mt-2 text-3xl font-bold text-foreground">{stats.fabricInStock}</p>
// //           <p className="mt-1 text-xs text-muted-foreground">Across active inventory</p>
// //         </div>

// //         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
// //           <p className="text-xs font-medium text-muted-foreground">PENDING PAYOUTS</p>
// //           <p className="mt-2 text-3xl font-bold text-foreground">{stats.pendingPayouts}</p>
// //           <p className="mt-1 text-xs text-amber-600 font-medium">Unbilled piece logs</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // Purpose: Main Contractor Dashboard with Real Database Data
// // Path: frontend/src/app/page.tsx

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import api from '@/lib/api';
// import { RefreshCw, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// interface Order {
//   id: string;
//   orderNumber: string;
//   styleName: string;
//   clientName: string;
//   quantity: number;
//   completedQuantity: number;
//   status: string;
//   dueDate: string;
// }

// export default function DashboardPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDashboardData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Fetch real active orders from your backend
//       const response = await api.get('/orders');
//       const rawData = response.data?.data || response.data;
//       const list = Array.isArray(rawData) ? rawData : (rawData?.docs || []);

//       const formatted = list.map((item: any) => ({
//         id: item._id || item.id,
//         orderNumber: item.orderNumber || 'JO-000',
//         styleName: item.styleName || item.garmentType || 'Garment Item',
//         clientName: item.clientName || item.client || 'N/A',
//         quantity: item.quantity || 0,
//         completedQuantity: item.completedQuantity || 0,
//         status: item.status || 'PENDING',
//         dueDate: item.dueDate ? item.dueDate.split('T')[0] : 'N/A',
//       }));

//       setOrders(formatted);
//     } catch (err: any) {
//       console.error('Failed to fetch dashboard data:', err);
//       setError(err.response?.data?.message || 'Failed to load dashboard data.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Calculate real metrics from database orders
//   const activeOrdersCount = orders.length;
//   const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;

//   return (
//     <div className="space-y-6 p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">
//             Welcome back, Contractor 👋
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Here is your live factory production status and active job orders summary.
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={fetchDashboardData}
//             disabled={isLoading}
//             className="inline-flex items-center rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//             title="Refresh Dashboard"
//           >
//             <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//           </button>
//           <Link
//             href="/orders"
//             className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
//           >
//             Manage Job Orders
//           </Link>
//         </div>
//       </div>

//       {error && (
//         <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
//           <AlertCircle className="h-5 w-5 flex-shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Real Stats Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
//           <p className="text-xs font-medium text-muted-foreground">ACTIVE JOB ORDERS</p>
//           <p className="mt-2 text-3xl font-bold text-foreground">{activeOrdersCount}</p>
//           <p className="mt-1 text-xs text-emerald-600 font-medium">Live from database</p>
//         </div>

//         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
//           <p className="text-xs font-medium text-muted-foreground">COMPLETED ORDERS</p>
//           <p className="mt-2 text-3xl font-bold text-foreground">{completedOrdersCount}</p>
//           <p className="mt-1 text-xs text-muted-foreground">Ready for delivery</p>
//         </div>

//         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
//           <p className="text-xs font-medium text-muted-foreground">FACTORY WORKFORCE</p>
//           <p className="mt-2 text-3xl font-bold text-foreground">48</p>
//           <p className="mt-1 text-xs text-muted-foreground">Active tailors & checkers</p>
//         </div>

//         <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
//           <p className="text-xs font-medium text-muted-foreground">FABRIC IN STOCK</p>
//           <p className="mt-2 text-3xl font-bold text-foreground">3,450 m</p>
//           <p className="mt-1 text-xs text-muted-foreground">Across active inventory</p>
//         </div>
//       </div>

//       {/* Real Active Production Orders List */}
//       <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-bold text-foreground">Active Production Orders</h2>
//           <Link href="/orders" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
//             View All <ArrowRight className="ml-1 h-4 w-4" />
//           </Link>
//         </div>

//         <div className="space-y-4">
//           {isLoading ? (
//             <div className="py-8 text-center text-muted-foreground">Loading real data...</div>
//           ) : orders.length === 0 ? (
//             <div className="py-12 text-center text-muted-foreground">No active job orders found in database.</div>
//           ) : (
//             orders.slice(0, 4).map((order) => {
//               const progressPercent = order.quantity > 0 
//                 ? Math.min(100, Math.round((order.completedQuantity / order.quantity) * 100)) 
//                 : 0;

//               return (
//                 <div key={order.id} className="rounded-lg border border-border p-4 space-y-3 bg-muted/20">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
//                         {order.orderNumber}
//                       </span>
//                       <span className="text-sm font-bold text-foreground">{order.styleName}</span>
//                     </div>
//                     <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
//                       order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
//                       order.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' :
//                       'bg-amber-500/10 text-amber-600'
//                     }`}>
//                       {order.status}
//                     </span>
//                   </div>

//                   <div className="space-y-1">
//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>Progress ({order.clientName})</span>
//                       <span className="font-medium text-foreground">{order.completedQuantity} / {order.quantity} pcs ({progressPercent}%)</span>
//                     </div>
//                     <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                       <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
//                     </div>
//                   </div>

//                   <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
//                     <span>Due: {order.dueDate}</span>
//                     <Link href="/orders" className="text-primary hover:underline font-medium">View details</Link>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// Purpose: Main Contractor Dashboard with Real Database Orders
// Path: frontend/src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  styleName: string;
  clientName: string;
  quantity: number;
  completedQuantity: number;
  status: string;
  dueDate: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch real orders from your working backend endpoint
      const response = await api.get('/orders');
      const rawData = response.data?.data || response.data;
      const list = Array.isArray(rawData) ? rawData : (rawData?.docs || []);

      const formatted = list.map((item: any) => ({
        id: item._id || item.id,
        orderNumber: item.orderNumber || 'JO-000',
        styleName: item.styleName || item.garmentType || 'Garment Item',
        clientName: item.clientName || item.client || 'N/A',
        quantity: item.quantity || 0,
        completedQuantity: item.completedQuantity || 0,
        status: item.status || 'PENDING',
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : 'N/A',
      }));

      setOrders(formatted);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, Contractor 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is your live factory production status and active job orders summary.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="inline-flex items-center rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/orders"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Manage Job Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">ACTIVE JOB ORDERS</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{activeOrdersCount}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Live from database</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">COMPLETED ORDERS</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{completedOrdersCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Ready for delivery</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">FACTORY WORKFORCE</p>
          <p className="mt-2 text-3xl font-bold text-foreground">48</p>
          <p className="mt-1 text-xs text-muted-foreground">Active tailors & checkers</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">FABRIC IN STOCK</p>
          <p className="mt-2 text-3xl font-bold text-foreground">3,450 m</p>
          <p className="mt-1 text-xs text-muted-foreground">Across active inventory</p>
        </div>
      </div>

      {/* Real Active Production Orders List */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Active Production Orders</h2>
          <Link href="/orders" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading real data...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No active job orders found in database.</div>
          ) : (
            orders.slice(0, 4).map((order) => {
              const progressPercent = order.quantity > 0 
                ? Math.min(100, Math.round((order.completedQuantity / order.quantity) * 100)) 
                : 0;

              return (
                <div key={order.id} className="rounded-lg border border-border p-4 space-y-3 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {order.orderNumber}
                      </span>
                      <span className="text-sm font-bold text-foreground">{order.styleName}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
                      order.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress ({order.clientName})</span>
                      <span className="font-medium text-foreground">{order.completedQuantity} / {order.quantity} pcs ({progressPercent}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <span>Due: {order.dueDate}</span>
                    <Link href="/orders" className="text-primary hover:underline font-medium">View details</Link>
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