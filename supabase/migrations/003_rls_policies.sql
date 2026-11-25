-- ============================================================================
-- Téranga S'cool — Migration 003 : Row Level Security (RLS) sur 100% des tables
-- ============================================================================

-- Activation RLS sur l'ensemble des tables
ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matieres               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enseignant_matieres    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matiere_notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapitres              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cours                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bibliotheque_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progression_cours      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercices              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soumissions_exercices  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cours_commentaires     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_discussions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_reponses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abonnements            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signalements           ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. PROFILES
-- ============================================================================
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR public.is_admin()
    OR public.is_enseignant()
    -- Les élèves peuvent voir les profils enseignants (messagerie/cours) et auteurs actifs du forum
    OR (statut = 'actif'::public.account_status)
  );

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;
CREATE POLICY "profiles_delete_admin_only"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 2. MATIERES & ENSEIGNANT_MATIERES & MATIERE_NOTIFICATIONS
-- ============================================================================
DROP POLICY IF EXISTS "matieres_select_all" ON public.matieres;
CREATE POLICY "matieres_select_all"
  ON public.matieres FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "matieres_write_admin" ON public.matieres;
CREATE POLICY "matieres_write_admin"
  ON public.matieres FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "enseignant_matieres_select" ON public.enseignant_matieres;
CREATE POLICY "enseignant_matieres_select"
  ON public.enseignant_matieres FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "enseignant_matieres_write_admin" ON public.enseignant_matieres;
CREATE POLICY "enseignant_matieres_write_admin"
  ON public.enseignant_matieres FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "matiere_notifications_select_own_or_admin" ON public.matiere_notifications;
CREATE POLICY "matiere_notifications_select_own_or_admin"
  ON public.matiere_notifications FOR SELECT
  TO authenticated
  USING (eleve_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "matiere_notifications_insert_own" ON public.matiere_notifications;
CREATE POLICY "matiere_notifications_insert_own"
  ON public.matiere_notifications FOR INSERT
  TO authenticated
  WITH CHECK (eleve_id = auth.uid());

DROP POLICY IF EXISTS "matiere_notifications_delete_own_or_admin" ON public.matiere_notifications;
CREATE POLICY "matiere_notifications_delete_own_or_admin"
  ON public.matiere_notifications FOR DELETE
  TO authenticated
  USING (eleve_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 3. CHAPITRES
-- ============================================================================
DROP POLICY IF EXISTS "chapitres_select_authenticated" ON public.chapitres;
CREATE POLICY "chapitres_select_authenticated"
  ON public.chapitres FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "chapitres_write_teacher_or_admin" ON public.chapitres;
CREATE POLICY "chapitres_write_teacher_or_admin"
  ON public.chapitres FOR ALL
  TO authenticated
  USING (public.is_admin() OR (public.is_enseignant() AND public.teaches_matiere(matiere_id)))
  WITH CHECK (public.is_admin() OR (public.is_enseignant() AND public.teaches_matiere(matiere_id)));

-- ============================================================================
-- 4. COURS
-- ============================================================================
DROP POLICY IF EXISTS "cours_select_published_or_staff" ON public.cours;
CREATE POLICY "cours_select_published_or_staff"
  ON public.cours FOR SELECT
  TO authenticated
  USING (
    statut = 'publie'::public.publication_status
    OR public.is_admin()
    OR enseignant_id = auth.uid()
    OR (public.is_enseignant() AND public.teaches_chapitre(chapitre_id))
  );

DROP POLICY IF EXISTS "cours_insert_teacher_or_admin" ON public.cours;
CREATE POLICY "cours_insert_teacher_or_admin"
  ON public.cours FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_enseignant()
      AND enseignant_id = auth.uid()
      AND public.teaches_chapitre(chapitre_id)
    )
  );

DROP POLICY IF EXISTS "cours_update_teacher_or_admin" ON public.cours;
CREATE POLICY "cours_update_teacher_or_admin"
  ON public.cours FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR (public.is_enseignant() AND (enseignant_id = auth.uid() OR public.teaches_chapitre(chapitre_id)))
  )
  WITH CHECK (
    public.is_admin()
    OR (public.is_enseignant() AND public.teaches_chapitre(chapitre_id))
  );

DROP POLICY IF EXISTS "cours_delete_teacher_or_admin" ON public.cours;
CREATE POLICY "cours_delete_teacher_or_admin"
  ON public.cours FOR DELETE
  TO authenticated
  USING (public.is_admin() OR (public.is_enseignant() AND enseignant_id = auth.uid()));

-- ============================================================================
-- 5. BIBLIOTHEQUE_DOCUMENTS
-- ============================================================================
DROP POLICY IF EXISTS "biblio_select_published_or_staff" ON public.bibliotheque_documents;
CREATE POLICY "biblio_select_published_or_staff"
  ON public.bibliotheque_documents FOR SELECT
  TO authenticated
  USING (
    statut = 'publie'::public.publication_status
    OR public.is_admin()
    OR enseignant_id = auth.uid()
    OR (public.is_enseignant() AND public.teaches_matiere(matiere_id))
  );

DROP POLICY IF EXISTS "biblio_insert_teacher_or_admin" ON public.bibliotheque_documents;
CREATE POLICY "biblio_insert_teacher_or_admin"
  ON public.bibliotheque_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_enseignant()
      AND enseignant_id = auth.uid()
      AND public.teaches_matiere(matiere_id)
    )
  );

DROP POLICY IF EXISTS "biblio_update_teacher_or_admin" ON public.bibliotheque_documents;
CREATE POLICY "biblio_update_teacher_or_admin"
  ON public.bibliotheque_documents FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR (public.is_enseignant() AND (enseignant_id = auth.uid() OR public.teaches_matiere(matiere_id)))
  )
  WITH CHECK (
    public.is_admin()
    OR (public.is_enseignant() AND public.teaches_matiere(matiere_id))
  );

DROP POLICY IF EXISTS "biblio_delete_teacher_or_admin" ON public.bibliotheque_documents;
CREATE POLICY "biblio_delete_teacher_or_admin"
  ON public.bibliotheque_documents FOR DELETE
  TO authenticated
  USING (public.is_admin() OR (public.is_enseignant() AND enseignant_id = auth.uid()));

-- ============================================================================
-- 6. PROGRESSION_COURS
-- ============================================================================
DROP POLICY IF EXISTS "progression_select_own_or_staff" ON public.progression_cours;
CREATE POLICY "progression_select_own_or_staff"
  ON public.progression_cours FOR SELECT
  TO authenticated
  USING (
    eleve_id = auth.uid()
    OR public.is_admin()
    OR public.is_enseignant()
  );

DROP POLICY IF EXISTS "progression_insert_own" ON public.progression_cours;
CREATE POLICY "progression_insert_own"
  ON public.progression_cours FOR INSERT
  TO authenticated
  WITH CHECK (eleve_id = auth.uid());

DROP POLICY IF EXISTS "progression_update_own" ON public.progression_cours;
CREATE POLICY "progression_update_own"
  ON public.progression_cours FOR UPDATE
  TO authenticated
  USING (eleve_id = auth.uid())
  WITH CHECK (eleve_id = auth.uid());

DROP POLICY IF EXISTS "progression_delete_own_or_admin" ON public.progression_cours;
CREATE POLICY "progression_delete_own_or_admin"
  ON public.progression_cours FOR DELETE
  TO authenticated
  USING (eleve_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 7. EXERCICES & SOUMISSIONS_EXERCICES
-- ============================================================================
DROP POLICY IF EXISTS "exercices_select_published_or_staff" ON public.exercices;
CREATE POLICY "exercices_select_published_or_staff"
  ON public.exercices FOR SELECT
  TO authenticated
  USING (
    statut = 'publie'::public.publication_status
    OR public.is_admin()
    OR enseignant_id = auth.uid()
    OR (public.is_enseignant() AND public.teaches_matiere(matiere_id))
  );

DROP POLICY IF EXISTS "exercices_write_teacher_or_admin" ON public.exercices;
CREATE POLICY "exercices_write_teacher_or_admin"
  ON public.exercices FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR (public.is_enseignant() AND (enseignant_id = auth.uid() OR public.teaches_matiere(matiere_id)))
  )
  WITH CHECK (
    public.is_admin()
    OR (public.is_enseignant() AND public.teaches_matiere(matiere_id))
  );

-- Soumissions : l'élève voit/dépose les siennes ; l'enseignant corrige celles de ses matières
DROP POLICY IF EXISTS "soumissions_select_own_teacher_or_admin" ON public.soumissions_exercices;
CREATE POLICY "soumissions_select_own_teacher_or_admin"
  ON public.soumissions_exercices FOR SELECT
  TO authenticated
  USING (
    eleve_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_enseignant()
      AND EXISTS (
        SELECT 1 FROM public.exercices e
        WHERE e.id = soumissions_exercices.exercice_id
          AND (e.enseignant_id = auth.uid() OR public.teaches_matiere(e.matiere_id))
      )
    )
  );

DROP POLICY IF EXISTS "soumissions_insert_own_eleve" ON public.soumissions_exercices;
CREATE POLICY "soumissions_insert_own_eleve"
  ON public.soumissions_exercices FOR INSERT
  TO authenticated
  WITH CHECK (
    eleve_id = auth.uid()
    AND note IS NULL
    AND statut IN ('a_faire'::public.soumission_status, 'envoye'::public.soumission_status)
  );

DROP POLICY IF EXISTS "soumissions_update_eleve_or_teacher_or_admin" ON public.soumissions_exercices;
CREATE POLICY "soumissions_update_eleve_or_teacher_or_admin"
  ON public.soumissions_exercices FOR UPDATE
  TO authenticated
  USING (
    eleve_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_enseignant()
      AND EXISTS (
        SELECT 1 FROM public.exercices e
        WHERE e.id = soumissions_exercices.exercice_id
          AND (e.enseignant_id = auth.uid() OR public.teaches_matiere(e.matiere_id))
      )
    )
  )
  WITH CHECK (
    eleve_id = auth.uid()
    OR public.is_admin()
    OR (
      public.is_enseignant()
      AND EXISTS (
        SELECT 1 FROM public.exercices e
        WHERE e.id = soumissions_exercices.exercice_id
          AND (e.enseignant_id = auth.uid() OR public.teaches_matiere(e.matiere_id))
      )
    )
  );

DROP POLICY IF EXISTS "soumissions_delete_admin_only" ON public.soumissions_exercices;
CREATE POLICY "soumissions_delete_admin_only"
  ON public.soumissions_exercices FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 8. COURS_COMMENTAIRES
-- ============================================================================
DROP POLICY IF EXISTS "cours_commentaires_select_authenticated" ON public.cours_commentaires;
CREATE POLICY "cours_commentaires_select_authenticated"
  ON public.cours_commentaires FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "cours_commentaires_insert_own" ON public.cours_commentaires;
CREATE POLICY "cours_commentaires_insert_own"
  ON public.cours_commentaires FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "cours_commentaires_update_own_or_admin" ON public.cours_commentaires;
CREATE POLICY "cours_commentaires_update_own_or_admin"
  ON public.cours_commentaires FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin())
  WITH CHECK (author_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "cours_commentaires_delete_own_or_admin" ON public.cours_commentaires;
CREATE POLICY "cours_commentaires_delete_own_or_admin"
  ON public.cours_commentaires FOR DELETE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 9. FORUM_DISCUSSIONS & FORUM_REPONSES
-- ============================================================================
DROP POLICY IF EXISTS "forum_discussions_select_authenticated" ON public.forum_discussions;
CREATE POLICY "forum_discussions_select_authenticated"
  ON public.forum_discussions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "forum_discussions_insert_own" ON public.forum_discussions;
CREATE POLICY "forum_discussions_insert_own"
  ON public.forum_discussions FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "forum_discussions_update_author_teacher_admin" ON public.forum_discussions;
CREATE POLICY "forum_discussions_update_author_teacher_admin"
  ON public.forum_discussions FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_enseignant() OR public.is_admin())
  WITH CHECK (author_id = auth.uid() OR public.is_enseignant() OR public.is_admin());

DROP POLICY IF EXISTS "forum_discussions_delete_author_or_admin" ON public.forum_discussions;
CREATE POLICY "forum_discussions_delete_author_or_admin"
  ON public.forum_discussions FOR DELETE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "forum_reponses_select_authenticated" ON public.forum_reponses;
CREATE POLICY "forum_reponses_select_authenticated"
  ON public.forum_reponses FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "forum_reponses_insert_own" ON public.forum_reponses;
CREATE POLICY "forum_reponses_insert_own"
  ON public.forum_reponses FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "forum_reponses_update_author_teacher_admin" ON public.forum_reponses;
CREATE POLICY "forum_reponses_update_author_teacher_admin"
  ON public.forum_reponses FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_enseignant() OR public.is_admin())
  WITH CHECK (author_id = auth.uid() OR public.is_enseignant() OR public.is_admin());

DROP POLICY IF EXISTS "forum_reponses_delete_author_or_admin" ON public.forum_reponses;
CREATE POLICY "forum_reponses_delete_author_or_admin"
  ON public.forum_reponses FOR DELETE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 10. CONVERSATIONS & MESSAGES (Privé strict : participants uniquement)
-- ============================================================================
DROP POLICY IF EXISTS "conversations_select_participants" ON public.conversations;
CREATE POLICY "conversations_select_participants"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (eleve_id = auth.uid() OR enseignant_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "conversations_insert_participants" ON public.conversations;
CREATE POLICY "conversations_insert_participants"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (eleve_id = auth.uid() OR enseignant_id = auth.uid());

DROP POLICY IF EXISTS "conversations_delete_admin" ON public.conversations;
CREATE POLICY "conversations_delete_admin"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "messages_select_participants" ON public.messages;
CREATE POLICY "messages_select_participants"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.is_conversation_participant(conversation_id) OR public.is_admin());

DROP POLICY IF EXISTS "messages_insert_participants" ON public.messages;
CREATE POLICY "messages_insert_participants"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND public.is_conversation_participant(conversation_id)
  );

DROP POLICY IF EXISTS "messages_delete_sender_or_admin" ON public.messages;
CREATE POLICY "messages_delete_sender_or_admin"
  ON public.messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 11. ABONNEMENTS (PayTech)
-- ============================================================================
DROP POLICY IF EXISTS "abonnements_select_own_or_admin" ON public.abonnements;
CREATE POLICY "abonnements_select_own_or_admin"
  ON public.abonnements FOR SELECT
  TO authenticated
  USING (eleve_id = auth.uid() OR public.is_admin());

-- Un élève peut initier une demande d'abonnement (en_attente uniquement, jamais actif directement)
DROP POLICY IF EXISTS "abonnements_insert_own_pending" ON public.abonnements;
CREATE POLICY "abonnements_insert_own_pending"
  ON public.abonnements FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      eleve_id = auth.uid()
      AND statut = 'en_attente'::public.abonnement_status
      AND validated_by IS NULL
    )
  );

-- Seul un admin (ou le webhook PayTech via service_role) peut valider/modifier un abonnement
DROP POLICY IF EXISTS "abonnements_update_admin_only" ON public.abonnements;
CREATE POLICY "abonnements_update_admin_only"
  ON public.abonnements FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "abonnements_delete_admin_only" ON public.abonnements;
CREATE POLICY "abonnements_delete_admin_only"
  ON public.abonnements FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 12. SIGNALEMENTS (Modération)
-- ============================================================================
DROP POLICY IF EXISTS "signalements_select_reporter_or_admin" ON public.signalements;
CREATE POLICY "signalements_select_reporter_or_admin"
  ON public.signalements FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "signalements_insert_authenticated" ON public.signalements;
CREATE POLICY "signalements_insert_authenticated"
  ON public.signalements FOR INSERT
  TO authenticated
  WITH CHECK (
    reporter_id = auth.uid()
    AND statut = 'en_attente'::public.signalement_status
  );

DROP POLICY IF EXISTS "signalements_update_admin_only" ON public.signalements;
CREATE POLICY "signalements_update_admin_only"
  ON public.signalements FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "signalements_delete_admin_only" ON public.signalements;
CREATE POLICY "signalements_delete_admin_only"
  ON public.signalements FOR DELETE
  TO authenticated
  USING (public.is_admin());
