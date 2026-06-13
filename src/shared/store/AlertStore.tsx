import { create } from 'zustand';
import { alertLegend, DEFAULT_VARIANT } from '../components/alert/alertLegend';

export type AlertVariant = keyof typeof alertLegend;

export interface AlertItem {
  id: string;
  variant: AlertVariant;
  title?: string;
  message: string;
}

interface AlertState {
  alerts: AlertItem[];
  showAlert: (alert: Omit<AlertItem, 'id'>) => void;
  dismissAlert: (id: string) => void;
}

let nextId = 0;

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],

  showAlert: (alert) => {
    const id = String(++nextId);
    const variant = alert.variant ?? DEFAULT_VARIANT;

    set((state) => ({
      alerts: [...state.alerts, { ...alert, id, variant }],
    }));

    const duration = alertLegend[variant]?.duration;
    if (duration && duration > 0) {
      setTimeout(() => get().dismissAlert(id), duration);
    }
  },

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}));
