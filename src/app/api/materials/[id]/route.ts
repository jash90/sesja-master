import { NextResponse } from 'next/server';

interface Material {
  id: string;
  filename: string;
  title: string;
  subject: string;
  size: number;
  createdAt: string;
  url: string;
}

interface Manifest {
  materials: Material[];
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

    // Find the material
    const material = manifest.materials.find(
      (m) => m.id === id && m.subject === subject
    );

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    // Fetch the content from static file
    const contentRes = await fetch(`${baseUrl}${material.url}`);

    if (!contentRes.ok) {
      return NextResponse.json(
        { error: 'Failed to load material content' },
        { status: 404 }
      );
    }

    const content = await contentRes.text();

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
