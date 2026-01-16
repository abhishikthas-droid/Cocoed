export type SectionType = 'normal' | 'example' | 'warning' | 'highlight';

export interface StudySection {
  title: string;
  content: string;
  type: SectionType;
}

export interface StudyNote {
  topic: string;
  sections: StudySection[];
}

export interface SavedNote extends StudyNote {
  id: string;
  timestamp: number;
}

export enum AppView {
  GENERATOR = 'GENERATOR',
  SAVED = 'SAVED',
  AI_HELP = 'AI_HELP'
}