# 📚 SesjaMaster

**Multi-format Educational Learning Platform for Polish University Students**

SesjaMaster ("Exam Session Master") is a comprehensive web-based learning platform designed to help students prepare for exams through multiple learning modalities: interactive quizzes, flashcards, study materials, and audio lectures.

## ✨ Features

### 📝 Interactive Quizzes
- Multiple-choice questions with detailed explanations
- Real-time scoring and progress tracking
- Question-by-question navigation with answer confirmation
- Comprehensive results screen with performance analytics
- Timer functionality to simulate exam conditions

### 🎴 Flashcard Learning
- Spaced repetition learning with 3D card flip animations
- Shuffle functionality for randomized learning
- Progress tracking (cards viewed / total cards)
- Next/previous navigation through card sets
- Visual indicators for learning progress

### 📚 Study Materials
- Text-based learning materials viewer
- Clean, distraction-free reading interface
- Organized by subject and topic
- Easy navigation between materials

### 🎵 Audio Lectures
- Full-featured MP3 player with play/pause controls
- Progress bar with seek functionality
- Download capability for offline study
- Audio file metadata display
- Responsive audio controls

### 📂 Subject Organization
- Content organized by university courses
- Automatic subject discovery
- Subject-specific content filtering
- Easy-to-navigate subject selection interface

### 🌐 Multi-subject Support
Currently includes materials for:
- **Systemy Wspomagania Decyzji** (Decision Support Systems)
  - Data Mining & Exploration
  - Neural Networks
  - Frequent Patterns & Association Rules
- **Inżynieria transportu** (Transport Engineering)
  - Industry 4.0
  - Local & External Transport
  - Inventory & Warehousing
  - INCOTERMS 2020

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server (http://localhost:3000)
bun run dev

# Build for production (generates content manifest)
bun run build

# Start production server
bun start

# Lint code
bun run lint
```

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.3.8** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript 5** - Type-safe development
- **Bun** - Fast JavaScript runtime and package manager

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### State Management
- **React Context** - Global state with QuizContext provider
- **Zustand** - Available for additional state needs
- **TanStack Query** - Server state and caching capabilities

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - TypeScript-first schema validation

### Content Management
- **File-based system** - JSON files for quizzes and flashcards
- **Text files** - Plain text study materials
- **Audio files** - MP3 format for lectures
- **Manifest generation** - Automatic content indexing on build

### Optional Features
- **Prisma** - TypeScript ORM (configured but not required)
- **next-intl** - Internationalization support
- **NextAuth.js** - Authentication (available if needed)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── subjects/            # Subject listing
│   │   ├── quizzes/             # Quiz endpoints
│   │   ├── flashcards/          # Flashcard endpoints
│   │   ├── materials/           # Study materials endpoints
│   │   └── audio-materials/     # Audio file endpoints
│   ├── quiz/[id]/               # Quiz pages
│   ├── flashcards/[id]/         # Flashcard pages
│   ├── materials/[id]/          # Material pages
│   └── audio/[id]/              # Audio player pages
│
├── components/
│   ├── screens/                 # Screen-level components
│   │   ├── HomeScreen.tsx       # Main subject selection
│   │   ├── QuizStartScreen.tsx  # Quiz initialization
│   │   ├── QuizQuestionScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── FlashcardLearnerScreen.tsx
│   │   ├── MaterialReaderScreen.tsx
│   │   └── AudioPlayerScreen.tsx
│   └── ui/                      # shadcn/ui components
│
├── context/
│   └── QuizContext.tsx          # Global state management
│
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
└── types.ts                     # TypeScript definitions

public/
├── {Subject Name}/              # Subject folder (e.g., "Systemy Wspomagania Decyzji")
│   ├── quizzes/                # JSON quiz files
│   │   └── topic_quiz.json
│   ├── flashcards/             # JSON flashcard sets
│   │   └── topic_fiszki.json
│   ├── materials/              # Text study materials
│   │   └── topic_tekst.txt
│   └── audio-materials/        # MP3 audio files
│       └── topic.mp3
└── manifest.json               # Auto-generated content index
```

## 📝 Adding New Educational Content

### 1. Create Subject Folder
Create a folder in `public/` with your subject name (in Polish):
```
public/Nazwa Przedmiotu/
```

### 2. Add Quizzes
Create JSON files in `quizzes/` subdirectory:
```json
{
  "title": "Quiz Title",
  "description": "Optional description",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}
```

### 3. Add Flashcards
Create JSON files in `flashcards/` subdirectory:
```json
{
  "title": "Flashcard Set Title",
  "description": "Optional description",
  "category": "Category name",
  "cards": [
    {
      "id": 1,
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}
```

### 4. Add Study Materials
Add plain text files (`.txt`) in `materials/` subdirectory with your study content.

### 5. Add Audio Lectures
Add MP3 files in `audio-materials/` subdirectory.

### 6. Regenerate Manifest
Run the build command to update the content index:
```bash
bun run build
```

The pre-build script (`scripts/generate-manifest.js`) will automatically scan all subject folders and create an updated `manifest.json` file.

## 🏗️ Architecture Overview

### State Management
- **QuizContext** - Centralized state provider managing:
  - Quiz state (questions, answers, scoring, timer)
  - Content loading (materials, flashcards, audio)
  - Subject selection
  - Navigation state

### Content Loading
- Subject-based API routes with query parameters
- Dynamic content discovery via manifest
- File-system-based content storage
- Automatic content type detection

### Screen-Based Navigation
- Dedicated screen components for each view
- Context-based state sharing between screens
- Type-safe navigation with Next.js App Router

### Pre-Build Process
- Automatic manifest generation
- Content validation and indexing
- Metadata extraction from files

## 🌍 Language Support

The platform is designed for Polish university students:
- All UI text in Polish
- Educational content in Polish
- Subject names use Polish terminology
- Support for Polish characters in filenames and content

## 📄 License

This project is educational software. Please check with the maintainer for usage rights.

---

Built for Polish students preparing for university exams 🎓
