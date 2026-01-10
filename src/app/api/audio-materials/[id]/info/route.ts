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
    const audioMaterialsDir = path.join(process.cwd(), 'public', subject, 'audio-materials');
    const filePath = path.join(audioMaterialsDir, id);

    try {
      const stats = await fs.stat(filePath);

      // Check if it's a file
      if (!stats.isFile()) {
        return NextResponse.json(
          { error: 'Audio material not found' },
          { status: 404 }
        );
      }

      // Return metadata as JSON
      return NextResponse.json({
        id: id,
        filename: id,
        title: id.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' '),
        size: stats.size,
        format: id.split('.').pop()?.toLowerCase() || 'mp3',
        createdAt: stats.birthtime,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Audio material not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading audio material info:', error);
    return NextResponse.json(
      { error: 'Failed to load audio material info' },
      { status: 500 }
    );
  }
}
