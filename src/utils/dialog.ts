import { Alert, Platform } from 'react-native';

// `Alert.alert` ne fait rien sur le web : on y utilise les fenêtres du navigateur.

/** Message simple avec un bouton OK. */
export function showNotice(title: string, message: string): void {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

/** Demande de confirmation d'une action destructive ; `onConfirm` n'est appelé que si l'utilisateur valide. */
export function confirmDestructive(title: string, message: string, confirmLabel: string, onConfirm: () => void): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
