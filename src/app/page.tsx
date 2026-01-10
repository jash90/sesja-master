'use client';

import { HomeScreen } from '@/components/screens/HomeScreen';
import { useQuiz } from '@/context/QuizContext';

export default function HomePage() {
  const { selectedSubject, setSelectedSubject } = useQuiz();

  return (
    <HomeScreen
      selectedSubject={selectedSubject}
      onSelectSubject={setSelectedSubject}
    />
  );
}
