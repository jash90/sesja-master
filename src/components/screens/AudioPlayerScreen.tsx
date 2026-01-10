'use client';

import { useState } from 'react';
import { Headphones, Download, Pause, Volume2, Home, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AudioMaterial } from '@/types';

export function AudioPlayerScreen({
  audioMaterial,
  onGoHome,
}: {
  audioMaterial: AudioMaterial | null;
  onGoHome: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle audio play/pause
  const toggleAudio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle seek (click on progress bar)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef) {
      const newTime = parseFloat(e.target.value);
      audioRef.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Get audio URL (static or fallback to API)
  const getAudioUrl = () => {
    if (!audioMaterial) return '';
    return audioMaterial.url || `/api/audio-materials/${audioMaterial.id}`;
  };

  // Download audio file
  const downloadAudio = async () => {
    if (!audioMaterial) return;
    try {
      const audioUrl = getAudioUrl();
      const res = await fetch(audioUrl);
      if (!res.ok) throw new Error('Failed to download audio');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = audioMaterial.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Błąd podczas pobierania pliku');
    }
  };

  if (!audioMaterial) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <header className="p-6 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onGoHome}
            variant="ghost"
            className="mb-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Wróć do listy
          </Button>
          <h1 className="text-3xl font-bold">{audioMaterial.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {audioMaterial.format.toUpperCase()} • {formatFileSize(audioMaterial.size)}
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center space-y-8">
              {/* Audio Visual */}
              <div className="w-full max-w-2xl">
                <audio
                  ref={(ref) => setAudioRef(ref)}
                  src={getAudioUrl()}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={() => audioRef && setCurrentTime(audioRef.currentTime)}
                  onLoadedMetadata={() => audioRef && setDuration(audioRef.duration)}
                  className="w-full"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleAudio}
                  size="lg"
                  className="w-20 h-20 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>

                <Button
                  onClick={downloadAudio}
                  size="lg"
                  variant="outline"
                  className="w-20 h-20 rounded-full"
                >
                  <Download className="w-8 h-8" />
                </Button>
              </div>

              {/* Time Display and Progress Bar */}
              <div className="w-full max-w-md space-y-2">
                {/* Progress Bar */}
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                {/* Time Display */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>{isPlaying ? 'Odtwarzanie...' : 'Zatrzymane'}</span>
              </div>
            </div>
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
