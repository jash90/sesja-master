'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Quiz, QuizState, FlashcardSet, AudioMaterial, MaterialContent, PdfDocument } from '@/types';
import { generateShuffledIndices } from '@/lib/utils';

interface QuizContextType {
  // Quiz state
  quiz: Quiz | null;
  quizState: QuizState | null;
  selectedAnswer: number | null;
  timeElapsed: number;

  // Question limit state
  questionLimit: number | null;
  setQuestionLimit: (limit: number | null) => void;
  activeQuiz: Quiz | null; // Quiz with selected questions

  // Content state
  currentMaterial: MaterialContent | null;
  currentAudio: AudioMaterial | null;
  currentFlashcardSet: FlashcardSet | null;
  currentPdf: PdfDocument | null;

  // Subject
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;

  // Quiz actions
  loadQuiz: (quizId: string) => Promise<void>;
  startQuiz: () => void;
  resetQuiz: () => void;
  handleAnswerSelect: (answerIndex: number) => void;
  handleConfirmAnswer: () => void;
  handleNextQuestion: () => boolean; // returns true if quiz finished
  handlePreviousQuestion: () => void;
  setSelectedAnswer: (answer: number | null) => void;
  clearQuiz: () => void;

  // Content actions
  loadMaterial: (materialId: string) => Promise<void>;
  loadAudio: (audioId: string) => Promise<void>;
  loadFlashcardSet: (flashcardId: string) => Promise<void>;
  loadPdf: (pdfId: string) => Promise<void>;
  clearMaterial: () => void;
  clearAudio: () => void;
  clearFlashcardSet: () => void;
  clearPdf: () => void;

  // Timer control
  startTimer: () => void;
  stopTimer: () => void;
  isTimerRunning: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Helper function to select random questions
function selectRandomQuestions(questions: Quiz['questions'], limit: number): Quiz['questions'] {
  if (limit >= questions.length) {
    return questions;
  }
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export function QuizProvider({ children }: { children: ReactNode }) {
  // Quiz state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null); // Quiz with selected questions
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);

  // Content state
  const [currentMaterial, setCurrentMaterial] = useState<MaterialContent | null>(null);
  const [currentAudio, setCurrentAudio] = useState<AudioMaterial | null>(null);
  const [currentFlashcardSet, setCurrentFlashcardSet] = useState<FlashcardSet | null>(null);
  const [currentPdf, setCurrentPdf] = useState<PdfDocument | null>(null);

  // Subject
  const [selectedSubject, setSelectedSubject] = useState<string>('test');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const isQuizActive = isTimerRunning && quizState && !quizState.isFinished;
    if (isQuizActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, quizState?.isFinished]);

  // Timer control
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  // Load quiz by ID (does NOT start the quiz, just loads data)
  const loadQuiz = useCallback(async (quizId: string) => {
    try {
      const res = await fetch(`/api/quiz/${quizId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load quiz');
      const quizData: Quiz = await res.json();
      setQuiz(quizData);
      setActiveQuiz(null);
      setQuizState(null);
      setSelectedAnswer(null);
      setTimeElapsed(0);
      // Default to all questions
      setQuestionLimit(quizData.questions.length);
    } catch (error) {
      console.error('Error loading quiz:', error);
      throw error;
    }
  }, [selectedSubject]);

  // Start quiz with selected number of questions
  const startQuiz = useCallback(() => {
    if (!quiz) return;

    const limit = questionLimit ?? quiz.questions.length;
    const selectedQuestions = selectRandomQuestions(quiz.questions, limit);

    const quizWithSelectedQuestions: Quiz = {
      ...quiz,
      questions: selectedQuestions,
    };

    setActiveQuiz(quizWithSelectedQuestions);

    // Initialize quiz state with shuffled answer indices
    const optionsCount = selectedQuestions[0]?.options.length ?? 4;
    setQuizState({
      currentQuestion: 0,
      answers: new Map(),
      confirmedAnswers: new Set(),
      isFinished: false,
      score: 0,
      shuffledIndices: generateShuffledIndices(selectedQuestions.length, optionsCount),
    });
    setSelectedAnswer(null);
    setTimeElapsed(0);
  }, [quiz, questionLimit]);

  // Reset quiz state (re-selects questions based on current limit)
  const resetQuiz = useCallback(() => {
    if (!quiz) return;

    const limit = questionLimit ?? quiz.questions.length;
    const selectedQuestions = selectRandomQuestions(quiz.questions, limit);

    const quizWithSelectedQuestions: Quiz = {
      ...quiz,
      questions: selectedQuestions,
    };

    setActiveQuiz(quizWithSelectedQuestions);

    const optionsCount = selectedQuestions[0]?.options.length ?? 4;
    setQuizState({
      currentQuestion: 0,
      answers: new Map(),
      confirmedAnswers: new Set(),
      isFinished: false,
      score: 0,
      shuffledIndices: generateShuffledIndices(selectedQuestions.length, optionsCount),
    });
    setSelectedAnswer(null);
    setTimeElapsed(0);
    setIsTimerRunning(false);
  }, [quiz, questionLimit]);

  // Clear quiz completely
  const clearQuiz = useCallback(() => {
    setQuiz(null);
    setActiveQuiz(null);
    setQuizState(null);
    setSelectedAnswer(null);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setQuestionLimit(null);
  }, []);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    const questionIndex = quizState?.currentQuestion ?? 0;
    if (quizState?.confirmedAnswers.has(questionIndex)) return;
    setSelectedAnswer(answerIndex);
  }, [quizState]);

  // Confirm answer
  const handleConfirmAnswer = useCallback(() => {
    if (!activeQuiz || !quizState || selectedAnswer === null) return;

    const questionIndex = quizState.currentQuestion;
    const newAnswers = new Map(quizState.answers);
    newAnswers.set(questionIndex, selectedAnswer);

    const isCorrect = selectedAnswer === activeQuiz.questions[questionIndex].correctAnswer;
    const newScore = quizState.score + (isCorrect ? 1 : 0);

    const newConfirmed = new Set(quizState.confirmedAnswers);
    newConfirmed.add(questionIndex);

    setQuizState({
      ...quizState,
      answers: newAnswers,
      confirmedAnswers: newConfirmed,
      score: newScore,
    });
  }, [activeQuiz, quizState, selectedAnswer]);

  // Move to next question - returns true if quiz finished
  const handleNextQuestion = useCallback((): boolean => {
    if (!activeQuiz || !quizState) return false;

    if (quizState.currentQuestion < activeQuiz.questions.length - 1) {
      const nextQuestionIndex = quizState.currentQuestion + 1;
      setQuizState({
        ...quizState,
        currentQuestion: nextQuestionIndex,
      });
      setSelectedAnswer(quizState.answers.get(nextQuestionIndex) ?? null);
      return false;
    } else {
      setQuizState({
        ...quizState,
        isFinished: true,
      });
      setIsTimerRunning(false);
      return true;
    }
  }, [activeQuiz, quizState]);

  // Move to previous question
  const handlePreviousQuestion = useCallback(() => {
    if (!activeQuiz || !quizState || quizState.currentQuestion === 0) return;

    const prevQuestionIndex = quizState.currentQuestion - 1;
    setQuizState({
      ...quizState,
      currentQuestion: prevQuestionIndex,
    });
    setSelectedAnswer(quizState.answers.get(prevQuestionIndex) ?? null);
  }, [activeQuiz, quizState]);

  // Load material by ID
  const loadMaterial = useCallback(async (materialId: string) => {
    try {
      const res = await fetch(`/api/materials/${materialId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load material');
      const materialData = await res.json();
      setCurrentMaterial(materialData);
    } catch (error) {
      console.error('Error loading material:', error);
      throw error;
    }
  }, [selectedSubject]);

  // Load flashcard set by ID
  const loadFlashcardSet = useCallback(async (flashcardId: string) => {
    try {
      const res = await fetch(`/api/flashcards/${flashcardId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load flashcard set');
      const flashcardData = await res.json();
      setCurrentFlashcardSet(flashcardData);
    } catch (error) {
      console.error('Error loading flashcard set:', error);
      throw error;
    }
  }, [selectedSubject]);

  // Load audio material by ID
  const loadAudio = useCallback(async (audioId: string) => {
    try {
      const res = await fetch(`/api/audio-materials/${audioId}/info?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load audio info');
      const audioData = await res.json();
      setCurrentAudio(audioData);
    } catch (error) {
      console.error('Error loading audio:', error);
      throw error;
    }
  }, [selectedSubject]);

  // Load PDF by ID
  const loadPdf = useCallback(async (pdfId: string) => {
    try {
      const res = await fetch(`/api/pdfs/${pdfId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load PDF');
      const pdfData = await res.json();
      setCurrentPdf(pdfData);
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw error;
    }
  }, [selectedSubject]);

  // Clear content
  const clearMaterial = useCallback(() => setCurrentMaterial(null), []);
  const clearAudio = useCallback(() => setCurrentAudio(null), []);
  const clearFlashcardSet = useCallback(() => setCurrentFlashcardSet(null), []);
  const clearPdf = useCallback(() => setCurrentPdf(null), []);

  const value: QuizContextType = {
    quiz,
    quizState,
    selectedAnswer,
    timeElapsed,
    questionLimit,
    setQuestionLimit,
    activeQuiz,
    currentMaterial,
    currentAudio,
    currentFlashcardSet,
    currentPdf,
    selectedSubject,
    setSelectedSubject,
    loadQuiz,
    startQuiz,
    resetQuiz,
    handleAnswerSelect,
    handleConfirmAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    setSelectedAnswer,
    clearQuiz,
    loadMaterial,
    loadAudio,
    loadFlashcardSet,
    loadPdf,
    clearMaterial,
    clearAudio,
    clearFlashcardSet,
    clearPdf,
    startTimer,
    stopTimer,
    isTimerRunning,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
