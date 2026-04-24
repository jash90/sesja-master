import { NextResponse } from 'next/server';
import { readManifest } from '@/lib/manifest';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';

    const manifest = await readManifest();
    const pdfs = (manifest.pdfs || []).filter(
      (pdf) => pdf.subject === subject
    );

    return NextResponse.json({ pdfs });
  } catch (error) {
    console.error('Error listing PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to list PDFs', pdfs: [] },
      { status: 500 }
    );
  }
}
