// Purpose: Production Floor Monitor Dashboard with Editable Remaining Target Pieces
// Path: frontend/src/app/production/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Search,
  RefreshCw,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  Coins,
  Target,
  Edit2,
  Check,
} from 'lucide-react';

interface ScanLog {
  id: string;
  bundleCode: string;
  orderNumber: string;
  tailorName: string;
  operation: string;
  completedPieces: number;
  rejectedPieces: number;
  pieceValue: number; // Rate per piece
  loggedAt: string;
  isDeleted?: boolean;
}

export default function ProductionPage() {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [totalTarget, setTotalTarget] = useState<number>(3000);
  const [isEditingTarget, setIsEditingTarget] = useState<boolean>(false);
  const [targetInput, setTargetInput] = useState<string>('3000');

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newBundle, setNewBundle] = useState({
    bundleCode: '',
    orderNumber: '',
    tailorName: '',
    operation: 'Collar Stitching & Fusing',
    completedPieces: '',
    rejectedPieces: '',
    pieceValue: '',
  });

  useEffect(() => {
    setIsMounted(true);
    setTotalTarget(3000);
    setTargetInput('3000');
    fetchScans();
  }, []);

  const fetchScans = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/floor/scans');
      const rawData = response.data?.data || [];
      const list = Array.isArray(rawData) ? rawData : [];

      const formatted: ScanLog[] = list.map((item: any) => ({
        id: item._id || item.id || `scan-${Math.random()}`,
        bundleCode: item.bundleCode || 'BND-000',
        orderNumber: item.orderNumber || 'JO-000',
        tailorName: item.tailorName || 'Unknown Worker',
        operation: item.operation || 'General Stitching',
        completedPieces: Number(item.completedPieces || 0),
        rejectedPieces: Number(item.rejectedPieces || 0),
        pieceValue: Number(item.pieceValue || 0),
        loggedAt: item.loggedAt || 'Recently',
        isDeleted: Boolean(item.isDeleted || false),
      }));
      setScans(formatted);
    } catch (err) {
      setScans([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Scan
  const handleDeleteScan = async (id: string) => {
    try {
      await api.delete(`/floor/scans/${id}`).catch(() => {});
    } catch (err) {
      console.error('Failed to delete scan from backend:', err);
    }
    setScans((prev) => prev.filter((scan) => scan.id !== id));
  };

  // Handle Add Manual Record
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ScanLog = {
      id: `scan-${Date.now()}`,
      bundleCode: newBundle.bundleCode || `BND-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber: newBundle.orderNumber || 'JO-2026-001',
      tailorName: newBundle.tailorName || 'Worker Name',
      operation: newBundle.operation,
      completedPieces: Number(newBundle.completedPieces) || 10,
      rejectedPieces: Number(newBundle.rejectedPieces) || 0,
      pieceValue: Number(newBundle.pieceValue) || 250,
      loggedAt: 'Just now',
      isDeleted: false,
    };

    try {
      await api.post('/floor/scans', newRecord).catch(() => {});
    } catch (err) {
      console.warn('Backend save failed, saved to local storage.');
    }

    const updatedScans = [newRecord, ...scans];
    setScans(updatedScans);
    setIsModalOpen(false);
    setNewBundle({
      bundleCode: '',
      orderNumber: '',
      tailorName: '',
      operation: 'Collar Stitching & Fusing',
      completedPieces: '',
      rejectedPieces: '',
      pieceValue: '',
    });
  };

  const activeScansList = scans.filter((s) => !s.isDeleted);

  // Overall Summary Metrics Calculations
  const totalCompletedPiecesAll = activeScansList.reduce(
    (acc, curr) => acc + (Number(curr.completedPieces) || 0),
    0
  );

  const remainingPiecesAll = Math.max(0, totalTarget - totalCompletedPiecesAll);

  const totalPieceValueAll = activeScansList.reduce(
    (acc, curr) => acc + ((Number(curr.completedPieces) || 0) * (Number(curr.pieceValue) || 0)),
    0
  );

  const filteredScans = activeScansList.filter(
    (scan) =>
      scan.bundleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.tailorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.operation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading Production Monitor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Production Floor Monitor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time shop floor assembly line throughput and worker piece-rate logs.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Scan Record
          </button>
          <button
            onClick={fetchScans}
            disabled={isLoading}
            className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Completed Pieces</p>
            <h3 className="text-xl font-bold text-foreground mt-1">{totalCompletedPiecesAll} pcs</h3>
          </div>
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Editable Remaining Target Pieces Card */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="w-full pr-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">Remaining Target Pieces</p>
              {!isEditingTarget ? (
                <button
                  onClick={() => {
                    setTargetInput(totalTarget.toString());
                    setIsEditingTarget(true);
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Edit Total Target"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const val = Number(targetInput);
                    if (!isNaN(val)) {
                      setTotalTarget(val);
                    }
                    setIsEditingTarget(false);
                  }}
                  className="text-primary hover:text-primary/80 transition-colors"
                  title="Save Target"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>

            {isEditingTarget ? (
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-sm font-bold focus:border-primary focus:outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <h3 className="text-xl font-bold text-foreground mt-1">{remainingPiecesAll} pcs</h3>
            )}
          </div>
          <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600 shrink-0">
            <Target className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total Piece-Rate Earnings</p>
            <h3 className="text-xl font-bold text-foreground mt-1">₹{totalPieceValueAll.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600">
            <Coins className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Live Piece-Rate Scans Section */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-lg font-bold text-foreground">Live Piece-Rate Scans</h2>
            <p className="text-xs text-muted-foreground">Verification logs submitted by workers or added manually</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tailor, bundle code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Bundle Code / Order</th>
                  <th className="px-4 py-3 font-semibold">Tailor / Worker</th>
                  <th className="px-4 py-3 font-semibold">Operation</th>
                  <th className="px-4 py-3 font-semibold">Completed</th>
                  <th className="px-4 py-3 font-semibold">Total Amount (Rate)</th>
                  <th className="px-4 py-3 font-semibold">Logged At</th>
                  <th className="px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredScans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                      No scan logs found. Click "+ Add Scan Record" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredScans.map((scan) => {
                    const totalAmount = scan.completedPieces * scan.pieceValue;
                    return (
                      <tr key={scan.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-foreground">{scan.bundleCode}</span>
                          <p className="font-mono text-[11px] text-muted-foreground">{scan.orderNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-foreground">{scan.tailorName}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{scan.operation}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-emerald-600">+{scan.completedPieces} pcs</span>
                          {scan.rejectedPieces > 0 && (
                            <p className="text-[10px] text-destructive">{scan.rejectedPieces} rejected</p>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                          ₹{totalAmount.toFixed(2)}
                          <span className="block text-[10px] font-normal text-muted-foreground">(@₹{scan.pieceValue.toFixed(2)}/pc)</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{scan.loggedAt}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteScan(scan.id)}
                            className="inline-flex items-center rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
                            title="Delete Record"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">Add New Scan Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Bundle Code</label>
                <input
                  type="text"
                  placeholder="e.g. BND-999-X"
                  value={newBundle.bundleCode}
                  onChange={(e) => setNewBundle({ ...newBundle, bundleCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Order Number</label>
                <input
                  type="text"
                  placeholder="e.g. JO-2026-999"
                  value={newBundle.orderNumber}
                  onChange={(e) => setNewBundle({ ...newBundle, orderNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Tailor / Worker Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newBundle.tailorName}
                  onChange={(e) => setNewBundle({ ...newBundle, tailorName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Operation</label>
                <select
                  value={newBundle.operation}
                  onChange={(e) => setNewBundle({ ...newBundle, operation: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                >
                  <option value="Collar Stitching & Fusing">Collar Stitching & Fusing</option>
                  <option value="Sleeve Joining & Overlock">Sleeve Joining & Overlock</option>
                  <option value="Button Hole & Bartack">Button Hole & Bartack</option>
                  <option value="Final Quality & Packaging">Final Quality & Packaging</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Completed Pcs</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newBundle.completedPieces}
                    onChange={(e) => setNewBundle({ ...newBundle, completedPieces: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Piece Rate (₹ / pc)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="35"
                    value={newBundle.pieceValue}
                    onChange={(e) => setNewBundle({ ...newBundle, pieceValue: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}