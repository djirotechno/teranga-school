-- ============================================================================
-- Téranga S'cool — Migration 002 : Helpers RLS, Triggers & Fonctions RPC
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Fonctions Helper RLS (SECURITY DEFINER pour éviter toute récursion RLS)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.get_current_user_role() = 'admin'::public.user_role, false);
$$;

CREATE OR REPLACE FUNCTION public.is_enseignant()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.get_current_user_role() = 'enseignant'::public.user_role, false);
$$;

CREATE OR REPLACE FUNCTION public.is_eleve()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.get_current_user_role() = 'eleve'::public.user_role, false);
$$;

CREATE OR REPLACE FUNCTION public.teaches_matiere(p_matiere_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.enseignant_matieres em
    WHERE em.enseignant_id = auth.uid()
      AND em.matiere_id = p_matiere_id
  );
$$;

CREATE OR REPLACE FUNCTION public.teaches_chapitre(p_chapitre_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chapitres c
    JOIN public.enseignant_matieres em ON em.matiere_id = c.matiere_id
    WHERE c.id = p_chapitre_id
      AND em.enseignant_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND (c.eleve_id = auth.uid() OR c.enseignant_id = auth.uid())
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. Trigger générique updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'profiles',
    'matieres',
    'chapitres',
    'cours',
    'bibliotheque_documents',
    'progression_cours',
    'exercices',
    'soumissions_exercices',
    'cours_commentaires',
    'forum_discussions',
    'forum_reponses',
    'conversations',
    'abonnements',
    'signalements'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I;', tbl, tbl);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Trigger de création automatique du profil à l'inscription (auth.users)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_niveau    public.niveau_scolaire;
  v_serie     public.serie_scolaire;
BEGIN
  v_full_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    'Utilisateur Téranga'
  );

  -- Cast sécurisé du niveau scolaire (fallback Terminale)
  BEGIN
    v_niveau := COALESCE((NEW.raw_user_meta_data ->> 'niveau')::public.niveau_scolaire, 'Terminale');
  EXCEPTION WHEN invalid_text_representation THEN
    v_niveau := 'Terminale';
  END;

  -- Cast sécurisé de la série (fallback L)
  BEGIN
    v_serie := COALESCE((NEW.raw_user_meta_data ->> 'serie')::public.serie_scolaire, 'L');
  EXCEPTION WHEN invalid_text_representation THEN
    v_serie := 'L';
  END;

  -- Sécurité : le rôle attribué à l'inscription publique est TOUJOURS 'eleve'.
  -- La promotion en 'enseignant' ou 'admin' se fait uniquement via back-office admin / service_role.
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    email,
    phone,
    ville,
    etablissement,
    niveau,
    serie,
    statut
  )
  VALUES (
    NEW.id,
    'eleve'::public.user_role,
    v_full_name,
    NEW.email,
    COALESCE(NEW.phone, NULLIF(trim(NEW.raw_user_meta_data ->> 'phone'), '')),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'ville'), ''),
    NULLIF(trim(NEW.raw_user_meta_data ->> 'etablissement'), ''),
    v_niveau,
    v_serie,
    'actif'::public.account_status
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. Triggers métier & garde-fous anti-escalade de privilèges
-- ----------------------------------------------------------------------------

-- Empêche un non-admin de modifier son propre rôle ou statut de compte
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Seul un administrateur peut modifier le rôle d''un utilisateur.';
    END IF;
    IF NEW.statut IS DISTINCT FROM OLD.statut THEN
      RAISE EXCEPTION 'Seul un administrateur peut modifier le statut d''un compte.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_protect_sensitive ON public.profiles;
CREATE TRIGGER trg_profiles_protect_sensitive
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_columns();

-- Empêche un élève d'auto-noter ou de modifier la correction d'une soumission
CREATE OR REPLACE FUNCTION public.protect_soumission_grading_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND public.is_eleve() THEN
    IF NEW.note IS DISTINCT FROM OLD.note
       OR NEW.corrige_par IS DISTINCT FROM OLD.corrige_par
       OR NEW.corrige_at IS DISTINCT FROM OLD.corrige_at
       OR NEW.feedback_texte IS DISTINCT FROM OLD.feedback_texte
       OR NEW.feedback_audio_url IS DISTINCT FROM OLD.feedback_audio_url
       OR NEW.feedback_audio_duration IS DISTINCT FROM OLD.feedback_audio_duration
       OR NEW.statut = 'corrige'::public.soumission_status
    THEN
      RAISE EXCEPTION 'Un élève ne peut pas modifier les champs de correction ou la note.';
    END IF;

    IF NEW.statut = 'envoye'::public.soumission_status AND NEW.soumis_at IS NULL THEN
      NEW.soumis_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_soumissions_protect_grading ON public.soumissions_exercices;
CREATE TRIGGER trg_soumissions_protect_grading
  BEFORE UPDATE ON public.soumissions_exercices
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_soumission_grading_columns();

-- Maintient reponses_count et is_teacher_reply sur le forum
CREATE OR REPLACE FUNCTION public.handle_forum_reponse_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_author_role public.user_role;
BEGIN
  SELECT role INTO v_author_role FROM public.profiles WHERE id = NEW.author_id;
  NEW.is_teacher_reply := (v_author_role IN ('enseignant'::public.user_role, 'admin'::public.user_role));
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_forum_reponses_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_discussions
       SET reponses_count = reponses_count + 1
     WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_discussions
       SET reponses_count = GREATEST(reponses_count - 1, 0)
     WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_forum_reponses_before_insert ON public.forum_reponses;
CREATE TRIGGER trg_forum_reponses_before_insert
  BEFORE INSERT ON public.forum_reponses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_forum_reponse_insert();

DROP TRIGGER IF EXISTS trg_forum_reponses_sync_count ON public.forum_reponses;
CREATE TRIGGER trg_forum_reponses_sync_count
  AFTER INSERT OR DELETE ON public.forum_reponses
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_forum_reponses_count();

-- Met à jour last_message_at sur la conversation à chaque nouveau message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
     SET last_message_at = NEW.created_at
   WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_messages_update_conversation ON public.messages;
CREATE TRIGGER trg_messages_update_conversation
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();

-- ----------------------------------------------------------------------------
-- 5. Fonctions RPC sécurisées (compteurs & lecture messagerie)
-- ----------------------------------------------------------------------------

-- Incrémente le compteur de vues d'un cours sans ouvrir d'UPDATE aux élèves
CREATE OR REPLACE FUNCTION public.increment_cours_vues(p_cours_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.';
  END IF;

  UPDATE public.cours
     SET vues_count = vues_count + 1
   WHERE id = p_cours_id
     AND statut = 'publie'::public.publication_status
  RETURNING vues_count INTO v_new_count;

  IF v_new_count IS NULL THEN
    RAISE EXCEPTION 'Cours introuvable ou non publié.';
  END IF;

  RETURN v_new_count;
END;
$$;

-- Incrémente le compteur de téléchargements d'un document PDF
CREATE OR REPLACE FUNCTION public.increment_document_telechargements(p_document_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.';
  END IF;

  UPDATE public.bibliotheque_documents
     SET telechargements_count = telechargements_count + 1
   WHERE id = p_document_id
     AND statut = 'publie'::public.publication_status
  RETURNING telechargements_count INTO v_new_count;

  IF v_new_count IS NULL THEN
    RAISE EXCEPTION 'Document introuvable ou non publié.';
  END IF;

  RETURN v_new_count;
END;
$$;

-- Marque tous les messages reçus d'une conversation comme lus
CREATE OR REPLACE FUNCTION public.mark_conversation_as_read(p_conversation_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_conversation_participant(p_conversation_id) THEN
    RAISE EXCEPTION 'Accès non autorisé à cette conversation.';
  END IF;

  UPDATE public.messages
     SET is_read = true,
         read_at = now()
   WHERE conversation_id = p_conversation_id
     AND sender_id <> auth.uid()
     AND is_read = false;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$;

-- Droits d'exécution explicites pour les utilisateurs authentifiés
REVOKE ALL ON FUNCTION public.increment_cours_vues(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_cours_vues(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.increment_document_telechargements(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_document_telechargements(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.mark_conversation_as_read(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_conversation_as_read(UUID) TO authenticated;
