-- ============================================================================
-- Téranga S'cool — Jeu de données de test (supabase/seed.sql)
-- Contexte : Sénégal — Terminale L & S (Dakar, Thiès, Guédiawaye)
-- Mot de passe commun en développement local : Teranga2026!
-- ============================================================================

DO $$
DECLARE
  -- Identifiants utilisateurs déterministes
  v_awa_id       UUID := '11111111-1111-4111-8111-111111111101'; -- Élève (Terminale L)
  v_moussa_id    UUID := '11111111-1111-4111-8111-111111111102'; -- Élève (Terminale S)
  v_fatou_id     UUID := '11111111-1111-4111-8111-111111111103'; -- Élève (Terminale L)
  v_prof_fr_id   UUID := '22222222-2222-4222-8222-222222222201'; -- M. Ibrahima Diop (Français)
  v_prof_ph_id   UUID := '22222222-2222-4222-8222-222222222202'; -- Mme Fatou Sarr (Philosophie)
  v_prof_hg_id   UUID := '22222222-2222-4222-8222-222222222203'; -- M. Cheikh Cissé (Histoire-Géo)
  v_admin_id     UUID := '33333333-3333-4333-8333-333333333301'; -- Admin Téranga

  -- Matières
  v_mat_fr       UUID := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01';
  v_mat_hg       UUID := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02';
  v_mat_ph       UUID := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa03';
  v_mat_math     UUID := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa04';
  v_mat_pc       UUID := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa05';
  v_mat_svt      UUID := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa06';

  -- Chapitres
  v_chap_arg     UUID := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb01';
  v_chap_diss    UUID := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02';
  v_chap_gf      UUID := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb03';
  v_chap_cons    UUID := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb04';

  -- Cours
  v_cours_arg1   UUID := 'cccccccc-cccc-4ccc-8ccc-cccccccccc01';
  v_cours_arg2   UUID := 'cccccccc-cccc-4ccc-8ccc-cccccccccc02';
  v_cours_gf1    UUID := 'cccccccc-cccc-4ccc-8ccc-cccccccccc03';
  v_cours_cons1  UUID := 'cccccccc-cccc-4ccc-8ccc-cccccccccc04';

  -- Exercices
  v_exo_1        UUID := 'dddddddd-dddd-4ddd-8ddd-dddddddddd01';
  v_exo_2        UUID := 'dddddddd-dddd-4ddd-8ddd-dddddddddd02';

  -- Forum & Conversations
  v_disc_1       UUID := 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeee01';
  v_disc_2       UUID := 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeee02';
  v_conv_1       UUID := 'ffffffff-ffff-4fff-8fff-ffffffffff01';

  v_pw_hash      TEXT := crypt('Teranga2026!', gen_salt('bf'));
BEGIN
  -- --------------------------------------------------------------------------
  -- 1. Utilisateurs auth.users (le trigger handle_new_user crée les profils)
  -- --------------------------------------------------------------------------
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, phone, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  )
  VALUES
    (
      v_awa_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'awa.diop@terangascool.sn', v_pw_hash, now(), '+221771234501',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Awa Diop","ville":"Dakar","etablissement":"Lycée Lamine Guèye","niveau":"Terminale","serie":"L"}'::jsonb,
      now(), now()
    ),
    (
      v_moussa_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'moussa.sall@terangascool.sn', v_pw_hash, now(), '+221771234502',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Moussa Sall","ville":"Guédiawaye","etablissement":"Lycée Seydina Limamou Laye","niveau":"Terminale","serie":"S"}'::jsonb,
      now(), now()
    ),
    (
      v_fatou_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'fatou.ndiaye@terangascool.sn', v_pw_hash, now(), '+221781234503',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Fatou Ndiaye","ville":"Thiès","etablissement":"Lycée Malick Sy","niveau":"Terminale","serie":"L"}'::jsonb,
      now(), now()
    ),
    (
      v_prof_fr_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'ibrahima.diop@terangascool.sn', v_pw_hash, now(), '+221776001001',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"M. Ibrahima Diop","ville":"Dakar","etablissement":"Lycée Blaise Diagne","niveau":"Autre","serie":"Autre"}'::jsonb,
      now(), now()
    ),
    (
      v_prof_ph_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'fatou.sarr@terangascool.sn', v_pw_hash, now(), '+221776001002',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Mme Fatou Sarr","ville":"Dakar","etablissement":"Lycée John F. Kennedy","niveau":"Autre","serie":"Autre"}'::jsonb,
      now(), now()
    ),
    (
      v_prof_hg_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'cheikh.cisse@terangascool.sn', v_pw_hash, now(), '+221776001003',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"M. Cheikh Cissé","ville":"Saint-Louis","etablissement":"Lycée Charles de Gaulle","niveau":"Autre","serie":"Autre"}'::jsonb,
      now(), now()
    ),
    (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@terangascool.sn', v_pw_hash, now(), '+221770000001',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Aminata Fall (Admin)","ville":"Dakar","niveau":"Autre","serie":"Autre"}'::jsonb,
      now(), now()
    )
  ON CONFLICT (id) DO NOTHING;

  -- Attribution des rôles enseignants/admin et préférences Wolof pour Awa Diop
  UPDATE public.profiles
     SET preferences = '{"wolof_support": true, "notif_forum": true, "notif_cours": true, "notif_rappels": true}'::jsonb
   WHERE id = v_awa_id;

  UPDATE public.profiles SET role = 'enseignant'::public.user_role WHERE id IN (v_prof_fr_id, v_prof_ph_id, v_prof_hg_id);
  UPDATE public.profiles SET role = 'admin'::public.user_role WHERE id = v_admin_id;

  -- --------------------------------------------------------------------------
  -- 2. Matières (couleurs alignées avec le Design System Téranga S'cool)
  -- --------------------------------------------------------------------------
  INSERT INTO public.matieres (id, nom, slug, description, niveau_cible, couleur_bg, couleur_text, couleur_border, statut, ordre)
  VALUES
    (v_mat_fr,   'Français',            'francais',           'Littérature, dissertation, grammaire, méthodologie et argumentation.',                        'Terminale L & S', '#FBECE2', '#C85A2B', '#F4DACB', 'disponible',         1),
    (v_mat_hg,   'Histoire-Géographie', 'histoire-geo',       'Le Sénégal contemporain, la décolonisation et les mutations géopolitiques mondiales.',        'Terminale L & S', '#EBF4EE', '#236B48', '#D9EADB', 'disponible',         2),
    (v_mat_ph,   'Philosophie',         'philosophie',        'Épistémologie, métaphysique, morale, esthétique et philosophie politique.',                   'Terminale L & S', '#F0EDFA', '#6644B8', '#E2DCF4', 'disponible',         3),
    (v_mat_math, 'Mathématiques',       'mathematiques',      'Algèbre, analyse, suites numériques, fonctions exponentielles et probabilités.',              'Terminale S & L', '#E6F0FA', '#1D63B8', '#D0E2F7', 'bientot_disponible', 4),
    (v_mat_pc,   'Sciences Physiques',  'sciences-physiques', 'Cinématique, dynamique, électromagnétisme, chimie organique et solutions.',                   'Terminale S',     '#FEF3E2', '#B86B1D', '#F7E5C8', 'bientot_disponible', 5),
    (v_mat_svt,  'SVT',                 'svt',                'Génétique, immunologie, physiologie nerveuse et géologie du Sénégal.',                        'Terminale S',     '#E9F5EC', '#1E7A46', '#CFEAD6', 'bientot_disponible', 6)
  ON CONFLICT (slug) DO NOTHING;

  -- Affectation enseignants <-> matières
  INSERT INTO public.enseignant_matieres (enseignant_id, matiere_id)
  VALUES
    (v_prof_fr_id, v_mat_fr),
    (v_prof_ph_id, v_mat_ph),
    (v_prof_hg_id, v_mat_hg)
  ON CONFLICT DO NOTHING;

  -- Inscriptions aux alertes "Bientôt disponible"
  INSERT INTO public.matiere_notifications (eleve_id, matiere_id)
  VALUES
    (v_awa_id, v_mat_math),
    (v_moussa_id, v_mat_math),
    (v_moussa_id, v_mat_svt)
  ON CONFLICT DO NOTHING;

  -- --------------------------------------------------------------------------
  -- 3. Chapitres & Cours
  -- --------------------------------------------------------------------------
  INSERT INTO public.chapitres (id, matiere_id, numero, titre, slug, objectif, niveau, serie, ordre)
  VALUES
    (v_chap_arg,  v_mat_fr, 'Chapitre 01', 'L''argumentation',                             'argumentation', 'Construire un raisonnement convaincant.',                  'Terminale', 'L', 1),
    (v_chap_diss, v_mat_fr, 'Chapitre 02', 'La dissertation littéraire',                   'dissertation',  'Maîtriser la problématisation et le plan.',                'Terminale', 'L', 2),
    (v_chap_gf,   v_mat_hg, 'Chapitre 01', 'Les relations internationales depuis 1945',    'guerre-froide', 'Comprendre l''ordre bipolaire et les grandes crises.',     'Terminale', 'L', 1),
    (v_chap_cons, v_mat_ph, 'Chapitre 01', 'La conscience et l''inconscient',              'conscience',    'Interroger la nature du sujet pensant.',                   'Terminale', 'L', 1)
  ON CONFLICT (matiere_id, slug) DO NOTHING;

  INSERT INTO public.cours (id, chapitre_id, enseignant_id, titre, description, type, media_url, thumbnail_url, duree_secondes, vues_count, ordre, statut)
  VALUES
    (v_cours_arg1,  v_chap_arg,  v_prof_fr_id, 'L''argumentation : méthodes et exemples',                'Piliers de la rhétorique : thèse, arguments et exemples pertinents pour le Bac.', 'video', 'cours-videos/francais/argumentation/lecon-01.mp4', '/images/course-thumbnail.png', 1104, 142, 1, 'publie'),
    (v_cours_arg2,  v_chap_arg,  v_prof_fr_id, 'Les types d''arguments',                                 'Argument d''autorité, analogie, logique et ad hominem.',                          'video', 'cours-videos/francais/argumentation/lecon-02.mp4', '/images/course-thumbnail.png',  720,  98, 2, 'publie'),
    (v_cours_gf1,   v_chap_gf,   v_prof_hg_id, 'La Guerre froide : blocs, idéologies et crises majeures','De la doctrine Truman à la crise des missiles de Cuba.',                          'video', 'cours-videos/histoire-geo/guerre-froide/lecon-01.mp4', '/images/course-thumbnail.png', 1450, 115, 1, 'publie'),
    (v_cours_cons1, v_chap_cons, v_prof_ph_id, 'Descartes et le Cogito : la conscience de soi',          'Du doute méthodique à la première certitude fondamentale du sujet.',              'video', 'cours-videos/philosophie/conscience/lecon-01.mp4', '/images/course-thumbnail.png', 1270,  89, 1, 'publie')
  ON CONFLICT (id) DO NOTHING;

  -- Progression d'Awa Diop (68% sur L'argumentation -> carte "Reprendre mon cours")
  INSERT INTO public.progression_cours (eleve_id, cours_id, pourcentage, derniere_position_secondes, temps_passe_secondes, last_accessed_at)
  VALUES
    (v_awa_id, v_cours_arg1,  68, 750, 1620, now() - interval '30 minutes'),
    (v_awa_id, v_cours_gf1,   45, 652,  980, now() - interval '1 day'),
    (v_awa_id, v_cours_cons1, 50, 635,  840, now() - interval '2 days')
  ON CONFLICT (eleve_id, cours_id) DO NOTHING;

  -- --------------------------------------------------------------------------
  -- 4. Bibliothèque PDF
  -- --------------------------------------------------------------------------
  INSERT INTO public.bibliotheque_documents (matiere_id, chapitre_id, enseignant_id, titre, slug, description, categorie, fichier_url, taille_octets, nombre_pages, telechargements_count, statut)
  VALUES
    (v_mat_fr, v_chap_arg,  v_prof_fr_id, 'L''argumentation — fiche de synthèse', 'argumentation-fiche-de-synthese', 'Méthodologie complète pour identifier les types d''arguments et connecteurs logiques.', 'fiche',     'bibliotheque-pdf/francais/argumentation-fiche-de-synthese.pdf', 1258291,  6, 84, 'publie'),
    (v_mat_fr, v_chap_diss, v_prof_fr_id, 'La dissertation — méthode',            'dissertation-methode',            'Guide complet pour analyser le sujet, problématiser et bâtir un plan au Bac.',           'fascicule', 'bibliotheque-pdf/francais/dissertation-methode.pdf',            2516582, 12, 67, 'publie'),
    (v_mat_hg, v_chap_gf,   v_prof_hg_id, 'Le système-monde — fascicule',         'systeme-monde-fascicule',         'Organisation géopolitique et géoéconomique de la mondialisation.',                       'fascicule', 'bibliotheque-pdf/histoire-geo/systeme-monde-fascicule.pdf',     3250585, 18, 53, 'publie'),
    (v_mat_ph, v_chap_cons, v_prof_ph_id, 'L''opinion et la raison — cours',      'opinion-et-raison-cours',         'Distinction doxa / épistémè, doute cartésien et usage critique de la raison.',           'pdf',       'bibliotheque-pdf/philosophie/opinion-et-raison-cours.pdf',       870400,  8, 49, 'publie')
  ON CONFLICT (slug) DO NOTHING;

  -- --------------------------------------------------------------------------
  -- 5. Exercices & Soumissions
  -- --------------------------------------------------------------------------
  INSERT INTO public.exercices (id, matiere_id, chapitre_id, enseignant_id, titre, consignes, type, difficulte, date_limite, statut)
  VALUES
    (v_exo_1, v_mat_fr, v_chap_arg,  v_prof_fr_id, 'Construire un paragraphe argumentatif type Bac', 'Rédigez un paragraphe argumenté (15-20 lignes) défendant le rôle social de la littérature engagée en Afrique de l''Ouest, illustré par Mariama Bâ ou Sembène Ousmane.', 'dissertation', 'moyen',    now() + interval '5 days', 'publie'),
    (v_exo_2, v_mat_ph, v_chap_cons, v_prof_ph_id, 'Explication de texte : Descartes, Méditations',  'Dégagez la thèse, la structure logique et l''enjeu philosophique de l''extrait proposé sur le doute hyperbolique.',                                                      'devoir',       'difficile', now() + interval '7 days', 'publie')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.soumissions_exercices (exercice_id, eleve_id, corrige_par, fichier_rendu_url, commentaire_eleve, statut, note, feedback_texte, feedback_audio_url, feedback_audio_duration, soumis_at, corrige_at)
  VALUES
    (
      v_exo_1, v_awa_id, v_prof_fr_id,
      'devoirs-eleves/11111111-1111-4111-8111-111111111101/dddddddd-dddd-4ddd-8ddd-dddddddddd01/copie-awa.pdf',
      'Bonjour Monsieur, voici mon paragraphe sur Une si longue lettre.',
      'corrige', 16.50,
      'Très bon travail Awa ! La transition entre l''argument et l''exemple de Ramatoulaye est fluide. Pense à renforcer ta phrase de bilan.',
      'notes-vocales/22222222-2222-4222-8222-222222222201/feedbacks/awa-exo1.webm', 48,
      now() - interval '2 days', now() - interval '1 day'
    ),
    (
      v_exo_2, v_awa_id, NULL,
      'devoirs-eleves/11111111-1111-4111-8111-111111111101/dddddddd-dddd-4ddd-8ddd-dddddddddd02/descartes-awa.pdf',
      'J''ai eu un petit doute sur la deuxième partie du texte.',
      'envoye', NULL, NULL, NULL, NULL,
      now() - interval '3 hours', NULL
    )
  ON CONFLICT (exercice_id, eleve_id) DO NOTHING;

  -- --------------------------------------------------------------------------
  -- 6. Communication Audio-First : Commentaires, Forum & Messagerie
  -- --------------------------------------------------------------------------
  INSERT INTO public.cours_commentaires (cours_id, author_id, contenu, audio_url, audio_duration)
  VALUES
    (v_cours_arg1, v_awa_id, 'Merci pour les exemples tirés d''auteurs sénégalais, c''est beaucoup plus clair !', NULL, NULL),
    (v_cours_arg1, v_fatou_id, 'Est-ce qu''on peut utiliser des exemples d''actualité au Bac ?', 'notes-vocales/11111111-1111-4111-8111-111111111103/commentaires/q1.webm', 42);

  INSERT INTO public.forum_discussions (id, matiere_id, chapitre_id, author_id, titre, contenu, audio_url, audio_duration, is_resolved)
  VALUES
    (
      v_disc_1, v_mat_fr, v_chap_arg, v_moussa_id,
      'Question sur la méthodologie du commentaire de texte en Français',
      'Bonjour à tous, j''ai souvent du mal à relier les figures de style au sens profond du texte lors du commentaire composé. Faut-il faire une liste ou les analyser dans un paragraphe argumenté ?',
      NULL, NULL, true
    ),
    (
      v_disc_2, v_mat_ph, v_chap_cons, v_fatou_id,
      'Différence entre conscience et inconscient chez Freud',
      'Pourquoi Freud affirme-t-il que le Moi n''est pas maître dans sa propre maison ? Est-ce que cela supprime notre liberté morale ?',
      'notes-vocales/11111111-1111-4111-8111-111111111103/forum/freud-q.webm', 35, false
    )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.forum_reponses (discussion_id, author_id, contenu, audio_url, audio_duration, is_validated)
  VALUES
    (
      v_disc_1, v_prof_fr_id,
      'Excellente question Moussa ! Ne fais jamais de simple catalogue. La règle d''or : Citer -> Nommer -> Analyser l''effet -> Relier à ton axe.',
      'notes-vocales/22222222-2222-4222-8222-222222222201/forum/rep-commentaire.webm', 42, true
    ),
    (
      v_disc_1, v_awa_id,
      'Merci M. Diop ! La formule Procédé -> Sens -> Effet m''aide beaucoup.',
      NULL, NULL, false
    ),
    (
      v_disc_2, v_prof_ph_id,
      'Bonjour Fatou. Écoute cette note vocale où je précise la nuance entre Freud et Sartre (avec un petit résumé en wolof à la fin).',
      'notes-vocales/22222222-2222-4222-8222-222222222202/forum/rep-freud.webm', 55, true
    );

  INSERT INTO public.conversations (id, eleve_id, enseignant_id, matiere_id)
  VALUES (v_conv_1, v_awa_id, v_prof_fr_id, v_mat_fr)
  ON CONFLICT (eleve_id, enseignant_id) DO NOTHING;

  INSERT INTO public.messages (conversation_id, sender_id, contenu, audio_url, audio_duration, attachment_url, attachment_name, attachment_size_bytes, is_read, read_at)
  VALUES
    (v_conv_1, v_awa_id, 'Bonjour Monsieur, pouvez-vous corriger mon introduction ?', NULL, NULL, NULL, NULL, NULL, true, now() - interval '1 hour'),
    (v_conv_1, v_prof_fr_id, 'Bien sûr Awa. Voici ton retour vocal et une fiche pour t''aider.', 'notes-vocales/22222222-2222-4222-8222-222222222201/messages/retour-intro.webm', 54, 'bibliotheque-pdf/francais/argumentation-fiche-de-synthese.pdf', 'Correction — introduction.pdf', 430080, false, NULL);

  -- --------------------------------------------------------------------------
  -- 7. Abonnements (Wave / Orange Money en XOF) & Modération
  -- --------------------------------------------------------------------------
  INSERT INTO public.abonnements (eleve_id, plan_nom, statut, date_debut, date_fin, montant_xof, methode_paiement, paytech_ref, validated_by, validated_at)
  VALUES
    (v_awa_id,    'Pack Terminale Annuel',  'actif',      now() - interval '20 days', now() + interval '250 days', 15000, 'wave',         'PT-SN-2026-0001', v_admin_id, now() - interval '20 days'),
    (v_moussa_id, 'Pack Terminale Mensuel', 'en_attente', NULL,                       NULL,                         2500, 'orange_money', 'PT-SN-2026-0002', NULL,       NULL)
  ON CONFLICT (paytech_ref) DO NOTHING;

  INSERT INTO public.signalements (target_type, target_id, reporter_id, motif, extrait, statut)
  VALUES
    ('forum_discussion', v_disc_2, v_moussa_id, 'Doublon avec une discussion existante', 'Différence entre conscience et inconscient chez Freud', 'en_attente');

END $$;
