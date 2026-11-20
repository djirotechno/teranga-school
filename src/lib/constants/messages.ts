export interface MessageAttachment {
  title: string;
  format: string;
  size: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'teacher';
  text?: string;
  audioDuration?: string;
  attachment?: MessageAttachment;
  time: string;
}

export interface Conversation {
  id: string;
  teacher: string;
  initials: string;
  role: string;
  subject: string;
  unread: boolean;
  time: string;
  lastMessage: string;
  messages: ChatMessage[];
}

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'm-diop',
    teacher: 'M. Diop',
    initials: 'MD',
    role: 'Enseignant de français',
    subject: 'Français',
    unread: true,
    time: '09:32',
    lastMessage: 'Merci Monsieur !',
    messages: [
      {
        id: 'msg-1',
        sender: 'student',
        text: 'Bonjour Monsieur, pouvez-vous corriger mon introduction ?',
        time: '09:12',
      },
      {
        id: 'msg-2',
        sender: 'teacher',
        text: 'Bien sûr Awa. Voici ton retour et une fiche pour t\'aider.',
        audioDuration: '0:54',
        attachment: {
          title: 'Correction — introduction',
          format: 'PDF',
          size: '420 Ko',
        },
        time: '09:30',
      },
      {
        id: 'msg-3',
        sender: 'student',
        text: 'Merci Monsieur !',
        time: '09:32',
      },
    ],
  },
  {
    id: 'mme-sow',
    teacher: 'Mme Sow',
    initials: 'MS',
    role: 'Enseignante de philosophie',
    subject: 'Philosophie',
    unread: true,
    time: '11:15',
    lastMessage: 'Excellente progression sur le chapitre de la morale !',
    messages: [
      {
        id: 'msg-sow-1',
        sender: 'teacher',
        text: 'Bonjour Awa, excellente progression sur le chapitre de la morale ! Continue sur cette lancée.',
        time: '11:15',
      },
    ],
  },
  {
    id: 'm-cisse',
    teacher: 'M. Cissé',
    initials: 'MC',
    role: 'Enseignant d\'histoire-géographie',
    subject: 'Histoire-Géo',
    unread: false,
    time: 'Hier',
    lastMessage: 'Voici les cartes complémentaires pour la révision.',
    messages: [
      {
        id: 'msg-cisse-1',
        sender: 'teacher',
        text: 'Bonjour Awa, voici les cartes complémentaires pour la révision de la Guerre froide.',
        attachment: {
          title: 'Repères géopolitiques et cartes',
          format: 'PDF',
          size: '1.8 Mo',
        },
        time: 'Hier',
      },
    ],
  },
];
