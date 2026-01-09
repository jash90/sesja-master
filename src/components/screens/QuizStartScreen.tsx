'use client';

import { Play, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Quiz, QuizState } from '@/types';

export function QuizStartScreen({
  quiz,
  onStartQuiz,
  onGoHome,
}: {
  quiz: Quiz;
  onStartQuiz: () => void;
  onGoHome: () => void;
}) {
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
              <p className="text-3xl font-bold text-primary">{quiz.questions.length}</p>
              <p className="text-sm text-muted-foreground">pytań</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">odpowiedzi na pytanie</p>
            </div>
          </div>

          <Button onClick={onStartQuiz} size="lg" className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Rozpocznij Quiz
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
