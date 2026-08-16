// Purpose: Trash / Deleted Job Orders Management Page
// Path: frontend/src/app/orders/trash/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Trash2, RotateCcw, ArrowLeft, Scissors, AlertCircle } from 'lucide-react';

interface TrashedOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  styleName: string;
  quantity: number;
  deletedAt: string;
}

export default function TrashPage() {
  const [trashedOrders, setTrashedOrders] = useState<TrashedOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrashedOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/orders/trash');
      const rawData = response.data?.data || response.data;
      const list = Array.isArray(rawData) ? rawData : [];

      const formatted = list.map((item: any) => ({
        id: item._id || item.id,
        orderNumber: item.orderNumber || 'JO-000',
        clientName: item.clientName || item.client || 'N/A',
        styleName: item.styleName || item.garmentType || 'N/A',
        quantity: item.quantity || 0,
        deletedAt: item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'N/A',
      }));

      setTrashedOrders(formatted);
    } catch (err: any) {
      console.error('Failed to fetch trash:', err);
      setError(err.response?.data?.message || 'Failed to load deleted orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedOrders();
  }, []);

  const handleRestore = async (orderId: string, orderNumber: string) => {
    if (window.confirm(`Are you sure you want to restore order ${orderNumber}?`)) {
      try {
        await api.patch(`/orders/${orderId}/restore`);
        fetchTrashedOrders(); // Refresh list
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to restore order.');
      }
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
              <Trash2 className="mr-2 h-6 w-6 text-rose-500" />
              Job Orders Trash Bin
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Deleted orders are kept for up to 3 months before permanent removal. You can restore them anytime.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Trashed Orders List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">Loading trash...</div>
        ) : trashedOrders.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border bg-card py-16 text-center">
            <Scissors className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-base font-semibold text-foreground">Trash is Empty</p>
            <p className="mt-1 text-xs text-muted-foreground">No soft-deleted job orders found.</p>
          </div>
        ) : (
          trashedOrders.map((order) => (
            <div
              key={order.id}
              className="relative flex flex-col justify-between rounded-xl border border-rose-500/20 bg-card p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-xs font-bold text-rose-600">
                    {order.orderNumber}
                  </span>
                  <h3 className="mt-1.5 text-base font-bold text-foreground">{order.styleName}</h3>
                  <p className="text-xs text-muted-foreground">{order.clientName} • {order.quantity} pcs</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Deleted on: {order.deletedAt}</span>
                <button
                  onClick={() => handleRestore(order.id, order.orderNumber)}
                  className="inline-flex items-center space-x-1 rounded-md bg-primary/10 px-3 py-1.5 font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}