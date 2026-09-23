# Nest — Brief de projet

> Ce fichier est le contexte de référence du projet. Lis-le au début de chaque session.
> Il définit ce qu'on construit, comment, et dans quel ordre. Si une instruction de l'utilisateur
> contredit ce fichier, demande confirmation avant d'agir.

## 1. Vue d'ensemble

**Nest** est une application mobile de gestion du foyer pour les couples. Elle permet de
répartir les tâches du quotidien de façon équilibrée et de réduire la charge mentale, en
rendant visible qui fait quoi. Le ton est doux, chaleureux, bienveillant — l'app valorise
l'effort de chacun plutôt que de créer de la compétition.

Ce projet est développé en solo par un Product Manager en reconversion, comme vitrine de
portfolio. La priorité est d'obtenir une app fonctionnelle et jolie qui tourne sur iPhone,
pas une architecture de production complexe.

## 2. Stack technique

- **Framework** : React Native avec **Expo** (managed workflow)
- **Langage** : TypeScript
- **Navigation** : `expo-router` (file-based routing)
- **Stockage local** : `@react-native-async-storage/async-storage` (ou `expo-sqlite` si besoin de requêtes)
- **Icônes** : jeu d'icônes personnalisé fourni par l'utilisateur (style line art vert sauge) — voir section DA
- **Tests sur appareil** : **Expo Go** (app gratuite sur l'App Store, scan d'un QR code — aucun compte Apple Developer requis à ce stade)

Ne pas ajouter de backend, de base de données distante, d'authentification serveur ou de
dépendances lourdes sans validation explicite. On reste simple et local.

## 3. Décision d'architecture clé : MVP local-first

Le MVP tourne **sur un seul appareil**, sans serveur ni synchronisation multi-appareils.
Les deux membres du foyer (Grégoire et Marine) sont **deux profils simulés dans la même app**.
L'utilisateur peut basculer de l'un à l'autre pour démontrer toute l'expérience (assignation,
répartition, stats) sans backend.

Toutes les données (foyer, tâches, complétions) sont stockées **localement** sur l'appareil.

> La synchronisation réelle entre deux téléphones (invitation du partenaire, données partagées
> en temps réel) est explicitement **hors périmètre MVP** → V2.

## 4. Périmètre du MVP

### Dans le MVP (à construire)
1. **Onboarding** : splash → bienvenue → nommer le foyer + choisir une icône → choisir les catégories
2. **Setup initial des tâches** : tâches suggérées (pré-remplies selon les catégories) + ajout de tâches personnalisées + assignation aux profils
3. **Dashboard (Accueil)** : tâches du jour, sélecteur de semaine, filtre "Nous / Moi", cocher une tâche comme faite
4. **Détail d'une tâche** : infos, fréquence + jours, assigné(s), historique, actions (modifier / supprimer / marquer fait)
5. **Écran Tâches** : toutes les tâches groupées par catégorie, filtre par catégorie, suggestions non configurées
6. **Ajout / édition d'une tâche** : nom, catégorie, fréquence (nombre + unité jour/semaine/mois/an), jours, assigné(s)
7. **Stats** : répartition Grégoire vs Marine (semaine/mois), détail par catégorie, message de gratitude dynamique
8. **Remerciement (version locale)** : voir section 4bis
9. **Bascule de profil** : un moyen simple de switcher entre Grégoire et Marine (ex : dans les Paramètres ou via un avatar en header)

### Hors MVP (V2 — ne pas construire pour l'instant)
- Synchronisation multi-appareils / backend
- Invitation réelle du partenaire par lien ou SMS
- Notifications **push cross-appareil** (le remerciement du MVP utilise une notif LOCALE, voir 4bis)
- Gestion de plusieurs foyers

## 4bis. Fonctionnalité de remerciement (version locale MVP)

Sur l'écran Stats, sous le message de gratitude dynamique, ajouter un **bouton "Remercier [prénom]"**
(le prénom = le membre qui a le plus contribué sur la période).

Comportement, **entièrement local, sans backend ni push serveur** :
1. Au tap → message de confirmation à l'expéditeur (ex : toast "Merci envoyé à Grégoire 💚")
2. Un enregistrement de remerciement est stocké localement
3. Quand on bascule sur le profil du destinataire, il voit le remerciement reçu
   (petite bannière ou mini-inbox sur le Dashboard ou l'écran Stats)
4. Optionnel mais recommandé pour l'effet démo : déclencher une **notification locale**
   (`expo-notifications`, notif locale uniquement — PAS de push distant) au moment de l'envoi

> Important : ne PAS construire de système de notifications push serveur ni de backend pour
> cette fonctionnalité. Tout se passe en local sur l'appareil. La vraie notif push
> cross-appareil est réservée à la V2 (quand un backend existera).

## 5. Modèle de données

```typescript
type Member = {
  id: string;
  name: string;          // "Grégoire" | "Marine"
  avatarIcon: string;    // clé d'icône avatar
  color: 'sage' | 'terracotta';
};

type Category = {
  id: string;
  name: string;          // Maison, Enfants, Administratif, Animaux, Travaux
  icon: string;          // clé d'icône catégorie
};

type Frequency = {
  count: number;         // ex : 2
  unit: 'day' | 'week' | 'month' | 'year';  // ex : 'week' → 2×/semaine
  days?: number[];       // 0=Lun ... 6=Dim, pertinent surtout pour unit='week'
};

type Task = {
  id: string;
  name: string;
  categoryId: string;
  frequency: Frequency;
  assigneeIds: string[]; // un ou deux membres
  isSuggested?: boolean; // true = suggérée non encore configurée
  createdAt: string;     // ISO date
};

type Completion = {
  id: string;
  taskId: string;
  memberId: string;      // qui a fait la tâche
  date: string;          // ISO date
};

type ThankYou = {
  id: string;
  fromMemberId: string;  // qui remercie
  toMemberId: string;    // qui est remercié
  message: string;       // message de remerciement
  date: string;          // ISO date
  read: boolean;         // le destinataire l'a-t-il vu ?
};

type Household = {
  id: string;
  name: string;          // "Le nid des Martin"
  icon: string;          // clé d'icône foyer
  categoryIds: string[]; // catégories activées à l'onboarding
  members: Member[];
  createdAt: string;
};
```

## 6. Direction artistique

Style **doux et organique**. Chaleureux, minimaliste, jamais agressif.

**Couleurs — palette exacte extraite du design Nest (source de vérité)**

Fonds & surfaces :
- Fond de l'app : `#FAF6EF` (beige très clair et chaud)
- Fond secondaire / beige : `#F3EBDD`
- Beige profond (séparateurs, aplats) : `#E9DCC8`
- Cartes / surfaces : `#FEFDFB` (blanc cassé chaud)

Verts (accent principal — profil Grégoire) :
- Vert profond `sage-deep` (traits, texte accent, éléments actifs) : `#5E7A55`
- Vert sauge `sage` (remplissages) : `#9DB48F`
- Vert sauge très clair `sage-soft` (fonds sélectionnés légers) : `#E7EDDF`

Terracotta (accent secondaire — profil Marine) :
- Terracotta `terra` : `#C99478`
- Terracotta profond `terra-deep` : `#9A5E42`
- Terracotta clair `terra-soft` : `#F0E2D8`

> Ajustement (retour utilisateur) : `terra-deep` est trop brun pour les boutons et éléments
> actifs (coché, bordures, avatar de Marine). Dans le code, le token `terracotta` (rôle
> "traits, éléments actifs") utilise plutôt `#C17E52` — une teinte intermédiaire entre
> `terra-deep` et `terra`, plus orangée et plus douce. `terra` et `terra-soft` restent
> inchangés pour les remplissages et les fonds sélectionnés légers.

Texte :
- Texte principal `ink` : `#4A4640` (gris chaud foncé, jamais de noir pur)

Accents complémentaires disponibles (à utiliser avec parcimonie) :
- Miel `honey` : `#D6A24E` — Prune `plum` : `#A57BA5` — Rouille `rust` : `#B66B47`

> Note : le logo de l'app (`assets/nest-logo-contrast.svg`) utilise `#5E7A55` (traits + cœur)
> et `#9DB48F` (remplissage maison). Utiliser ces mêmes tokens partout pour la cohérence.

**Style visuel**
- Coins très arrondis (16px minimum sur les cartes, pilules pour les boutons)
- Pas d'ombres agressives, pas de dégradés criards, pas de 3D
- Espacement généreux entre les éléments
- Typographie : sans-serif arrondie et amicale
- Icônes : line art, trait fin et uniforme, couleur vert sauge — un jeu personnalisé sera fourni
  (catégories, icônes de foyer, avatars). En attendant, utiliser des icônes line art d'une lib
  cohérente (ex : `lucide-react-native`) en `#5C7A5C`.

**Catégories et leurs icônes**
- 🧹 Maison — maison
- 👶 Enfants — bébé / enfant
- 📋 Administratif — presse-papier / document
- 🐾 Animaux — patte
- 🔧 Travaux — clé à molette

## 7. Approche de développement

Construire **de manière incrémentale**, un morceau fonctionnel à la fois. Après chaque étape,
l'app doit se lancer sans erreur dans Expo Go pour que l'utilisateur puisse tester sur son iPhone.

Ordre recommandé :
1. Initialiser le projet Expo + TypeScript + expo-router, vérifier qu'il se lance
2. Mettre en place le design system (couleurs, composants de base : bouton, carte, avatar, checkbox)
3. Modèle de données + couche de stockage local (AsyncStorage) avec données de démo (seed)
4. Dashboard (l'écran central) avec données mockées
5. Détail d'une tâche + cocher comme fait
6. Ajout / édition d'une tâche
7. Écran Tâches (groupé par catégorie)
8. Stats
9. Bascule de profil Grégoire / Marine
10. Remerciement local (bouton sur Stats + réception sur l'autre profil + notif locale) — voir 4bis
11. Onboarding (en dernier, car on peut démarrer avec un foyer pré-rempli pour développer)

À chaque étape : expliquer brièvement ce qui a été fait et comment le tester dans Expo Go.

## 8. Ton de collaboration

L'utilisateur découvre le développement mobile et Claude Code. Explique les choses simplement,
sans jargon inutile. Quand tu proposes une commande à lancer, précise ce qu'elle fait. Signale
quand une action nécessite quelque chose de sa part (installer une app, scanner un QR code, etc.).
