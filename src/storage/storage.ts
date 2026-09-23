import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildSeedData } from '@/data/seed';
import type { AppData } from '@/types';

// Changer le suffixe de version si le modèle de données évolue (repart de zéro, onboarding compris).
const STORAGE_KEY = '@nest/data/v1';

/** null = aucun foyer configuré : direction l'onboarding. */
export async function loadData(): Promise<AppData | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // Données illisibles : on repart de zéro, via l'onboarding.
  }
  return null;
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Recharge le foyer de démo pré-rempli (bouton "Réinitialiser les données de démo"). */
export async function resetData(): Promise<AppData> {
  const seed = buildSeedData();
  await saveData(seed);
  return seed;
}

/** Efface tout, pour repasser par l'onboarding. */
export async function clearData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
