export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizMetadata {
  id: string;
  filename: string;
  title: string;
  description: string;
  questionCount: number;
}

export interface QuizState {
  currentQuestion: number;
  answers: Map<number, number>;
  confirmedAnswers: Set<number>;
  isFinished: boolean;
  score: number;
}

export interface Material {
  id: string;
  filename: string;
  title: string;
  size: number;
  createdAt: Date;
}

export interface MaterialContent {
  id: string;
  filename: string;
  title: string;
  content: string;
  size: number;
  createdAt: Date;
}

export interface AudioMaterial {
  id: string;
  filename: string;
  title: string;
  size: number;
  format: string;
  createdAt: Date;
  url?: string;
}

export interface Flashcard {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: string;
  cardCount: number;
}

export interface FlashcardCard {
  id: number;
  front: string;
  back: string;
}

export interface FlashcardSet {
  title: string;
  description: string;
  category: string;
  cards: FlashcardCard[];
}

export type AppView =
  | 'home'
  | 'quiz-start'
  | 'quiz-question'
  | 'quiz-results'
  | 'material-reader'
  | 'audio-player'
  | 'flashcard-learn';
