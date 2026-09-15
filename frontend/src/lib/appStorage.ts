const STORAGE_KEY = 'garment_erp_app_state';

const defaultWorkers: any[] = [];
const defaultBuyers: any[] = [];
const defaultScans: any[] = [];
const defaultSettings = {
  factoryName: '',
  gstin: '',
  address: '',
  email: '',
  phone: '',
  currency: 'Indian Rupee (INR ₹)',
  whatsappAlerts: true,
  autoScan: true,
};
const defaultPayouts: any[] = [];

export const appDefaultState = {
  buyers: defaultBuyers,
  workers: defaultWorkers,
  scans: defaultScans,
  payouts: defaultPayouts,
  settings: defaultSettings,
};

export function loadAppState() {
  if (typeof window === 'undefined') {
    return appDefaultState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return appDefaultState;
    const parsed = JSON.parse(raw);
    return {
      buyers: Array.isArray(parsed.buyers) ? parsed.buyers : appDefaultState.buyers,
      workers: Array.isArray(parsed.workers) ? parsed.workers : appDefaultState.workers,
      scans: Array.isArray(parsed.scans) ? parsed.scans : appDefaultState.scans,
      payouts: Array.isArray(parsed.payouts) ? parsed.payouts : appDefaultState.payouts,
      settings: parsed.settings || appDefaultState.settings,
    };
  } catch (error) {
    console.error('Unable to read persisted app state:', error);
    return appDefaultState;
  }
}

export function saveAppState(partialState: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const current = loadAppState();
  const next = { ...current, ...partialState };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetAppState() {
  if (typeof window === 'undefined') return appDefaultState;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appDefaultState));
  return appDefaultState;
}
