import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'test';
    const materialsDir = path.join(process.cwd(), 'public', subject, 'materials');

    // Check if directory exists, if not create it
    try {
      await fs.access(materialsDir);
    } catch {
      await fs.mkdir(materialsDir, { recursive: true });
      return NextResponse.json({ materials: [] });
    }

    // Read all files from materials directory
    const files = await fs.readdir(materialsDir);
    const textFiles = files.filter((file) => file.endsWith('.txt'));

    // Get file stats for creation date and size
    const materials = await Promise.all(
      textFiles.map(async (file) => {
        try {
          const filePath = path.join(materialsDir, file);
          const stats = await fs.stat(filePath);

          return {
            id: file.replace('.txt', ''),
            filename: file,
            title: file.replace('.txt', '').replace(/-/g, ' ').replace(/_/g, ' '),
            size: stats.size,
            createdAt: stats.birthtime,
          };
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out null values (failed reads) and sort by creation date
    const validMaterials = materials
      .filter((material): material is NonNullable<typeof material> => material !== null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ materials: validMaterials });
  } catch (error) {
    console.error('Error listing materials:', error);
    return NextResponse.json(
      { error: 'Failed to list materials', materials: [] },
      { status: 500 }
    );
  }
}
