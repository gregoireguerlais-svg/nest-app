import * as Notifications from 'expo-notifications';

// Affiche la notif même quand l'app est au premier plan : utile pour l'effet démo,
// puisqu'on envoie et reçoit sur le même appareil.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Notification LOCALE uniquement (rien ne part sur un serveur). Demande la permission au
 * premier envoi. N'échoue jamais bruyamment : c'est un bonus, pas le cœur de la fonctionnalité.
 */
export async function sendLocalThankYouNotification(title: string, body: string): Promise<void> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (status !== 'granted') {
      ({ status } = await Notifications.requestPermissionsAsync());
    }
    if (status !== 'granted') return;
    await Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: null });
  } catch {
    // Pas de notif système disponible (simulateur, permission refusée...) : sans conséquence.
  }
}
