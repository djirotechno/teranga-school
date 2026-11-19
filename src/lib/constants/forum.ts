export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: 'Élève' | 'Enseignant';
  avatarInitials: string;
  time: string;
  content: string;
  hasAudio?: boolean;
  audioDuration?: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorRole: 'Élève' | 'Enseignant';
  avatarInitials: string;
  time: string;
  tag: 'Français' | 'Histoire-Géo' | 'Philosophie' | 'Général';
  chapter?: string;
  content: string;
  answers: number;
  isSolved?: boolean;
  hasAudio?: boolean;
  audioDuration?: string;
  replies: ForumReply[];
}

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'methodologie-commentaire-francais',
    title: 'Question sur la méthodologie du commentaire de texte en Français',
    author: 'Moussa Sall',
    authorRole: 'Élève',
    avatarInitials: 'MS',
    time: 'Il y a 2h',
    tag: 'Français',
    chapter: "L'argumentation & l'analyse littéraire",
    content: "Bonjour à tous, j'ai souvent du mal à relier les figures de style au sens profond du texte lors du commentaire composé. Est-ce qu'il faut faire une liste ou bien analyser chaque figure dans un paragraphe argumenté ?",
    answers: 5,
    isSolved: true,
    replies: [
      {
        id: 'r1',
        authorName: 'M. Diop',
        authorRole: 'Enseignant',
        avatarInitials: 'MD',
        time: 'Il y a 1h',
        content: "Excellente question Moussa ! Ne fais jamais de simple catalogue de figures de style. La règle d'or est : Citer la figure ➔ La nommer ➔ Expliquer l'effet produit sur le lecteur ➔ Relier cet effet à l'idée directrice de ta sous-partie.",
        hasAudio: true,
        audioDuration: '0:42',
      },
      {
        id: 'r2',
        authorName: 'Awa Diop',
        authorRole: 'Élève',
        avatarInitials: 'AD',
        time: 'Il y a 45 min',
        content: "Merci M. Diop ! La formule 'Procédé ➔ Sens ➔ Effet' m'aide beaucoup à structurer mes paragraphes.",
      }
    ]
  },
  {
    id: 'conscience-inconscient-freud',
    title: 'Différence entre conscience et inconscient chez Freud',
    author: 'Fatou Ndiaye',
    authorRole: 'Élève',
    avatarInitials: 'FN',
    time: 'Il y a 4h',
    tag: 'Philosophie',
    chapter: 'La conscience et le sujet',
    content: "Bonjour, est-ce que quelqu'un pourrait m'expliquer clairement pourquoi Freud affirme que 'le Moi n'est pas maître dans sa propre maison' ? Est-ce que cela remet en cause toute liberté morale ?",
    answers: 8,
    isSolved: false,
    hasAudio: true,
    audioDuration: '0:35',
    replies: [
      {
        id: 'r3',
        authorName: 'Mme Sarr',
        authorRole: 'Enseignant',
        avatarInitials: 'FS',
        time: 'Il y a 3h',
        content: "Bonjour Fatou. Chez Freud, les pulsions refoulées dans l'inconscient (le Ça) et les interdits moraux intériorisés (le Surmoi) influencent nos actions sans que le Moi conscient ne s'en rende compte. Écoute cette note vocale pour la nuance avec Sartre.",
        hasAudio: true,
        audioDuration: '0:55',
      }
    ]
  },
  {
    id: 'causes-economiques-colonisation-senegal',
    title: 'Les causes économiques de la colonisation au Sénégal',
    author: 'Amadou Ba',
    authorRole: 'Élève',
    avatarInitials: 'AB',
    time: 'Hier',
    tag: 'Histoire-Géo',
    chapter: "L'impérialisme en Afrique",
    content: "Dans mon devoir d'Histoire, je dois citer les motivations économiques qui ont poussé la métropole française à s'implanter au Sénégal au XIXe siècle. Quels sont les points incontournables ?",
    answers: 3,
    isSolved: true,
    replies: [
      {
        id: 'r4',
        authorName: 'M. Ndiaye',
        authorRole: 'Enseignant',
        avatarInitials: 'IN',
        time: 'Hier',
        content: "Trois éléments clés : 1. La recherche de matières premières (notamment l'arachide pour les huileries de Marseille), 2. Le besoin de débouchés commerciaux pour l'industrie européenne en crise de surproduction, 3. Le contrôle des routes maritimes vers l'Atlantique Sud.",
      }
    ]
  },
  {
    id: 'guerre-froide-crise-cuba',
    title: "Pourquoi la crise de Cuba (1962) est-elle considérée comme l'acmé de la Guerre froide ?",
    author: 'Cheikh Tidiane',
    authorRole: 'Élève',
    avatarInitials: 'CT',
    time: 'Il y a 2 jours',
    tag: 'Histoire-Géo',
    chapter: 'La Guerre froide',
    content: "Je prépare une fiche sur la crise de Cuba et j'aimerais bien comprendre le rôle de la dissuasion nucléaire et du blocus maritime mis en place par Kennedy.",
    answers: 4,
    isSolved: false,
    replies: []
  }
];
