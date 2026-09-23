import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { OnboardingFlow } from '@/onboarding/OnboardingFlow';
import type { AppData } from '@/types';

import { clearData, loadData, resetData, saveData } from './storage';

type AppContextValue = {
  data: AppData;
  /** Modifie les données et les enregistre sur l'appareil. */
  updateData: (updater: (current: AppData) => AppData) => void;
  /** Remet les données de démo. */
  resetToDemo: () => Promise<void>;
  /** Efface le foyer actuel pour repasser par l'onboarding. */
  restartOnboarding: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Charge les données au démarrage. Trois états : chargement (rien à l'écran, comme le
 * chargement des polices), pas de foyer configuré (onboarding), foyer prêt (l'app).
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setChecked(true);
    });
  }, []);

  const updateData = useCallback((updater: (current: AppData) => AppData) => {
    setData((current) => {
      if (!current) return current;
      const next = updater(current);
      saveData(next);
      return next;
    });
  }, []);

  const resetToDemo = useCallback(async () => {
    setData(await resetData());
  }, []);

  const restartOnboarding = useCallback(async () => {
    await clearData();
    setData(null);
  }, []);

  const completeOnboarding = useCallback((fresh: AppData) => {
    saveData(fresh);
    setData(fresh);
  }, []);

  if (!checked) return null;
  if (!data) return <OnboardingFlow onComplete={completeOnboarding} />;

  return <AppContext value={{ data, updateData, resetToDemo, restartOnboarding }}>{children}</AppContext>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}
