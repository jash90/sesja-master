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

    return NextResponse.redirect(new URL(audioMaterial.url, request.url));
  } catch (error) {
    console.error('Error loading audio material:', error);
    return NextResponse.json(
      { error: 'Failed to load audio material' },
      { status: 500 }
    );
  }
}
