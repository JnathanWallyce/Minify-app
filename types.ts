
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface Church {
  id: string;
  name: string;
  type: 'HQ' | 'BRANCH'; // HQ = Igreja Mãe, BRANCH = Filial
  address?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  coverImage?: string;
  bio?: string;
  churchId: string; // Vínculo com a igreja
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    role: UserRole;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  type: 'announcement' | 'devotional' | 'event' | 'question';
  churchId: string; // Post pertence a uma igreja específica
  eventDate?: string; // Data do evento se type === 'event'
}

export interface NavItem {
  label: string;
  icon: any; // Lucide icon component type
  id: string;
  roles: UserRole[]; // Permissões de acesso
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum EventType {
  SERVICE = 'Culto',
  CLASS = 'Aula',
  MEETING = 'Reunião',
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string; // ISO String
  type: EventType;
  churchId: string;
  // Detalhes específicos
  details: {
    subtitle?: string; // Ex: "Lição 5: A Fé" ou "Tema: O Retorno"
    leader?: string; // Nome do Professor ou Pregador
    description?: string; // Resumo da aula ou liturgia
    location?: string; // Sala 3 ou Templo Principal
    lessonNumber?: string; // Apenas para aulas
  };
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  user?: string; 
  churchId: string; // Transação pertence a uma igreja específica
  installment?: string; // Ex: "1/12" para custos fixos ou parcelados
}

// --- NOVAS INTERFACES PARA GRUPOS ---

export interface Group {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  churchId: string;
  members: string[]; // IDs dos usuários
  meetingDay: string;
  meetingTime: string;
  location: string;
  image: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  content: string; // Texto ou URL/Identificador se for mídia
  type: 'text' | 'image' | 'audio' | 'sticker';
  timestamp: string;
  senderName?: string; // Opcional para facilitar display
  senderAvatar?: string;
}