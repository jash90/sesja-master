'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { QuizStartScreen } from '@/components/screens/QuizStartScreen';

export default function QuizStartPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { quiz, loadQuiz, setSelectedSubject } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quizId = params.id as string;
  const subject = searchParams.get('subject') || 'test';

  useEffect(() => {
    setSelectedSubject(subject);
  }, [subject, setSelectedSubject]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadQuiz(quizId);
      } catch (err) {
        setError('Błąd podczas ładowania quizu');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, loadQuiz]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">Ładowanie quizu...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <div className="text-white text-xl mb-4">{error || 'Quiz nie znaleziony'}</div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizStartScreen
      quiz={quiz}
      onStartQuiz={() => router.push(`/quiz/${quizId}/question?subject=${encodeURIComponent(subject)}`)}
      onGoHome={() => router.push('/')}
    />
  );
}
