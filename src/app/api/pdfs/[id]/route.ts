import { NextResponse } from 'next/server';

interface PdfDocument {
  id: string;
  filename: string;
  title: string;
  subject: string;
  size: number;
  createdAt: string;
  url: string;
}

interface Manifest {
  pdfs: PdfDocument[];
  generatedAt: string;
  subjects: string[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';

    // Fetch manifest from static file
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const manifestRes = await fetch(`${baseUrl}/manifest.json`, {
      next: { revalidate: 60 },
    });

    if (!manifestRes.ok) {
      return NextResponse.json(
        { error: 'Manifest not found' },
        { status: 404 }
      );
    }

    const manifest: Manifest = await manifestRes.json();

    // Find the PDF by ID and subject
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
