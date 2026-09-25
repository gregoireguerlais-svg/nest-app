# Nest 🪺

**Nest est une application mobile de gestion du foyer pour les couples.** Elle aide à répartir
les tâches du quotidien de façon équilibrée et à réduire la charge mentale, en rendant visible
*qui fait quoi* — dans un ton doux et bienveillant, sans compétition.

👉 **Essayer la version web : [nest-app.expo.app](https://nest-app.expo.app)**
(ouvre le lien sur ton téléphone ou ton ordinateur, aucun compte nécessaire)

> Projet de portfolio, conçu et développé en solo par un Product Manager en reconversion.

---

## Le problème

Dans un couple, la charge mentale du foyer est souvent invisible : celui ou celle qui pense aux
courses, au vétérinaire ou à la déclaration de la nounou porte un travail que l'autre ne voit pas.
Nest rend ce travail visible, sans jugement, et valorise l'effort de chacun.

## Fonctionnalités

- **Onboarding en 5 écrans** : accueil, nom et icône du foyer, prénoms et couleurs des deux
  profils, choix des catégories
- **Accueil** : tâches du jour, sélecteur de semaine, filtre « Nous / Moi », cocher une tâche
- **Tâches** : toutes les tâches groupées par catégorie, filtres par catégorie et par personne,
  25 tâches suggérées à activer en un tap
- **Détail d'une tâche** : fréquence, jours, personnes assignées, historique
- **Ajout / édition** : nom, catégorie, fréquence (jour, semaine, mois, an), jours, assignation
- **Stats** : répartition de la charge entre les deux personnes (semaine ou mois), détail par
  catégorie, message de gratitude qui s'adapte aux données
- **Remerciement** : un bouton « Remercier [prénom] » qui envoie un mot doux, visible sur le profil
  de l'autre personne
- **Bascule de profil** entre les deux membres du foyer

## Choix de produit

- **Local-first pour le MVP.** Tout tourne sur un seul appareil, sans compte ni serveur : les deux
  personnes sont deux profils dans la même app. Cela permet de valider l'expérience (répartition,
  stats, remerciement) avant d'investir dans la synchronisation.
- **La gratitude plutôt que la compétition.** Les statistiques racontent l'équilibre du couple,
  jamais un classement : le message est adapté (« Bel équilibre entre vous deux 💚 ») et le
  remerciement fait partie du produit, pas d'un après-coup.
- **Les tâches se mesurent à ce qui est réellement fait.** La répartition se calcule sur les
  tâches cochées, pas sur celles assignées.
- **Des suggestions plutôt qu'une page blanche.** Un nouveau foyer démarre avec des tâches
  suggérées selon ses catégories, à configurer en un tap.

## Stack technique

- **React Native** avec **Expo** (SDK 57), **TypeScript**
- **expo-router** pour la navigation (routes par fichiers)
- **AsyncStorage** pour le stockage local des données
- **expo-notifications** (notifications locales uniquement, pas de push distant)
- **react-native-svg** pour le logo et les illustrations, **lucide-react-native** pour les icônes
- Police **Nunito**
- **EAS Hosting** pour la version web

## Lancer le projet

```bash
npm install
npx expo start
```

Scanne le QR code avec **Expo Go** sur ton téléphone (ton téléphone doit être sur le même Wi-Fi
que ton ordinateur), ou lance `npx expo start --web` pour la version web.

Autres commandes utiles :

```bash
npm run deploy:web       # publie la version web sur nest-app.expo.app
npm run publish:preview  # publie une mise à jour Expo Go (compte propriétaire uniquement)
npx tsc --noEmit         # vérifie les types
npx expo lint            # vérifie le style du code
```

## Structure du projet

```
src/
  app/            écrans (expo-router) : onglets Accueil / Tâches / Stats, détail et formulaire de tâche
  components/     composants d'écran (ligne de tâche, sélecteur de semaine, barre de répartition…)
  components/ui/  design system : bouton, carte, avatar, case à cocher, pastille, icônes…
  onboarding/     parcours d'accueil et illustrations
  storage/        données locales, actions (cocher, créer, supprimer, remercier)
  data/           catalogue de catégories et tâches suggérées, données de démonstration
  utils/          dates, planification des tâches, statistiques, dialogues compatibles web
  theme/          couleurs, espacements, polices (miroir de design.md)
  types/          modèle de données
design.md         design system : tokens, composants, règles
CLAUDE.md         brief du projet
```

## Design

Style **doux et organique** : beige chaud, vert sauge pour le premier profil, terracotta pour le
second, coins très arrondis, aucune ombre. Le design system complet est décrit dans
[`design.md`](design.md), et ses tokens sont regroupés dans `src/theme/index.ts`.

## Ce que j'ai appris en le construisant

- **Expo Go ne convient plus à des testeurs extérieurs.** Depuis mai 2026, Expo Go n'ouvre les
  mises à jour publiées que pour le propriétaire du projet. Pour faire tester à distance, j'ai
  publié une version web accessible par simple lien.
- **Le web n'est pas un mobile.** Certaines fonctions natives (fenêtres de confirmation) ne
  marchent pas dans un navigateur : le projet passe par un petit utilitaire compatible partout.
- **Un design system centralisé** (un seul fichier de couleurs) permet de changer toute la palette
  en un endroit, ce qui a servi lors de l'ajustement du terracotta.

## Et après (V2)

- Synchronisation entre deux téléphones (invitation du partenaire, données partagées)
- Notifications push entre les deux personnes
- Icônes et avatars illustrés personnalisés
- Écran Paramètres (modifier le foyer, les prénoms, les catégories)
- Fréquences plus fines (« toutes les 2 semaines », « au besoin »)
- Gestion de plusieurs foyers

## Auteur

Grégoire Guerlais — Product Manager en reconversion.
