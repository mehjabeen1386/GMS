
// Purpose: Factory Settings & Configurations with persistent localStorage saving
// Path: frontend/src/app/settings/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function FactorySettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states
  const [factoryName, setFactoryName] = useState('Apex Garments Unit #4');
  const [gstin, setGstin] = useState('27AABCA1234F1Z9');
  const [address, setAddress] = useState('Plot 42, MIDC Industrial Area, Electronic Zone, Bangalore - 560100');
  const [email, setEmail] = useState('operations@apexgarments.in');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [currency, setCurrency] = useState('Indian Rupee (INR ₹)');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [autoScan, setAutoScan] = useState(true);

  // Load saved settings on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soms_factory_settings');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.factoryName) setFactoryName(data.factoryName);
          if (data.gstin) setGstin(data.gstin);
          if (data.address) setAddress(data.address);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
          if (data.currency) setCurrency(data.currency);
          if (typeof data.whatsappAlerts === 'boolean') setWhatsappAlerts(data.whatsappAlerts);
          if (typeof data.autoScan === 'boolean') setAutoScan(data.autoScan);
        } catch (e) {
          console.error('Failed to parse factory settings', e);
        }
      }
    }
  }, []);

  if (!isMounted) return null;

  // Handle Save Settings
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const settingsData = {
      factoryName,
      gstin,
      address,
      email,
      phone,
      currency,
      whatsappAlerts,
      autoScan
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('soms_factory_settings', JSON.stringify(settingsData));
    }

    setSuccessMsg(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setSuccessMsg(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            <Settings className="mr-2.5 h-6 w-6 text-primary" />
            Factory Settings & Configurations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your garment manufacturing plant profile, tax registrations, and operational defaults.
          </p>
        </div>
        <button
          type="submit"
          form="settings-form"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 shadow-sm transition-all">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">Factory settings updated and saved successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form id="settings-form" onSubmit={handleSave} className="space-y-6">
        {/* Plant Profile & Tax Identity */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
            Plant Profile & Tax Identity
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Factory Unit Name
              </label>
              <input
                type="text"
                value={factoryName}
                onChange={(e) => setFactoryName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Registered Factory Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* System & Currency Defaults */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
            System & Currency Defaults
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Default Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="Indian Rupee (INR ₹)">Indian Rupee (INR ₹)</option>
              <option value="US Dollar (USD $)">US Dollar (USD $)</option>
              <option value="Euro (EUR €)">Euro (EUR €)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
              />
              <div>
                <span className="text-sm font-semibold text-foreground">WhatsApp Operational Alerts</span>
                <p className="text-xs text-muted-foreground">Send automated dispatch updates and low stock alerts via WhatsApp.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScan}
                onChange={(e) => setAutoScan(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
              />
              <div>
                <span className="text-sm font-semibold text-foreground">Auto-Scan Roll Deduction</span>
                <p className="text-xs text-muted-foreground">Automatically deduct fabric meterage from inventory upon bundle cutting scan.</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}