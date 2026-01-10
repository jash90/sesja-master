const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const manifestPath = path.join(publicDir, 'manifest.json');

function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      createdAt: stats.birthtime.toISOString(),
    };
  } catch {
    return { size: 0, createdAt: new Date().toISOString() };
  }
}

function scanDirectory(dirPath, baseDir = '') {
  const results = {
    audioMaterials: [],
    materials: [],
    flashcards: [],
    quizzes: [],
  };

  if (!fs.existsSync(dirPath)) {
    return results;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      // Check for content subdirectories
      const audioDir = path.join(fullPath, 'audio-materials');
      const materialsDir = path.join(fullPath, 'materials');
      const flashcardsDir = path.join(fullPath, 'flashcards');
      const quizzesDir = path.join(fullPath, 'quizzes');

      // Scan audio-materials
      if (fs.existsSync(audioDir)) {
        const audioFiles = fs.readdirSync(audioDir);
        for (const file of audioFiles) {
          const ext = path.extname(file).toLowerCase();
          if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
            const filePath = path.join(audioDir, file);
            const stats = getFileStats(filePath);
            results.audioMaterials.push({
              id: file,
              filename: file,
              title: file.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' '),
              subject: entry.name,
              format: ext.slice(1),
              size: stats.size,
              createdAt: stats.createdAt,
              url: `/${encodeURIComponent(entry.name)}/audio-materials/${encodeURIComponent(file)}`,
            });
          }
        }
      }

      // Scan materials
      if (fs.existsSync(materialsDir)) {
        const materialFiles = fs.readdirSync(materialsDir);
        for (const file of materialFiles) {
          if (file.endsWith('.txt')) {
            const filePath = path.join(materialsDir, file);
            const stats = getFileStats(filePath);
            const id = file.replace('.txt', '');
            results.materials.push({
              id,
              filename: file,
              title: id.replace(/-/g, ' ').replace(/_/g, ' '),
              subject: entry.name,
              size: stats.size,
              createdAt: stats.createdAt,
              url: `/${encodeURIComponent(entry.name)}/materials/${encodeURIComponent(file)}`,
            });
          }
        }
      }

      // Scan flashcards
      if (fs.existsSync(flashcardsDir)) {
        const flashcardFiles = fs.readdirSync(flashcardsDir);
        for (const file of flashcardFiles) {
          if (file.endsWith('.json')) {
            const filePath = path.join(flashcardsDir, file);
            const stats = getFileStats(filePath);
            const id = file.replace('.json', '');
            results.flashcards.push({
              id,
              filename: file,
              title: id.replace(/-/g, ' ').replace(/_/g, ' '),
              subject: entry.name,
              size: stats.size,
              createdAt: stats.createdAt,
              url: `/${encodeURIComponent(entry.name)}/flashcards/${encodeURIComponent(file)}`,
            });
          }
        }
      }

      // Scan quizzes
      if (fs.existsSync(quizzesDir)) {
        const quizFiles = fs.readdirSync(quizzesDir);
        for (const file of quizFiles) {
          if (file.endsWith('.json')) {
            const filePath = path.join(quizzesDir, file);
            const stats = getFileStats(filePath);
            const id = file.replace('.json', '');
            results.quizzes.push({
              id,
              filename: file,
              title: id.replace(/-/g, ' ').replace(/_/g, ' '),
              subject: entry.name,
              size: stats.size,
              createdAt: stats.createdAt,
              url: `/${encodeURIComponent(entry.name)}/quizzes/${encodeURIComponent(file)}`,
            });
          }
        }
      }
    }
  }

  return results;
}

function generateManifest() {
  console.log('Generating manifest.json...');

  const manifest = scanDirectory(publicDir);

  // Sort by creation date (newest first)
  manifest.audioMaterials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  manifest.materials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  manifest.flashcards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  manifest.quizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Add metadata
  manifest.generatedAt = new Date().toISOString();
  manifest.subjects = [...new Set([
    ...manifest.audioMaterials.map(a => a.subject),
    ...manifest.materials.map(m => m.subject),
    ...manifest.flashcards.map(f => f.subject),
    ...manifest.quizzes.map(q => q.subject),
  ])];

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Manifest generated successfully!`);
  console.log(`  - Audio materials: ${manifest.audioMaterials.length}`);
  console.log(`  - Materials: ${manifest.materials.length}`);
  console.log(`  - Flashcards: ${manifest.flashcards.length}`);
  console.log(`  - Quizzes: ${manifest.quizzes.length}`);
  console.log(`  - Subjects: ${manifest.subjects.join(', ')}`);
}

generateManifest();
