import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');

    // Read all entries in public directory
    const entries = await fs.readdir(publicDir, { withFileTypes: true });

    // Filter only directories (exclude files like logo.svg, robots.txt)
    const subjects = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'pl'));

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error listing subjects:', error);
    return NextResponse.json(
      { error: 'Failed to list subjects', subjects: [] },
      { status: 500 }
    );
  }
}
