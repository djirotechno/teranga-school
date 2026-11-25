-- ============================================================================
-- Téranga S'cool — Migration 001 : Extensions, Types ENUM, Tables & Index
-- Cible : Supabase (PostgreSQL 15+)
-- Idempotente : peut être ré-exécutée sans erreur
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ----------------------------------------------------------------------------
-- 2. Types ENUM (idempotents)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('eleve', 'enseignant', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.account_status AS ENUM ('actif', 'en_attente', 'suspendu');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.niveau_scolaire AS ENUM (
    'Terminale',
    'Première',
    'Seconde',
    'Troisième',
    'Autre'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.serie_scolaire AS ENUM (
    'L',
    'L1',
    'L2',
    'S',
    'S1',
    'S2',
    'G',
    'Autre'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.matiere_status AS ENUM ('disponible', 'bientot_disponible');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.cours_type AS ENUM ('video', 'document');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.publication_status AS ENUM ('brouillon', 'publie', 'archive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.document_category AS ENUM ('pdf', 'fiche', 'fascicule', 'annales');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.exercice_type AS ENUM ('qcm', 'dissertation', 'entrainement', 'devoir');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.exercice_difficulty AS ENUM ('facile', 'moyen', 'difficile');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.soumission_status AS ENUM ('a_faire', 'envoye', 'corrige');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.abonnement_status AS ENUM ('actif', 'en_attente', 'a_renouveler', 'expire');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.paiement_methode AS ENUM ('wave', 'orange_money', 'manuel');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.signalement_target_type AS ENUM (
    'forum_discussion',
    'forum_reponse',
    'bibliotheque',
    'commentaire'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.signalement_status AS ENUM ('en_attente', 'traite', 'rejete');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- 3. Domaine A : Utilisateurs, Profils & Préférences
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role           public.user_role NOT NULL DEFAULT 'eleve',
  full_name      TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 2),
  email          TEXT UNIQUE,
  phone          TEXT UNIQUE,
  ville          TEXT,
  etablissement  TEXT,
  niveau         public.niveau_scolaire DEFAULT 'Terminale',
  serie          public.serie_scolaire DEFAULT 'L',
  avatar_url     TEXT,
  statut         public.account_status NOT NULL DEFAULT 'actif',
  preferences    JSONB NOT NULL DEFAULT '{
    "wolof_support": false,
    "notif_forum": true,
    "notif_cours": true,
    "notif_rappels": true
  }'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT profiles_contact_required CHECK (email IS NOT NULL OR phone IS NOT NULL),
  CONSTRAINT profiles_preferences_is_object CHECK (jsonb_typeof(preferences) = 'object')
);

COMMENT ON TABLE public.profiles IS 'Profils utilisateurs liés 1:1 à auth.users (élèves, enseignants, admins).';

-- ----------------------------------------------------------------------------
-- 4. Domaine B : Catalogue Pédagogique & Progression
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matieres (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL DEFAULT '',
  niveau_cible    TEXT NOT NULL DEFAULT 'Terminale L & S',
  couleur_bg      TEXT NOT NULL DEFAULT '#FBECE2',
  couleur_text    TEXT NOT NULL DEFAULT '#C85A2B',
  couleur_border  TEXT NOT NULL DEFAULT '#F4DACB',
  statut          public.matiere_status NOT NULL DEFAULT 'bientot_disponible',
  ordre           SMALLINT NOT NULL DEFAULT 0 CHECK (ordre >= 0),
  search_vector   TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(nom, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'B')
  ) STORED,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table d'association N:N Enseignants <-> Matières (3NF, utilisée par RLS)
CREATE TABLE IF NOT EXISTS public.enseignant_matieres (
  enseignant_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matiere_id     UUID NOT NULL REFERENCES public.matieres(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (enseignant_id, matiere_id)
);

-- Inscriptions aux notifications pour les matières "Bientôt disponibles"
CREATE TABLE IF NOT EXISTS public.matiere_notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eleve_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matiere_id   UUID NOT NULL REFERENCES public.matieres(id) ON DELETE CASCADE,
  notified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (eleve_id, matiere_id)
);

CREATE TABLE IF NOT EXISTS public.chapitres (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matiere_id  UUID NOT NULL REFERENCES public.matieres(id) ON DELETE CASCADE,
  numero      TEXT NOT NULL DEFAULT 'Chapitre 01',
  titre       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  objectif    TEXT NOT NULL DEFAULT '',
  niveau      public.niveau_scolaire NOT NULL DEFAULT 'Terminale',
  serie       public.serie_scolaire,
  ordre       SMALLINT NOT NULL DEFAULT 1 CHECK (ordre >= 1),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (matiere_id, slug)
);

CREATE TABLE IF NOT EXISTS public.cours (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapitre_id     UUID NOT NULL REFERENCES public.chapitres(id) ON DELETE CASCADE,
  enseignant_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titre           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  type            public.cours_type NOT NULL DEFAULT 'video',
  media_url       TEXT,
  thumbnail_url   TEXT,
  duree_secondes  INTEGER NOT NULL DEFAULT 0 CHECK (duree_secondes >= 0),
  vues_count      INTEGER NOT NULL DEFAULT 0 CHECK (vues_count >= 0),
  ordre           SMALLINT NOT NULL DEFAULT 1 CHECK (ordre >= 1),
  statut          public.publication_status NOT NULL DEFAULT 'publie',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bibliotheque_documents (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matiere_id             UUID NOT NULL REFERENCES public.matieres(id) ON DELETE RESTRICT,
  chapitre_id            UUID REFERENCES public.chapitres(id) ON DELETE SET NULL,
  enseignant_id          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titre                  TEXT NOT NULL,
  slug                   TEXT NOT NULL UNIQUE,
  description            TEXT NOT NULL DEFAULT '',
  categorie              public.document_category NOT NULL DEFAULT 'pdf',
  fichier_url            TEXT NOT NULL,
  taille_octets          BIGINT NOT NULL DEFAULT 0 CHECK (taille_octets >= 0),
  nombre_pages           INTEGER CHECK (nombre_pages IS NULL OR nombre_pages > 0),
  telechargements_count  INTEGER NOT NULL DEFAULT 0 CHECK (telechargements_count >= 0),
  statut                 public.publication_status NOT NULL DEFAULT 'publie',
  search_vector          TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(titre, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'B')
  ) STORED,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.progression_cours (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eleve_id                    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cours_id                    UUID NOT NULL REFERENCES public.cours(id) ON DELETE CASCADE,
  pourcentage                 SMALLINT NOT NULL DEFAULT 0 CHECK (pourcentage BETWEEN 0 AND 100),
  derniere_position_secondes  INTEGER NOT NULL DEFAULT 0 CHECK (derniere_position_secondes >= 0),
  temps_passe_secondes        INTEGER NOT NULL DEFAULT 0 CHECK (temps_passe_secondes >= 0),
  is_completed                BOOLEAN GENERATED ALWAYS AS (pourcentage >= 100) STORED,
  last_accessed_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (eleve_id, cours_id)
);

-- ----------------------------------------------------------------------------
-- 5. Domaine C : Exercices & Suivi Pédagogique
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercices (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matiere_id         UUID NOT NULL REFERENCES public.matieres(id) ON DELETE RESTRICT,
  chapitre_id        UUID REFERENCES public.chapitres(id) ON DELETE SET NULL,
  enseignant_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titre              TEXT NOT NULL,
  consignes          TEXT NOT NULL,
  type               public.exercice_type NOT NULL DEFAULT 'entrainement',
  difficulte         public.exercice_difficulty NOT NULL DEFAULT 'moyen',
  fichier_joint_url  TEXT,
  date_limite        TIMESTAMPTZ,
  statut             public.publication_status NOT NULL DEFAULT 'publie',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.soumissions_exercices (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercice_id              UUID NOT NULL REFERENCES public.exercices(id) ON DELETE CASCADE,
  eleve_id                 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  corrige_par              UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  fichier_rendu_url        TEXT,
  commentaire_eleve        TEXT,
  statut                   public.soumission_status NOT NULL DEFAULT 'a_faire',
  note                     NUMERIC(4,2) CHECK (note IS NULL OR (note >= 0 AND note <= 20)),
  feedback_texte           TEXT,
  feedback_audio_url       TEXT,
  feedback_audio_duration  INTEGER CHECK (feedback_audio_duration IS NULL OR feedback_audio_duration > 0),
  soumis_at                TIMESTAMPTZ,
  corrige_at               TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exercice_id, eleve_id),
  CONSTRAINT soumission_corrige_requires_timestamp CHECK (
    statut <> 'corrige' OR corrige_at IS NOT NULL
  )
);

-- ----------------------------------------------------------------------------
-- 6. Domaine D : Communication & Audio-First
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cours_commentaires (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id        UUID NOT NULL REFERENCES public.cours(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contenu         TEXT,
  audio_url       TEXT,
  audio_duration  INTEGER CHECK (audio_duration IS NULL OR audio_duration > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cours_commentaire_content_or_audio CHECK (
    NULLIF(trim(coalesce(contenu, '')), '') IS NOT NULL OR audio_url IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS public.forum_discussions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matiere_id      UUID REFERENCES public.matieres(id) ON DELETE SET NULL,
  chapitre_id     UUID REFERENCES public.chapitres(id) ON DELETE SET NULL,
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  titre           TEXT NOT NULL CHECK (char_length(trim(titre)) >= 5),
  contenu         TEXT,
  audio_url       TEXT,
  audio_duration  INTEGER CHECK (audio_duration IS NULL OR audio_duration > 0),
  is_resolved     BOOLEAN NOT NULL DEFAULT false,
  reponses_count  INTEGER NOT NULL DEFAULT 0 CHECK (reponses_count >= 0),
  search_vector   TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(titre, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(contenu, '')), 'B')
  ) STORED,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT forum_discussion_content_or_audio CHECK (
    NULLIF(trim(coalesce(contenu, '')), '') IS NOT NULL OR audio_url IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS public.forum_reponses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id     UUID NOT NULL REFERENCES public.forum_discussions(id) ON DELETE CASCADE,
  author_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contenu           TEXT,
  audio_url         TEXT,
  audio_duration    INTEGER CHECK (audio_duration IS NULL OR audio_duration > 0),
  is_validated      BOOLEAN NOT NULL DEFAULT false,
  is_teacher_reply  BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT forum_reponse_content_or_audio CHECK (
    NULLIF(trim(coalesce(contenu, '')), '') IS NOT NULL OR audio_url IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eleve_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enseignant_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matiere_id       UUID REFERENCES public.matieres(id) ON DELETE SET NULL,
  last_message_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (eleve_id, enseignant_id),
  CONSTRAINT conversations_distinct_users CHECK (eleve_id <> enseignant_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id        UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contenu                TEXT,
  audio_url              TEXT,
  audio_duration         INTEGER CHECK (audio_duration IS NULL OR audio_duration > 0),
  attachment_url         TEXT,
  attachment_name        TEXT,
  attachment_size_bytes  BIGINT CHECK (attachment_size_bytes IS NULL OR attachment_size_bytes >= 0),
  is_read                BOOLEAN NOT NULL DEFAULT false,
  read_at                TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT message_has_payload CHECK (
    NULLIF(trim(coalesce(contenu, '')), '') IS NOT NULL
    OR audio_url IS NOT NULL
    OR attachment_url IS NOT NULL
  )
);

-- ----------------------------------------------------------------------------
-- 7. Domaine E : Abonnements (PayTech) & Modération
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.abonnements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eleve_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_nom          TEXT NOT NULL DEFAULT 'Pack Terminale Complet',
  statut            public.abonnement_status NOT NULL DEFAULT 'en_attente',
  date_debut        TIMESTAMPTZ,
  date_fin          TIMESTAMPTZ,
  montant_xof       INTEGER NOT NULL CHECK (montant_xof >= 0),
  methode_paiement  public.paiement_methode NOT NULL,
  paytech_ref       TEXT UNIQUE,
  paytech_token     TEXT,
  validated_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  validated_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT abonnement_dates_coherentes CHECK (
    date_debut IS NULL OR date_fin IS NULL OR date_fin >= date_debut
  )
);

CREATE TABLE IF NOT EXISTS public.signalements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type       public.signalement_target_type NOT NULL,
  target_id         UUID NOT NULL,
  reporter_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  motif             TEXT NOT NULL CHECK (char_length(trim(motif)) >= 3),
  extrait           TEXT,
  statut            public.signalement_status NOT NULL DEFAULT 'en_attente',
  treated_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  treated_at        TIMESTAMPTZ,
  notes_moderation  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. Index de Performance & Recherche Plein Texte
-- ----------------------------------------------------------------------------

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role_statut ON public.profiles (role, statut);
CREATE INDEX IF NOT EXISTS idx_profiles_niveau_serie ON public.profiles (niveau, serie);

-- Matières & Chapitres & Cours
CREATE INDEX IF NOT EXISTS idx_matieres_statut_ordre ON public.matieres (statut, ordre);
CREATE INDEX IF NOT EXISTS idx_matieres_search ON public.matieres USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_matieres_nom_trgm ON public.matieres USING GIN (nom gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_enseignant_matieres_matiere ON public.enseignant_matieres (matiere_id);
CREATE INDEX IF NOT EXISTS idx_matiere_notifications_matiere ON public.matiere_notifications (matiere_id);

CREATE INDEX IF NOT EXISTS idx_chapitres_matiere_ordre ON public.chapitres (matiere_id, ordre);
CREATE INDEX IF NOT EXISTS idx_cours_chapitre_ordre ON public.cours (chapitre_id, ordre);
CREATE INDEX IF NOT EXISTS idx_cours_enseignant ON public.cours (enseignant_id);
CREATE INDEX IF NOT EXISTS idx_cours_statut ON public.cours (statut);

-- Bibliothèque (FTS + Trigrammes pour recherche instantanée)
CREATE INDEX IF NOT EXISTS idx_biblio_matiere_statut ON public.bibliotheque_documents (matiere_id, statut);
CREATE INDEX IF NOT EXISTS idx_biblio_chapitre ON public.bibliotheque_documents (chapitre_id);
CREATE INDEX IF NOT EXISTS idx_biblio_search ON public.bibliotheque_documents USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_biblio_titre_trgm ON public.bibliotheque_documents USING GIN (titre gin_trgm_ops);

-- Progression ("Reprendre mon cours" = ORDER BY last_accessed_at DESC)
CREATE INDEX IF NOT EXISTS idx_progression_eleve_recent ON public.progression_cours (eleve_id, last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_progression_cours ON public.progression_cours (cours_id);

-- Exercices & Soumissions
CREATE INDEX IF NOT EXISTS idx_exercices_matiere_chapitre ON public.exercices (matiere_id, chapitre_id);
CREATE INDEX IF NOT EXISTS idx_exercices_enseignant ON public.exercices (enseignant_id);
CREATE INDEX IF NOT EXISTS idx_soumissions_eleve_statut ON public.soumissions_exercices (eleve_id, statut);
CREATE INDEX IF NOT EXISTS idx_soumissions_exercice_statut ON public.soumissions_exercices (exercice_id, statut);

-- Communication & Audio-First
CREATE INDEX IF NOT EXISTS idx_cours_commentaires_cours_date ON public.cours_commentaires (cours_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cours_commentaires_author ON public.cours_commentaires (author_id);

CREATE INDEX IF NOT EXISTS idx_forum_discussions_matiere_date ON public.forum_discussions (matiere_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_discussions_resolved ON public.forum_discussions (is_resolved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_discussions_author ON public.forum_discussions (author_id);
CREATE INDEX IF NOT EXISTS idx_forum_discussions_search ON public.forum_discussions USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_forum_discussions_titre_trgm ON public.forum_discussions USING GIN (titre gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_forum_reponses_discussion_date ON public.forum_reponses (discussion_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_forum_reponses_author ON public.forum_reponses (author_id);

CREATE INDEX IF NOT EXISTS idx_conversations_eleve_recent ON public.conversations (eleve_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_enseignant_recent ON public.conversations (enseignant_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_date ON public.messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages (conversation_id, is_read) WHERE is_read = false;

-- Abonnements & Modération
CREATE INDEX IF NOT EXISTS idx_abonnements_eleve_statut ON public.abonnements (eleve_id, statut);
CREATE INDEX IF NOT EXISTS idx_abonnements_statut_fin ON public.abonnements (statut, date_fin);
CREATE INDEX IF NOT EXISTS idx_signalements_statut_date ON public.signalements (statut, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signalements_target ON public.signalements (target_type, target_id);
