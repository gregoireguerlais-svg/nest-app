# Nest — Design System

> **À lire avant TOUT changement d'interface.** Ce fichier décrit le design **tel qu'implémenté et
> validé dans le MVP**. Les tokens ci-dessous reflètent exactement `src/theme/index.ts` — **garder
> les deux synchronisés**. Toujours utiliser les tokens (jamais de valeurs en dur). Si un besoin
> n'est pas couvert, l'ajouter d'abord ici ET dans `src/theme/index.ts`, puis l'utiliser.
>
> En cas d'écart entre un mockup et ce fichier, **le code validé fait foi** : on met ce fichier à
> jour, on ne "corrige" pas le code pour coller au mockup sans accord.

## Principe directeur

Style **doux et organique** : chaleureux, minimaliste, apaisant, jamais agressif.
L'app valorise l'effort et réduit la charge mentale — le design respire le calme,
pas la productivité anxiogène.

Règles transversales :
- Coins arrondis partout (cartes `radius.card` = 20, boutons en pilule)
- Aucune ombre, aucun dégradé, pas de 3D (les surfaces se distinguent par `surface` + bordure `border`)
- Espacement généreux
- Jamais de noir pur (utiliser `text`)

---

## 1. Couleurs — tokens (miroir de `src/theme/index.ts`)

**Fonds & surfaces**
- `background` : `#FAF6EF` — fond de l'app (beige très clair et chaud)
- `backgroundSecondary` : `#F3EBDD` — fond secondaire ; utilisé pour les marges autour de l'app sur le web (grand écran)
- `surface` : `#FEFDFB` — cartes, champs de saisie, texte sur fond coloré
- `border` : `#E9DCC8` — bordures de cartes, champs, tâches suggérées

**Vert sauge — accent principal / profil Grégoire (1er profil par défaut)**
- `sage` : `#5E7A55` — boutons primaires, texte accent, éléments actifs, coche, icônes, avatar
- `sageFill` : `#9DB48F` — remplissages des illustrations uniquement (logo, scène de bienvenue)
- `sageSoft` : `#E7EDDF` — bouton secondaire, piste du sélecteur segmenté, bannière de remerciement

**Terracotta — accent secondaire / profil Marine (2ᵉ profil par défaut)**
- `terracotta` : `#C17E52` — éléments actifs du 2ᵉ profil (coche, bordure, avatar, pastille de couleur).
  ⚠️ Teinte volontairement ajustée : `terra-deep` (#9A5E42) du design d'origine était trop brune.
- `terracottaFill` : `#C99478` — remplissages d'illustration (défini, pas encore utilisé)
- `terracottaSoft` : `#F0E2D8` — bannière de remerciement envoyée par le 2ᵉ profil

**Texte**
- `text` : `#4A4640` — texte principal (gris chaud foncé, jamais de noir pur)
- `muted` : `#888888` — texte secondaire / labels

**Accents complémentaires (avec parcimonie, pas encore utilisés)**
- `honey` : `#D6A24E` — `plum` : `#A57BA5` — `rust` : `#B66B47`

**Règle profils**
Chaque membre a une couleur (`sage` ou `terracotta`, choisie à l'onboarding, toujours distinctes
entre les deux). Cette couleur sert de fond d'avatar (initiale en `surface`), de coche de tâche,
de pastille dans la répartition et de bordure d'assignation. Les prénoms sont saisis à
l'onboarding : ne jamais coder "Grégoire" / "Marine" en dur dans l'UI (ils ne sont que les noms de
la démo).

---

## 2. Typographie

Police : **Nunito** (arrondie, amicale), poids dans `fonts` : `regular` 400, `semibold` 600,
`bold` 700, `extrabold` 800. Composant `AppText` (prop `variant`, prop `muted`) :

- `title` : 30px, extrabold — titre d'écran
- `heading` : 20px, bold — titre de carte / de section
- `body` : 16px, regular — corps
- `caption` : 13px, semibold — labels, légendes
- `muted` : passe le texte en couleur `muted`

Splash : « Nest » 44px extrabold, sous-titre 13px bold en capitales espacées (`letterSpacing` 3).
Les libellés courts dans un contrôle à largeur fixe (« Semaine », « Bonjour [prénom] ») utilisent
`numberOfLines={1}` + `adjustsFontSizeToFit` pour rétrécir plutôt que déborder.

---

## 3. Espacement & rayons (miroir de `spacing` / `radius`)

- `spacing` : xs 4 / sm 8 / md 16 / lg 24 / xl 32
- Marges latérales d'écran : `spacing.lg` (24)
- `radius.card` : 20 (cartes, champs de saisie)
- `radius.pill` : 999 (boutons, pilules, contrôle segmenté)
- Espace entre cartes d'une liste : `spacing.sm` ; entre blocs d'écran : `spacing.md`

---

## 4. Composants (`src/components/`, `src/components/ui/`)

**Button** — pilule, hauteur mini 52. `primary` : fond `sage`, texte `surface`. `secondary` : fond
`sageSoft`, texte `sage`. Pressé ou désactivé : opacité 0,6.

**Card** — fond `surface`, bordure 1px `border`, `radius.card`, padding `spacing.md`, sans ombre.

**Avatar** — cercle, initiale du prénom en `surface` (bold) sur la couleur du membre (`sage` /
`terracotta`). Tailles courantes : 24–28 (listes), 32–48 (en-têtes). Une tâche partagée affiche les
deux avatars côte à côte.

**ProfileSwitcher** — deux avatars dans l'en-tête du Dashboard : le profil actif est plus grand
(44) et cerclé de sa couleur, l'autre est plus petit (32) et estompé ; toucher l'autre bascule.

**Checkbox** — cercle 28px, bordure 2px à la couleur du membre ; fait = plein à cette couleur avec
coche `surface`. Désactivée (jour futur) : opacité 0,4.

**TaskRow** (Dashboard) — carte : checkbox, nom, ligne « Catégorie · fréquence », avatars des
assignés. Faite : carte à 60 % d'opacité, nom barré ; les tâches faites passent en bas de liste.
Toucher la carte ouvre le détail.

**TaskCatalogRow** (onglet Tâches) — carte : nom, fréquence, avatars ; pas de coche.

**SuggestedTaskRow** — bordure pointillée `border`, nom normal, légende « Suggestion · à
configurer », pastille `+` (`sageSoft`, icône `sage`) à droite ; ouvre le formulaire pré-rempli.

**Chip** (pilule) — `md` (jours, catégories à l'onboarding) ou `sm` (filtres de catégories, avec
icône). Bordure 1,5px + texte à la couleur du chip (`sage` par défaut) ; sélectionné = fond plein
à cette couleur, texte `surface`. Les filtres de catégories sont à **sélection multiple** ; « Toutes »
est actif quand rien d'autre ne l'est.

**SegmentedControl** — piste `sageSoft` arrondie ; segment actif = fond `sage`, texte `surface` ;
inactif = texte `sage`. Utilisé pour Nous/Moi, Nous/[prénoms], Semaine/Mois, unité de fréquence.

**Formulaire de tâche** — champ texte (`surface`, bordure `border`, `radius.card`) ; catégories en
pilules `surface` avec icône, sélection = fond `sage` ; stepper `−`/valeur/`+` (pastilles
`sageSoft`) + sélecteur d'unité ; jours en `Chip` (« Lun »…« Dim », optionnels, visibles pour
« Semaine ») ; assignés en pastilles bordées de la couleur du membre (sélection = fond plein).
Message d'erreur en `terracotta`. Toutes les catégories sont proposées : en choisir une l'active
pour le foyer.

**WeekStrip** — flèches ‹ › + 7 jours (Lun–Dim) en cartes `surface` ; jour sélectionné = fond
`sage` ; aujourd'hui = bordure `sage` 2px.

**SplitBar** — barre proportionnelle des parts de chaque membre (couleurs des membres) ; piste
`sageSoft` si aucune donnée. Hauteur 12 (global) ou 8 (par catégorie).

**Carte gratitude** (Stats) — `Card` standard, message dynamique + bouton « Remercier [prénom] »
(secondaire), visible seulement si l'autre membre a coché au moins une tâche sur la période.

**ThankYouBanner** — bannière en haut du Dashboard, fond `sageSoft` ou `terracottaSoft` selon la
couleur de l'expéditeur ; toucher = marquer comme lu.

**Toast** — pilule `text` avec texte `surface`, en bas d'écran, disparaît après 2,5 s.

**Fab** — bouton rond 56px `sage`, icône `+` `surface`, fixé en bas à droite de l'écran Tâches
(ouvre le formulaire de création).

**Barre de navigation basse** — 3 onglets : **Accueil**, **Tâches**, **Stats** (pas d'écran
Paramètres dans le MVP). Fond `surface`, bordure haute `border`, actif = `sage`, inactif = `muted`.

**En-tête Stats** — icône + nom du foyer (`heading`) avant la carte Répartition.

**Outils de démo** — bas du Dashboard : « Réinitialiser les données de démo », « Recommencer
l'onboarding » (texte `caption` `muted`), temporaires. « Aperçu du design system » n'apparaît qu'en
développement (`__DEV__`) ; en production, `/design-system` et toute adresse inconnue ramènent à
l'accueil (`src/app/+not-found.tsx`).

---

**Version web** — l'app reste dans une colonne de 480px maximum, centrée, sur fond
`backgroundSecondary` (`src/app/_layout.tsx`). `Alert.alert` ne fonctionne pas sur le web : passer
par `src/utils/dialog.ts` (`showNotice`, `confirmDestructive`) pour toute fenêtre de message ou
de confirmation.

---

## 5. Onboarding (5 écrans, `src/onboarding/OnboardingFlow.tsx`)

1. **Splash** — logo `NestMark` sur carte blanche arrondie, « Nest », « GESTION DU FOYER », invite
   « Appuyez pour commencer » (tap n'importe où).
2. **Bienvenue** — scène `HomeScene`, « Gérez votre foyer, ensemble. », bouton « Créer mon foyer »,
   lien « J'ai déjà un foyer » (message « Bientôt disponible », V2).
3. **Foyer** — nom + icône (6 icônes Lucide : maison, cœur, soleil, feuille, étincelles, fleur).
4. **Profils** — prénom + couleur (`sage` / `terracotta`, échange automatique si conflit) pour les
   deux personnes, avec aperçu d'avatar.
5. **Catégories** — choix multiple (au moins une) ; crée un foyer avec les suggestions de ces
   catégories, sans tâche configurée.

Pas d'indicateur de progression. Les boutons « Continuer » / « Terminer » sont désactivés tant que
les champs requis sont vides.

---

## 6. États (règles générales)

- **Sélectionné** : couleur du membre ou `sage`, fond plein, texte `surface`
- **Fait / complété** : coche à la couleur du membre, carte estompée, nom barré
- **Désactivé** : opacité réduite (0,4 checkbox, 0,6 bouton)
- **Partagé (2 personnes)** : afficher les deux avatars
- **Vide** : phrase douce en `muted` (« Aucune tâche pour ce filtre. », « Rien de prévu 🌿 »)

---

## 7. Assets et icônes

- **Logo** : composant `NestMark` (`src/components/ui/NestMark.tsx`, SVG via `react-native-svg`) —
  tracé fidèle au design d'origine ; traits en `sage`, remplissages (maison, cœur) en `sageFill`.
- **Illustration de bienvenue** : `HomeScene` (`src/onboarding/HomeScene.tsx`), même convention
  traits `sage` / remplissages `sageFill`.
- **Icônes de catégories et de foyer** : icônes line art **Lucide** (`lucide-react-native`),
  trait 1,5–1,75, couleur `sage` — **provisoire**. Un jeu d'icônes personnalisé (catégories,
  foyer) et des avatars illustrés sont prévus pour la **prochaine version** ; ils remplaceront
  `CategoryIcon`, `HouseholdIcon` et l'initiale de `Avatar`.

---

## 8. À faire / À éviter

À faire : réutiliser les tokens, garder de l'air, arrondir, rester sobre, garder ce fichier et
`src/theme/index.ts` synchronisés.
À éviter : noir pur, ombres, dégradés, couleurs hors palette, prénoms codés en dur, valeurs en dur.
