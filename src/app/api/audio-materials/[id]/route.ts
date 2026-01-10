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

      // Read file and return as response
      const fileContent = await fs.readFile(filePath);

      // Determine content type based on file extension
      const ext = id.split('.').pop()?.toLowerCase();
      const contentTypes: Record<string, string> = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        ogg: 'audio/ogg',
        m4a: 'audio/mp4',
        m4b: 'audio/mp4',
      };

      const contentType = contentTypes[ext || ''] || 'audio/mpeg';

      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': stats.size.toString(),
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Audio material not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading audio material:', error);
    return NextResponse.json(
      { error: 'Failed to load audio material' },
      { status: 500 }
    );
  }
}
