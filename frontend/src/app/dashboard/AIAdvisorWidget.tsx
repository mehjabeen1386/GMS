// Purpose: Frontend AI Operations Advisor Widget for Garment ERP Dashboard
// Path: frontend/src/app/dashboard/AIAdvisorWidget.tsx

'Y' // or 'use client';
'use client';

import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Scissors } from 'lucide-react';

export default function AIAdvisorWidget() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card p-6 border border-primary/20 shadow-sm relative overflow-hidden mb-6">
      <div className="absolute right-4 top-4 text-primary/10 pointer-events-none">
        <Sparkles className="h-24 w-24" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-primary p-2.5 text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Faisal Smart AI Operations Advisor</h2>
          <p className="text-[11px] text-muted-foreground">Real-time predictive analytics & fabric efficiency insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/90 backdrop-blur-sm p-4 rounded-xl border border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bottleneck Risk</span>
          <div className="flex items-center gap-2 mt-1.5">
            <AlertTriangle className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold text-foreground">Low Risk (Optimal Capacity)</span>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-sm p-4 rounded-xl border border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Efficiency Score</span>
          <div className="flex items-center gap-2 mt-1.5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary">94.2% (High Performance)</span>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-sm p-4 rounded-xl border border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Scrap Reduction Tip</span>
          <div className="flex items-center gap-2 mt-1.5">
            <Scissors className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-foreground">Save ~12m cloth via pattern nesting.</span>
          </div>
        </div>
      </div>
    </div>
  );
}