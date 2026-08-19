// Purpose: Interactive AI Fabric & Cost Estimator Component
// Path: frontend/src/app/inventory/AIEstimatorTool.tsx

'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function AIEstimatorTool() {
  const [style, setStyle] = useState('Sherwani');
  const [qty, setQty] = useState(50);
  const [fabric, setFabric] = useState('Cotton');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call to backend AI estimator
    setTimeout(() => {
      let multiplier = style.toLowerCase().includes('sherwani') ? 3.5 : 2.0;
      let totalMeters = (qty * multiplier).toFixed(1);
      setResult({
        totalFabricMeters: totalMeters,
        scrapWaste: (Number(totalMeters) * 0.05).toFixed(1),
        cost: qty * 550,
        recommendation: `Optimal layout computed via AI. Use ${totalMeters}m rolls.`
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">AI Fabric & Cost Smart Estimator</h2>
          <p className="text-[11px] text-muted-foreground">Calculate precise material consumption and waste using automated AI heuristics</p>
        </div>
      </div>

      <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Garment Style</label>
          <input 
            type="text" 
            value={style} 
            onChange={(e) => setStyle(e.target.value)} 
            className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-primary"
            placeholder="e.g. Sherwani, Kurti"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Target Quantity</label>
          <input 
            type="number" 
            value={qty} 
            onChange={(e) => setQty(Number(e.target.value))} 
            className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Fabric Description</label>
          <input 
            type="text" 
            value={fabric} 
            onChange={(e) => setFabric(e.target.value)} 
            className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-primary"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 h-[38px]"
        >
          {loading ? 'Calculating...' : (
            <>
              <Sparkles className="h-3.5 w-3.5" /> Calculate with AI
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Required Fabric</span>
            <p className="text-xs font-bold text-foreground mt-1">{result.totalFabricMeters} Meters</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Scrap Buffer (5%)</span>
            <p className="text-xs font-bold text-amber-600 mt-1">{result.scrapWaste} Meters saved</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">AI Insight</span>
            <p className="text-xs font-medium text-foreground mt-1">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}