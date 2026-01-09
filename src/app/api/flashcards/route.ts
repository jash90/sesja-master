import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const flashcardsDir = path.join(process.cwd(), 'public', 'test', 'flashcards');

    // Check if directory exists, if not create it
    try {
      await fs.access(flashcardsDir);
    } catch {
      await fs.mkdir(flashcardsDir, { recursive: true });
      return NextResponse.json({ flashcards: [] });
    }

    // Read all files from flashcards directory
    const files = await fs.readdir(flashcardsDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    // Read each JSON file to get metadata
    const flashcards = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const filePath = path.join(flashcardsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const flashcardData = JSON.parse(content);

          // Count cards in the set
          const cardCount = flashcardData.cards?.length || 0;

          return {
            id: file.replace('.json', ''),
            filename: file,
            title: flashcardData.title || 'Brak tytułu',
            description: flashcardData.description || '',
            category: flashcardData.category || 'Ogólny',
            cardCount: cardCount,
          };
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out null values (failed reads) and sort by category
    const validFlashcards = flashcards
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.category.localeCompare(b.category));

    return NextResponse.json({ flashcards: validFlashcards });
  } catch (error) {
    console.error('Error listing flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to list flashcards', flashcards: [] },
      { status: 500 }
    );
  }
}
