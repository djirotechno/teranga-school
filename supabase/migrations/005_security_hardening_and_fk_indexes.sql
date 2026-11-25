-- ============================================================================
-- Téranga S'cool — Migration 005 : Durcissement EXECUTE (SECURITY DEFINER) & Index FK
-- ============================================================================

-- 1. Révoquer EXECUTE pour PUBLIC et anon sur les fonctions SECURITY DEFINER
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_sensitive_columns() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_soumission_grading_columns() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_forum_reponse_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_forum_reponses_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_conversation_last_message() FROM PUBLIC, anon, authenticated;

-- Helpers RLS : uniquement accessibles aux utilisateurs authentifiés (jamais anon)
REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.is_enseignant() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_enseignant() TO authenticated;

REVOKE ALL ON FUNCTION public.is_eleve() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_eleve() TO authenticated;

REVOKE ALL ON FUNCTION public.teaches_matiere(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teaches_matiere(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.teaches_chapitre(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teaches_chapitre(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.is_conversation_participant(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_conversation_participant(UUID) TO authenticated;

-- RPC métier : révoquer explicitement anon (authenticated déjà accordé)
REVOKE ALL ON FUNCTION public.increment_cours_vues(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_cours_vues(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.increment_document_telechargements(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_document_telechargements(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.mark_conversation_as_read(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_conversation_as_read(UUID) TO authenticated;

-- 2. Index couvrants sur les 9 clés étrangères signalées par le Performance Advisor
CREATE INDEX IF NOT EXISTS idx_abonnements_validated_by ON public.abonnements (validated_by);
CREATE INDEX IF NOT EXISTS idx_biblio_enseignant ON public.bibliotheque_documents (enseignant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_matiere ON public.conversations (matiere_id);
CREATE INDEX IF NOT EXISTS idx_exercices_chapitre ON public.exercices (chapitre_id);
CREATE INDEX IF NOT EXISTS idx_forum_discussions_chapitre ON public.forum_discussions (chapitre_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_signalements_reporter ON public.signalements (reporter_id);
CREATE INDEX IF NOT EXISTS idx_signalements_treated_by ON public.signalements (treated_by);
CREATE INDEX IF NOT EXISTS idx_soumissions_corrige_par ON public.soumissions_exercices (corrige_par);
