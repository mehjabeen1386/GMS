// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import api from '@/lib/api';
// import {
//   ArrowLeft,
//   Calendar,
//   Building2,
//   QrCode,
//   IndianRupee,
//   RefreshCw,
//   Printer,
//   AlertTriangle,
//   ChevronRight,
//   Plus, 
//   Search, 
//   Eye, 
//   Trash2, 
//   Home, 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// interface Operation {
//   id: string;
//   name: string;
//   sequenceOrder: number;
//   pieceRate: number;
//   completedPieces: number;
// }

// interface Bundle {
//   id: string;
//   bundleCode: string;
//   size: string;
//   color: string;
//   quantity: number;
//   status: 'CUTTING' | 'IN_PROGRESS' | 'COMPLETED';
//   currentOperation?: string;
//   assignedWorker?: string;
// }

// interface JobOrderDetail {
//   id: string;
//   orderNumber: string;
//   clientName: string;
//   styleName: string;
//   quantity: number;
//   completedQuantity: number;
//   status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
//   startDate: string;
//   dueDate: string;
//   fabricDetails: {
//     type: string;
//     consumptionPerPieceMeters: number;
//     totalRequiredMeters: number;
//   };
//   operations: Operation[];
//   bundles: Bundle[];
// }

// interface OperationRowProps {
//   operationName: string;
//   pieceRate: number;
//   targetQty: number;
//   completedQty: number;
//   onUpdate: (newQty: number) => void;
// }

// function OperationRow({
//   operationName,
//   pieceRate,
//   targetQty,
//   completedQty,
//   onUpdate,
// }: OperationRowProps) {
//   const [inputVal, setInputVal] = useState(completedQty.toString());
//   const [isEditing, setIsEditing] = useState(false);

//   const handleSave = () => {
//     const qty = parseInt(inputVal, 10);
//     if (!isNaN(qty) && qty >= 0 && qty <= targetQty) {
//       onUpdate(qty);
//       setIsEditing(false);
//     } else {
//       alert(`Please enter a valid quantity between 0 and ${targetQty}`);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center">
//       <div>
//         <h4 className="text-sm font-semibold text-foreground">{operationName}</h4>
//         <p className="mt-0.5 flex items-center text-xs font-medium text-emerald-600">
//           <IndianRupee className="mr-0.5 h-3 w-3" />
//           Piece Rate: ₹{pieceRate.toFixed(2)} per piece
//         </p>
//       </div>

//       <div className="flex items-center space-x-4">
//         {isEditing ? (
//           <div className="flex items-center space-x-2">
//             <Input
//               type="number"
//               value={inputVal}
//               onChange={(e) => setInputVal(e.target.value)}
//               className="w-24 h-8 text-sm"
//               max={targetQty}
//               min={0}
//             />
//             <Button size="sm" onClick={handleSave}>Save</Button>
//             <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
//           </div>
//         ) : (
//           <div className="flex items-center space-x-4">
//             <span className="text-sm font-medium text-foreground">
//               {completedQty} / {targetQty} pcs
//             </span>
//             <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
//               Update Progress
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function OrderDetailPage() {
//   const params = useParams();
//   const orderId = params?.id as string;
//   const [order, setOrder] = useState<JobOrderDetail | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [activeTab, setActiveTab] = useState<'OPERATIONS' | 'BUNDLES'>('OPERATIONS');

//   const fetchOrderDetail = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get(`/orders/${orderId}`);
//       const raw = response.data?.data || response.data?.order || response.data;

//       if (raw) {
//         const formattedOrder: JobOrderDetail = {
//           id: raw._id || raw.id || orderId,
//           orderNumber: raw.orderNumber || raw.jobOrderNumber || 'JO-2026-000',
//           clientName: raw.clientName || raw.client || 'N/A',
//           styleName: raw.styleName || raw.garmentType || raw.style || raw.garmentStyle || 'Garment Item',
//           quantity: raw.quantity || raw.totalQuantity || raw.targetQuantity || 0,
//           completedQuantity: raw.completedQuantity || raw.producedQuantity || 0,
//           status: raw.status || 'PENDING',
//           startDate: raw.startDate ? String(raw.startDate).split('T')[0] : 'N/A',
//           dueDate: raw.dueDate
//             ? String(raw.dueDate).split('T')[0]
//             : raw.deliveryDate
//             ? String(raw.deliveryDate).split('T')[0]
//             : raw.targetDeliveryDate
//             ? String(raw.targetDeliveryDate).split('T')[0]
//             : 'N/A',
//           fabricDetails: {
//             type: raw.fabricDetails?.type || raw.fabricType || 'Standard Cotton Fabric',
//             consumptionPerPieceMeters: raw.fabricDetails?.consumptionPerPieceMeters || raw.fabricConsumption || 1.5,
//             totalRequiredMeters:
//               raw.fabricDetails?.totalRequiredMeters ||
//               (raw.quantity || 0) * (raw.fabricDetails?.consumptionPerPieceMeters || 1.5),
//           },
//           operations: Array.isArray(raw.operations) && raw.operations.length > 0
//             ? raw.operations.map((op: any, index: number) => ({
//                 id: op._id || op.id || `op-${index + 1}`,
//                 name: op.name || op.operationName || `Operation #${index + 1}`,
//                 sequenceOrder: op.sequenceOrder || index + 1,
//                 pieceRate: op.pieceRate || op.rate || 0,
//                 completedPieces: op.completedPieces || op.completedQuantity || 0,
//               }))
//             : [
//                 {
//                   id: 'op-1',
//                   name: 'Cutting & Panel Assembly',
//                   sequenceOrder: 1,
//                   pieceRate: 5.0,
//                   completedPieces: 0,
//                 },
//                 {
//                   id: 'op-2',
//                   name: 'Main Body Stitching',
//                   sequenceOrder: 2,
//                   pieceRate: 8.5,
//                   completedPieces: 0,
//                 },
//                 {
//                   id: 'op-3',
//                   name: 'Quality Inspection & Finishing',
//                   sequenceOrder: 3,
//                   pieceRate: 4.0,
//                   completedPieces: 0,
//                 },
//               ],
//           bundles: Array.isArray(raw.bundles) && raw.bundles.length > 0
//             ? raw.bundles.map((b: any, index: number) => ({
//                 id: b._id || b.id || `bnd-${index + 1}`,
//                 bundleCode: b.bundleCode || b.code || `BND-${raw.orderNumber || '000'}-${index + 1}`,
//                 size: b.size || 'M',
//                 color: b.color || 'Standard',
//                 quantity: b.quantity || 50,
//                 status: b.status || 'IN_PROGRESS',
//                 currentOperation: b.currentOperation || 'Main Stitching',
//                 assignedWorker: b.assignedWorker || b.workerName || 'Unassigned',
//               }))
//             : [],
//         };

//         setOrder(formattedOrder);
//       }
//     } catch (err) {
//       console.error('Failed to fetch order detail:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateOperation = async (opId: string, newQty: number) => {
//     try {
//       const updatedOperations = order?.operations?.map((op: any) => 
//         op.id === opId ? { ...op, completedPieces: newQty } : op
//       ) || [];

//       await api.patch(`/orders/${orderId}`, {
//         operations: updatedOperations,
//       });

//       fetchOrderDetail();
//     } catch (err) {
//       console.error('Failed to update operation:', err);
//       alert('Failed to update progress. Please check your backend connection.');
//     }
//   };

//   useEffect(() => {
//     if (orderId) {
//       fetchOrderDetail();
//     }
//   }, [orderId]);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center space-y-3 py-20">
//         <RefreshCw className="h-8 w-8 animate-spin text-primary" />
//         <p className="text-sm font-medium text-muted-foreground">Loading order details...</p>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="rounded-xl border border-border bg-card py-16 text-center">
//         <AlertTriangle className="mx-auto mb-2 h-10 w-10 text-amber-500" />
//         <p className="text-base font-semibold text-foreground">Order Not Found</p>
//         <p className="mb-4 mt-1 text-xs text-muted-foreground">
//           The requested job order ID does not exist or was deleted.
//         </p>
//         <Link
//           href="/orders"
//           className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
//         >
//           <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Orders
//         </Link>
//       </div>
//     );
//   }

//   const completionPercentage = order.quantity > 0 ? Math.round((order.completedQuantity / order.quantity) * 100) : 0;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="flex items-center space-x-3">
//           <Link
//             href="/orders"
//             className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Link>
//           <div>
//             <div className="flex items-center space-x-2">
//               <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
//                 {order.orderNumber}
//               </span>
//               <span
//                 className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                   order.status === 'COMPLETED'
//                     ? 'bg-emerald-500/10 text-emerald-600'
//                     : order.status === 'IN_PROGRESS'
//                     ? 'bg-blue-500/10 text-blue-600'
//                     : 'bg-amber-500/10 text-amber-600'
//                 }`}
//               >
//                 {order.status?.replace('_', ' ')}
//               </span>
//             </div>
//             <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground">
//               {order.styleName}
//             </h1>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => window.print()}
//             className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
//           >
//             <Printer className="mr-1.5 h-4 w-4" /> Print Job Card
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
//           <p className="text-xs font-semibold uppercase text-muted-foreground">Client Partner</p>
//           <p className="mt-1 flex items-center text-base font-bold text-foreground">
//             <Building2 className="mr-1.5 h-4 w-4 text-primary" />
//             {order.clientName}
//           </p>
//         </div>
//         <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
//           <p className="text-xs font-semibold uppercase text-muted-foreground">Target Quantity</p>
//           <p className="mt-1 text-base font-bold text-foreground">
//             {order.completedQuantity} / {order.quantity} pcs
//           </p>
//           <div className="mt-2 h-1.5 w-full bg-border rounded-full">
//             <div
//               className="h-1.5 bg-primary rounded-full"
//               style={{ width: `${Math.min(completionPercentage, 100)}%` }}
//             />
//           </div>
//         </div>
//         <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
//           <p className="text-xs font-semibold uppercase text-muted-foreground">Fabric Allocated</p>
//           <p className="mt-1 text-base font-bold text-foreground">
//             {order.fabricDetails.totalRequiredMeters} meters
//           </p>
//           <p className="mt-0.5 text-[11px] text-muted-foreground">
//             {order.fabricDetails.consumptionPerPieceMeters}m / piece
//           </p>
//         </div>
//         <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
//           <p className="text-xs font-semibold uppercase text-muted-foreground">Delivery Schedule</p>
//           <p className="mt-1 flex items-center text-base font-bold text-foreground">
//             <Calendar className="mr-1.5 h-4 w-4 text-amber-500" />
//             Due: {order.dueDate}
//           </p>
//           <p className="mt-0.5 text-[11px] text-muted-foreground">Started: {order.startDate}</p>
//         </div>
//       </div>

//       <div className="flex space-x-6 border-b border-border">
//         <button
//           onClick={() => setActiveTab('OPERATIONS')}
//           className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
//             activeTab === 'OPERATIONS'
//               ? 'border-primary text-primary'
//               : 'border-transparent text-muted-foreground hover:text-foreground'
//           }`}
//         >
//           Operation Sequence & Piece Rates ({order.operations.length})
//         </button>
//         <button
//           onClick={() => setActiveTab('BUNDLES')}
//           className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
//             activeTab === 'BUNDLES'
//               ? 'border-primary text-primary'
//               : 'border-transparent text-muted-foreground hover:text-foreground'
//           }`}
//         >
//           Production Bundles & QR Tags ({order.bundles.length})
//         </button>
//       </div>

//       {activeTab === 'OPERATIONS' && (
//         <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-base font-bold text-foreground">Garment Assembly Breakdown</h2>
//             <span className="text-xs text-muted-foreground">Ordered Floor Workflow</span>
//           </div>
//           <div className="space-y-3">
//             {order.operations.map((op) => (
//               <OperationRow
//                 key={op.id}
//                 operationName={op.name}
//                 pieceRate={op.pieceRate}
//                 targetQty={order.quantity}
//                 completedQty={op.completedPieces}
//                 onUpdate={(newQty) => handleUpdateOperation(op.id, newQty)}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === 'BUNDLES' && (
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {order.bundles.map((bundle) => (
//             <div
//               key={bundle.id}
//               className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
//             >
//               <div className="flex items-start justify-between">
//                 <div>
//                   <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold text-foreground">
//                     {bundle.bundleCode}
//                   </span>
//                   <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
//                     <span>
//                       Size: <strong className="text-foreground">{bundle.size}</strong>
//                     </span>
//                     <span>•</span>
//                     <span>
//                       Color: <strong className="text-foreground">{bundle.color}</strong>
//                     </span>
//                   </div>
//                 </div>
//                 <QrCode className="h-8 w-8 rounded bg-primary/10 p-1 text-primary" />
//               </div>
//               <div className="space-y-1 rounded border border-border/50 bg-muted/40 p-2.5 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Quantity:</span>
//                   <span className="font-bold text-foreground">{bundle.quantity} pcs</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Current Stage:</span>
//                   <span className="font-semibold text-primary">{bundle.currentOperation}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Assigned Tailor:</span>
//                   <span className="text-foreground">{bundle.assignedWorker || 'Unassigned'}</span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between pt-1 text-xs">
//                 <span
//                   className={`rounded-full px-2 py-0.5 font-medium ${
//                     bundle.status === 'COMPLETED'
//                       ? 'bg-emerald-500/10 text-emerald-600'
//                       : 'bg-blue-500/10 text-blue-600'
//                   }`}
//                 >
//                   {bundle.status}
//                 </span>
//                 <Link
//                   href={`/production/scan?bundle=${encodeURIComponent(bundle.bundleCode)}`}
//                   className="flex items-center font-semibold text-primary hover:underline"
//                 >
//                   Log Piece Rate <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import {
  ArrowLeft,
  Calendar,
  Building2,
  QrCode,
  IndianRupee,
  RefreshCw,
  Printer,
  AlertTriangle,
  ChevronRight,
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  Home, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Operation {
  id: string;
  name: string;
  sequenceOrder: number;
  pieceRate: number;
  completedPieces: number;
}

interface Bundle {
  id: string;
  bundleCode: string;
  size: string;
  color: string;
  quantity: number;
  status: 'CUTTING' | 'IN_PROGRESS' | 'COMPLETED';
  currentOperation?: string;
  assignedWorker?: string;
}

interface JobOrderDetail {
  id: string;
  orderNumber: string;
  clientName: string;
  styleName: string;
  quantity: number;
  completedQuantity: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  dueDate: string;
  fabricDetails: {
    type: string;
    consumptionPerPieceMeters: number;
    totalRequiredMeters: number;
  };
  operations: Operation[];
  bundles: Bundle[];
}

interface OperationRowProps {
  operationName: string;
  pieceRate: number;
  targetQty: number;
  completedQty: number;
  onUpdate: (newQty: number) => void;
}

function OperationRow({
  operationName,
  pieceRate,
  targetQty,
  completedQty,
  onUpdate,
}: OperationRowProps) {
  const [inputVal, setInputVal] = useState(completedQty.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const qty = parseInt(inputVal, 10);
    if (!isNaN(qty) && qty >= 0 && qty <= targetQty) {
      onUpdate(qty);
      setIsEditing(false);
    } else {
      alert(`Please enter a valid quantity between 0 and ${targetQty}`);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center">
      <div>
        <h4 className="text-sm font-semibold text-foreground">{operationName}</h4>
        <p className="mt-0.5 flex items-center text-xs font-medium text-emerald-600">
          <IndianRupee className="mr-0.5 h-3 w-3" />
          Piece Rate: ₹{pieceRate.toFixed(2)} per piece
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-24 h-8 text-sm"
              max={targetQty}
              min={0}
            />
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">
              {completedQty} / {targetQty} pcs
            </span>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Update Progress
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<JobOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'OPERATIONS' | 'BUNDLES'>('OPERATIONS');

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      const raw = response.data?.data || response.data?.order || response.data;

      if (raw) {
        const formattedOrder: JobOrderDetail = {
          id: raw._id || raw.id || orderId,
          orderNumber: raw.orderNumber || raw.jobOrderNumber || 'JO-2026-000',
          clientName: raw.clientName || raw.client || 'N/A',
          styleName: raw.styleName || raw.garmentType || raw.style || raw.garmentStyle || 'Garment Item',
          quantity: raw.quantity || raw.totalQuantity || raw.targetQuantity || 0,
          completedQuantity: raw.completedQuantity || raw.producedQuantity || 0,
          status: raw.status || 'PENDING',
          startDate: raw.startDate ? String(raw.startDate).split('T')[0] : 'N/A',
          dueDate: raw.dueDate
            ? String(raw.dueDate).split('T')[0]
            : raw.deliveryDate
            ? String(raw.deliveryDate).split('T')[0]
            : raw.targetDeliveryDate
            ? String(raw.targetDeliveryDate).split('T')[0]
            : 'N/A',
          fabricDetails: {
            type: raw.fabricDetails?.type || raw.fabricType || 'Standard Cotton Fabric',
            consumptionPerPieceMeters: raw.fabricDetails?.consumptionPerPieceMeters || raw.fabricConsumption || 1.5,
            totalRequiredMeters:
              raw.fabricDetails?.totalRequiredMeters ||
              (raw.quantity || 0) * (raw.fabricDetails?.consumptionPerPieceMeters || 1.5),
          },
          operations: Array.isArray(raw.operations) && raw.operations.length > 0
            ? raw.operations.map((op: any, index: number) => ({
                id: op._id || op.id || `op-${index + 1}`,
                name: op.name || op.operationName || `Operation #${index + 1}`,
                sequenceOrder: op.sequenceOrder || index + 1,
                pieceRate: op.pieceRate || op.rate || 0,
                completedPieces: op.completedPieces || op.completedQuantity || 0,
              }))
            : [
                {
                  id: 'op-1',
                  name: 'Cutting & Panel Assembly',
                  sequenceOrder: 1,
                  pieceRate: 5.0,
                  completedPieces: 0,
                },
                {
                  id: 'op-2',
                  name: 'Main Body Stitching',
                  sequenceOrder: 2,
                  pieceRate: 8.5,
                  completedPieces: 0,
                },
                {
                  id: 'op-3',
                  name: 'Quality Inspection & Finishing',
                  sequenceOrder: 3,
                  pieceRate: 4.0,
                  completedPieces: 0,
                },
              ],
          bundles: Array.isArray(raw.bundles) && raw.bundles.length > 0
            ? raw.bundles.map((b: any, index: number) => ({
                id: b._id || b.id || `bnd-${index + 1}`,
                bundleCode: b.bundleCode || b.code || `BND-${raw.orderNumber || '000'}-${index + 1}`,
                size: b.size || 'M',
                color: b.color || 'Standard',
                quantity: b.quantity || 50,
                status: b.status || 'IN_PROGRESS',
                currentOperation: b.currentOperation || 'Main Stitching',
                assignedWorker: b.assignedWorker || b.workerName || 'Unassigned',
              }))
            : [],
        };

        setOrder(formattedOrder);
      }
    } catch (err) {
      console.error('Failed to fetch order detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOperation = async (opId: string, newQty: number) => {
    try {
      const updatedOperations = order?.operations?.map((op: any) => 
        op.id === opId ? { ...op, completedPieces: newQty } : op
      ) || [];

      const finalOperation = updatedOperations[updatedOperations.length - 1];
      const newCompletedQuantity = finalOperation ? finalOperation.completedPieces : 0;

      let newStatus = order?.status;
      if (newCompletedQuantity >= (order?.quantity || 0)) {
        newStatus = 'COMPLETED';
      } else if (newCompletedQuantity > 0) {
        if (order?.status === 'PENDING') {
          newStatus = 'IN_PROGRESS';
        }
      } else {
        if (order?.status !== 'CANCELLED') {
          newStatus = 'PENDING';
        }
      }

      await api.patch(`/orders/${orderId}`, {
        operations: updatedOperations,
        completedQuantity: newCompletedQuantity,
        status: newStatus,
      });

      fetchOrderDetail();
    } catch (err) {
      console.error('Failed to update operation:', err);
      alert('Failed to update progress. Please check your backend connection.');
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-border bg-card py-16 text-center">
        <AlertTriangle className="mx-auto mb-2 h-10 w-10 text-amber-500" />
        <p className="text-base font-semibold text-foreground">Order Not Found</p>
        <p className="mb-4 mt-1 text-xs text-muted-foreground">
          The requested job order ID does not exist or was deleted.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const completionPercentage = order.quantity > 0 ? Math.round((order.completedQuantity / order.quantity) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <Link
            href="/orders"
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                {order.orderNumber}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  order.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : order.status === 'IN_PROGRESS'
                    ? 'bg-blue-500/10 text-blue-600'
                    : order.status === 'CANCELLED'
                    ? 'bg-rose-500/10 text-rose-600'
                    : 'bg-amber-500/10 text-amber-600'
                }`}
              >
                {order.status?.replace('_', ' ')}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground">
              {order.styleName}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Printer className="mr-1.5 h-4 w-4" /> Print Job Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Client Partner</p>
          <p className="mt-1 flex items-center text-base font-bold text-foreground">
            <Building2 className="mr-1.5 h-4 w-4 text-primary" />
            {order.clientName}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Target Quantity</p>
          <p className="mt-1 text-base font-bold text-foreground">
            {order.completedQuantity} / {order.quantity} pcs
          </p>
          <div className="mt-2 h-1.5 w-full bg-border rounded-full">
            <div
              className="h-1.5 bg-primary rounded-full"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Fabric Allocated</p>
          <p className="mt-1 text-base font-bold text-foreground">
            {order.fabricDetails.totalRequiredMeters} meters
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {order.fabricDetails.consumptionPerPieceMeters}m / piece
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Delivery Schedule</p>
          <p className="mt-1 flex items-center text-base font-bold text-foreground">
            <Calendar className="mr-1.5 h-4 w-4 text-amber-500" />
            Due: {order.dueDate}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Started: {order.startDate}</p>
        </div>
      </div>

      <div className="flex space-x-6 border-b border-border">
        <button
          onClick={() => setActiveTab('OPERATIONS')}
          className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
            activeTab === 'OPERATIONS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Operation Sequence & Piece Rates ({order.operations.length})
        </button>
        <button
          onClick={() => setActiveTab('BUNDLES')}
          className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
            activeTab === 'BUNDLES'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Production Bundles & QR Tags ({order.bundles.length})
        </button>
      </div>

      {activeTab === 'OPERATIONS' && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Garment Assembly Breakdown</h2>
            <span className="text-xs text-muted-foreground">Ordered Floor Workflow</span>
          </div>
          <div className="space-y-3">
            {order.operations.map((op) => (
              <OperationRow
                key={op.id}
                operationName={op.name}
                pieceRate={op.pieceRate}
                targetQty={order.quantity}
                completedQty={op.completedPieces}
                onUpdate={(newQty) => handleUpdateOperation(op.id, newQty)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'BUNDLES' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {order.bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                    {bundle.bundleCode}
                  </span>
                  <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>
                      Size: <strong className="text-foreground">{bundle.size}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Color: <strong className="text-foreground">{bundle.color}</strong>
                    </span>
                  </div>
                </div>
                <QrCode className="h-8 w-8 rounded bg-primary/10 p-1 text-primary" />
              </div>
              <div className="space-y-1 rounded border border-border/50 bg-muted/40 p-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-bold text-foreground">{bundle.quantity} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stage:</span>
                  <span className="font-semibold text-primary">{bundle.currentOperation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Tailor:</span>
                  <span className="text-foreground">{bundle.assignedWorker || 'Unassigned'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    bundle.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}
                >
                  {bundle.status}
                </span>
                <Link
                  href={`/production/scan?bundle=${encodeURIComponent(bundle.bundleCode)}`}
                  className="flex items-center font-semibold text-primary hover:underline"
                >
                  Log Piece Rate <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}