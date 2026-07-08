#!/usr/bin/env node
/**
 * Parse Matthew Henry Concise Commentary from plain text to JSON
 * Source: CCEL (Christian Classics Ethereal Library)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, 'sword-modules/mhcc.txt');
const OUTPUT_FILE = path.join(__dirname, '../src/data/mhcc-commentary.json');

// Book name normalization
const BOOK_NAMES = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
  'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
  'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

// Regex patterns
const BOOK_PATTERN = new RegExp(`^\\s*(${BOOK_NAMES.join('|')})\\s*$`);
const CHAPTER_PATTERN = /^Chapter\s+(\d+)\s*$/;
const VERSES_PATTERN = /^Verses?\s+(\d+(?:[,-]\s*\d+)*)\s*$/;
const SEPARATOR_PATTERN = /^_{10,}$/;

function parseRange(rangeStr) {
  // Parse "1, 2" or "1-5" or "1" into array of verse numbers
  const parts = rangeStr.split(/[,\s]+/).filter(p => p);
  const verses = [];
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      for (let v = start; v <= end; v++) {
        verses.push(v);
      }
    } else {
      const num = parseInt(part.trim(), 10);
      if (!isNaN(num)) verses.push(num);
    }
  }
  
  return verses;
}

async function main() {
  console.log('📖 Parsing Matthew Henry Concise Commentary...\n');
  
  const content = fs.readFileSync(INPUT_FILE, 'utf-8');
  const lines = content.split('\n');
  
  const commentary = {};
  let currentBook = null;
  let currentChapter = null;
  let currentVerseRange = null;
  let currentContent = [];
  let inChapterOutline = false;
  let chapterIntro = '';
  
  const saveCurrentEntry = () => {
    if (currentBook && currentChapter && currentVerseRange && currentContent.length > 0) {
      if (!commentary[currentBook]) {
        commentary[currentBook] = {};
      }
      if (!commentary[currentBook][currentChapter]) {
        commentary[currentBook][currentChapter] = { intro: '', verses: {} };
      }
      
      const text = currentContent.join(' ').trim();
      const key = currentVerseRange.join('-');
      commentary[currentBook][currentChapter].verses[key] = text;
    }
    currentContent = [];
    currentVerseRange = null;
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and separators
    if (!line || SEPARATOR_PATTERN.test(line)) {
      continue;
    }
    
    // Check for book name
    const bookMatch = line.match(BOOK_PATTERN);
    if (bookMatch) {
      saveCurrentEntry();
      currentBook = bookMatch[1];
      currentChapter = null;
      inChapterOutline = false;
      console.log(`Processing ${currentBook}...`);
      continue;
    }
    
    // Check for chapter heading
    const chapterMatch = line.match(CHAPTER_PATTERN);
    if (chapterMatch && currentBook) {
      saveCurrentEntry();
      currentChapter = parseInt(chapterMatch[1], 10);
      inChapterOutline = true;
      chapterIntro = '';
      continue;
    }
    
    // Check for verse heading
    const verseMatch = line.match(VERSES_PATTERN);
    if (verseMatch && currentBook && currentChapter) {
      saveCurrentEntry();
      currentVerseRange = parseRange(verseMatch[1]);
      inChapterOutline = false;
      continue;
    }
    
    // Skip chapter outlines (lines ending with verse references in parentheses)
    if (inChapterOutline && /\(\d+[^)]*\)\s*$/.test(line)) {
      continue;
    }
    
    // Skip "Chapter Outline" text
    if (line === 'Chapter Outline') {
      inChapterOutline = true;
      continue;
    }
    
    // Accumulate content
    if (currentVerseRange && currentBook && currentChapter) {
      currentContent.push(line);
    }
  }
  
  // Save final entry
  saveCurrentEntry();
  
  // Calculate stats
  let totalEntries = 0;
  let totalBooks = Object.keys(commentary).length;
  
  for (const book of Object.values(commentary)) {
    for (const chapter of Object.values(book)) {
      totalEntries += Object.keys(chapter.verses || {}).length;
    }
  }
  
  console.log(`\nParsed ${totalBooks} books, ${totalEntries} commentary entries`);
  
  // Create output
  const output = {
    metadata: {
      source: 'Matthew Henry Concise Commentary',
      provider: 'Christian Classics Ethereal Library (CCEL)',
      license: 'Public Domain',
      generated: new Date().toISOString(),
      totalBooks,
      totalEntries
    },
    commentary
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Wrote ${OUTPUT_FILE}`);
  
  // Show sample
  const sample = commentary['Genesis']?.['1']?.verses?.['1-2'];
  if (sample) {
    console.log('\nSample (Genesis 1:1-2):');
    console.log(sample.substring(0, 200) + '...');
  }
}

main().catch(console.error);
