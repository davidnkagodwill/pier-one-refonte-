# Série LinkedIn : refonte de Pier One (4 jours)

Tagger la page de Pier One France à l'endroit indiqué (@Pier One France), via le @ de LinkedIn.
Lien du site : à mettre en premier commentaire, pas dans le post.
Meilleur créneau : mardi, mercredi ou jeudi entre 8 h et 9 h.

---

## Jour 1 : l'annonce, avec l'avant / après

Visuels : jour1-avant-apres.mp4 (vidéo) ou jour1-avant-apres.png (image)

7 looks, 1 corde à linge, 0 commande.

J'ai décidé de refaire le site de @Pier One France.

Personne ne me l'a demandé. C'est un projet personnel, un concept non officiel, pour m'entraîner sur un vrai site e-commerce plutôt que sur une marque inventée.

En parcourant leur site, j'ai vu une marque avec des pièces qui ont du style. Et une page d'accueil qui ne le montre pas.

Mon idée de départ : un portant de vêtements suspendu à une corde. Tu cliques sur un cintre, le mannequin enfile le look, et tout le portant glisse.

Pendant 4 jours, je vous montre tout le process :

Jour 1 : l'avant / après (vous êtes ici)
Jour 2 : ce que j'aime et ce que j'aime moins sur le site actuel, et mes wireframes
Jour 3 : comment j'ai construit le carrousel qui change les habits
Jour 4 : le site final, avec toutes ses fonctionnalités

Dans la vidéo : le site actuel d'abord, puis ma version.

Vous préférez lequel ? Et surtout, qu'est-ce qui vous fait dire ça ?

#UXDesign #WebDesign

---

## Jour 2 : ce que j'aime, ce que j'aime moins, et les wireframes

Visuels : jour2-carrousel-pier-one.pdf (10 slides, à publier comme document)

5 détails m'ont arrêté sur le site actuel de @Pier One France.

D'abord ce que j'aime :

Le logo PIER · ONE, simple et élégant.
Des prix accessibles, visibles dès la page d'accueil.
Une structure e-commerce classique qu'on comprend tout de suite.

Et ce que j'aime moins :

1. Un bandeau « Soldes d'été » encore en ligne au moment où j'écris.
2. Un mélange d'anglais et de français : « Shop By Category », « New Arrivals », « View all » à côté de « Nouvelle collection ».
3. Du faux texte oublié sous les services : « Ultrices dolor massa dui curabitur ».
4. Un grand titre « Party Wears » qui pourrait être celui de n'importe quelle boutique.
5. Des photos de styles très différents, sans fil conducteur.

Rien de dramatique pris un par un. Mis ensemble, ça donne l'impression d'un thème installé et jamais terminé.

Avant d'ouvrir Framer, j'ai donc posé la structure en wireframes :

En haut, le portant interactif à la place de la grande bannière.
Puis un bandeau qui défile avec les infos utiles (livraison, retours).
Les trois univers : Homme, Femme, Accessoires.
Les meilleures ventes.
Et un club newsletter pour finir.

Pas de couleur, pas de police. Juste l'ordre dans lequel on veut que le visiteur découvre la marque.

Qu'est-ce que vous regardez en premier quand vous arrivez sur un site de vêtements ?

#UXDesign #Wireframe

---

## Jour 3 : comment j'ai fait le carrousel qui change les habits

Visuels : jour3-portant-making-of.mp4 (48 s)

Ma première version du carrousel était en 3D. Je l'ai jetée.

Un mannequin 3D stylisé, des vêtements modélisés, tout bougeait bien. Mais ça ne ressemblait pas à un site de mode. Personne n'achète un pantalon en regardant un bonhomme en 3D.

Alors j'ai tout repris avec de vraies photos.

Étape 1 : une photo du modèle en pied, mains dans les poches, jambes croisées.
Étape 2 : les autres tenues, générées par IA dans la même pose, sur fond blanc. Et chaque tenue aussi seule, sur un cintre.
Étape 3 : le détourage. Le fond blanc est retiré directement dans le navigateur, au chargement de la page. Pas besoin de détourer chaque photo à la main.
Étape 4 : l'animation, dans Framer.

Le portant est un composant de code dans Framer. Les photos, les couleurs et les textes restent modifiables dans le panneau de droite, sans retoucher le code.

Chaque cintre connaît sa place par rapport au look porté : de -3 à gauche à +3 à droite. Quand je clique sur un cintre, il devient le look porté. Toutes les positions changent d'un coup, et chaque cintre glisse vers sa nouvelle place.

Pour le mouvement, j'utilise un ressort (Framer Motion) plutôt qu'une durée fixe. Les cintres accélèrent puis freinent en douceur, comme de vrais vêtements qu'on pousse sur une tringle. Le cintre cliqué grossit et s'efface pendant que la photo du mannequin apparaît, avec 0,2 seconde de décalage.

Le détail qui a tout changé : réduire la taille du mannequin et des vêtements. Dans la première version, ils prenaient tout l'écran et on ne voyait plus le portant.

Recommencer une partie de zéro, vous l'acceptez facilement, ou vous essayez d'abord de sauver ce qui existe ?

#UXDesign #Framer

---

## Jour 4 : le site final

Visuels : jour4-site-final.mp4 (45 s)

6 pages, 7 looks, 1 portant qui habille le mannequin.

Voici ma refonte du site de @Pier One France, terminée.

Ce que vous voyez dans la vidéo :

Le portant interactif : 7 looks, le détail de chaque pièce avec son prix, et le bouton « Acheter le look » qui affiche le total.
Les pages Homme, Femme et Accessoires.
Une fiche produit pour chaque article.
Le panier.
Le club Pier One, avec -10 % sur la première commande.
Et tout le site, adapté au téléphone.

Tout le site est construit dans Framer.

Ce projet m'a rappelé une chose : un site de mode ne doit pas seulement lister des produits. Il doit donner envie de les porter.

Le lien pour tester le site est en commentaire. Dites-moi ce que vous changeriez en premier.

#UXDesign #WebDesign
