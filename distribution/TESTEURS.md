# Faire tester Nest

**Lien** (à coller dans Expo Go) :
`exp://u.expo.dev/92886c7d-9db2-4d9d-905a-0d140ca02f60?channel-name=preview`

**QR code** : `distribution/nest-testeurs-qr.png` (même lien).

Ce lien montre toujours la **dernière version publiée** : les testeurs n'ont rien à refaire
quand tu publies une mise à jour. Ton ordinateur n'a pas besoin d'être allumé.

## Message à envoyer aux testeurs

1. Installe l'app gratuite **Expo Go** (App Store sur iPhone, Google Play sur Android).
2. Ouvre Expo Go, puis :
   - **iPhone** : ouvre l'appareil photo, scanne le QR code, touche la bannière « Ouvrir dans Expo Go ».
   - **Android** : dans Expo Go, touche « Scan QR code » et scanne le QR code.
   - **Sans QR code** : dans Expo Go, choisis « Enter URL manually » et colle le lien ci-dessus.
3. Aucun compte n'est nécessaire. Autorise les notifications si l'app le demande (facultatif).
4. La première ouverture peut prendre quelques secondes (téléchargement de l'app).

## Publier une nouvelle version pour les testeurs

Dans le dossier du projet (une commande, ça envoie la version actuelle du code) :

    npm run publish:preview

Les testeurs la recevront à la prochaine ouverture de l'app dans Expo Go (fermer puis rouvrir).

## Tester en direct depuis ton Mac (développement)

    npx expo start            # même Wi-Fi que le téléphone
    npx expo start --tunnel   # Wi-Fi différent (installe un petit outil au premier lancement)

Ces modes servent à **toi** pour développer. Sur iPhone, ils exigent d'être connecté à Expo Go
avec **ton** compte Expo : ne les utilise pas pour des testeurs, donne-leur le lien ci-dessus.
