#!/usr/bin/env node
/**
 * Create compact cross-references for public folder
 * Uses a more compact format for efficient loading
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'cross-references.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data', 'cross-refs');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BOOK_CODES = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
  'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
  'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS',
  '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
];

const BOOK_INDEX = Object.fromEntries(BOOK_CODES.map((code, i) => [code, i]));

console.log('📦 Creating compact cross-references for public folder...\n');

// Load original data
const data = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
const crossRefs = data.crossReferences;

// Track stats
const stats = {
  totalVerses: 0,
  totalRefs: 0,
  byBook: {}
};

// Process by book for split files
const bookData = {};

for (const [key, refs] of Object.entries(crossRefs)) {
  const [book, chapter, verse] = key.split('.');
  
  if (!bookData[book]) {
    bookData[book] = {};
  }
  
  // Compact format: [bookIndex, chapter, verse] for each ref
  // Even more compact: "B:C:V" string
  const compactRefs = refs.map(r => 
    `${BOOK_INDEX[r.book]}:${r.chapter}:${r.verseStart}`
  ).join(',');
  
  const chapterKey = parseInt(chapter, 10);
  const verseKey = parseInt(verse, 10);
  
  if (!bookData[book][chapterKey]) {
    bookData[book][chapterKey] = {};
  }
  
  bookData[book][chapterKey][verseKey] = compactRefs;
  
  stats.totalVerses++;
  stats.totalRefs += refs.length;
  stats.byBook[book] = (stats.byBook[book] || 0) + 1;
}

// Write individual book files
let totalSize = 0;
for (const [book, chapters] of Object.entries(bookData)) {
  const filePath = path.join(OUTPUT_DIR, `${book.toLowerCase()}.json`);
  const content = JSON.stringify(chapters);
  fs.writeFileSync(filePath, content);
  
  const size = Buffer.byteLength(content);
  totalSize += size;
  console.log(`  ${book}: ${stats.byBook[book]} verses (${(size / 1024).toFixed(1)} KB)`);
}

// Write metadata/index file
const indexData = {
  books: BOOK_CODES,
  generated: new Date().toISOString(),
  totalVerses: stats.totalVerses,
  totalRefs: stats.totalRefs,
  source: 'josephilipraja/bible-cross-reference-json + TSK',
  credit: 'SoulLiberty/MetaV'
};

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(indexData, null, 2));

console.log(`\n✅ Created ${Object.keys(bookData).length} book files`);
console.log(`📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📁 Output: ${OUTPUT_DIR}`);

// Also create a smaller embedded version with just top verses
// (for initial load / fallback)
const topVerses = {};
let count = 0;
const MAX_EMBEDDED = 2000;

for (const [key, refs] of Object.entries(crossRefs)) {
  if (count >= MAX_EMBEDDED) break;
  if (refs.length >= 3) { // Keep verses with 3+ refs
    topVerses[key] = refs.slice(0, 10).map(r => ({
      book: r.book,
      chapter: r.chapter,
      verseStart: r.verseStart,
      verseEnd: r.verseEnd
    }));
    count++;
  }
}

// Write small embedded file for src/data
const embeddedPath = path.join(__dirname, '..', 'src', 'data', 'cross-references.json');
const embeddedData = {
  metadata: {
    source: 'josephilipraja/bible-cross-reference-json + TSK',
    credit: 'SoulLiberty/MetaV',
    generated: new Date().toISOString(),
    totalVerses: stats.totalVerses,
    note: 'Full data loaded from /data/cross-refs/',
    embeddedVerses: count
  },
  bookAbbreviations: data.bookAbbreviations,
  crossReferences: topVerses
};

fs.writeFileSync(embeddedPath, JSON.stringify(embeddedData, null, 2));
console.log(`\n📝 Embedded file: ${count} popular verses (${(fs.statSync(embeddedPath).size / 1024).toFixed(0)} KB)`);
