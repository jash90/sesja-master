const fs = require('fs');
const path = require('path');

// Get subject name from command line arguments
const subject = process.argv[2];

if (!subject) {
  console.error('❌ Błąd: Nie podano nazwy przedmiotu.');
  console.error('');
  console.error('Użycie: node scripts/export-blooket.js "Nazwa przedmiotu"');
  console.error('');
  console.error('Przykład: node scripts/export-blooket.js "Technologie Frontendowe"');
  process.exit(1);
}

const quizzesDir = path.join(process.cwd(), 'public', subject, 'quizzes');
const exportsDir = path.join(process.cwd(), 'exports');

// Check if subject folder exists
if (!fs.existsSync(quizzesDir)) {
  console.error(`❌ Błąd: Folder przedmiotu nie istnieje: ${quizzesDir}`);
  console.error('');
  console.error('Dostępne przedmioty:');
  const publicDir = path.join(process.cwd(), 'public');
  const subjects = fs.readdirSync(publicDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => fs.existsSync(path.join(publicDir, entry.name, 'quizzes')))
    .map(entry => `  - "${entry.name}"`);
  console.error(subjects.join('\n'));
  process.exit(1);
}

// Ensure exports directory exists
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Remove/replace HTML tags (Blooket doesn't allow them)
function sanitizeHTML(str) {
  // Replace <tag> with [tag]
  return str.replace(/<([^>]+)>/g, '[$1]');
}

// Escape CSV field (handle commas, quotes, newlines)
function escapeCSV(field) {
  if (field == null) return '';
  let str = String(field);
  // Sanitize HTML tags
  str = sanitizeHTML(str);
  // If contains comma, quote, or newline - wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Load all quizzes from the subject
function loadQuizzes() {
  const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.error(`❌ Błąd: Brak plików quizów w folderze: ${quizzesDir}`);
    process.exit(1);
  }

  const allQuestions = [];
  const quizNames = [];

  for (const file of files) {
    try {
      const filePath = path.join(quizzesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const quiz = JSON.parse(content);

      if (quiz.questions && Array.isArray(quiz.questions)) {
        quizNames.push(quiz.title || file);
        for (const q of quiz.questions) {
          if (q.question && q.options && Array.isArray(q.options) && q.options.length >= 2) {
            allQuestions.push({
              question: q.question,
              options: q.options.slice(0, 4), // Max 4 options
              correctAnswer: (q.correctAnswer || 0) + 1, // Convert to 1-indexed
            });
          }
        }
      }
    } catch (err) {
      console.warn(`⚠️ Pominięto plik (błąd parsowania): ${file}`);
    }
  }

  return { questions: allQuestions, quizNames };
}

// Generate Blooket CSV format
function generateBlooketCSV(questions) {
  const lines = [];

  // Blooket header (exact format required - uses CRLF inside quoted strings)
  lines.push('"Blooket\r\nImport Template",,,,,,,');
  lines.push('Question #,Question Text,Answer 1,Answer 2,"Answer 3\r\n(Optional)","Answer 4\r\n(Optional)","Time Limit (sec)\r\n(Max: 300 seconds)","Correct Answer(s)\r\n(Only include Answer #)"');

  // Add questions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const row = [
      i + 1, // Question #
      escapeCSV(q.question), // Question Text
      escapeCSV(q.options[0] || ''), // Answer 1
      escapeCSV(q.options[1] || ''), // Answer 2
      escapeCSV(q.options[2] || ''), // Answer 3 (Optional)
      escapeCSV(q.options[3] || ''), // Answer 4 (Optional)
      30, // Time Limit (default 30 seconds)
      q.correctAnswer, // Correct Answer (1-indexed)
    ];
    lines.push(row.join(','));
  }

  // Use CRLF line endings (Windows format required by Blooket)
  return lines.join('\r\n') + '\r\n';
}

// Main execution
console.log(`📚 Eksport quizów dla przedmiotu: "${subject}"`);
console.log('');

const { questions, quizNames } = loadQuizzes();

console.log(`📁 Znalezione quizy (${quizNames.length}):`);
quizNames.forEach(name => console.log(`   - ${name}`));
console.log('');

const csv = generateBlooketCSV(questions);

// Generate output filename (replace spaces with underscores)
const safeSubjectName = subject.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '');
const outputPath = path.join(exportsDir, `${safeSubjectName}_blooket.csv`);

fs.writeFileSync(outputPath, csv, 'utf-8');

console.log(`✅ Eksport zakończony pomyślnie!`);
console.log(`   📊 Wyeksportowano pytań: ${questions.length}`);
console.log(`   📄 Plik: ${outputPath}`);
console.log('');
console.log('💡 Importuj plik do Blooket: blooket.com → Create → Import');
