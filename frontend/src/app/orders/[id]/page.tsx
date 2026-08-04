// Purpose: Detailed Job Order View with Operations Sequence and Bundle QR Tracker
// Path: frontend/src/app/orders/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Scissors,
  ArrowLeft,
  Calendar,
  Building2,
  QrCode,
  IndianRupee,
  RefreshCw,
  Printer,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<JobOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'OPERATIONS' | 'BUNDLES'>('OPERATIONS');

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      const data = response.data.data || response.data;
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order detail, using mock fallback:', err);
      // Fallback mockup structure
      setOrder({
        id: orderId || 'ord-101',
        orderNumber: 'JO-2026-891',
        clientName: 'Raymond Retail',
        styleName: 'Men Formal Oxford Shirt',
        quantity: 600,
        completedQuantity: 420,
        status: 'IN_PROGRESS',
        startDate: '2026-07-10',
        dueDate: '2026-08-10',
        fabricDetails: {
          type: '100% Egyptian Cotton Blue Striped',
          consumptionPerPieceMeters: 1.6,
          totalRequiredMeters: 960,
        },
        operations: [
          {
            id: 'op-1',
            name: 'Front Pocket Attachment',
            sequenceOrder: 1,
            pieceRate: 4.5,
            completedPieces: 600,
          },
          {
            id: 'op-2',
            name: 'Collar Stitching & Fusing',
            sequenceOrder: 2,
            pieceRate: 8.0,
            completedPieces: 540,
          },
          {
            id: 'op-3',
            name: 'Sleeve Joining & Overlock',
            sequenceOrder: 3,
            pieceRate: 6.5,
            completedPieces: 420,
          },
          {
            id: 'op-4',
            name: 'Button Hole & Bartack',
            sequenceOrder: 4,
            pieceRate: 3.5,
            completedPieces: 210,
          },
          {
            id: 'op-5',
            name: 'Final Quality Checking & Ironing',
            sequenceOrder: 5,
            pieceRate: 5.0,
            completedPieces: 180,
          },
        ],
        bundles: [
          {
            id: 'bnd-101',
            bundleCode: 'BND-891-A39-M',
            size: 'M',
            color: 'Sky Blue',
            quantity: 50,
            status: 'COMPLETED',
            currentOperation: 'Final Quality Checking',
            assignedWorker: 'Ramesh Verma',
          },
          {
            id: 'bnd-102',
            bundleCode: 'BND-891-A39-L',
            size: 'L',
            color: 'Sky Blue',
            quantity: 50,
            status: 'IN_PROGRESS',
            currentOperation: 'Sleeve Joining & Overlock',
            assignedWorker: 'Sunita Devi',
          },
          {
            id: 'bnd-103',
            bundleCode: 'BND-891-A39-XL',
            size: 'XL',
            color: 'Sky Blue',
            quantity: 50,
            status: 'CUTTING',
            currentOperation: 'Front Pocket Attachment',
            assignedWorker: 'Unassigned',
          },
        ],
      });
    } finally {
      setIsLoading(false);
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

  const completionPercentage = Math.round((order.completedQuantity / order.quantity) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
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
                    : 'bg-blue-500/10 text-blue-600'
                }`}
              >
                {order.status.replace('_', ' ')}
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
          <Link
            href="/production/scan"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <QrCode className="mr-1.5 h-4 w-4" /> Floor Scanner
          </Link>
        </div>
      </div>

      {/* Summary Metrics Cards */}
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

      {/* Navigation Tabs */}
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

      {/* Tab Content: Operations Sequence */}
      {activeTab === 'OPERATIONS' && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Garment Assembly Breakdown</h2>
            <span className="text-xs text-muted-foreground">Ordered Floor Workflow</span>
          </div>
          <div className="space-y-3">
            {order.operations.map((op) => {
              const opProgress = Math.round((op.completedPieces / order.quantity) * 100);
              return (
                <div
                  key={op.id}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                      #{op.sequenceOrder}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{op.name}</h4>
                      <p className="mt-0.5 flex items-center text-xs font-medium text-emerald-600">
                        <IndianRupee className="mr-0.5 h-3 w-3" />
                        Piece Rate: ₹{op.pieceRate.toFixed(2)} per piece
                      </p>
                    </div>
                  </div>
                  <div className="w-full space-y-1 sm:w-64">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Completed</span>
                      <span className="font-semibold text-foreground">
                        {op.completedPieces} / {order.quantity} pcs
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-1.5 bg-primary rounded-full"
                        style={{ width: `${Math.min(opProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Production Bundles */}
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