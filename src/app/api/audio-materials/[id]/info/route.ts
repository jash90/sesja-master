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

    // Find the audio material
    const audioMaterial = manifest.audioMaterials.find(
      (audio) => audio.id === id && audio.subject === subject
    );

    if (!audioMaterial) {
      return NextResponse.json(
        { error: 'Audio material not found' },
        { status: 404 }
      );
    }

    // Return metadata
    return NextResponse.json({
      id: audioMaterial.id,
      filename: audioMaterial.filename,
      title: audioMaterial.title,
      size: audioMaterial.size,
      format: audioMaterial.format,
      createdAt: audioMaterial.createdAt,
      url: audioMaterial.url,
    });
  } catch (error) {
    console.error('Error loading audio material info:', error);
    return NextResponse.json(
      { error: 'Failed to load audio material info' },
      { status: 500 }
    );
  }
}
