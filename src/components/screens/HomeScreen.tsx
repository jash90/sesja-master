'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, BookOpen, Loader2, FileText, Headphones, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { QuizMetadata, Material, AudioMaterial, Flashcard } from '@/types';

export function HomeScreen({
  selectedSubject,
  onSelectSubject,
}: {
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizMetadata[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [audioMaterials, setAudioMaterials] = useState<AudioMaterial[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);

  // Load subjects
  useEffect(() => {
    fetch('/api/subjects')
      .then((res) => res.json())
      .then((data) => {
        const loadedSubjects = data.subjects || [];
        setSubjects(loadedSubjects);
        // Auto-select first subject if current doesn't exist
        if (loadedSubjects.length > 0 && !loadedSubjects.includes(selectedSubject)) {
          onSelectSubject(loadedSubjects[0]);
        }
        setLoadingSubjects(false);
      })
      .catch((error) => {
        console.error('Error loading subjects:', error);
        setLoadingSubjects(false);
      });
  }, []);

  // Load data based on selected subject
  useEffect(() => {
    setLoadingQuizzes(true);
    fetch(`/api/quizzes?subject=${encodeURIComponent(selectedSubject)}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data.quizzes || []);
        setLoadingQuizzes(false);
      })
      .catch((error) => {
        console.error('Error loading quizzes:', error);
        setLoadingQuizzes(false);
      });
  }, [selectedSubject]);

  useEffect(() => {
    setLoadingMaterials(true);
    fetch(`/api/materials?subject=${encodeURIComponent(selectedSubject)}`)
      .then((res) => res.json())
      .then((data) => {
        setMaterials(data.materials || []);
        setLoadingMaterials(false);
      })
      .catch((error) => {
        console.error('Error loading materials:', error);
        setLoadingMaterials(false);
      });
  }, [selectedSubject]);

  useEffect(() => {
    setLoadingAudio(true);
    fetch(`/api/audio-materials?subject=${encodeURIComponent(selectedSubject)}`)
      .then((res) => res.json())
      .then((data) => {
        setAudioMaterials(data.audioMaterials || []);
        setLoadingAudio(false);
      })
      .catch((error) => {
        console.error('Error loading audio materials:', error);
        setLoadingAudio(false);
      });
  }, [selectedSubject]);

  useEffect(() => {
    setLoadingFlashcards(true);
    fetch(`/api/flashcards?subject=${encodeURIComponent(selectedSubject)}`)
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data.flashcards || []);
        setLoadingFlashcards(false);
      })
      .catch((error) => {
        console.error('Error loading flashcards:', error);
        setLoadingFlashcards(false);
      });
  }, [selectedSubject]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <header className="p-6 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">SesjaMaster</h1>
              <p className="text-muted-foreground mt-1">Quizy i materiały do nauki</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Przedmiot:</span>
              {loadingSubjects ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => onSelectSubject(e.target.value)}
                    className="appearance-none bg-background border rounded-md px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="quizzes" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="quizzes">Quizy</TabsTrigger>
              <TabsTrigger value="materials">Teksty</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="flashcards">Fiszki</TabsTrigger>
            </TabsList>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="mt-6">
              {loadingQuizzes ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : quizzes.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Brak dostępnych quizów</h3>
                  <p className="text-muted-foreground mb-4">
                    Dodaj pliki JSON do folderu <code className="bg-muted px-2 py-1 rounded">/public/quizzes</code>
                  </p>
                  <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
                    <h4 className="font-semibold mb-3">Format pliku JSON:</h4>
                    <pre className="text-xs bg-background rounded p-4 overflow-x-auto text-left">
{`{
  "title": "Tytuł quizu",
  "description": "Opcjonalny opis",
  "questions": [
    {
      "question": "Treść pytania?",
      "options": ["Odp A", "Odp B", "Odp C", "Odp D"],
      "correctAnswer": 0,
      "explanation": "Wyjaśnienie odpowiedzi"
    }
  ]
}`}
                    </pre>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.map((quizMeta) => (
                    <Link key={quizMeta.id} href={`/quiz/${quizMeta.id}?subject=${encodeURIComponent(selectedSubject)}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 group h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                                {quizMeta.title}
                              </CardTitle>
                              {quizMeta.description && (
                                <CardDescription className="line-clamp-2">
                                  {quizMeta.description}
                                </CardDescription>
                              )}
                            </div>
                            <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-semibold text-primary">{quizMeta.questionCount}</span>
                              <span>pytań</span>
                            </div>
                            <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                              <Play className="w-4 h-4 mr-1" />
                              Rozpocznij
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="mt-6">
              {loadingMaterials ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : materials.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Brak dostępnych materiałów</h3>
                  <p className="text-muted-foreground mb-4">
                    Dodaj pliki tekstowe do folderu <code className="bg-muted px-2 py-1 rounded">/public/materials</code>
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((material) => (
                    <Link key={material.id} href={`/materials/${material.id}?subject=${encodeURIComponent(selectedSubject)}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 group h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                                {material.title}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {formatFileSize(material.size)}
                              </CardDescription>
                            </div>
                            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <FileText className="w-4 h-4 mr-1" />
                            Czytaj
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Audio Materials Tab */}
            <TabsContent value="audio" className="mt-6">
              {loadingAudio ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : audioMaterials.length === 0 ? (
                <Card className="p-12 text-center">
                  <Headphones className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Brak dostępnych materiałów audio</h3>
                  <p className="text-muted-foreground mb-4">
                    Dodaj pliki MP3 do folderu <code className="bg-muted px-2 py-1 rounded">/public/audio-materials</code>
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {audioMaterials.map((audioMaterial) => (
                    <Link key={audioMaterial.id} href={`/audio/${audioMaterial.id}?subject=${encodeURIComponent(selectedSubject)}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 group h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                                {audioMaterial.title}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {audioMaterial.format.toUpperCase()} • {formatFileSize(audioMaterial.size)}
                              </CardDescription>
                            </div>
                            <Headphones className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Play className="w-4 h-4 mr-1" />
                            Odtwórz
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Flashcards Tab */}
            <TabsContent value="flashcards" className="mt-6">
              {loadingFlashcards ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : flashcards.length === 0 ? (
                <Card className="p-12 text-center">
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Brak dostępnych fiszek</h3>
                  <p className="text-muted-foreground mb-4">
                    Dodaj pliki JSON do folderu <code className="bg-muted px-2 py-1 rounded">/public/flashcards</code>
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flashcards.map((flashcard) => (
                    <Link key={flashcard.id} href={`/flashcards/${flashcard.id}?subject=${encodeURIComponent(selectedSubject)}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 group h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                                {flashcard.title}
                              </CardTitle>
                              {flashcard.description && (
                                <CardDescription className="line-clamp-2">
                                  {flashcard.description}
                                </CardDescription>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  {flashcard.category}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {flashcard.cardCount} kart
                                </span>
                              </div>
                            </div>
                            <RefreshCw className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Ćwicz
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="p-4 border-t bg-background/80 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 SesjaMaster
        </div>
      </footer>
    </div>
  );
}
