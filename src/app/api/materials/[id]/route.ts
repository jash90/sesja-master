import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const materialsDir = path.join(process.cwd(), 'public', 'test', 'materials');
    const filePath = path.join(materialsDir, `${id}.txt`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);

      return NextResponse.json({
        id,
        filename: `${id}.txt`,
        title: id.replace(/-/g, ' ').replace(/_/g, ' '),
        content,
        size: stats.size,
        createdAt: stats.birthtime,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading material:', error);
    return NextResponse.json(
      { error: 'Failed to load material' },
      { status: 500 }
    );
  }
}
