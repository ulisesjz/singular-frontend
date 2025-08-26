export interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  password: string;
  hasCompletedOnboarding?: boolean;
  cardsDetails:{ data: Card[]; lastUpdated: Date }
}

export type InfoStep = {
  title: string;
  subtitles: React.ReactNode[];
  action: string;
  cta: string;
  typeInput: 'info';
};

export type PauseStep = {
  _id: string;
  title: { mobile: string; desktop: string };
  subtitle: { mobile: string[]; desktop: string[] };
  action?: string;
  cta: { mobile: string; desktop: string };
  typeInput: 'pause';
  image?: boolean;
  skippable?: boolean;
  finish?: boolean;
};

export type QuestionStep = {
  _id: string;
  typeInput: string;
  title: string;
  subtitle?: string;
  options?: string[];
  required: boolean;
  orderNumber: number;
  createdAt: string;
  hasGuide?: boolean;
  fase?: number;
};

export type Step = InfoStep | PauseStep | QuestionStep;

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type CardImage = {
  url: string;
  alt: string;
};

export type Card = {
  title: string;
  description: string;
  prompt: string;
  images: CardImage[];
};

export type CardsResponse = {
  cards: Card[];
};