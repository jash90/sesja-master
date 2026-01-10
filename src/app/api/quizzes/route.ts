import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';
    const quizzesDir = path.join(process.cwd(), 'public', subject, 'quizzes');

    // Check if directory exists, if not create it
    try {
      await fs.access(quizzesDir);
    } catch {
      await fs.mkdir(quizzesDir, { recursive: true });
      return NextResponse.json({ quizzes: [] });
    }

    // Read all files from quizzes directory
    const files = await fs.readdir(quizzesDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    // Read each JSON file to get metadata
    const quizzes = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const filePath = path.join(quizzesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const quizData = JSON.parse(content);

          return {
            id: file.replace('.json', ''),
            filename: file,
            title: quizData.title || 'Brak tytułu',
            description: quizData.description || '',
            questionCount: quizData.questions?.length || 0,
          };
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out null values (failed reads)
    const validQuizzes = quizzes.filter((quiz): quiz is NonNullable<typeof quiz> => quiz !== null);

    return NextResponse.json({ quizzes: validQuizzes });
  } catch (error) {
    console.error('Error listing quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to list quizzes', quizzes: [] },
      { status: 500 }
    );
  }
}
