'use client';

import { Play, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Quiz } from '@/types';

interface QuestionThreshold {
  percent: number;
  count: number;
}

export function QuizStartScreen({
  quiz,
  questionLimit,
  onQuestionLimitChange,
  onStartQuiz,
  onGoHome,
}: {
  quiz: Quiz;
  questionLimit: number | null;
  onQuestionLimitChange: (limit: number) => void;
  onStartQuiz: () => void;
  onGoHome: () => void;
}) {
  const totalQuestions = quiz.questions.length;

  // Calculate thresholds as numbers
  const thresholds: QuestionThreshold[] = [
    { percent: 10, count: Math.max(1, Math.round(totalQuestions * 0.1)) },
    { percent: 50, count: Math.round(totalQuestions * 0.5) },
    { percent: 100, count: totalQuestions },
  ];

  // Remove duplicates (can happen with small quizzes)
  const uniqueThresholds = thresholds.filter(
    (threshold, index, self) =>
      index === self.findIndex((t) => t.count === threshold.count)
  );

  const currentLimit = questionLimit ?? totalQuestions;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{quiz.title}</CardTitle>
          {quiz.description && (
            <CardDescription className="text-base mt-2">{quiz.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary">{totalQuestions}</p>
              <p className="text-sm text-muted-foreground">pytań w quizie</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">odpowiedzi na pytanie</p>
            </div>
          </div>

          {/* Question count selection */}
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Ile pytań chcesz rozwiązać?
            </p>
            <div className="flex justify-center gap-3">
              {uniqueThresholds.map(({ percent, count }) => (
                <Button
                  key={percent}
                  variant={currentLimit === count ? 'default' : 'outline'}
                  onClick={() => onQuestionLimitChange(count)}
                  className="flex-1 max-w-[120px] h-auto py-3"
                >
                  <div className="text-center">
                    <div className="font-bold text-lg">{count}</div>
                    <div className="text-xs opacity-70">{percent}%</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={onStartQuiz} size="lg" className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Rozpocznij Quiz ({currentLimit} {currentLimit === 1 ? 'pytanie' : currentLimit < 5 ? 'pytania' : 'pytań'})
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
        </CardContent>
      </Card>
    </div>
  );
}
