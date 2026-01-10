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

export async function GET(request: Request) {
  try {
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
      return NextResponse.json({ materials: [] });
    }

    const manifest: Manifest = await manifestRes.json();

    // Filter by subject
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
