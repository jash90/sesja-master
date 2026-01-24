'use client';

import { Play, Home, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FlashcardSet } from '@/types';

interface CardThreshold {
  percent: number;
  count: number;
}

export function FlashcardStartScreen({
  flashcardSet,
  cardLimit,
  onCardLimitChange,
  onStartFlashcards,
  onGoHome,
}: {
  flashcardSet: FlashcardSet;
  cardLimit: number | null;
  onCardLimitChange: (limit: number) => void;
  onStartFlashcards: () => void;
  onGoHome: () => void;
}) {
  const totalCards = flashcardSet.cards.length;

  // Calculate thresholds as numbers
  const thresholds: CardThreshold[] = [
    { percent: 10, count: Math.max(1, Math.round(totalCards * 0.1)) },
    { percent: 50, count: Math.round(totalCards * 0.5) },
    { percent: 100, count: totalCards },
  ];

  // Remove duplicates (can happen with small sets)
  const uniqueThresholds = thresholds.filter(
    (threshold, index, self) =>
      index === self.findIndex((t) => t.count === threshold.count)
  );

  const currentLimit = cardLimit ?? totalCards;

  // Polish grammar for cards
  const getCardWord = (count: number) => {
    if (count === 1) return 'fiszka';
    if (count >= 2 && count <= 4) return 'fiszki';
    return 'fiszek';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{flashcardSet.title}</CardTitle>
          {flashcardSet.description && (
            <CardDescription className="text-base mt-2">{flashcardSet.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary">{totalCards}</p>
              <p className="text-sm text-muted-foreground">{getCardWord(totalCards)} w zestawie</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary">{flashcardSet.category}</p>
              <p className="text-sm text-muted-foreground">kategoria</p>
            </div>
          </div>

          {/* Card count selection */}
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Ile fiszek chcesz przerobić?
            </p>
            <div className="flex justify-center gap-3">
              {uniqueThresholds.map(({ percent, count }) => (
                <Button
                  key={percent}
                  variant={currentLimit === count ? 'default' : 'outline'}
                  onClick={() => onCardLimitChange(count)}
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

          {/* Info about shuffling */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shuffle className="w-4 h-4" />
            <span>Fiszki zostaną wylosowane i pomieszane</span>
          </div>

          <Button onClick={onStartFlashcards} size="lg" className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Rozpocznij naukę ({currentLimit} {getCardWord(currentLimit)})
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
