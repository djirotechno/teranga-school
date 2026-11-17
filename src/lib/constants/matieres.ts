export interface LessonItem {
  id: string;
  order: number;
  title: string;
  type: 'video' | 'pdf' | 'exercise';
  duration?: string;
  fileSize?: string;
  questionsCount?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  progressPercent?: number;
  isCompleted?: boolean;
  desc?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'pdf' | 'fiche' | 'annales';
  fileSize: string;
  pages: number;
  downloadUrl?: string;
  desc: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  type: 'qcm' | 'dissertation' | 'entrainement';
  questionsCount: number;
  estimatedTime: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  isCompleted?: boolean;
  score?: number;
}

export interface DiscussionItem {
  id: string;
  authorName: string;
  authorRole: 'Élève' | 'Enseignant';
  avatarInitials: string;
  timeAgo: string;
  question: string;
  hasAudio?: boolean;
  audioDuration?: string;
  repliesCount: number;
  solved: boolean;
}

export interface ChapterData {
  id: string;
  number: string;
  title: string;
  objective: string;
  subjectId: string;
  subjectName: string;
  subjectColor: {
    bg: string;
    text: string;
    border: string;
    pillBg: string;
    pillText: string;
  };
  featuredLesson: {
    videoId: string;
    title: string;
    duration: string;
    progressPercent: number;
    thumbnailUrl: string;
    desc: string;
  };
  lessons: LessonItem[];
  exercises: ExerciseItem[];
  resources: ResourceItem[];
  discussions: DiscussionItem[];
}

export interface SubjectData {
  id: string;
  name: string;
  slug: string;
  level: string;
  desc: string;
  color: {
    bg: string;
    text: string;
    border: string;
    pillBg: string;
    pillText: string;
  };
  isAvailable: boolean;
  chapters: ChapterData[];
}

export const MATIERES_DATA: Record<string, SubjectData> = {
  francais: {
    id: 'francais',
    name: 'Français',
    slug: 'francais',
    level: 'Terminale L & S',
    desc: 'Littérature, dissertation, grammaire, méthodologie et argumentation.',
    color: {
      bg: 'bg-[#FBECE2]',
      text: 'text-[#C85A2B]',
      border: 'border-[#F4DACB]',
      pillBg: 'bg-[#FBECE2]',
      pillText: 'text-[#C85A2B]',
    },
    isAvailable: true,
    chapters: [
      {
        id: 'argumentation',
        number: 'Chapitre 01',
        title: "L'argumentation",
        objective: 'construire un raisonnement convaincant.',
        subjectId: 'francais',
        subjectName: 'Français',
        subjectColor: {
          bg: 'bg-[#FBECE2]',
          text: 'text-[#C85A2B]',
          border: 'border-[#F4DACB]',
          pillBg: 'bg-[#FBECE2]',
          pillText: 'text-[#C85A2B]',
        },
        featuredLesson: {
          videoId: '1',
          title: "L'argumentation : méthodes et exemples",
          duration: '18:24',
          progressPercent: 68,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: "Découvrez les piliers de la rhétorique et de l'argumentation : thèse, arguments et exemples pertinents pour réussir vos dissertations au Bac.",
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: "L'argumentation : méthodes et exemples",
            type: 'video',
            duration: '18:24',
            progressPercent: 68,
            isCompleted: false,
            desc: "Introduction aux stratégies argumentatives et structuration d'un paragraphe argumenté.",
          },
          {
            id: '2',
            order: 2,
            title: "Les types d'arguments",
            type: 'video',
            duration: '12 min',
            progressPercent: 0,
            isCompleted: false,
            desc: "Argument d'autorité, argument par analogie, argument logique et argument ad hominem.",
          },
          {
            id: '3',
            order: 3,
            title: 'Fiche de synthèse',
            type: 'pdf',
            fileSize: '1,2 Mo',
            isCompleted: false,
            desc: "Résumé complet des connecteurs logiques et des procédés rhétoriques à télécharger.",
          },
          {
            id: '4',
            order: 4,
            title: "S'entraîner à argumenter",
            type: 'exercise',
            questionsCount: 8,
            isCompleted: false,
            desc: "Exercices d'application directe : repérer les failles d'un raisonnement et formuler un contre-argument.",
          },
          {
            id: '5',
            order: 5,
            title: 'Analyse d’un extrait de plaidoyer',
            type: 'video',
            duration: '15 min',
            progressPercent: 0,
            isCompleted: false,
            desc: "Étude guidée d'un texte littéraire engagé pour illustrer la force de la persuasion.",
          },
        ],
        exercises: [
          {
            id: 'ex-1',
            title: "Identifier les connecteurs logiques",
            type: 'qcm',
            questionsCount: 10,
            estimatedTime: '15 min',
            difficulty: 'Facile',
            score: 85,
            isCompleted: true,
          },
          {
            id: 'ex-2',
            title: "Construire un paragraphe argumentatif type Bac",
            type: 'entrainement',
            questionsCount: 5,
            estimatedTime: '25 min',
            difficulty: 'Moyen',
          },
          {
            id: 'ex-3',
            title: "Réfutation et contre-argumentation",
            type: 'dissertation',
            questionsCount: 3,
            estimatedTime: '30 min',
            difficulty: 'Difficile',
          },
        ],
        resources: [
          {
            id: 'res-1',
            title: "Fiche mémo : Les 7 grands types d'arguments",
            type: 'fiche',
            fileSize: '1,2 Mo',
            pages: 4,
            desc: "Schéma clair avec définitions, pièges à éviter et exemples tirés d'auteurs africains et francophones.",
          },
          {
            id: 'res-2',
            title: "Tableau récapitulatif des connecteurs d'opposition et de concession",
            type: 'pdf',
            fileSize: '850 Ko',
            pages: 2,
            desc: "Liste alphabétique et nuances de sens pour enrichir votre style écrit.",
          },
          {
            id: 'res-3',
            title: "Sujets d'annales corrigés du Baccalauréat Sénégal (2018-2023)",
            type: 'annales',
            fileSize: '3,4 Mo',
            pages: 18,
            desc: "Sujets officiels de dissertation et commentaires composés avec corrigés détaillés.",
          },
        ],
        discussions: [
          {
            id: 'disc-1',
            authorName: 'Moussa Ndiaye',
            authorRole: 'Élève',
            avatarInitials: 'MN',
            timeAgo: 'Il y a 2 heures',
            question: "Quelle est la différence exacte entre persuader et convaincre dans un sujet de dissertation ?",
            repliesCount: 4,
            solved: true,
          },
          {
            id: 'disc-2',
            authorName: 'Fatou Sow',
            authorRole: 'Élève',
            avatarInitials: 'FS',
            timeAgo: 'Hier à 16:30',
            question: "Est-ce qu'on peut utiliser des exemples tirés de l'actualité sénégalaise en plus des œuvres littéraires ?",
            hasAudio: true,
            audioDuration: '0:42',
            repliesCount: 2,
            solved: false,
          },
        ],
      },
      {
        id: 'dissertation',
        number: 'Chapitre 02',
        title: 'La dissertation littéraire',
        objective: 'maîtriser la problématisation et le plan.',
        subjectId: 'francais',
        subjectName: 'Français',
        subjectColor: {
          bg: 'bg-[#FBECE2]',
          text: 'text-[#C85A2B]',
          border: 'border-[#F4DACB]',
          pillBg: 'bg-[#FBECE2]',
          pillText: 'text-[#C85A2B]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Comprendre le sujet et définir la problématique',
          duration: '22:10',
          progressPercent: 30,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: "Méthode rigoureuse d'analyse des mots-clés du libellé pour éviter le hors-sujet.",
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Comprendre le sujet et définir la problématique',
            type: 'video',
            duration: '22:10',
            progressPercent: 30,
            isCompleted: false,
          },
          {
            id: '2',
            order: 2,
            title: 'Le plan dialectique vs le plan thématique',
            type: 'video',
            duration: '18:40',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '3',
            order: 3,
            title: 'Guide méthodologique de la dissertation',
            type: 'pdf',
            fileSize: '1,5 Mo',
            isCompleted: false,
          },
          {
            id: '4',
            order: 4,
            title: 'Rédiger une introduction percutante',
            type: 'exercise',
            questionsCount: 6,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
      {
        id: 'poesie',
        number: 'Chapitre 03',
        title: 'La poésie négro-africaine',
        objective: "analyser les thèmes et l'engagement poétique.",
        subjectId: 'francais',
        subjectName: 'Français',
        subjectColor: {
          bg: 'bg-[#FBECE2]',
          text: 'text-[#C85A2B]',
          border: 'border-[#F4DACB]',
          pillBg: 'bg-[#FBECE2]',
          pillText: 'text-[#C85A2B]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Senghor, Césaire et le mouvement de la Négritude',
          duration: '25:30',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: "Aux sources du mouvement intellectuel et poétique qui a révolutionné la littérature francophone.",
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Senghor, Césaire et le mouvement de la Négritude',
            type: 'video',
            duration: '25:30',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '2',
            order: 2,
            title: 'Explication linéaire : Femme Noire de L.S. Senghor',
            type: 'video',
            duration: '19:15',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '3',
            order: 3,
            title: 'Anthologie poétique et lexique',
            type: 'pdf',
            fileSize: '2,1 Mo',
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
      {
        id: 'roman',
        number: 'Chapitre 04',
        title: 'Le roman contemporain',
        objective: "explorer l'évolution narrative et sociale.",
        subjectId: 'francais',
        subjectName: 'Français',
        subjectColor: {
          bg: 'bg-[#FBECE2]',
          text: 'text-[#C85A2B]',
          border: 'border-[#F4DACB]',
          pillBg: 'bg-[#FBECE2]',
          pillText: 'text-[#C85A2B]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Une si longue lettre de Mariama Bâ : étude intégrale',
          duration: '28:00',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: "Analyse des thèmes majeurs : polygamie, condition de la femme, tradition et modernité au Sénégal.",
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Une si longue lettre de Mariama Bâ : étude intégrale',
            type: 'video',
            duration: '28:00',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '2',
            order: 2,
            title: 'Fiche d’analyse des personnages et de la structure épistolaire',
            type: 'pdf',
            fileSize: '1,4 Mo',
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
    ],
  },
  'histoire-geo': {
    id: 'histoire-geo',
    name: 'Histoire-Géographie',
    slug: 'histoire-geo',
    level: 'Terminale L & S',
    desc: 'Le Sénégal contemporain, la décolonisation et les mutations géopolitiques mondiales.',
    color: {
      bg: 'bg-[#EBF4EE]',
      text: 'text-[#236B48]',
      border: 'border-[#D9EADB]',
      pillBg: 'bg-[#EBF4EE]',
      pillText: 'text-[#236B48]',
    },
    isAvailable: true,
    chapters: [
      {
        id: 'guerre-froide',
        number: 'Chapitre 01',
        title: 'Les relations internationales depuis 1945',
        objective: "comprendre l'ordre bipolaire et les grandes crises.",
        subjectId: 'histoire-geo',
        subjectName: 'Histoire-Géographie',
        subjectColor: {
          bg: 'bg-[#EBF4EE]',
          text: 'text-[#236B48]',
          border: 'border-[#D9EADB]',
          pillBg: 'bg-[#EBF4EE]',
          pillText: 'text-[#236B48]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'La Guerre froide : blocs, idéologies et crises majeures',
          duration: '24:10',
          progressPercent: 45,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'De la doctrine Truman à la crise des missiles de Cuba, les points clés du programme d’histoire.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'La Guerre froide : blocs, idéologies et crises majeures',
            type: 'video',
            duration: '24:10',
            progressPercent: 45,
            isCompleted: false,
          },
          {
            id: '2',
            order: 2,
            title: 'La chute du mur de Berlin et la fin de l’URSS',
            type: 'video',
            duration: '18:30',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '3',
            order: 3,
            title: 'Chronologie et repères géopolitiques essentiels',
            type: 'pdf',
            fileSize: '1,8 Mo',
            isCompleted: false,
          },
          {
            id: '4',
            order: 4,
            title: 'QCM de validation des repères historiques',
            type: 'exercise',
            questionsCount: 10,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
      {
        id: 'decolonisation',
        number: 'Chapitre 02',
        title: 'La décolonisation en Afrique et en Asie',
        objective: 'analyser les facteurs et les formes des indépendances.',
        subjectId: 'histoire-geo',
        subjectName: 'Histoire-Géographie',
        subjectColor: {
          bg: 'bg-[#EBF4EE]',
          text: 'text-[#236B48]',
          border: 'border-[#D9EADB]',
          pillBg: 'bg-[#EBF4EE]',
          pillText: 'text-[#236B48]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Les étapes de l’émancipation africaine',
          duration: '21:40',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Facteurs internes et externes de la décolonisation et création des nouveaux États.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Les étapes de l’émancipation africaine',
            type: 'video',
            duration: '21:40',
            progressPercent: 0,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
      {
        id: 'senegal',
        number: 'Chapitre 03',
        title: 'Le Sénégal : économie et population',
        objective: 'étudier les dynamiques territoriales et démographiques.',
        subjectId: 'histoire-geo',
        subjectName: 'Histoire-Géographie',
        subjectColor: {
          bg: 'bg-[#EBF4EE]',
          text: 'text-[#236B48]',
          border: 'border-[#D9EADB]',
          pillBg: 'bg-[#EBF4EE]',
          pillText: 'text-[#236B48]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Démographie, urbanisation et dynamique de Dakar',
          duration: '20:15',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Croissance démographique, aménagement du territoire et défis environnementaux.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Démographie, urbanisation et dynamique de Dakar',
            type: 'video',
            duration: '20:15',
            progressPercent: 0,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
    ],
  },
  philosophie: {
    id: 'philosophie',
    name: 'Philosophie',
    slug: 'philosophie',
    level: 'Terminale L & S',
    desc: 'Épistémologie, métaphysique, morale, esthétique et philosophie politique.',
    color: {
      bg: 'bg-[#F0EDFA]',
      text: 'text-[#6644B8]',
      border: 'border-[#E2DCF4]',
      pillBg: 'bg-[#F0EDFA]',
      pillText: 'text-[#6644B8]',
    },
    isAvailable: true,
    chapters: [
      {
        id: 'conscience',
        number: 'Chapitre 01',
        title: 'La conscience et l’inconscient',
        objective: 'interroger la nature du sujet pensant.',
        subjectId: 'philosophie',
        subjectName: 'Philosophie',
        subjectColor: {
          bg: 'bg-[#F0EDFA]',
          text: 'text-[#6644B8]',
          border: 'border-[#E2DCF4]',
          pillBg: 'bg-[#F0EDFA]',
          pillText: 'text-[#6644B8]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Descartes et le Cogito : la conscience de soi',
          duration: '21:10',
          progressPercent: 50,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Du doute méthodique à la première certitude fondamentale du sujet.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Descartes et le Cogito : la conscience de soi',
            type: 'video',
            duration: '21:10',
            progressPercent: 50,
            isCompleted: false,
          },
          {
            id: '2',
            order: 2,
            title: 'Freud et l’hypothèse de l’inconscient psychique',
            type: 'video',
            duration: '23:45',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '3',
            order: 3,
            title: 'Anthologie de citations et textes d’auteurs',
            type: 'pdf',
            fileSize: '1,3 Mo',
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
      {
        id: 'etat-pouvoir',
        number: 'Chapitre 02',
        title: 'L’État, le droit et la liberté',
        objective: 'penser le pouvoir politique et la justice.',
        subjectId: 'philosophie',
        subjectName: 'Philosophie',
        subjectColor: {
          bg: 'bg-[#F0EDFA]',
          text: 'text-[#6644B8]',
          border: 'border-[#E2DCF4]',
          pillBg: 'bg-[#F0EDFA]',
          pillText: 'text-[#6644B8]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'L’état de nature et le contrat social (Hobbes, Rousseau)',
          duration: '26:00',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Pourquoi les hommes ont-ils besoin de lois et d’un État pour vivre ensemble ?',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'L’état de nature et le contrat social (Hobbes, Rousseau)',
            type: 'video',
            duration: '26:00',
            progressPercent: 0,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
    ],
  },
  mathematiques: {
    id: 'mathematiques',
    name: 'Mathématiques',
    slug: 'mathematiques',
    level: 'Terminale S & L',
    desc: 'Algèbre, analyse, suites numériques, fonctions exponentielles et probabilités.',
    color: {
      bg: 'bg-[#E6F0FA]',
      text: 'text-[#1D63B8]',
      border: 'border-[#D0E2F7]',
      pillBg: 'bg-[#E6F0FA]',
      pillText: 'text-[#1D63B8]',
    },
    isAvailable: false,
    chapters: [
      {
        id: 'fonctions',
        number: 'Chapitre 01',
        title: 'Fonctions logarithmes et exponentielles',
        objective: 'maîtriser les dérivées, limites et études de fonctions.',
        subjectId: 'mathematiques',
        subjectName: 'Mathématiques',
        subjectColor: {
          bg: 'bg-[#E6F0FA]',
          text: 'text-[#1D63B8]',
          border: 'border-[#D0E2F7]',
          pillBg: 'bg-[#E6F0FA]',
          pillText: 'text-[#1D63B8]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Fonction Logarithme Népérien : propriétés et dérivées',
          duration: '25:00',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Définition, propriétés algébriques et résolution d’équations et inéquations.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Fonction Logarithme Népérien : propriétés et dérivées',
            type: 'video',
            duration: '25:00',
            progressPercent: 0,
            isCompleted: false,
          },
          {
            id: '2',
            order: 2,
            title: 'Fiche d’exercices corrigés type Bac',
            type: 'pdf',
            fileSize: '1,6 Mo',
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
    ],
  },
  'sciences-physiques': {
    id: 'sciences-physiques',
    name: 'Sciences Physiques',
    slug: 'sciences-physiques',
    level: 'Terminale S',
    desc: 'Cinématique, dynamique, électromagnétisme, chimie organique et solutions.',
    color: {
      bg: 'bg-[#FEF3E2]',
      text: 'text-[#B86B1D]',
      border: 'border-[#F7E5C8]',
      pillBg: 'bg-[#FEF3E2]',
      pillText: 'text-[#B86B1D]',
    },
    isAvailable: false,
    chapters: [
      {
        id: 'newton',
        number: 'Chapitre 01',
        title: 'Lois de Newton et mouvements dans un champ uniforme',
        objective: 'établir les équations horaires et les trajectoires.',
        subjectId: 'sciences-physiques',
        subjectName: 'Sciences Physiques',
        subjectColor: {
          bg: 'bg-[#FEF3E2]',
          text: 'text-[#B86B1D]',
          border: 'border-[#F7E5C8]',
          pillBg: 'bg-[#FEF3E2]',
          pillText: 'text-[#B86B1D]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Deuxième loi de Newton et bilan des forces',
          duration: '27:15',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Application du principe fondamental de la dynamique à des cas réels du Bac.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Deuxième loi de Newton et bilan des forces',
            type: 'video',
            duration: '27:15',
            progressPercent: 0,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
    ],
  },
  svt: {
    id: 'svt',
    name: 'SVT',
    slug: 'svt',
    level: 'Terminale S',
    desc: 'Sciences de la Vie et de la Terre : génétique, immunologie et géologie.',
    color: {
      bg: 'bg-[#EAF7EE]',
      text: 'text-[#1B7843]',
      border: 'border-[#CEEFD8]',
      pillBg: 'bg-[#EAF7EE]',
      pillText: 'text-[#1B7843]',
    },
    isAvailable: false,
    chapters: [
      {
        id: 'genetique',
        number: 'Chapitre 01',
        title: 'Brassages génétiques et méiose',
        objective: 'comprendre la transmission des caractères héréditaires.',
        subjectId: 'svt',
        subjectName: 'SVT',
        subjectColor: {
          bg: 'bg-[#EAF7EE]',
          text: 'text-[#1B7843]',
          border: 'border-[#CEEFD8]',
          pillBg: 'bg-[#EAF7EE]',
          pillText: 'text-[#1B7843]',
        },
        featuredLesson: {
          videoId: '1',
          title: 'Méiose et brassage inter-chromosomique',
          duration: '24:00',
          progressPercent: 0,
          thumbnailUrl: '/images/course-thumbnail.png',
          desc: 'Étapes détaillées de la division cellulaire et création de la diversité génétique.',
        },
        lessons: [
          {
            id: '1',
            order: 1,
            title: 'Méiose et brassage inter-chromosomique',
            type: 'video',
            duration: '24:00',
            progressPercent: 0,
            isCompleted: false,
          },
        ],
        exercises: [],
        resources: [],
        discussions: [],
      },
    ],
  },
};

// Helper to look up a chapter
export function getChapter(subjectSlug: string, chapterSlug: string): ChapterData | null {
  const subject = MATIERES_DATA[subjectSlug.toLowerCase()];
  if (!subject) return null;

  const found = subject.chapters.find((c) => c.id.toLowerCase() === chapterSlug.toLowerCase());
  return found || null;
}
