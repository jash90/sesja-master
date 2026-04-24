import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface AudioMaterial {
  id: string;
  filename: string;
  title: string;
  subject: string;
  format: string;
  size: number;
  createdAt: string;
  url: string;
}

export interface Material {
  id: string;
  filename: string;
  title: string;
  subject: string;
  size: number;
  createdAt: string;
  url: string;
}

export interface PdfDocument {
  id: string;
  filename: string;
  title: string;
  subject: string;
  size: number;
  createdAt: string;
  url: string;
}

export interface Manifest {
  audioMaterials: AudioMaterial[];
  materials: Material[];
  pdfs?: PdfDocument[];
  generatedAt: string;
  subjects: string[];
}

const publicDir = path.join(process.cwd(), 'public');
const manifestPath = path.join(publicDir, 'manifest.json');

export async function readManifest(): Promise<Manifest> {
  const raw = await readFile(manifestPath, 'utf-8');
  return JSON.parse(raw) as Manifest;
}

export function resolvePublicPath(urlPath: string): string {
  const decoded = decodeURI(urlPath).replace(/^\/+/, '');
  return path.join(publicDir, decoded);
}
