# Téranga S'cool — Documentation Projet & Guide IA (`GEMINI.md`)

> Ce document résume l'objectif, les fonctionnalités, l'architecture, la stack technique, les choix de design et les conventions de développement de **Téranga S'cool**, afin de permettre à tout développeur ou futur modèle IA de reprendre le projet immédiatement et de manière cohérente.

---

## 1. Ce que l'application fait

**Téranga S'cool** est une plateforme éducative (e-learning) conçue pour les élèves du secondaire au **Sénégal et en Afrique de l'Ouest** (avec un focus initial sur la classe de **Terminale**, notamment les séries **L** et **S**).

Slogan : *« Bien plus que des cours. Un espace pour comprendre, échanger et réussir. »*

L'application réunit **3 espaces utilisateurs distincts** (plus un parcours d'authentification) :
- **Espace Élève** : suivre des cours vidéo structurés par matière et chapitre, consulter et télécharger des fascicules/fiches PDF, poser des questions (texte et **notes vocales**) sur le forum, échanger en direct avec ses enseignants, rendre ses exercices et suivre sa progression.
- **Espace Enseignant** : consulter un tableau de bord des tâches prioritaires, publier des cours (vidéos ou documents PDF), répondre aux questions du forum et aux messages privés, suivre les élèves et corriger leurs devoirs.
- **Espace Administrateur** : superviser les indicateurs clés de la plateforme, gérer les comptes utilisateurs (élèves/enseignants), vérifier et valider les abonnements/accès, et modérer les contenus signalés.

> **État actuel du projet :** Prototype front-end complet, interactif et responsive, alimenté par des données mockées (`src/lib/constants/` et états locaux React `useState`). L'infrastructure back-end (API routes, authentification réelle, base de données, paiements) est structurée mais non encore connectée.

---

## 2. Toutes les fonctionnalités implémentées

### 🔐 Authentification (`(auth)`)
- **Redirection racine (`/`)** : redirige automatiquement vers `/connexion`.
- **Connexion (`/connexion`)** : formulaire téléphone ou e-mail + mot de passe (avec affichage/masquage), case *« Se souvenir de moi »*, lien mot de passe oublié et redirection vers `/accueil`.
- **Inscription (`/inscription`)** : création de compte avec nom complet, téléphone/e-mail, sélection du niveau (`Terminale`, `Première`, `Seconde`, `Troisième`, `Autre / Enseignant`), mot de passe (min. 8 caractères) et acceptation des conditions.
- **Mot de passe oublié (`/mot-de-passe-oublie`)** : saisie de l'identifiant avec écran de confirmation d'envoi.

### 🎓 Espace Élève (`(eleve)`)
- **Tableau de bord (`/accueil`)** :
  - Salutation personnalisée (*Awa Diop*, Terminale L).
  - Accès rapide aux **3 matières principales** (*Français*, *Histoire-Géo*, *Philosophie*) + bouton interactif *« Voir tout / Voir moins »* révélant les autres matières (*Mathématiques*, *Sciences Physiques*, *SVT*, *Anglais*).
  - Carte **« Reprendre mon cours »** avec miniature vidéo, badge matière, durée, barre de progression (68 %) et bouton d'accès direct au lecteur.
  - Raccourcis vers les 4 espaces : *Bibliothèque*, *Forum*, *Messages*, *Mon suivi*.
- **Catalogue des matières & Cours (`/matieres`, `/matieres/[matiere]`, `/matieres/[matiere]/[chapitre]`, `/matieres/[matiere]/[chapitre]/cours/[videoId]`)** :
  - Filtrage par disponibilité (*Toutes*, *Disponibles*, *Bientôt disponibles*) et recherche instantanée.
  - Modale d'aperçu et inscription aux notifications pour les matières *« Bientôt disponibles »*.
  - Page matière listant les chapitres du programme (avec fallback dynamique si un slug n'est pas dans les constantes).
  - Page chapitre et page lecteur vidéo avec 4 onglets : **Cours**, **Exercices**, **Ressources** (visionneuse PDF intégrée avec zoom/pagination et téléchargement simulé), **Discussions** (commentaires texte et audio sous le cours).
  - Lecteur vidéo personnalisé (`VideoPlayer`) et liste de leçons interactive (`ChapitreItem`).
- **Bibliothèque (`/bibliotheque` et `/bibliotheque/[documentId]`)** :
  - Recherche temps réel et filtres par matière (*Tout*, *Français*, *Histoire-Géo*, *Philosophie*).
  - Aperçu/lecteur PDF intégré (`PdfViewer` / modale de lecture avec zoom et navigation de pages) et téléchargement avec notification toast.
- **Forum d'entraide (`/forum`, `/forum/nouveau`, `/forum/[discussionId]`)** :
  - Liste des discussions avec recherche, filtres par matière et statut *« Résolu »*.
  - Création de nouvelles questions via modale (`NewQuestionModal`) ou page dédiée (`/forum/nouveau`), avec support **texte + enregistrement vocal simulé** (`AudioRecorder`).
  - Consultation détaillée (`TopicDetailModal` et page `[discussionId]`), ajout de réponses (texte ou vocal) et bascule du statut résolu.
- **Messagerie directe (`/messages` et `/messages/[conversationId]`)** :
  - Liste des conversations avec les enseignants, recherche et indicateur de messages non lus.
  - Vue chat complète (`ChatConversationView`) prenant en charge messages texte, **notes vocales** (`AudioPlayer` / `AudioRecorder`) et pièces jointes.
- **Mon suivi (`/mon-suivi`)** :
  - Statistiques globales (cours suivis, temps passé, exercices réussis) et progression par matière avec barres dégradées.
  - Suivi des exercices filtrable par statut (*À faire*, *Envoyé*, *Corrigé*), consultation des consignes, notes et retours enseignants.
  - Modale de dépôt de devoir (sélection matière, titre, fichier, commentaire).
- **Mon compte (`/compte`, `/compte/parametres`, `/compte/abonnement`)** :
  - Interface à 3 onglets synchronisée par query param (`?tab=profil|parametres|abonnement`) :
    - **Profil** : édition des informations personnelles (nom, e-mail, téléphone, ville, établissement, série).
    - **Paramètres** : préférences (ex. support/explications en Wolof, notifications forum/cours/rappels) et changement de mot de passe avec validation.
    - **Abonnement** : gestion et aperçu du statut d'abonnement.

### 👨‍🏫 Espace Enseignant (`(enseignant)`)
- **Tableau de bord (`/enseignant`)** :
  - KPIs cliquables (*Questions à traiter*, *Exercices reçus*, *Cours publiés*).
  - Liste des **tâches prioritaires** (question forum, exercice à corriger, message privé) avec modale de traitement rapide (réponse, notation `/20` et envoi de feedback).
- **Mes cours (`/enseignant/cours` et `/enseignant/cours/publier`)** :
  - Liste des cours publiés (vidéos et documents PDF) avec vues, durée, niveau et date.
  - Formulaire de publication de nouveau cours (titre, matière, niveau, type vidéo/document, description) avec confirmation.
- **Suivi des élèves (`/enseignant/eleves`)** :
  - Liste des élèves de la classe avec recherche, statut (*Exercice à corriger* / *À jour*), moyenne et progression.
- **Forum enseignant (`/enseignant/forum`)** :
  - Filtrage des questions (*Toutes* / *Non résolues*) et réponse directe en tant qu'enseignant.
- **Messagerie enseignant (`/enseignant/messages`)** :
  - Interface de discussion à deux colonnes avec les élèves et envoi de réponses en temps réel (état local).

### 🛡️ Espace Administrateur (`(admin)`)
- **Tableau de bord (`/admin`)** :
  - KPIs globaux (*Élèves inscrits*, *Enseignants*, *Accès actifs*) et cartes d'accès rapide vers la gestion.
- **Gestion des utilisateurs (`/admin/utilisateurs`)** :
  - Liste complète avec recherche, filtrage par rôle (*Élève*, *Enseignant*), ajout, modification, suppression et gestion du statut (*Actif* / *En attente*).
- **Gestion des abonnements (`/admin/abonnements`)** :
  - Compteurs d'abonnements actifs / à renouveler, liste des comptes, modale de détail et outil de **validation rapide d'accès** (activation d'un paiement en attente avec mise à jour des compteurs et toast).
- **Modération (`/admin/moderation`)** :
  - Liste des signalements (Forum, Bibliothèque), consultation d'extrait de contenu, modale de règles de la communauté et actions de traitement (*Traité*) avec feedback toast.

### 🚧 Routes & Fichiers préparés (stubs / à compléter)
- **Pages placeholders (4 à 14 lignes)** :
  - `src/app/(admin)/admin/contenus/page.tsx`
  - `src/app/(eleve)/mon-suivi/exercices/page.tsx`
  - `src/app/(enseignant)/enseignant/eleves/[eleveId]/page.tsx`
  - `src/app/(eleve)/compte/abonnement/page.tsx` et `parametres/page.tsx` (redirections/wrappers vers `/compte?tab=...`)
- **Dossiers API créés mais vides** : `src/app/api/{abonnements,auth,cours,exercices,vocaux}/`
- **Fichiers squelettes (`export {};`)** : `src/types/{user,pedagogie,communication}.ts`, `src/hooks/{useAudioRecorder,useCourseProgress}.ts`, `src/lib/utils/formatters.ts`, `src/lib/validators/`.

---

## 3. Structure des fichiers

```text
teranga-scool/
├── .env.example                    # Modèle des variables d'environnement (App, NextAuth, DB, Supabase, PayTech)
├── GEMINI.md                       # Ce fichier de documentation
├── next.config.ts                  # Configuration Next.js (reactStrictMode: true)
├── package.json                    # Dépendances et scripts (dev, build, start, lint)
├── tailwind.config.ts              # Palette de couleurs custom `teranga.*` et border-radius
├── tsconfig.json                   # TypeScript strict + alias `@/*` -> `./src/*`
├── public/
│   └── images/                     # Logos (logo-teranga.jpeg, logo-teranga-scool.svg, logo-badge.png) & miniatures
└── src/
    ├── app/
    │   ├── globals.css             # Directives Tailwind et variables CSS (--background, --foreground)
    │   ├── layout.tsx              # Layout racine (lang="fr", métadonnées, fond crème #F8F5EE)
    │   ├── page.tsx                # Redirige vers /connexion
    │   ├── not-found.tsx           # Page 404 personnalisée
    │   ├── (auth)/                 # Route group Authentification (layout split-screen 2 colonnes)
    │   │   ├── layout.tsx
    │   │   ├── connexion/page.tsx
    │   │   ├── inscription/page.tsx
    │   │   └── mot-de-passe-oublie/page.tsx
    │   ├── (eleve)/                # Route group Élève (SidebarEleve + TopBar)
    │   │   ├── layout.tsx
    │   │   ├── accueil/page.tsx
    │   │   ├── matieres/
    │   │   │   ├── page.tsx
    │   │   │   └── [matiere]/
    │   │   │       ├── page.tsx
    │   │   │       └── [chapitre]/
    │   │   │           ├── page.tsx
    │   │   │           └── cours/[videoId]/page.tsx
    │   │   ├── bibliotheque/
    │   │   │   ├── page.tsx
    │   │   │   └── [documentId]/page.tsx
    │   │   ├── forum/
    │   │   │   ├── page.tsx
    │   │   │   ├── nouveau/page.tsx
    │   │   │   └── [discussionId]/page.tsx
    │   │   ├── messages/
    │   │   │   ├── page.tsx
    │   │   │   └── [conversationId]/page.tsx
    │   │   ├── mon-suivi/
    │   │   │   ├── page.tsx
    │   │   │   └── exercices/page.tsx          # Stub
    │   │   └── compte/
    │   │       ├── page.tsx
    │   │       ├── abonnement/page.tsx
    │   │       └── parametres/page.tsx
    │   ├── (enseignant)/           # Route group Enseignant (SidebarEnseignant + TopBar)
    │   │   ├── layout.tsx
    │   │   └── enseignant/
    │   │       ├── page.tsx
    │   │       ├── cours/
    │   │       │   ├── page.tsx
    │   │       │   └── publier/page.tsx
    │   │       ├── eleves/
    │   │       │   ├── page.tsx
    │   │       │   └── [eleveId]/page.tsx      # Stub
    │   │       ├── forum/page.tsx
    │   │       └── messages/page.tsx
    │   ├── (admin)/                # Route group Administrateur (SidebarAdmin + TopBar)
    │   │   ├── layout.tsx
    │   │   └── admin/
    │   │       ├── page.tsx
    │   │       ├── utilisateurs/page.tsx
    │   │       ├── abonnements/page.tsx
    │   │       ├── contenus/page.tsx           # Stub
    │   │       └── moderation/page.tsx
    │   └── api/                    # Emplacements préparés pour les Route Handlers (vides pour l'instant)
    │       ├── abonnements/
    │       ├── auth/
    │       ├── cours/
    │       ├── exercices/
    │       └── vocaux/
    ├── components/
    │   ├── layout/                 # TopBar, ProfileDropdown, SidebarEleve, SidebarEnseignant, SidebarAdmin
    │   ├── media/                  # VideoPlayer, PdfViewer, AudioPlayer, AudioRecorder
    │   ├── metier/                 # MatiereCard, ChapitreItem, CourseComments, ChatConversationView,
    │   │                           # NewQuestionModal, TopicDetailModal
    │   └── ui/                     # Avatar, Badge, Button, Card, Logo, ProgressBar, SearchBar
    ├── hooks/                      # Hooks personnalisés (squelettes : useAudioRecorder, useCourseProgress)
    ├── lib/
    │   ├── constants/              # Données mockées structurées (matieres.ts, bibliotheque.ts, forum.ts, messages.ts)
    │   ├── utils/                  # Utilitaires (formatters.ts - squelette)
    │   └── validators/             # Schémas de validation (dossier vide)
    └── types/                      # Définitions TypeScript globales (squelettes : user, pedagogie, communication)
```

---

## 4. Technologies utilisées

### Stack actuelle (installée dans `package.json`)
- **Framework** : **Next.js `^15.1.0`** (App Router, Route Groups, dynamic routes).
- **UI Library** : **React `^19.0.0`** & **React DOM `^19.0.0`**.
- **Langage** : **TypeScript `^5.7.2`** (mode `strict: true`, alias `@/*`).
- **Styling** : **Tailwind CSS `^3.4.16`**, **PostCSS `^8.4.49`**, **Autoprefixer `^10.4.20`**.
- **Icônes** : **Lucide React `^0.468.0`**.
- **Utilitaires CSS** : **`clsx` `^2.1.1`** et **`tailwind-merge` `^2.5.5`**.

### Intégrations prévues (préparées dans `.env.example`)
- **Authentification** : NextAuth (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`).
- **Base de données** : `DATABASE_URL` (PostgreSQL / ORM à définir).
- **Stockage média (vidéos, PDF, vocaux)** : Supabase Storage (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Paiements locaux** : Wave / Orange Money via **PayTech** (`PAYTECH_API_KEY`, `PAYTECH_API_SECRET`).

---

## 5. Décisions de design

### Identité visuelle & Palette de couleurs (`tailwind.config.ts`)
L'interface adopte une esthétique chaleureuse, académique et rassurante, éloignée du blanc froid standard :
- **Vert Téranga profond (Sidebar, branding, titres enseignants/admin)** :
  - `teranga.dark`: `#0F3833`
  - `teranga.darker`: `#0B2B27`
  - `teranga.cardDark`: `#184540`
- **Orange Terracotta (Actions principales, CTA, accents, progression)** :
  - `teranga.orange`: `#E75A24`
  - `teranga.orangeHover`: `#D04D1B`
- **Crème / Sable (Fonds de pages et surfaces secondaires)** :
  - Fond global : `#F8F5EE` / `teranga.cream` (`#F7F4EE`) / `teranga.creamLight` (`#FAF8F4`)
  - Champs / barres inactives : `teranga.creamInput` (`#ECE5D8`)
- **Textes** : `stone-900` / `#1F2937` (`teranga.charcoal`) et `stone-500` / `#6B7280` (`teranga.muted`).

### Code couleur sémantique par matière
Chaque matière possède sa propre teinte pastel (fond, texte, bordure) pour une reconnaissance visuelle immédiate :
- **Français** : Pêche / Terracotta (`#FBECE2` / `#C85A2B`)
- **Histoire-Géo** : Vert sauge (`#EBF4EE` / `#236B48`)
- **Philosophie** : Lavande (`#F0EDFA` / `#6644B8`)
- **Mathématiques** : Bleu clair (`#E6F0FA` / `#1D63B8`)
- **Sciences Physiques** : Ambre (`#FEF3E2` / `#B86B1D`)

### Ergonomie & UX
- **Architecture par Route Groups** : `(auth)`, `(eleve)`, `(enseignant)` et `(admin)` isolent proprement les layouts et sidebars de chaque rôle sans polluer les URLs.
- **Responsive Mobile-First** : sidebars rétractables avec backdrop flouté sur mobile (`lg:hidden`), grilles adaptatives et zones tactiles confortables.
- **Formes douces** : cartes très arrondies (`rounded-2xl`, `rounded-3xl`), ombres légères (`shadow-xs`, `shadow-[0_2px_10px_rgba(0,0,0,0.03)]`) et bordures subtiles `border-stone-200/70`.
- **Approche « Audio-First » (Notes vocales)** : l'enregistrement et la lecture de vocaux sont intégrés au cœur du Forum, des Messages et des Commentaires de cours, pour lever la barrière de l'écrit et coller aux usages des élèves sénégalais (incluant la possibilité de support en Wolof dans les paramètres).
- **Feedback utilisateur immédiat** : notifications *toast* vert foncé (`#0F3833`) en bas à droite pour confirmer chaque action (téléchargement, publication, sauvegarde, validation d'abonnement).

---

## 6. Instructions pour un futur modèle IA

Si tu reprends le développement de **Téranga S'cool**, respecte impérativement les directives suivantes :

1. **Respecte strictement le Design System** :
   - Utilise les couleurs de la marque (`#0F3833`, `#E75A24`, `#F8F5EE`, gamme `stone-*`) et les composants UI existants dans `src/components/ui/` (`Button`, `Badge`, `Card`, `Avatar`, `ProgressBar`, `SearchBar`, `Logo`) avant d'en créer de nouveaux.
   - Conserve les coins arrondis (`rounded-xl`, `rounded-2xl`, `rounded-3xl`) et les animations subtiles.
2. **Langue et contexte culturel** :
   - Toute l'interface utilisateur, les libellés, les messages d'erreur et les données d'exemple doivent être en **français** naturel, cohérent avec le système éducatif sénégalais (Terminale L/S, Baccalauréat, noms locaux, opérateurs Wave/Orange Money, mention du Wolof).
3. **Architecture Next.js App Router** :
   - Ne mélange pas les rôles : chaque espace possède son propre Route Group (`(auth)`, `(eleve)`, `(enseignant)`, `(admin)`) et sa propre sidebar.
   - Les pages interactives utilisent `'use client'`. Lors du branchement back-end, privilégie les Server Components pour le chargement initial des données et isole l'interactivité dans des Client Components.
4. **Attention à l'état actuel (100 % mocké)** :
   - Les données proviennent actuellement de `src/lib/constants/` (`matieres.ts`, `bibliotheque.ts`, `forum.ts`, `messages.ts`) ou sont codées en dur dans les composants.
   - `AudioRecorder.tsx` simule actuellement un chronomètre sans utiliser l'API navigateur `MediaRecorder`. Le futur enregistrement réel devra être implémenté dans `src/hooks/useAudioRecorder.ts`.
   - `src/app/(enseignant)/enseignant/messages/page.tsx` mute directement `activeConv.messages.push(...)` : à refactoriser avec une mise à jour immuable d'état lors de l'évolution de la messagerie.
5. **Priorités pour passer en production (Back-end)** :
   - Centraliser les interfaces TypeScript actuellement dispersées dans les pages vers `src/types/{user,pedagogie,communication}.ts`.
   - Implémenter les Route Handlers dans les dossiers déjà prévus sous `src/app/api/`.
   - Compléter les 3 pages stubs restantes : `/admin/contenus`, `/mon-suivi/exercices` et `/enseignant/eleves/[eleveId]`.
   - Ajouter un middleware de protection des routes par rôle (`eleve`, `enseignant`, `admin`) une fois l'authentification branchée.
6. **Sécurité & Hygiène** :
   - Ne jamais commiter ni exposer le contenu de `.env.local` ; documenter toute nouvelle variable dans `.env.example`.
   - Vérifier que `npm run build` et `npm run lint` passent sans erreur TypeScript après chaque modification majeure.
