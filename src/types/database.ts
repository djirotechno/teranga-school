export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      abonnements: {
        Row: {
          created_at: string
          date_debut: string | null
          date_fin: string | null
          eleve_id: string
          id: string
          methode_paiement: Database["public"]["Enums"]["paiement_methode"]
          montant_xof: number
          paytech_ref: string | null
          paytech_token: string | null
          plan_nom: string
          statut: Database["public"]["Enums"]["abonnement_status"]
          updated_at: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          eleve_id: string
          id?: string
          methode_paiement: Database["public"]["Enums"]["paiement_methode"]
          montant_xof: number
          paytech_ref?: string | null
          paytech_token?: string | null
          plan_nom?: string
          statut?: Database["public"]["Enums"]["abonnement_status"]
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          eleve_id?: string
          id?: string
          methode_paiement?: Database["public"]["Enums"]["paiement_methode"]
          montant_xof?: number
          paytech_ref?: string | null
          paytech_token?: string | null
          plan_nom?: string
          statut?: Database["public"]["Enums"]["abonnement_status"]
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abonnements_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abonnements_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bibliotheque_documents: {
        Row: {
          categorie: Database["public"]["Enums"]["document_category"]
          chapitre_id: string | null
          created_at: string
          description: string
          enseignant_id: string | null
          fichier_url: string
          id: string
          matiere_id: string
          nombre_pages: number | null
          search_vector: unknown
          slug: string
          statut: Database["public"]["Enums"]["publication_status"]
          taille_octets: number
          telechargements_count: number
          titre: string
          updated_at: string
        }
        Insert: {
          categorie?: Database["public"]["Enums"]["document_category"]
          chapitre_id?: string | null
          created_at?: string
          description?: string
          enseignant_id?: string | null
          fichier_url: string
          id?: string
          matiere_id: string
          nombre_pages?: number | null
          search_vector?: unknown
          slug: string
          statut?: Database["public"]["Enums"]["publication_status"]
          taille_octets?: number
          telechargements_count?: number
          titre: string
          updated_at?: string
        }
        Update: {
          categorie?: Database["public"]["Enums"]["document_category"]
          chapitre_id?: string | null
          created_at?: string
          description?: string
          enseignant_id?: string | null
          fichier_url?: string
          id?: string
          matiere_id?: string
          nombre_pages?: number | null
          search_vector?: unknown
          slug?: string
          statut?: Database["public"]["Enums"]["publication_status"]
          taille_octets?: number
          telechargements_count?: number
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bibliotheque_documents_chapitre_id_fkey"
            columns: ["chapitre_id"]
            isOneToOne: false
            referencedRelation: "chapitres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bibliotheque_documents_enseignant_id_fkey"
            columns: ["enseignant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bibliotheque_documents_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      chapitres: {
        Row: {
          created_at: string
          id: string
          matiere_id: string
          niveau: Database["public"]["Enums"]["niveau_scolaire"]
          numero: string
          objectif: string
          ordre: number
          serie: Database["public"]["Enums"]["serie_scolaire"] | null
          slug: string
          titre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          matiere_id: string
          niveau?: Database["public"]["Enums"]["niveau_scolaire"]
          numero?: string
          objectif?: string
          ordre?: number
          serie?: Database["public"]["Enums"]["serie_scolaire"] | null
          slug: string
          titre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          matiere_id?: string
          niveau?: Database["public"]["Enums"]["niveau_scolaire"]
          numero?: string
          objectif?: string
          ordre?: number
          serie?: Database["public"]["Enums"]["serie_scolaire"] | null
          slug?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapitres_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          eleve_id: string
          enseignant_id: string
          id: string
          last_message_at: string
          matiere_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          eleve_id: string
          enseignant_id: string
          id?: string
          last_message_at?: string
          matiere_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          eleve_id?: string
          enseignant_id?: string
          id?: string
          last_message_at?: string
          matiere_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_enseignant_id_fkey"
            columns: ["enseignant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      cours: {
        Row: {
          chapitre_id: string
          created_at: string
          description: string
          duree_secondes: number
          enseignant_id: string | null
          id: string
          media_url: string | null
          ordre: number
          statut: Database["public"]["Enums"]["publication_status"]
          thumbnail_url: string | null
          titre: string
          type: Database["public"]["Enums"]["cours_type"]
          updated_at: string
          vues_count: number
        }
        Insert: {
          chapitre_id: string
          created_at?: string
          description?: string
          duree_secondes?: number
          enseignant_id?: string | null
          id?: string
          media_url?: string | null
          ordre?: number
          statut?: Database["public"]["Enums"]["publication_status"]
          thumbnail_url?: string | null
          titre: string
          type?: Database["public"]["Enums"]["cours_type"]
          updated_at?: string
          vues_count?: number
        }
        Update: {
          chapitre_id?: string
          created_at?: string
          description?: string
          duree_secondes?: number
          enseignant_id?: string | null
          id?: string
          media_url?: string | null
          ordre?: number
          statut?: Database["public"]["Enums"]["publication_status"]
          thumbnail_url?: string | null
          titre?: string
          type?: Database["public"]["Enums"]["cours_type"]
          updated_at?: string
          vues_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "cours_chapitre_id_fkey"
            columns: ["chapitre_id"]
            isOneToOne: false
            referencedRelation: "chapitres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cours_enseignant_id_fkey"
            columns: ["enseignant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cours_commentaires: {
        Row: {
          audio_duration: number | null
          audio_url: string | null
          author_id: string
          contenu: string | null
          cours_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          audio_duration?: number | null
          audio_url?: string | null
          author_id: string
          contenu?: string | null
          cours_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          audio_duration?: number | null
          audio_url?: string | null
          author_id?: string
          contenu?: string | null
          cours_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cours_commentaires_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cours_commentaires_cours_id_fkey"
            columns: ["cours_id"]
            isOneToOne: false
            referencedRelation: "cours"
            referencedColumns: ["id"]
          },
        ]
      }
      enseignant_matieres: {
        Row: {
          created_at: string
          enseignant_id: string
          matiere_id: string
        }
        Insert: {
          created_at?: string
          enseignant_id: string
          matiere_id: string
        }
        Update: {
          created_at?: string
          enseignant_id?: string
          matiere_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enseignant_matieres_enseignant_id_fkey"
            columns: ["enseignant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enseignant_matieres_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      exercices: {
        Row: {
          chapitre_id: string | null
          consignes: string
          created_at: string
          date_limite: string | null
          difficulte: Database["public"]["Enums"]["exercice_difficulty"]
          enseignant_id: string | null
          fichier_joint_url: string | null
          id: string
          matiere_id: string
          statut: Database["public"]["Enums"]["publication_status"]
          titre: string
          type: Database["public"]["Enums"]["exercice_type"]
          updated_at: string
        }
        Insert: {
          chapitre_id?: string | null
          consignes: string
          created_at?: string
          date_limite?: string | null
          difficulte?: Database["public"]["Enums"]["exercice_difficulty"]
          enseignant_id?: string | null
          fichier_joint_url?: string | null
          id?: string
          matiere_id: string
          statut?: Database["public"]["Enums"]["publication_status"]
          titre: string
          type?: Database["public"]["Enums"]["exercice_type"]
          updated_at?: string
        }
        Update: {
          chapitre_id?: string | null
          consignes?: string
          created_at?: string
          date_limite?: string | null
          difficulte?: Database["public"]["Enums"]["exercice_difficulty"]
          enseignant_id?: string | null
          fichier_joint_url?: string | null
          id?: string
          matiere_id?: string
          statut?: Database["public"]["Enums"]["publication_status"]
          titre?: string
          type?: Database["public"]["Enums"]["exercice_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercices_chapitre_id_fkey"
            columns: ["chapitre_id"]
            isOneToOne: false
            referencedRelation: "chapitres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercices_enseignant_id_fkey"
            columns: ["enseignant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercices_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_discussions: {
        Row: {
          audio_duration: number | null
          audio_url: string | null
          author_id: string
          chapitre_id: string | null
          contenu: string | null
          created_at: string
          id: string
          is_resolved: boolean
          matiere_id: string | null
          reponses_count: number
          search_vector: unknown
          titre: string
          updated_at: string
        }
        Insert: {
          audio_duration?: number | null
          audio_url?: string | null
          author_id: string
          chapitre_id?: string | null
          contenu?: string | null
          created_at?: string
          id?: string
          is_resolved?: boolean
          matiere_id?: string | null
          reponses_count?: number
          search_vector?: unknown
          titre: string
          updated_at?: string
        }
        Update: {
          audio_duration?: number | null
          audio_url?: string | null
          author_id?: string
          chapitre_id?: string | null
          contenu?: string | null
          created_at?: string
          id?: string
          is_resolved?: boolean
          matiere_id?: string | null
          reponses_count?: number
          search_vector?: unknown
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_discussions_chapitre_id_fkey"
            columns: ["chapitre_id"]
            isOneToOne: false
            referencedRelation: "chapitres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_discussions_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reponses: {
        Row: {
          audio_duration: number | null
          audio_url: string | null
          author_id: string
          contenu: string | null
          created_at: string
          discussion_id: string
          id: string
          is_teacher_reply: boolean
          is_validated: boolean
          updated_at: string
        }
        Insert: {
          audio_duration?: number | null
          audio_url?: string | null
          author_id: string
          contenu?: string | null
          created_at?: string
          discussion_id: string
          id?: string
          is_teacher_reply?: boolean
          is_validated?: boolean
          updated_at?: string
        }
        Update: {
          audio_duration?: number | null
          audio_url?: string | null
          author_id?: string
          contenu?: string | null
          created_at?: string
          discussion_id?: string
          id?: string
          is_teacher_reply?: boolean
          is_validated?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_reponses_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reponses_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "forum_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      matiere_notifications: {
        Row: {
          created_at: string
          eleve_id: string
          id: string
          matiere_id: string
          notified_at: string | null
        }
        Insert: {
          created_at?: string
          eleve_id: string
          id?: string
          matiere_id: string
          notified_at?: string | null
        }
        Update: {
          created_at?: string
          eleve_id?: string
          id?: string
          matiere_id?: string
          notified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matiere_notifications_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matiere_notifications_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      matieres: {
        Row: {
          couleur_bg: string
          couleur_border: string
          couleur_text: string
          created_at: string
          description: string
          id: string
          niveau_cible: string
          nom: string
          ordre: number
          search_vector: unknown
          slug: string
          statut: Database["public"]["Enums"]["matiere_status"]
          updated_at: string
        }
        Insert: {
          couleur_bg?: string
          couleur_border?: string
          couleur_text?: string
          created_at?: string
          description?: string
          id?: string
          niveau_cible?: string
          nom: string
          ordre?: number
          search_vector?: unknown
          slug: string
          statut?: Database["public"]["Enums"]["matiere_status"]
          updated_at?: string
        }
        Update: {
          couleur_bg?: string
          couleur_border?: string
          couleur_text?: string
          created_at?: string
          description?: string
          id?: string
          niveau_cible?: string
          nom?: string
          ordre?: number
          search_vector?: unknown
          slug?: string
          statut?: Database["public"]["Enums"]["matiere_status"]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_size_bytes: number | null
          attachment_url: string | null
          audio_duration: number | null
          audio_url: string | null
          contenu: string | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_size_bytes?: number | null
          attachment_url?: string | null
          audio_duration?: number | null
          audio_url?: string | null
          contenu?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachment_name?: string | null
          attachment_size_bytes?: number | null
          attachment_url?: string | null
          audio_duration?: number | null
          audio_url?: string | null
          contenu?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          etablissement: string | null
          full_name: string
          id: string
          niveau: Database["public"]["Enums"]["niveau_scolaire"] | null
          phone: string | null
          preferences: Json
          role: Database["public"]["Enums"]["user_role"]
          serie: Database["public"]["Enums"]["serie_scolaire"] | null
          statut: Database["public"]["Enums"]["account_status"]
          updated_at: string
          ville: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          etablissement?: string | null
          full_name: string
          id: string
          niveau?: Database["public"]["Enums"]["niveau_scolaire"] | null
          phone?: string | null
          preferences?: Json
          role?: Database["public"]["Enums"]["user_role"]
          serie?: Database["public"]["Enums"]["serie_scolaire"] | null
          statut?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          ville?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          etablissement?: string | null
          full_name?: string
          id?: string
          niveau?: Database["public"]["Enums"]["niveau_scolaire"] | null
          phone?: string | null
          preferences?: Json
          role?: Database["public"]["Enums"]["user_role"]
          serie?: Database["public"]["Enums"]["serie_scolaire"] | null
          statut?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      progression_cours: {
        Row: {
          cours_id: string
          created_at: string
          derniere_position_secondes: number
          eleve_id: string
          id: string
          is_completed: boolean | null
          last_accessed_at: string
          pourcentage: number
          temps_passe_secondes: number
          updated_at: string
        }
        Insert: {
          cours_id: string
          created_at?: string
          derniere_position_secondes?: number
          eleve_id: string
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string
          pourcentage?: number
          temps_passe_secondes?: number
          updated_at?: string
        }
        Update: {
          cours_id?: string
          created_at?: string
          derniere_position_secondes?: number
          eleve_id?: string
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string
          pourcentage?: number
          temps_passe_secondes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "progression_cours_cours_id_fkey"
            columns: ["cours_id"]
            isOneToOne: false
            referencedRelation: "cours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progression_cours_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signalements: {
        Row: {
          created_at: string
          extrait: string | null
          id: string
          motif: string
          notes_moderation: string | null
          reporter_id: string | null
          statut: Database["public"]["Enums"]["signalement_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["signalement_target_type"]
          treated_at: string | null
          treated_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          extrait?: string | null
          id?: string
          motif: string
          notes_moderation?: string | null
          reporter_id?: string | null
          statut?: Database["public"]["Enums"]["signalement_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["signalement_target_type"]
          treated_at?: string | null
          treated_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          extrait?: string | null
          id?: string
          motif?: string
          notes_moderation?: string | null
          reporter_id?: string | null
          statut?: Database["public"]["Enums"]["signalement_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["signalement_target_type"]
          treated_at?: string | null
          treated_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signalements_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signalements_treated_by_fkey"
            columns: ["treated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      soumissions_exercices: {
        Row: {
          commentaire_eleve: string | null
          corrige_at: string | null
          corrige_par: string | null
          created_at: string
          eleve_id: string
          exercice_id: string
          feedback_audio_duration: number | null
          feedback_audio_url: string | null
          feedback_texte: string | null
          fichier_rendu_url: string | null
          id: string
          note: number | null
          soumis_at: string | null
          statut: Database["public"]["Enums"]["soumission_status"]
          updated_at: string
        }
        Insert: {
          commentaire_eleve?: string | null
          corrige_at?: string | null
          corrige_par?: string | null
          created_at?: string
          eleve_id: string
          exercice_id: string
          feedback_audio_duration?: number | null
          feedback_audio_url?: string | null
          feedback_texte?: string | null
          fichier_rendu_url?: string | null
          id?: string
          note?: number | null
          soumis_at?: string | null
          statut?: Database["public"]["Enums"]["soumission_status"]
          updated_at?: string
        }
        Update: {
          commentaire_eleve?: string | null
          corrige_at?: string | null
          corrige_par?: string | null
          created_at?: string
          eleve_id?: string
          exercice_id?: string
          feedback_audio_duration?: number | null
          feedback_audio_url?: string | null
          feedback_texte?: string | null
          fichier_rendu_url?: string | null
          id?: string
          note?: number | null
          soumis_at?: string | null
          statut?: Database["public"]["Enums"]["soumission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "soumissions_exercices_corrige_par_fkey"
            columns: ["corrige_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soumissions_exercices_eleve_id_fkey"
            columns: ["eleve_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soumissions_exercices_exercice_id_fkey"
            columns: ["exercice_id"]
            isOneToOne: false
            referencedRelation: "exercices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      increment_cours_vues: { Args: { p_cours_id: string }; Returns: number }
      increment_document_telechargements: {
        Args: { p_document_id: string }
        Returns: number
      }
      is_admin: { Args: never; Returns: boolean }
      is_conversation_participant: {
        Args: { p_conversation_id: string }
        Returns: boolean
      }
      is_eleve: { Args: never; Returns: boolean }
      is_enseignant: { Args: never; Returns: boolean }
      mark_conversation_as_read: {
        Args: { p_conversation_id: string }
        Returns: number
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      teaches_chapitre: { Args: { p_chapitre_id: string }; Returns: boolean }
      teaches_matiere: { Args: { p_matiere_id: string }; Returns: boolean }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      abonnement_status: "actif" | "en_attente" | "a_renouveler" | "expire"
      account_status: "actif" | "en_attente" | "suspendu"
      cours_type: "video" | "document"
      document_category: "pdf" | "fiche" | "fascicule" | "annales"
      exercice_difficulty: "facile" | "moyen" | "difficile"
      exercice_type: "qcm" | "dissertation" | "entrainement" | "devoir"
      matiere_status: "disponible" | "bientot_disponible"
      niveau_scolaire:
        | "Terminale"
        | "PremiÃ¨re"
        | "Seconde"
        | "TroisiÃ¨me"
        | "Autre"
      paiement_methode: "wave" | "orange_money" | "manuel"
      publication_status: "brouillon" | "publie" | "archive"
      serie_scolaire: "L" | "L1" | "L2" | "S" | "S1" | "S2" | "G" | "Autre"
      signalement_status: "en_attente" | "traite" | "rejete"
      signalement_target_type:
        | "forum_discussion"
        | "forum_reponse"
        | "bibliotheque"
        | "commentaire"
      soumission_status: "a_faire" | "envoye" | "corrige"
      user_role: "eleve" | "enseignant" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      abonnement_status: ["actif", "en_attente", "a_renouveler", "expire"],
      account_status: ["actif", "en_attente", "suspendu"],
      cours_type: ["video", "document"],
      document_category: ["pdf", "fiche", "fascicule", "annales"],
      exercice_difficulty: ["facile", "moyen", "difficile"],
      exercice_type: ["qcm", "dissertation", "entrainement", "devoir"],
      matiere_status: ["disponible", "bientot_disponible"],
      niveau_scolaire: [
        "Terminale",
        "PremiÃ¨re",
        "Seconde",
        "TroisiÃ¨me",
        "Autre",
      ],
      paiement_methode: ["wave", "orange_money", "manuel"],
      publication_status: ["brouillon", "publie", "archive"],
      serie_scolaire: ["L", "L1", "L2", "S", "S1", "S2", "G", "Autre"],
      signalement_status: ["en_attente", "traite", "rejete"],
      signalement_target_type: [
        "forum_discussion",
        "forum_reponse",
        "bibliotheque",
        "commentaire",
      ],
      soumission_status: ["a_faire", "envoye", "corrige"],
      user_role: ["eleve", "enseignant", "admin"],
    },
  },
} as const
