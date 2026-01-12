# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An educational quiz and learning platform built with Next.js 15, TypeScript, and shadcn/ui. The application supports multiple learning formats: interactive quizzes, flashcards, text materials, and audio materials organized by subject.

## Development Commands

### Core Development
```bash
# Start development server on port 3000
bun run dev

# Build for production (runs manifest generation pre-build script)
bun run build

# Start production server
bun start

# Lint code
bun run lint
```

### Database (Prisma - if schema is added)
```bash
# Push schema changes to database
bun run db:push

# Generate Prisma client
bun run db:generate

# Run database migrations
bun run db:migrate

# Reset database
bun run db:reset
```

## Architecture Overview

### Application Structure

The app follows **Next.js 15 App Router** conventions with a context-based state management approach:

#### Core Directories
- **`src/app/`** - Next.js App Router pages and API routes
- **`src/components/ui/`** - Reusable shadcn/ui components (50+ components)
- **`src/components/screens/`** - Screen-level components for different views
- **`src/context/`** - React Context providers for global state
- **`src/hooks/`** - Custom React hooks
- **`src/lib/`** - Utility functions and configurations
- **`src/types.ts`** - TypeScript type definitions

#### Educational Content Structure
Content is organized in `public/` by subject folders:
```
public/
├── {Subject Name}/
│   ├── quizzes/          # JSON quiz files
│   ├── flashcards/       # JSON flashcard sets
│   ├── materials/        # Text learning materials (.txt)
│   └── audio-materials/  # Audio files (.mp3)
└── manifest.json         # Auto-generated content index
```

### State Management Architecture

**`QuizContext` (src/context/QuizContext.tsx)** - Central state provider managing:
- Quiz state (current question, answers, scoring, timer)
- Content loading (materials, flashcards, audio)
- Subject selection
- Navigation between questions

All screen components consume `useQuiz()` hook to access shared state.

### Key Patterns

#### Subject-Based Content Loading
All API routes accept a `subject` query parameter to filter content by subject folder:
```typescript
GET /api/quizzes?subject={subjectName}
GET /api/materials/{id}?subject={subjectName}
```

#### Screen-Based Architecture
Each major view has a dedicated screen component:
- `HomeScreen` - Subject and content selection
- `QuizStartScreen` - Quiz initialization
- `QuizQuestionScreen` - Question display and answering
- `ResultsScreen` - Quiz completion and scoring
- `FlashcardLearnerScreen` - Flashcard practice
- `MaterialReaderScreen` - Text material reading
- `AudioPlayerScreen` - Audio material playback

#### API Route Structure
API routes in `src/app/api/` follow REST patterns:
- `/api/quizzes` - List all quizzes for a subject
- `/api/quiz/[id]` - Get specific quiz
- `/api/flashcards` - List all flashcard sets
- `/api/materials` - List all text materials
- `/api/audio-materials` - List all audio materials

### Content File Formats

#### Quiz JSON Structure
```typescript
{
  "title": "Quiz Title",
  "description": "Optional description",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // Index of correct option
      "explanation": "Optional explanation"
    }
  ]
}
```

#### Flashcard JSON Structure
```typescript
{
  "title": "Flashcard Set Title",
  "description": "Optional description",
  "category": "Category name",
  "cards": [
    {
      "id": 1,
      "front": "Front text",
      "back": "Back text"
    }
  ]
}
```

### Pre-Build Script

**`scripts/generate-manifest.js`** runs before each build to:
1. Scan all subject folders in `public/`
2. Index all quizzes, flashcards, materials, and audio files
3. Generate `public/manifest.json` with metadata

This enables dynamic content discovery without hardcoded file lists.

## Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript 5** for type safety
- **Bun** as package manager and runtime

### UI Components
- **shadcn/ui** - Comprehensive component library built on Radix UI
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icon system

### State & Data
- **Zustand** - Available for additional state management
- **TanStack Query** - Available for server state caching
- **React Context** - Currently used for global quiz state

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Additional Features
- **next-intl** - Internationalization (configured but not heavily used)
- **NextAuth.js** - Authentication (available, not implemented)
- **Prisma** - ORM (available, no schema currently)

## Path Aliases

TypeScript paths configured in `tsconfig.json`:
```typescript
"@/*" maps to "./src/*"
```

Example: `import { Button } from '@/components/ui/button'`

## Important Implementation Notes

### Adding New Educational Content

1. Create subject folder in `public/{SubjectName}/`
2. Add content files in appropriate subdirectories (quizzes/, flashcards/, materials/, audio-materials/)
3. Run build to regenerate manifest (or run `node scripts/generate-manifest.js` directly)
4. Content will automatically appear in the app

### Audio Material Handling

Audio files are served directly from `public/` but require route handling in `/api/audio-materials/[id]/route.ts` to stream content properly. Check existing implementation before modifying.

### Quiz Timer

The quiz timer in `QuizContext` uses browser intervals and starts/stops based on quiz state. It automatically stops when quiz is finished.

### Type Safety

All data structures are typed in `src/types.ts`. When adding new features:
1. Define types in `types.ts` first
2. Update `QuizContextType` if adding global state
3. Ensure API responses match expected types

## Development Workflow

1. **Add/modify UI components**: Use shadcn/ui patterns, all components in `src/components/ui/`
2. **Create new screens**: Add to `src/components/screens/`, consume `useQuiz()` hook
3. **Add API routes**: Follow existing patterns in `src/app/api/`
4. **Add content**: Place files in `public/{Subject}/` subdirectories
5. **Run build**: Regenerates manifest and validates TypeScript

## Common Gotchas

- **Manifest out of sync**: Run `bun run build` to regenerate after adding content files
- **Audio not playing**: Check file exists in correct `public/{Subject}/audio-materials/` path
- **Subject not found**: Subject name must exactly match folder name in `public/`
- **Context errors**: Ensure `QuizProvider` wraps components that use `useQuiz()`
- **TypeScript errors on build**: Set `ignoreBuildErrors: true` in `next.config.ts` only as last resort
