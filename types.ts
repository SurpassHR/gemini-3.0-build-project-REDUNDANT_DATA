
export enum Section {
  OUTLINE = 'OUTLINE',
  TIMELINE = 'TIMELINE',
  WORLD = 'WORLD',
  CHAPTERS = 'CHAPTERS',
  ECHO = 'ECHO'
}

export interface Chapter {
  id: number;
  title: string;
  enTitle: string;
  coreEvent: string;
  plot: string[];
  theme: string[];
  // Expanded field for full text
  storyContent: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  desc: string;
  traits: string[];
  // Expanded fields
  clearanceLevel: string;
  status: string;
  psychProfile: string;
  history: string;
  quote: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  type: 'personal' | 'world'; 
  // Expanded fields for modal
  fullDate?: string;
  details?: string[];
  impact?: string;
}

export interface WorldItem {
  title: string;
  id: string;
  desc: string;
  icon: string;
  // Expanded fields
  specs: string[];
  history: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'PHENOMENON' | 'PROTOCOL';
}
