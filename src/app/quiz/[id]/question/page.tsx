'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { QuizQuestionScreen } from '@/components/screens/QuizQuestionScreen';

export default function QuizQuestionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    quiz,
    activeQuiz,
    quizState,
    selectedAnswer,
    timeElapsed,
    loadQuiz,
    startQuiz,
    setSelectedSubject,
    handleAnswerSelect,
    handleConfirmAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    startTimer,
  } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);

  const quizId = params.id as string;
  const subject = searchParams.get('subject') || 'test';

  useEffect(() => {
    setSelectedSubject(subject);
  }, [subject, setSelectedSubject]);

  // Load quiz if not already loaded, and start if activeQuiz is not set
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quiz) {
        try {
          setIsLoading(true);
          await loadQuiz(quizId);
        } catch (err) {
          console.error(err);
          router.push('/');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [quiz, quizId, loadQuiz, router]);

  // Start quiz if loaded but activeQuiz is not set (direct navigation)
  useEffect(() => {
    if (quiz && !activeQuiz && !isLoading) {
      startQuiz();
    }
  }, [quiz, activeQuiz, isLoading, startQuiz]);

  // Start timer when quiz is ready
  useEffect(() => {
    if (activeQuiz && quizState && !quizState.isFinished) {
      startTimer();
    }
  }, [activeQuiz, quizState, startTimer]);

  const handleNext = () => {
    const isFinished = handleNextQuestion();
    if (isFinished) {
      router.push(`/quiz/${quizId}/results?subject=${encodeURIComponent(subject)}`);
    }
  };

  if (isLoading || !activeQuiz || !quizState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <QuizQuestionScreen
      quiz={activeQuiz}
      quizState={quizState}
      selectedAnswer={selectedAnswer}
      handleAnswerSelect={handleAnswerSelect}
      handleConfirmAnswer={handleConfirmAnswer}
      handleNextQuestion={handleNext}
      handlePreviousQuestion={handlePreviousQuestion}
      timeElapsed={timeElapsed}
    />
  );
}
