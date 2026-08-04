// Purpose: Global Error Boundary Fallback Component
// Path: frontend/src/app/error.tsx

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error captured by boundary:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                Unexpected Factory System Error
              </h1>
              <p className="text-sm text-muted-foreground">
                An unhandled exception occurred while processing your request on the manufacturing floor.
              </p>
            </div>

            {error?.message && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border text-left font-mono text-xs text-destructive break-words">
                {error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => reset()}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Home className="mr-2 h-4 w-4" />
                Return Dashboard
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}