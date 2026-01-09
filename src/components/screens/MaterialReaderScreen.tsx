'use client';

import { FileText, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MaterialContent } from '@/types';

export function MaterialReaderScreen({
  material,
  onGoHome,
}: {
  material: MaterialContent;
  onGoHome: () => void;
}) {
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
          <h1 className="text-3xl font-bold">{material.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatFileSize(material.size)}
          </p>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans">
              {material.content}
            </pre>
          </CardContent>
        </Card>
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
