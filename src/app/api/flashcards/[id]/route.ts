import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';
    const flashcardsDir = path.join(process.cwd(), 'public', subject, 'flashcards');
    const filePath = path.join(flashcardsDir, `${id}.json`);

    try {
      const stats = await fs.stat(filePath);

      // Check if it's a file
      if (!stats.isFile()) {
        return NextResponse.json(
          { error: 'Flashcard set not found' },
          { status: 404 }
        );
      }

      // Read file and return as response
      const content = await fs.readFile(filePath, 'utf-8');
      const flashcardData = JSON.parse(content);

      return NextResponse.json(flashcardData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Flashcard set not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading flashcard set:', error);
    return NextResponse.json(
      { error: 'Failed to load flashcard set' },
      { status: 500 }
    );
  }
}
