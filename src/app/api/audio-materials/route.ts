import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const audioMaterialsDir = path.join(process.cwd(), 'public', 'test', 'audio-materials');

    // Check if directory exists, if not create it
    try {
      await fs.access(audioMaterialsDir);
    } catch {
      await fs.mkdir(audioMaterialsDir, { recursive: true });
      return NextResponse.json({ audioMaterials: [] });
    }

    // Read all files from audio-materials directory
    const files = await fs.readdir(audioMaterialsDir);
    const audioFiles = files.filter((file) => {
      const ext = file.toLowerCase();
      return ext.endsWith('.mp3') || ext.endsWith('.wav') || ext.endsWith('.ogg') || ext.endsWith('.m4a');
    });

    // Get file stats for creation date and size
    const audioMaterials = await Promise.all(
      audioFiles.map(async (file) => {
        try {
          const filePath = path.join(audioMaterialsDir, file);
          const stats = await fs.stat(filePath);

          return {
            id: file,
            filename: file,
            title: file.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' '),
            size: stats.size,
            format: file.split('.').pop()?.toLowerCase() || 'mp3',
            createdAt: stats.birthtime,
          };
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out null values (failed reads) and sort by creation date
    const validAudioMaterials = audioMaterials
      .filter((material): material is NonNullable<typeof material> => material !== null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ audioMaterials: validAudioMaterials });
  } catch (error) {
    console.error('Error listing audio materials:', error);
    return NextResponse.json(
      { error: 'Failed to list audio materials', audioMaterials: [] },
      { status: 500 }
    );
  }
}
