import { readFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { readManifest, resolvePublicPath } from '@/lib/manifest';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';

    const manifest = await readManifest();
    const material = manifest.materials.find(
      (m) => m.id === id && m.subject === subject
    );

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    const content = await readFile(resolvePublicPath(material.url), 'utf-8');

    return NextResponse.json({
      id: material.id,
      filename: material.filename,
      title: material.title,
      content,
      size: material.size,
      createdAt: material.createdAt,
    });
  } catch (error) {
    console.error('Error loading material:', error);
    return NextResponse.json(
      { error: 'Failed to load material' },
      { status: 500 }
    );
  }
}
