'use client';

import { Home, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Quiz, QuizState } from '@/types';

export function ResultsScreen({
  quiz,
  quizState,
  onTryAgain,
  onGoHome,
}: {
  quiz: Quiz;
  quizState: QuizState;
  onTryAgain: () => void;
  onGoHome: () => void;
}) {
  // Calculate score percentage
  const getScorePercentage = () => {
    return Math.round((quizState.score / quiz.questions.length) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-background to-secondary/20">
      <header className="max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold">Wyniki Quizu</h1>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full py-8 space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">{quiz.title}</CardTitle>
            <CardDescription>Quiz zakończony!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className={getScoreColor()}
                    strokeDasharray={`${getScorePercentage() * 3.52} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor()}`}>
                    {getScorePercentage()}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold">{quizState.score}</p>
                <p className="text-sm text-muted-foreground">poprawnych</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold">{quiz.questions.length - quizState.score}</p>
                <p className="text-sm text-muted-foreground">błędnych</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold">{formatTime(quizState.timeElapsed)}</p>
                <p className="text-sm text-muted-foreground">czas</p>
              </div>
            </div>

            {getScorePercentage() >= 80 && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4">
                <p className="text-yellow-900 dark:text-yellow-100 font-semibold text-center">
                  🎉 Świetna robota! Znasz się na tym temacie!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szczegółowe wyniki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {quiz.questions.map((q, index) => {
                const userAnswer = quizState.answers.get(index);
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">Pytanie {index + 1}: {q.question}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Twoja odpowiedź:{' '}
                            <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {userAnswer !== undefined ? q.options[userAnswer] : 'Brak odpowiedzi'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-muted-foreground">
                              Poprawna odpowiedź:{' '}
                              <span className="text-green-600 dark:text-green-400">
                                {q.options[q.correctAnswer]}
                              </span>
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-muted-foreground mt-2 italic">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="max-w-4xl mx-auto w-full pb-4 space-y-2">
        <Button onClick={onTryAgain} size="lg" className="w-full">
          <Play className="w-5 h-5 mr-2" />
          Spróbuj ponownie
        </Button>
        <Button
          onClick={onGoHome}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <Home className="w-5 h-5 mr-2" />
          Wróć do strony głównej
        </Button>
      </footer>
    </div>
  );
}
