-- ============================================================================
-- Téranga S'cool — Migration 004 : Supabase Storage Buckets & Politiques RLS
-- ============================================================================
-- Convention de nommage des chemins dans les buckets privés :
--   avatars/          -> {user_id}/avatar.{ext}
--   cours-videos/     -> {matiere_slug}/{chapitre_slug}/{fichier}
--   bibliotheque-pdf/ -> {matiere_slug}/{document_slug}.pdf
--   notes-vocales/    -> {user_id}/{contexte}/{uuid}.webm
--   devoirs-eleves/   -> {eleve_id}/{exercice_id}/{fichier}
-- ============================================================================

-- 1. Création idempotente des buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    true,
    2097152, -- 2 Mo
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'cours-videos',
    'cours-videos',
    false,
    524288000, -- 500 Mo
    ARRAY['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'bibliotheque-pdf',
    'bibliotheque-pdf',
    false,
    26214400, -- 25 Mo
    ARRAY['application/pdf']
  ),
  (
    'notes-vocales',
    'notes-vocales',
    false,
    10485760, -- 10 Mo
    ARRAY['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/aac']
  ),
  (
    'devoirs-eleves',
    'devoirs-eleves',
    false,
    15728640, -- 15 Mo
    ARRAY[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  )
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 2. Politiques RLS sur storage.objects
-- ============================================================================

-- --- BUCKET : avatars (Public en lecture, propriétaire/admin en écriture) ---
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
CREATE POLICY "avatars_owner_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
CREATE POLICY "avatars_owner_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );

DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );

-- --- BUCKET : cours-videos (Privé : lecture authentifiée, écriture enseignant/admin) ---
DROP POLICY IF EXISTS "cours_videos_authenticated_read" ON storage.objects;
CREATE POLICY "cours_videos_authenticated_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cours-videos');

DROP POLICY IF EXISTS "cours_videos_staff_insert" ON storage.objects;
CREATE POLICY "cours_videos_staff_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cours-videos'
    AND (public.is_enseignant() OR public.is_admin())
  );

DROP POLICY IF EXISTS "cours_videos_staff_update" ON storage.objects;
CREATE POLICY "cours_videos_staff_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cours-videos'
    AND (public.is_enseignant() OR public.is_admin())
  );

DROP POLICY IF EXISTS "cours_videos_staff_delete" ON storage.objects;
CREATE POLICY "cours_videos_staff_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cours-videos'
    AND (public.is_enseignant() OR public.is_admin())
  );

-- --- BUCKET : bibliotheque-pdf (Privé : lecture authentifiée, écriture enseignant/admin) ---
DROP POLICY IF EXISTS "biblio_pdf_authenticated_read" ON storage.objects;
CREATE POLICY "biblio_pdf_authenticated_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'bibliotheque-pdf');

DROP POLICY IF EXISTS "biblio_pdf_staff_insert" ON storage.objects;
CREATE POLICY "biblio_pdf_staff_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'bibliotheque-pdf'
    AND (public.is_enseignant() OR public.is_admin())
  );

DROP POLICY IF EXISTS "biblio_pdf_staff_update" ON storage.objects;
CREATE POLICY "biblio_pdf_staff_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'bibliotheque-pdf'
    AND (public.is_enseignant() OR public.is_admin())
  );

DROP POLICY IF EXISTS "biblio_pdf_staff_delete" ON storage.objects;
CREATE POLICY "biblio_pdf_staff_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'bibliotheque-pdf'
    AND (public.is_enseignant() OR public.is_admin())
  );

-- --- BUCKET : notes-vocales (Privé : Audio-First forum, cours, messages, feedbacks) ---
DROP POLICY IF EXISTS "notes_vocales_authenticated_read" ON storage.objects;
CREATE POLICY "notes_vocales_authenticated_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'notes-vocales');

DROP POLICY IF EXISTS "notes_vocales_owner_insert" ON storage.objects;
CREATE POLICY "notes_vocales_owner_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'notes-vocales'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "notes_vocales_owner_delete" ON storage.objects;
CREATE POLICY "notes_vocales_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'notes-vocales'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );

-- --- BUCKET : devoirs-eleves (Privé strict : élève propriétaire, enseignants & admin) ---
DROP POLICY IF EXISTS "devoirs_eleves_owner_or_staff_read" ON storage.objects;
CREATE POLICY "devoirs_eleves_owner_or_staff_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'devoirs-eleves'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_enseignant()
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "devoirs_eleves_owner_insert" ON storage.objects;
CREATE POLICY "devoirs_eleves_owner_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'devoirs-eleves'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "devoirs_eleves_owner_update" ON storage.objects;
CREATE POLICY "devoirs_eleves_owner_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'devoirs-eleves'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );

DROP POLICY IF EXISTS "devoirs_eleves_owner_or_admin_delete" ON storage.objects;
CREATE POLICY "devoirs_eleves_owner_or_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'devoirs-eleves'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
  );
