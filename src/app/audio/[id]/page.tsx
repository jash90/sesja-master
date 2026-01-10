'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { AudioPlayerScreen } from '@/components/screens/AudioPlayerScreen';

export default function AudioPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentAudio, loadAudio, clearAudio, setSelectedSubject } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioId = params.id as string;
  const subject = searchParams.get('subject') || 'test';

  useEffect(() => {
    setSelectedSubject(subject);
  }, [subject, setSelectedSubject]);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadAudio(audioId);
      } catch (err) {
        setError('Błąd podczas ładowania pliku audio');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();
  }, [audioId, loadAudio]);

  const handleGoHome = () => {
    clearAudio();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">Ładowanie audio...</div>
      </div>
    );
  }

  if (error || !currentAudio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <div className="text-white text-xl mb-4">{error || 'Audio nie znalezione'}</div>
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
    <AudioPlayerScreen
      audioMaterial={currentAudio}
      onGoHome={handleGoHome}
    />
  );
}
