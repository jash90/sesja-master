import { NextResponse } from 'next/server';

interface AudioMaterial {
  id: string;
  filename: string;
  title: string;
  subject: string;
  format: string;
  size: number;
  createdAt: string;
  url: string;
}

interface Manifest {
  audioMaterials: AudioMaterial[];
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
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!manifestRes.ok) {
      return NextResponse.json({ audioMaterials: [] });
    }

    const manifest: Manifest = await manifestRes.json();

    // Filter by subject
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
