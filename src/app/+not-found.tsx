import { Redirect } from 'expo-router';

// Toute adresse inconnue (ancien lien, page ajoutée à l'écran d'accueil sur une route qui n'existe plus…)
// ramène simplement à l'accueil.
export default function NotFound() {
  return <Redirect href="/" />;
}
