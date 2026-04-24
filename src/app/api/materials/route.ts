import { NextResponse } from 'next/server';
import { readManifest } from '@/lib/manifest';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';

    const manifest = await readManifest();
    const materials = manifest.materials.filter(
      (material) => material.subject === subject
    );

    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Error listing materials:', error);
    return NextResponse.json(
      { error: 'Failed to list materials', materials: [] },
      { status: 500 }
    );
  }
}
