# Faire tester Nest

## Version web (pour tous les testeurs, sans rien installer)

**Lien : https://nest-app.expo.app** — QR code : `distribution/nest-web-qr.png`

Fonctionne dans le navigateur, sur iPhone, Android et ordinateur, sans compte et sans que ton
ordinateur soit allumé. Sur téléphone, on peut l'ajouter à l'écran d'accueil (Partager → « Sur
l'écran d'accueil » sur iPhone ; menu ⋮ → « Ajouter à l'écran d'accueil » sur Android).

Limites de la version web : pas de notification lors d'un remerciement, et le rendu n'est pas
exactement celui d'une app native. Les données restent **dans le navigateur de chaque testeur**
(personne ne voit celles des autres ; vider les données du site les efface).

### Message à envoyer aux testeurs

> Salut ! Teste Nest, mon app de gestion du foyer en couple : https://nest-app.expo.app
> Ouvre le lien sur ton téléphone (ou scanne le QR). Au premier lancement, crée un foyer avec
> deux prénoms, puis explore : ajoute des tâches, coche-les, regarde les Stats.
> Dis-moi ce qui te plaît, ce qui te bloque et ce que tu aurais envie d'y voir !

### Publier une nouvelle version du site

    npm run deploy:web

(exporte le site puis le publie ; le lien ne change pas, compte 1 à 2 minutes de propagation).

## Expo Go (pour toi, propriétaire du compte Expo)

Depuis le 12 mai 2026, Expo Go n'ouvre les mises à jour EAS que pour le **propriétaire du projet**
ou les **membres de son organisation** connectés à Expo Go. Les testeurs extérieurs voient une
erreur 403 : ne leur envoie pas de lien `exp://`.

    npm run publish:preview   # publie la version actuelle sur le canal "preview"

Lien à ouvrir dans Expo Go (compte `ggtest` connecté) :
`exp://u.expo.dev/92886c7d-9db2-4d9d-905a-0d140ca02f60?channel-name=preview`

Développement en direct : `npx expo start` (même Wi-Fi) ou `npx expo start --tunnel`.
Sur iPhone, Expo Go doit être connecté avec **ton** compte Expo.
