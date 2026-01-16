#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');

const SUBDIRS = ['quizzes', 'flashcards', 'materials', 'audio-materials'];

const EXAMPLE_QUIZ = {
  title: 'Przykładowy Quiz',
  description: 'Opis quizu',
  questions: [
    {
      question: 'Przykładowe pytanie?',
      options: ['Odpowiedź A', 'Odpowiedź B', 'Odpowiedź C', 'Odpowiedź D'],
      correctAnswer: 0,
      explanation: 'Wyjaśnienie poprawnej odpowiedzi',
    },
  ],
};

const EXAMPLE_FLASHCARD = {
  title: 'Przykładowe Fiszki',
  description: 'Opis zestawu fiszek',
  category: 'Kategoria',
  cards: [
    {
      id: 1,
      front: 'Przód fiszki',
      back: 'Tył fiszki',
    },
  ],
};

function createSubjectFolders(subjectName, withExamples = false) {
  if (!subjectName) {
    console.error('❌ Błąd: Podaj nazwę przedmiotu jako argument');
    console.log('\nUżycie:');
    console.log('  node scripts/create-subject.js "Nazwa Przedmiotu"');
    console.log('  node scripts/create-subject.js "Nazwa Przedmiotu" --with-examples');
    process.exit(1);
  }

  const subjectDir = path.join(publicDir, subjectName);

  // Check if subject already exists
  if (fs.existsSync(subjectDir)) {
    console.error(`❌ Błąd: Przedmiot "${subjectName}" już istnieje w ${subjectDir}`);
    process.exit(1);
  }

  console.log(`\n📚 Tworzenie struktury dla przedmiotu: ${subjectName}\n`);

  // Create main subject directory
  fs.mkdirSync(subjectDir, { recursive: true });
  console.log(`✅ Utworzono: ${subjectDir}`);

  // Create subdirectories
  for (const subdir of SUBDIRS) {
    const subdirPath = path.join(subjectDir, subdir);
    fs.mkdirSync(subdirPath, { recursive: true });
    console.log(`  └─ ${subdir}/`);
  }

  // Create example files if requested
  if (withExamples) {
    console.log('\n📝 Tworzenie przykładowych plików...\n');

    // Example quiz
    const quizPath = path.join(subjectDir, 'quizzes', 'przykladowy-quiz.json');
    fs.writeFileSync(quizPath, JSON.stringify(EXAMPLE_QUIZ, null, 2), 'utf8');
    console.log(`  ✅ quizzes/przykladowy-quiz.json`);

    // Example flashcards
    const flashcardPath = path.join(subjectDir, 'flashcards', 'przykladowe-fiszki.json');
    fs.writeFileSync(flashcardPath, JSON.stringify(EXAMPLE_FLASHCARD, null, 2), 'utf8');
    console.log(`  ✅ flashcards/przykladowe-fiszki.json`);

    // Example material
    const materialPath = path.join(subjectDir, 'materials', 'przykladowy-material.txt');
    fs.writeFileSync(
      materialPath,
      `# ${subjectName}\n\nTo jest przykładowy materiał tekstowy.\n\n## Sekcja 1\n\nTreść sekcji...\n`,
      'utf8'
    );
    console.log(`  ✅ materials/przykladowy-material.txt`);

    // Placeholder for audio
    const audioReadmePath = path.join(subjectDir, 'audio-materials', '.gitkeep');
    fs.writeFileSync(audioReadmePath, '', 'utf8');
    console.log(`  ✅ audio-materials/.gitkeep`);
  }

  console.log('\n✨ Struktura utworzona pomyślnie!');
  console.log('\n📋 Następne kroki:');
  console.log(`  1. Dodaj pliki quizów do: ${subjectName}/quizzes/`);
  console.log(`  2. Dodaj fiszki do: ${subjectName}/flashcards/`);
  console.log(`  3. Dodaj materiały tekstowe do: ${subjectName}/materials/`);
  console.log(`  4. Dodaj materiały audio do: ${subjectName}/audio-materials/`);
  console.log('  5. Uruchom: bun run build (aby wygenerować manifest)\n');
}

// Parse arguments
const args = process.argv.slice(2);
const subjectName = args.find((arg) => !arg.startsWith('--'));
const withExamples = args.includes('--with-examples') || args.includes('-e');

createSubjectFolders(subjectName, withExamples);
