# Configuration du formulaire de contact

Le formulaire public envoie maintenant les données vers la fonction serveur `api/contact.ts`.

## Fonctionnement

1. **Gmail SMTP + Nodemailer** envoie le message du visiteur dans la boîte définie par `CONTACT_TO_EMAIL`.
2. L’adresse du visiteur est placée dans `Reply-To`, ce qui permet de lui répondre directement depuis Gmail.
3. **Resend API** envoie un accusé de réception au visiteur.
4. Si Gmail SMTP rencontre une erreur, Resend devient automatiquement le canal de secours pour transmettre le message à l’administrateur.
5. Si Resend échoue uniquement pour l’accusé de réception, le formulaire reste validé dès lors que le message principal a bien été reçu.

## Variables d’environnement

Copiez `.env.example` vers `.env.local` pour le développement :

```bash
cp .env.example .env.local
```

Puis renseignez :

```env
CONTACT_TO_EMAIL=votre-adresse@gmail.com
GMAIL_SMTP_USER=votre-adresse@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Kalawang <contact@votre-domaine.fr>
```

N’utilisez jamais le préfixe `VITE_` pour ces variables. Elles doivent rester exclusivement côté serveur.

## Gmail SMTP

Le mot de passe Gmail normal ne doit pas être utilisé.

1. Activez la validation en deux étapes du compte Google.
2. Ouvrez la section des mots de passe d’application.
3. Créez un mot de passe d’application pour le site Kalawang.
4. Copiez les 16 caractères dans `GMAIL_APP_PASSWORD`.

Nodemailer se connecte à `smtp.gmail.com` sur le port sécurisé `465`.

## Resend

Pour envoyer un accusé de réception à n’importe quel visiteur :

1. Ajoutez votre domaine dans Resend.
2. Ajoutez les enregistrements DNS demandés chez votre hébergeur de domaine.
3. Attendez que le domaine soit marqué comme vérifié.
4. Créez une clé API autorisée à envoyer des e-mails.
5. Utilisez une adresse de ce domaine dans `RESEND_FROM_EMAIL`.

Exemple :

```env
RESEND_FROM_EMAIL=Kalawang <contact@kalawang.fr>
```

L’adresse de test `onboarding@resend.dev` est limitée et ne convient pas à un formulaire public envoyé à des visiteurs différents.

## Configuration sur Vercel

Dans le projet Vercel :

1. Ouvrez **Settings** puis **Environment Variables**.
2. Ajoutez les cinq variables.
3. Activez-les au minimum pour **Production** et **Preview**.
4. Redéployez le projet après la modification.

## Test local complet

`npm run dev` lance seulement Vite et ne simule pas la fonction `/api/contact`.

Pour tester le frontend et la fonction serveur ensemble :

```bash
npx vercel dev
```

Puis ouvrez l’adresse locale indiquée par Vercel et envoyez un message depuis la section **Contact**.

## Contrôles intégrés

- validation du nom, de l’e-mail, du sujet et de la longueur du message ;
- limite de taille de la requête ;
- champ invisible anti-robot ;
- délai minimal de remplissage anti-spam ;
- échappement du contenu avant insertion dans les e-mails HTML ;
- secrets conservés uniquement dans les variables serveur ;
- aucune clé Gmail ou Resend incluse dans le bundle React.

## Dépannage

### Le formulaire affiche « service momentanément indisponible »

Vérifiez les logs de la fonction `api/contact` dans Vercel. Cette erreur signifie que Gmail et le secours Resend ont tous les deux échoué ou sont mal configurés.

### Gmail refuse l’authentification

Vérifiez que `GMAIL_APP_PASSWORD` contient bien un mot de passe d’application et non le mot de passe principal du compte.

### Le message arrive dans Gmail mais le visiteur ne reçoit rien

Le canal principal fonctionne. Vérifiez `RESEND_API_KEY`, la vérification du domaine et `RESEND_FROM_EMAIL`.

### Répondre au visiteur

Ouvrez le message reçu dans Gmail et cliquez normalement sur **Répondre**. Nodemailer configure automatiquement l’adresse du visiteur comme destinataire de la réponse.
