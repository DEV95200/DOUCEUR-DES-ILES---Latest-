# Kalawang Forge — Dashboard d’administration

## Accès

- URL locale : `/forge`
- Mot de passe initial : `kalawang2026`
- Le mot de passe peut être modifié dans **Réglages > Accès Forge**.

> Cette version utilise le stockage local du navigateur. Elle permet de tester toutes les liaisons entre le dashboard et le site public sans serveur externe.

## Phase 1 — Fondations livrées

### Catalogue produits
- Création, modification et suppression d’un produit.
- Prix, ancien prix, stock, catégorie, unité, descriptions, badge et visibilité.
- Import d’image depuis l’ordinateur avec aperçu immédiat.
- Gestion des ruptures de stock et suspension globale des commandes.

### Recettes numériques
- Création et modification de recettes payantes.
- Prix, durée, difficulté, image, description et visibilité.
- Ajout réel au panier comme produit numérique.

### Marketing
- Campagnes promotionnelles multiples.
- Code promo fonctionnel dans le checkout.
- Réduction en pourcentage.
- Compte à rebours avec date de fin.
- Barre promotionnelle ou annonce globale.
- Popup marketing avec délai et affichage unique par session.
- Intégration YouTube pilotée depuis Forge.

### Contenus et identité
- Hero : sur-titre, titre, texte surligné, accroche et boutons.
- Nom de marque, e-mail, localisation et texte du pied de page.
- Activation ou désactivation des animations principales.
- Mode maintenance sans bloquer `/forge`.

### Commerce et commandes
- Frais de livraison et seuil de livraison offerte.
- Préfixe automatique des commandes.
- Enregistrement d’une commande dans Forge.
- Détail client, articles, remise, livraison et total.
- Suivi du statut de commande.
- Décrément automatique du stock après validation.

### Sauvegarde
- Sauvegarde automatique dans le navigateur.
- Export complet au format JSON.
- Import d’une sauvegarde JSON.
- Réinitialisation générale.

## Phase 2 — Vérifications effectuées

- Compilation TypeScript stricte réussie.
- Build Vite de production réussi.
- Liaison `Forge > Produits > Boutique` vérifiée dans le code.
- Liaison `Forge > Marketing > Barre promo > Checkout` vérifiée.
- Liaison `Forge > Recettes > Panier` vérifiée.
- Liaison `Checkout > Commandes Forge > Stock` vérifiée.
- Liaison `Forge > Contenus > Hero / YouTube / Footer` vérifiée.
- Liaison `Forge > Maintenance > Site public` vérifiée.

## Limites avant une vraie mise en production

Le dashboard est fonctionnel dans le navigateur utilisé, mais les données ne sont pas encore partagées entre plusieurs appareils. Une version commerciale doit connecter :

1. une base de données comme Supabase ;
2. une authentification serveur avec rôles ;
3. un stockage d’images ;
4. un paiement réel comme Stripe ;
5. des e-mails transactionnels ;
6. une gestion sécurisée des secrets et des permissions.

Aucun paiement bancaire réel n’est déclenché dans cette version. Le checkout enregistre une commande de démonstration dans Forge.

## Commandes

```bash
npm install
npm run dev
npm run build
```

## Formulaire de contact — Gmail SMTP et Resend

Le bouton de contact ouvre maintenant une vraie section de formulaire reliée à une fonction Vercel sécurisée.

- réception principale avec Gmail SMTP et Nodemailer ;
- adresse du client configurée en `Reply-To` ;
- accusé de réception avec Resend ;
- secours Resend automatique si Gmail SMTP échoue ;
- validation serveur et protections anti-spam ;
- variables sensibles absentes du frontend.

Consultez `CONTACT_EMAIL_SETUP.md` pour renseigner Gmail, Resend et Vercel.
