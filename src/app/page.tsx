'use client';

import { useState, useEffect } from 'react';
import type { AppView, Quiz, QuizState, FlashcardSet, AudioMaterial, MaterialContent, FlashcardCard } from '@/types';

import { HomeScreen } from '@/components/screens/HomeScreen';
import { QuizStartScreen } from '@/components/screens/QuizStartScreen';
import { QuizQuestionScreen } from '@/components/screens/QuizQuestionScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';
import { MaterialReaderScreen } from '@/components/screens/MaterialReaderScreen';
import { AudioPlayerScreen } from '@/components/screens/AudioPlayerScreen';
import { FlashcardLearnerScreen } from '@/components/screens/FlashcardLearnerScreen';

export default function QuizApp() {
  const [view, setView] = useState<AppView>('home');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [currentMaterial, setCurrentMaterial] = useState<MaterialContent | null>(null);
  const [currentAudio, setCurrentAudio] = useState<AudioMaterial | null>(null);

  const [currentFlashcardSet, setCurrentFlashcardSet] = useState<FlashcardSet | null>(null);

  // Subject selection state
  const [selectedSubject, setSelectedSubject] = useState<string>('test');

  // Timer for quiz - increments every second when quiz is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (view === 'quiz-question' && quizState && !quizState.isFinished) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, quizState?.isFinished]);

  // Load quiz by ID
  const loadQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quiz/${quizId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load quiz');
      const quizData = await res.json();
      setQuiz(quizData);
      setView('quiz-start');
      resetQuiz();
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Błąd podczas ładowania quizu');
    }
  };

  // Load material by ID
  const loadMaterial = async (materialId: string) => {
    try {
      const res = await fetch(`/api/materials/${materialId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load material');
      const materialData = await res.json();
      setCurrentMaterial(materialData);
      setView('material-reader');
    } catch (error) {
      console.error('Error loading material:', error);
      alert('Błąd podczas ładowania materiału');
    }
  };

  // Load flashcard set by ID
  const loadFlashcardSet = async (flashcardId: string) => {
    try {
      const res = await fetch(`/api/flashcards/${flashcardId}?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load flashcard set');
      const flashcardData = await res.json();
      setCurrentFlashcardSet(flashcardData);
      setView('flashcard-learn');
    } catch (error) {
      console.error('Error loading flashcard set:', error);
      alert('Błąd podczas ładowania fiszki');
    }
  };

  // Load audio material by ID
  const loadAudio = async (audioId: string) => {
    try {
      const res = await fetch(`/api/audio-materials/${audioId}/info?subject=${encodeURIComponent(selectedSubject)}`);
      if (!res.ok) throw new Error('Failed to load audio info');
      const audioData = await res.json();
      setCurrentAudio(audioData);
      setView('audio-player');
    } catch (error) {
      console.error('Error loading audio:', error);
      alert('Błąd podczas ładowania pliku audio');
    }
  };

  // Reset quiz state
  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: new Map(),
      confirmedAnswers: new Set(),
      isFinished: false,
      score: 0,
    });
    setSelectedAnswer(null);
    setTimeElapsed(0);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const questionIndex = quizState?.currentQuestion ?? 0;
    if (quizState?.confirmedAnswers.has(questionIndex)) return;
    setSelectedAnswer(answerIndex);
  };

  // Confirm answer
  const handleConfirmAnswer = () => {
    if (!quiz || !quizState || selectedAnswer === null) return;

    const questionIndex = quizState.currentQuestion;
    const newAnswers = new Map(quizState.answers);
    newAnswers.set(questionIndex, selectedAnswer);

    const isCorrect = selectedAnswer === quiz.questions[questionIndex].correctAnswer;
    const newScore = quizState.score + (isCorrect ? 1 : 0);

    const newConfirmed = new Set(quizState.confirmedAnswers);
    newConfirmed.add(questionIndex);

    setQuizState({
      ...quizState,
      answers: newAnswers,
      confirmedAnswers: newConfirmed,
      score: newScore,
    });
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (!quiz || !quizState) return;

    if (quizState.currentQuestion < quiz.questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
      });
      const nextQuestionIndex = quizState.currentQuestion + 1;
      setSelectedAnswer(quizState.answers.get(nextQuestionIndex) ?? null);
    } else {
      setQuizState({
        ...quizState,
        isFinished: true,
      });
      setView('quiz-results');
    }
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (!quiz || !quizState || quizState.currentQuestion === 0) return;

    const prevQuestionIndex = quizState.currentQuestion - 1;
    setQuizState({
      ...quizState,
      currentQuestion: prevQuestionIndex,
    });
    setSelectedAnswer(quizState.answers.get(prevQuestionIndex) ?? null);
  };

  // Main render
  switch (view) {
    case 'home':
      return (
        <HomeScreen
          setView={setView}
          onLoadQuiz={loadQuiz}
          onLoadMaterial={loadMaterial}
          onLoadAudio={loadAudio}
          onLoadFlashcardSet={loadFlashcardSet}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
        />
      );
    case 'quiz-start':
      if (!quiz) return null;
      return (
        <QuizStartScreen
          quiz={quiz}
          onStartQuiz={() => setView('quiz-question')}
          onGoHome={() => {
            setQuiz(null);
            setView('home');
          }}
        />
      );
    case 'quiz-question':
      if (!quiz || !quizState) return null;
      return (
        <QuizQuestionScreen
          quiz={quiz}
          quizState={quizState}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          handleAnswerSelect={handleAnswerSelect}
          handleConfirmAnswer={handleConfirmAnswer}
          handleNextQuestion={handleNextQuestion}
          handlePreviousQuestion={handlePreviousQuestion}
          timeElapsed={timeElapsed}
        />
      );
    case 'quiz-results':
      if (!quiz || !quizState) return null;
      return (
        <ResultsScreen
          quiz={quiz}
          quizState={quizState}
          timeElapsed={timeElapsed}
          onTryAgain={() => {
            resetQuiz();
            setView('quiz-question');
          }}
          onGoHome={() => {
            setQuiz(null);
            setQuizState(null);
            setView('home');
          }}
        />
      );
    case 'material-reader':
      if (!currentMaterial) return null;
      return (
        <MaterialReaderScreen
          material={currentMaterial}
          onGoHome={() => {
            setCurrentMaterial(null);
            setView('home');
          }}
        />
      );
    case 'audio-player':
      if (!currentAudio) return null;
      return (
        <AudioPlayerScreen
          audioMaterial={currentAudio}
          onGoHome={() => {
            setCurrentAudio(null);
            setView('home');
          }}
        />
      );
    case 'flashcard-learn':
      if (!currentFlashcardSet) return null;
      return (
        <FlashcardLearnerScreen
          flashcardSet={currentFlashcardSet}
          onGoHome={() => {
            setCurrentFlashcardSet(null);
            setView('home');
          }}
        />
      );
    default:
      return <HomeScreen setView={setView} onLoadQuiz={loadQuiz} onLoadMaterial={loadMaterial} onLoadAudio={loadAudio} onLoadFlashcardSet={loadFlashcardSet} selectedSubject={selectedSubject} onSelectSubject={setSelectedSubject} />;
  }
}
