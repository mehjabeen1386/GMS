// Purpose: Shop Floor QR Code Scanner and Piece-Rate Logging Interface
// Path: frontend/src/app/production/scan/page.tsx

'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Check,
} from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  skillCategory: string;
}

interface BundleDetails {
  bundleCode: string;
  orderNumber: string;
  styleName: string;
  size: string;
  color: string;
  totalQuantity: number;
  remainingQuantity: number;
  currentOperation: string;
}

// Zod Schema for QR Piece Log Submission
const scanLogSchema = z.object({
  bundleCode: z.string().min(3, 'Bundle code is required'),
  workerId: z.string().min(1, 'Please select a worker'),
  operationId: z.string().min(1, 'Please select an operation'),
  piecesCompleted: z.coerce.number().min(1, 'At least 1 piece must be completed'),
  rejectedPieces: z.coerce.number().min(0, 'Rejected pieces cannot be negative').default(0),
});

type ScanLogFormData = z.infer<typeof scanLogSchema>;

function QRScannerForm() {
  const searchParams = useSearchParams();
  const initialBundleCode = searchParams?.get('bundle') || '';

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [operations, setOperations] = useState<
    Array<{ id: string; name: string; pieceRate: number }>
  >([]);
  const [bundleInfo, setBundleInfo] = useState<BundleDetails | null>(null);
  const [isLoadingBundle, setIsLoadingBundle] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScanLogFormData>({
    resolver: zodResolver(scanLogSchema),
    defaultValues: {
      bundleCode: initialBundleCode,
      workerId: '',
      operationId: '',
      piecesCompleted: 50,
      rejectedPieces: 0,
    },
  });

  const watchedBundleCode = watch('bundleCode');

  // Fetch workers and operations dropdown lists on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [workersRes, opsRes] = await Promise.all([
          api.get('/workers'),
          api.get('/operations'),
        ]);
        setWorkers(workersRes.data.data || workersRes.data || []);
        setOperations(opsRes.data.data || opsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch worker/operation metadata, using fallbacks:', err);
        setWorkers([
          { id: 'w-1', name: 'Ramesh Verma', skillCategory: 'Senior Tailor' },
          { id: 'w-2', name: 'Sunita Devi', skillCategory: 'Collar Specialist' },
          { id: 'w-3', name: 'Amit Patel', skillCategory: 'Button & Bartack' },
        ]);
        setOperations([
          { id: 'op-1', name: 'Front Pocket Attachment', pieceRate: 4.5 },
          { id: 'op-2', name: 'Collar Stitching & Fusing', pieceRate: 8.0 },
          { id: 'op-3', name: 'Sleeve Joining & Overlock', pieceRate: 6.5 },
        ]);
      }
    };
    fetchMetadata();
  }, []);

  // Lookup bundle details when bundleCode changes
  const fetchBundleDetails = async (code: string) => {
    if (!code || code.length < 3) return;
    setIsLoadingBundle(true);
    setServerError(null);
    try {
      const response = await api.get(`/bundles/${encodeURIComponent(code)}`);
      const data = response.data.data || response.data;
      setBundleInfo(data);
      if (data.piecesCompleted) {
        setValue('piecesCompleted', data.remainingQuantity || 50);
      }
    } catch (err) {
      console.warn('Bundle lookup failed, generating simulated bundle info:', err);
      setBundleInfo({
        bundleCode: code,
        orderNumber: 'JO-2026-891',
        styleName: 'Men Formal Oxford Shirt',
        size: 'M',
        color: 'Sky Blue',
        totalQuantity: 50,
        remainingQuantity: 50,
        currentOperation: 'Sleeve Joining & Overlock',
      });
    } finally {
      setIsLoadingBundle(false);
    }
  };

  useEffect(() => {
    if (initialBundleCode) {
      fetchBundleDetails(initialBundleCode);
    }
  }, [initialBundleCode]);

  const onSubmitLog = async (data: ScanLogFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const response = await api.post('/production/scan', data);
      const resData = response.data.data || response.data;
      setSuccessMessage(
        `Successfully logged ${data.piecesCompleted} pieces for bundle ${data.bundleCode}! Earned: ₹${resData.earnedAmount || 0}`
      );
      reset({
        bundleCode: '',
        workerId: '',
        operationId: '',
        piecesCompleted: 50,
        rejectedPieces: 0,
      });
      setBundleInfo(null);
    } catch (err: any) {
      console.error('Failed to submit scan log:', err);
      setServerError(
        err.response?.data?.message || 'Failed to record piece log. Please verify bundle code.'
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="flex items-center text-2xl font-bold tracking-tight text-foreground">
            <QrCode className="mr-2 h-6 w-6 text-primary" />
            Shop Floor QR Scanner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Scan garment bundle QR tags or enter codes manually to log worker piece-rate production.
          </p>
        </div>
        <button
          onClick={() => setIsCameraActive((prev) => !prev)}
          className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
            isCameraActive
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          <Camera className="mr-2 h-4 w-4" />
          {isCameraActive ? 'Stop Camera' : 'Scan via Camera'}
        </button>
      </div>

      {/* Camera Simulation Viewfinder */}
      {isCameraActive && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm animate-in fade-in zoom-in-95">
          <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black/90">
            <Camera className="mb-3 h-12 w-12 animate-pulse text-primary" />
            <p className="text-sm font-medium text-white">Position bundle QR code inside viewfinder</p>
            <p className="mt-1 text-xs text-zinc-400">Camera stream active (simulated scanner)</p>

            <button
              type="button"
              onClick={() => {
                const sampleCode = 'BND-891-A39-M';
                setValue('bundleCode', sampleCode);
                fetchBundleDetails(sampleCode);
                setIsCameraActive(false);
              }}
              className="mt-4 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Simulate Successful Scan (BND-891-A39-M)
            </button>
          </div>
        </div>
      )}

      {/* Success & Error Banners */}
      {successMessage && (
        <div className="flex items-center space-x-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}
      {serverError && (
        <div className="flex items-center space-x-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{serverError}</span>
        </div>
      )}

      {/* Main Logging Form */}
      <form
        onSubmit={handleSubmit(onSubmitLog)}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 className="text-base font-bold text-foreground">Piece-Rate Entry Form</h2>

        {/* Bundle Code Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Bundle QR Code
          </label>
          <div className="flex space-x-2">
            <input
              {...register('bundleCode')}
              type="text"
              placeholder="e.g. BND-891-A39-M"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onBlur={(e) => fetchBundleDetails(e.target.value)}
            />
            <button
              type="button"
              onClick={() => fetchBundleDetails(watchedBundleCode)}
              disabled={isLoadingBundle}
              className="rounded-lg border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 disabled:opacity-50"
            >
              {isLoadingBundle ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Lookup'}
            </button>
          </div>
          {errors.bundleCode && (
            <p className="mt-1 text-xs text-destructive">{errors.bundleCode.message}</p>
          )}
        </div>

        {/* Fetched Bundle Details Card */}
        {bundleInfo && (
          <div className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-4 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>
                {bundleInfo.styleName} ({bundleInfo.orderNumber})
              </span>
              <span className="font-mono text-primary">{bundleInfo.bundleCode}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-muted-foreground">
              <div>
                Size: <strong className="text-foreground">{bundleInfo.size}</strong>
              </div>
              <div>
                Color: <strong className="text-foreground">{bundleInfo.color}</strong>
              </div>
              <div>
                Remaining: <strong className="text-foreground">{bundleInfo.remainingQuantity} pcs</strong>
              </div>
            </div>
          </div>
        )}

        {/* Worker & Operation Selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Assigned Worker / Tailor
            </label>
            <select
              {...register('workerId')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Tailor...</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.skillCategory})
                </option>
              ))}
            </select>
            {errors.workerId && (
              <p className="mt-1 text-xs text-destructive">{errors.workerId.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Garment Operation
            </label>
            <select
              {...register('operationId')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Operation...</option>
              {operations.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name} (₹{op.pieceRate}/pc)
                </option>
              ))}
            </select>
            {errors.operationId && (
              <p className="mt-1 text-xs text-destructive">{errors.operationId.message}</p>
            )}
          </div>
        </div>

        {/* Pieces Completed & Rejected */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Completed Pieces
            </label>
            <input
              {...register('piecesCompleted')}
              type="number"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.piecesCompleted && (
              <p className="mt-1 text-xs text-destructive">{errors.piecesCompleted.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Rejected / Defective Pieces
            </label>
            <input
              {...register('rejectedPieces')}
              type="number"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.rejectedPieces && (
              <p className="mt-1 text-xs text-destructive">{errors.rejectedPieces.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end border-t border-border pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Recording Log...' : 'Confirm Piece Log'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function QRScannerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <QRScannerForm />
    </Suspense>
  );
}