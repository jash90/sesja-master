import { NextResponse } from 'next/server';
import { readManifest } from '@/lib/manifest';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';

    const manifest = await readManifest();
    const audioMaterial = manifest.audioMaterials.find(
      (audio) => audio.id === id && audio.subject === subject
    );

    if (!audioMaterial) {
      return NextResponse.json(
        { error: 'Audio material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: audioMaterial.id,
      filename: audioMaterial.filename,
      title: audioMaterial.title,
      size: audioMaterial.size,
      format: audioMaterial.format,
      createdAt: audioMaterial.createdAt,
      url: audioMaterial.url,
    });
  } catch (error) {
    console.error('Error loading audio material info:', error);
    return NextResponse.json(
      { error: 'Failed to load audio material info' },
      { status: 500 }
    );
  }
}
