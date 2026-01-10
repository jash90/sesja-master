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
    const quizzesDir = path.join(process.cwd(), 'public', subject, 'quizzes');
    const filePath = path.join(quizzesDir, `${id}.json`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const quizData = JSON.parse(content);

      return NextResponse.json(quizData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to load quiz' },
      { status: 500 }
    );
  }
}
