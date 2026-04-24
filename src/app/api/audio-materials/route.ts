import { NextResponse } from 'next/server';
import { readManifest } from '@/lib/manifest';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';

    const manifest = await readManifest();
    const audioMaterials = manifest.audioMaterials.filter(
      (audio) => audio.subject === subject
    );

    return NextResponse.json({ audioMaterials });
  } catch (error) {
    console.error('Error listing audio materials:', error);
    return NextResponse.json(
      { error: 'Failed to list audio materials', audioMaterials: [] },
      { status: 500 }
    );
  }
}
