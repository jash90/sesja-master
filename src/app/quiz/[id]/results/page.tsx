'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { ResultsScreen } from '@/components/screens/ResultsScreen';

export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    quiz,
    quizState,
    timeElapsed,
    loadQuiz,
    resetQuiz,
    clearQuiz,
    setSelectedSubject,
  } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);

  const quizId = params.id as string;
  const subject = searchParams.get('subject') || 'test';

  useEffect(() => {
    setSelectedSubject(subject);
  }, [subject, setSelectedSubject]);

  // Load quiz if not already loaded
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

  const handleTryAgain = () => {
    resetQuiz();
    router.push(`/quiz/${quizId}/question?subject=${encodeURIComponent(subject)}`);
  };

  const handleGoHome = () => {
    clearQuiz();
    router.push('/');
  };

  if (isLoading || !quiz || !quizState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">Ładowanie wyników...</div>
      </div>
    );
  }

  return (
    <ResultsScreen
      quiz={quiz}
      quizState={quizState}
      timeElapsed={timeElapsed}
      onTryAgain={handleTryAgain}
      onGoHome={handleGoHome}
    />
  );
}
