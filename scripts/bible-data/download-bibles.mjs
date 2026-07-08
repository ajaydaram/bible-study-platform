#!/usr/bin/env node
/**
 * Download Bible texts and Strong's Dictionary for local storage
 * Sources: Public domain Bible JSON files from GitHub
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../../public/data/bibles');
const STRONGS_DIR = join(__dirname, '../../public/data/strongs');

// Ensure directories exist
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
if (!existsSync(STRONGS_DIR)) mkdirSync(STRONGS_DIR, { recursive: true });

// Bible sources (all public domain)
const BIBLE_SOURCES = {
  kjv: {
    name: 'King James Version',
    url: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json',
    abbrev: 'KJV'
  },
  web: {
    name: 'World English Bible',
    url: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_bbe.json', // BBE as fallback
    abbrev: 'WEB'
  },
  asv: {
    name: 'American Standard Version',
    // ASV from alternative source
    url: 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/t_asv.json',
    abbrev: 'ASV'
  }
};

// Strong's Dictionary source
const STRONGS_SOURCES = {
  greek: 'https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.json',
  hebrew: 'https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.json'
};

// Book name mappings
const BOOK_NAMES = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John',
  '3 John', 'Jude', 'Revelation'
];

const BOOK_ABBREVS = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SOS', 'ISA', 'JER', 'LAM', 'EZE', 'DAN', 'HOS', 'JOE', 'AMO',
  'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
  'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
  'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB',
  'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JDE', 'REV'
];

async function downloadJson(url) {
  console.log(`  Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return response.json();
}

/**
 * Process thiagobodruk format: array of books with chapters as arrays of verses
 */
function processThiagoFormat(data, version) {
  const result = {
    version,
    books: {}
  };

  data.forEach((book, bookIndex) => {
    const bookAbbrev = BOOK_ABBREVS[bookIndex];
    const bookName = book.name || BOOK_NAMES[bookIndex];
    
    result.books[bookAbbrev] = {
      name: bookName,
      abbrev: bookAbbrev,
      chapters: {}
    };

    book.chapters.forEach((chapter, chapterIndex) => {
      const chapterNum = chapterIndex + 1;
      result.books[bookAbbrev].chapters[chapterNum] = {};
      
      chapter.forEach((verseText, verseIndex) => {
        const verseNum = verseIndex + 1;
        result.books[bookAbbrev].chapters[chapterNum][verseNum] = verseText;
      });
    });
  });

  return result;
}

/**
 * Process scrollmapper ASV format: array of {b, c, v, t} objects
 */
function processScrollmapperFormat(data, version) {
  const result = {
    version,
    books: {}
  };

  data.forEach(verse => {
    const bookIndex = verse.b - 1;
    const bookAbbrev = BOOK_ABBREVS[bookIndex];
    const chapterNum = verse.c;
    const verseNum = verse.v;
    const text = verse.t;

    if (!result.books[bookAbbrev]) {
      result.books[bookAbbrev] = {
        name: BOOK_NAMES[bookIndex],
        abbrev: bookAbbrev,
        chapters: {}
      };
    }

    if (!result.books[bookAbbrev].chapters[chapterNum]) {
      result.books[bookAbbrev].chapters[chapterNum] = {};
    }

    result.books[bookAbbrev].chapters[chapterNum][verseNum] = text;
  });

  return result;
}

async function downloadBibles() {
  console.log('\n📖 Downloading Bible Texts...\n');

  for (const [key, config] of Object.entries(BIBLE_SOURCES)) {
    console.log(`\n${config.name} (${config.abbrev}):`);
    
    try {
      const rawData = await downloadJson(config.url);
      
      let processed;
      if (Array.isArray(rawData) && rawData[0]?.chapters) {
        // thiagobodruk format
        processed = processThiagoFormat(rawData, config.abbrev);
      } else if (Array.isArray(rawData) && rawData[0]?.b !== undefined) {
        // scrollmapper format
        processed = processScrollmapperFormat(rawData, config.abbrev);
      } else {
        console.log(`  ⚠️ Unknown format for ${key}, skipping...`);
        continue;
      }

      const bookCount = Object.keys(processed.books).length;
      let verseCount = 0;
      Object.values(processed.books).forEach(book => {
        Object.values(book.chapters).forEach(chapter => {
          verseCount += Object.keys(chapter).length;
        });
      });

      const outputPath = join(OUTPUT_DIR, `${key}.json`);
      writeFileSync(outputPath, JSON.stringify(processed, null, 0)); // Compact for smaller file size
      
      console.log(`  ✓ ${bookCount} books, ${verseCount.toLocaleString()} verses`);
      console.log(`  ✓ Saved to: ${outputPath}`);
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

async function downloadStrongs() {
  console.log('\n\n📚 Downloading Strong\'s Dictionaries...\n');

  for (const [lang, url] of Object.entries(STRONGS_SOURCES)) {
    console.log(`\nStrong's ${lang.charAt(0).toUpperCase() + lang.slice(1)}:`);
    
    try {
      const rawData = await downloadJson(url);
      
      // Process into a simpler lookup format
      const processed = {};
      
      for (const [key, entry] of Object.entries(rawData)) {
        // Key format: "G1" or "H1" 
        const strongsNum = key.replace(/^[GH]/, '');
        processed[strongsNum] = {
          lemma: entry.lemma || entry.word || '',
          translit: entry.translit || entry.xlit || '',
          pronunciation: entry.pronunciation || entry.pron || '',
          definition: entry.strongs_def || entry.derivation || entry.meaning || '',
          kjvUsage: entry.kjv_def || ''
        };
      }

      const entryCount = Object.keys(processed).length;
      const outputPath = join(STRONGS_DIR, `${lang}.json`);
      writeFileSync(outputPath, JSON.stringify(processed, null, 0));
      
      console.log(`  ✓ ${entryCount.toLocaleString()} entries`);
      console.log(`  ✓ Saved to: ${outputPath}`);
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  SCRIPTORIUM - Local Bible Data Setup');
  console.log('═══════════════════════════════════════════════════════════');

  await downloadBibles();
  await downloadStrongs();

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('  ✅ Download Complete!');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
