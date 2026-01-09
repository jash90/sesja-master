'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, RotateCcw, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { FlashcardSet, FlashcardCard } from '@/types';

export function FlashcardLearnerScreen({
  flashcardSet,
  onGoHome,
}: {
  flashcardSet: FlashcardSet;
  onGoHome: () => void;
}) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcardSet.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcardSet.cards.length) * 100;

  // Handle card flip
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Go to next card
  const handleNextCard = () => {
    if (currentCardIndex < flashcardSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  // Go to previous card
  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    } else {
      setCurrentCardIndex(flashcardSet.cards.length - 1);
      setIsFlipped(false);
    }
  };

  // Shuffle cards
  const handleShuffle = () => {
    const shuffled = [...flashcardSet.cards].sort(() => Math.random() - 0.5);
    onGoHome(); // Will trigger reload with new order
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <header className="p-6 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onGoHome}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wróć do listy
          </Button>
          <h1 className="text-3xl font-bold">{flashcardSet.title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-muted-foreground">
              {flashcardSet.category}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {currentCardIndex + 1} z {flashcardSet.cards.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </div>
      </header>

      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <Card
            className="cursor-pointer transition-all hover:shadow-xl overflow-hidden p-0"
            style={{ perspective: '1000px', minHeight: '400px' }}
            onClick={handleCardFlip}
          >
            <div
              className="relative w-full h-[400px] transition-transform duration-500"
              style={{
                transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front of card */}
              <div
                className="absolute inset-0 flex items-center justify-center p-8 backface-hidden bg-card rounded-xl"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                }}
              >
                <div className="text-center w-full h-full flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-primary">{currentCard.front}</h2>
                </div>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 flex items-center justify-center p-8 bg-primary text-primary-foreground backface-hidden rounded-xl"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-center w-full h-full flex items-center justify-center">
                  <h2 className="text-2xl font-bold">{currentCard.back}</h2>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={handlePreviousCard}
              disabled={currentCardIndex === 0}
              variant="outline"
              size="lg"
              className="w-20 h-20 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              onClick={handleShuffle}
              variant="outline"
              size="lg"
              className="w-20 h-20 rounded-full"
              title="Pomieszaj karty"
            >
              <RotateCcw className="w-8 h-8" />
            </Button>

            <Button
              onClick={handleNextCard}
              variant="outline"
              size="lg"
              className="w-20 h-20 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Kliknij na kartę, aby zobaczyć odpowiedź
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 border-t bg-background/80 backdrop-blur-sm mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <Button
            onClick={onGoHome}
            variant="outline"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Wróć do strony głównej
          </Button>
        </div>
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground mt-4">
          © 2026 SesjaMaster
        </div>
      </footer>
    </div>
  );
}
