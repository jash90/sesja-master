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
    const pdf = (manifest.pdfs || []).find(
      (p) => p.id === id && p.subject === subject
    );

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pdf);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}
