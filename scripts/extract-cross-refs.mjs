#!/usr/bin/env node
/**
 * Extract Cross-References from SQLite databases and convert to JSON
 * Source: bible_databases repo (TSK-style cross-references)
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLITE_DIR = path.join(__dirname, 'sword-modules/bible_databases/formats/sqlite/extras');
const OUTPUT_FILE = path.join(__dirname, '../src/data/cross-references.json');

// Book name normalization
const BOOK_NAMES = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
  'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
  'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA', 'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
  'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
  'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA',
  'Jonah': 'JON', 'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP', 'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
  'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
  'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
  'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI',
  '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB',
  'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN',
  '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV'
};

// Reverse mapping for display
const BOOK_ABBREVS = Object.fromEntries(
  Object.entries(BOOK_NAMES).map(([name, abbr]) => [abbr, name])
);

function normalizeBookName(name) {
  // Handle variations
  const normalized = name.trim();
  if (BOOK_NAMES[normalized]) return BOOK_NAMES[normalized];
  
  // Try matching with "Song of Songs" -> "Song of Solomon"
  if (normalized === 'Song of Songs') return 'SNG';
  if (normalized === 'Psalm') return 'PSA';
  
  console.warn(`Unknown book: ${name}`);
  return null;
}

function makeVerseKey(book, chapter, verse) {
  const bookCode = normalizeBookName(book);
  if (!bookCode) return null;
  return `${bookCode}.${chapter}.${verse}`;
}

async function main() {
  console.log('📖 Extracting Cross-References from SQLite databases...\n');
  
  // Use the database with highest votes (file 4)
  const dbPath = path.join(SQLITE_DIR, 'cross_references_4.db');
  const db = new Database(dbPath, { readonly: true });
  
  // Get all cross-references
  const rows = db.prepare(`
    SELECT from_book, from_chapter, from_verse, 
           to_book, to_chapter, to_verse_start, to_verse_end, votes
    FROM cross_references
    WHERE votes >= 5
    ORDER BY from_book, from_chapter, from_verse, votes DESC
  `).all();
  
  console.log(`Found ${rows.length} quality cross-references (votes >= 5)`);
  
  // Group by source verse
  const crossRefs = {};
  let skipped = 0;
  
  for (const row of rows) {
    const sourceKey = makeVerseKey(row.from_book, row.from_chapter, row.from_verse);
    if (!sourceKey) {
      skipped++;
      continue;
    }
    
    const targetBook = normalizeBookName(row.to_book);
    if (!targetBook) {
      skipped++;
      continue;
    }
    
    if (!crossRefs[sourceKey]) {
      crossRefs[sourceKey] = [];
    }
    
    // Format target reference
    const target = {
      book: targetBook,
      chapter: row.to_chapter,
      verseStart: row.to_verse_start,
      verseEnd: row.to_verse_end || row.to_verse_start,
      votes: row.votes
    };
    
    // Limit to top 10 references per verse
    if (crossRefs[sourceKey].length < 10) {
      crossRefs[sourceKey].push(target);
    }
  }
  
  console.log(`Skipped ${skipped} entries with unknown books`);
  console.log(`Generated ${Object.keys(crossRefs).length} verse entries`);
  
  // Create output structure
  const output = {
    metadata: {
      source: 'bible_databases (TSK-style)',
      generated: new Date().toISOString(),
      totalVerses: Object.keys(crossRefs).length,
      minVotes: 5
    },
    bookAbbreviations: BOOK_ABBREVS,
    crossReferences: crossRefs
  };
  
  // Write JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ Wrote ${OUTPUT_FILE}`);
  
  // Stats
  const totalRefs = Object.values(crossRefs).reduce((sum, refs) => sum + refs.length, 0);
  console.log(`Total cross-references: ${totalRefs}`);
  
  db.close();
}

main().catch(console.error);
