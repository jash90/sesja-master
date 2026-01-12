'use client';

import { ChevronRight, ChevronLeft, Clock, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Quiz, QuizState } from '@/types';

export function QuizQuestionScreen({
  quiz,
  quizState,
  selectedAnswer,
  handleAnswerSelect,
  handleConfirmAnswer,
  handleNextQuestion,
  handlePreviousQuestion,
  timeElapsed,
}: {
  quiz: Quiz;
  quizState: QuizState;
  selectedAnswer: number | null;
  handleAnswerSelect: (answer: number) => void;
  handleConfirmAnswer: () => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  timeElapsed: number;
}) {
  const currentQuestion = quiz.questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quiz.questions.length) * 100;
  const hasAnswered = quizState.confirmedAnswers.has(quizState.currentQuestion);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-background to-secondary/20">
      <header className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold truncate">{quiz.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Pytanie {quizState.currentQuestion + 1} z {quiz.questions.length}
        </p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizState.shuffledIndices[quizState.currentQuestion].map((originalIndex, displayIndex) => {
              const option = currentQuestion.options[originalIndex];
              let variant: 'default' | 'outline' | 'correct' | 'wrong' = 'default';
              let disabled = false;

              if (hasAnswered) {
                disabled = true;
                const savedAnswer = quizState.answers.get(quizState.currentQuestion);
                if (originalIndex === currentQuestion.correctAnswer) {
                  variant = 'correct';
                } else if (originalIndex === savedAnswer && savedAnswer !== currentQuestion.correctAnswer) {
                  variant = 'wrong';
                } else {
                  variant = 'outline';
                }
              } else if (selectedAnswer === originalIndex) {
                variant = 'default';
              } else {
                variant = 'outline';
              }

              const savedOriginalAnswer = quizState.answers.get(quizState.currentQuestion);
              const isUserWrong = savedOriginalAnswer !== undefined && savedOriginalAnswer !== currentQuestion.correctAnswer && originalIndex === savedOriginalAnswer;

              return (
                <button
                  key={displayIndex}
                  onClick={() => handleAnswerSelect(originalIndex)}
                  disabled={disabled}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    variant === 'correct'
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-400'
                      : variant === 'wrong'
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-400'
                      : variant === 'default'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-semibold min-w-[24px]">{displayIndex + 1}.</span>
                    <span>{option}</span>
                    {hasAnswered && originalIndex === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto flex-shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isUserWrong && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}

            {hasAnswered && currentQuestion.explanation && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Wyjaśnienie:</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="max-w-4xl mx-auto w-full pb-4">
        <div className="flex gap-4">
          <Button
            onClick={handlePreviousQuestion}
            disabled={quizState.currentQuestion === 0}
            variant="outline"
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Cofnij
          </Button>

          {!hasAnswered ? (
            <Button
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              size="lg"
              className="flex-1"
            >
              Potwierdź odpowiedź
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              size="lg"
              className="flex-1"
            >
              {quizState.currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Następne pytanie
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Zobacz wyniki
                  <Trophy className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
