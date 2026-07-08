#!/usr/bin/env node
/**
 * Import Enhanced Cross-References from josephilipraja/bible-cross-reference-json
 * 
 * This script downloads cross-reference data (31,102 verses) and converts it
 * to the format used by the Scriptorium app.
 * 
 * Source: https://github.com/josephilipraja/bible-cross-reference-json
 * Original credit: SoulLiberty/MetaV
 * License: GPL-2.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://raw.githubusercontent.com/josephilipraja/bible-cross-reference-json/master';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// Book abbreviation mapping (source format → our format)
const BOOK_MAP = {
  'GEN': 'GEN', 'EXO': 'EXO', 'LEV': 'LEV', 'NUM': 'NUM', 'DEU': 'DEU',
  'JOS': 'JOS', 'JDG': 'JDG', 'RUT': 'RUT', '1SA': '1SA', '2SA': '2SA',
  '1KI': '1KI', '2KI': '2KI', '1CH': '1CH', '2CH': '2CH', 'EZR': 'EZR',
  'NEH': 'NEH', 'EST': 'EST', 'JOB': 'JOB', 'PSA': 'PSA', 'PRO': 'PRO',
  'ECC': 'ECC', 'SOS': 'SNG', 'ISA': 'ISA', 'JER': 'JER', 'LAM': 'LAM',
  'EZE': 'EZK', 'DAN': 'DAN', 'HOS': 'HOS', 'JOE': 'JOL', 'AMO': 'AMO',
  'OBA': 'OBA', 'JON': 'JON', 'MIC': 'MIC', 'NAH': 'NAM', 'HAB': 'HAB',
  'ZEP': 'ZEP', 'HAG': 'HAG', 'ZEC': 'ZEC', 'MAL': 'MAL',
  'MAT': 'MAT', 'MAR': 'MRK', 'LUK': 'LUK', 'JOH': 'JHN', 'ACT': 'ACT',
  'ROM': 'ROM', '1CO': '1CO', '2CO': '2CO', 'GAL': 'GAL', 'EPH': 'EPH',
  'PHP': 'PHP', 'COL': 'COL', '1TH': '1TH', '2TH': '2TH', '1TI': '1TI',
  '2TI': '2TI', 'TIT': 'TIT', 'PHM': 'PHM', 'HEB': 'HEB', 'JAM': 'JAS',
  '1PE': '1PE', '2PE': '2PE', '1JO': '1JN', '2JO': '2JN', '3JO': '3JN',
  'JDE': 'JUD', 'REV': 'REV'
};

// Full book names
const BOOK_NAMES = {
  'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers',
  'DEU': 'Deuteronomy', 'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth',
  '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings',
  '1CH': '1 Chronicles', '2CH': '2 Chronicles', 'EZR': 'Ezra', 'NEH': 'Nehemiah',
  'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms', 'PRO': 'Proverbs',
  'ECC': 'Ecclesiastes', 'SNG': 'Song of Solomon', 'ISA': 'Isaiah',
  'JER': 'Jeremiah', 'LAM': 'Lamentations', 'EZK': 'Ezekiel', 'DAN': 'Daniel',
  'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos', 'OBA': 'Obadiah',
  'JON': 'Jonah', 'MIC': 'Micah', 'NAM': 'Nahum', 'HAB': 'Habakkuk',
  'ZEP': 'Zephaniah', 'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi',
  'MAT': 'Matthew', 'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John',
  'ACT': 'Acts', 'ROM': 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians',
  'GAL': 'Galatians', 'EPH': 'Ephesians', 'PHP': 'Philippians', 'COL': 'Colossians',
  '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy',
  '2TI': '2 Timothy', 'TIT': 'Titus', 'PHM': 'Philemon', 'HEB': 'Hebrews',
  'JAS': 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John',
  '2JN': '2 John', '3JN': '3 John', 'JUD': 'Jude', 'REV': 'Revelation'
};

/**
 * Parse a reference like "GEN 23 4" into structured form
 */
function parseReference(ref) {
  const parts = ref.split(' ');
  if (parts.length < 3) return null;
  
  const srcBook = parts[0];
  const book = BOOK_MAP[srcBook];
  if (!book) {
    console.warn(`Unknown book: ${srcBook}`);
    return null;
  }
  
  const chapter = parseInt(parts[1], 10);
  const verse = parseInt(parts[2], 10);
  
  if (isNaN(chapter) || isNaN(verse)) return null;
  
  return { book, chapter, verse };
}

/**
 * Create a verse key in our format (e.g., "GEN.23.4")
 */
function makeKey(ref) {
  return `${ref.book}.${ref.chapter}.${ref.verse}`;
}

/**
 * Download a single JSON file
 */
async function downloadFile(fileNum) {
  const url = `${BASE_URL}/${fileNum}.json`;
  console.log(`  Downloading ${fileNum}.json...`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Process all cross-reference data
 */
async function processAllFiles() {
  console.log('📖 Importing Enhanced Cross-References\n');
  console.log('Source: josephilipraja/bible-cross-reference-json');
  console.log('Credit: SoulLiberty/MetaV\n');
  
  const allCrossRefs = {};
  let totalVerses = 0;
  let totalRefs = 0;
  
  // Download and process all 32 files
  for (let i = 1; i <= 32; i++) {
    try {
      const data = await downloadFile(i);
      
      // Process each verse in the file
      for (const [verseId, verseData] of Object.entries(data)) {
        // Parse the source verse
        const sourceRef = parseReference(verseData.v);
        if (!sourceRef) continue;
        
        const sourceKey = makeKey(sourceRef);
        
        // Parse all cross-references
        const refs = [];
        if (verseData.r) {
          for (const [refId, refStr] of Object.entries(verseData.r)) {
            const targetRef = parseReference(refStr);
            if (targetRef) {
              refs.push({
                book: targetRef.book,
                chapter: targetRef.chapter,
                verseStart: targetRef.verse,
                verseEnd: targetRef.verse,
                votes: 1 // From MetaV data
              });
              totalRefs++;
            }
          }
        }
        
        if (refs.length > 0) {
          // Merge with existing refs for this verse
          if (allCrossRefs[sourceKey]) {
            // Deduplicate by combining existing + new
            const existingSet = new Set(
              allCrossRefs[sourceKey].map(r => `${r.book}.${r.chapter}.${r.verseStart}`)
            );
            for (const ref of refs) {
              const refKey = `${ref.book}.${ref.chapter}.${ref.verseStart}`;
              if (!existingSet.has(refKey)) {
                allCrossRefs[sourceKey].push(ref);
              }
            }
          } else {
            allCrossRefs[sourceKey] = refs;
          }
          totalVerses++;
        }
      }
      
      console.log(`    File ${i}/32 processed`);
    } catch (err) {
      console.error(`  Error processing file ${i}: ${err.message}`);
    }
  }
  
  console.log(`\n✅ Processed ${totalVerses} verses with ${totalRefs} cross-references\n`);
  
  return allCrossRefs;
}

/**
 * Merge with existing cross-references
 */
function mergeWithExisting(newRefs) {
  const existingPath = path.join(OUTPUT_DIR, 'cross-references.json');
  
  try {
    const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
    const existingRefs = existingData.crossReferences || {};
    
    console.log(`📎 Merging with existing data (${Object.keys(existingRefs).length} verses)...`);
    
    let merged = 0;
    let added = 0;
    
    for (const [key, refs] of Object.entries(existingRefs)) {
      if (newRefs[key]) {
        // Merge: keep unique refs
        const existingSet = new Set(refs.map(r => `${r.book}.${r.chapter}.${r.verseStart}`));
        let addedToVerse = 0;
        
        for (const ref of newRefs[key]) {
          const refKey = `${ref.book}.${ref.chapter}.${ref.verseStart}`;
          if (!existingSet.has(refKey)) {
            refs.push({ ...ref, votes: ref.votes }); // Add new ref
            addedToVerse++;
          }
        }
        
        // Also add the existing refs' votes info
        newRefs[key] = refs;
        if (addedToVerse > 0) merged++;
      } else {
        // Keep existing entry
        newRefs[key] = refs;
        added++;
      }
    }
    
    console.log(`  Merged ${merged} verses, kept ${added} existing-only verses\n`);
  } catch (err) {
    console.log('  No existing cross-references to merge with\n');
  }
  
  return newRefs;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Download and process new data
    let crossRefs = await processAllFiles();
    
    // Merge with existing data
    crossRefs = mergeWithExisting(crossRefs);
    
    // Sort references by book order within each verse
    const bookOrder = Object.keys(BOOK_NAMES);
    for (const refs of Object.values(crossRefs)) {
      refs.sort((a, b) => {
        const orderA = bookOrder.indexOf(a.book);
        const orderB = bookOrder.indexOf(b.book);
        if (orderA !== orderB) return orderA - orderB;
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.verseStart - b.verseStart;
      });
    }
    
    // Build final output
    const output = {
      metadata: {
        source: 'josephilipraja/bible-cross-reference-json + TSK',
        originalCredit: 'SoulLiberty/MetaV',
        license: 'GPL-2.0',
        generated: new Date().toISOString(),
        totalVerses: Object.keys(crossRefs).length,
        totalReferences: Object.values(crossRefs).reduce((sum, refs) => sum + refs.length, 0)
      },
      bookAbbreviations: BOOK_NAMES,
      crossReferences: crossRefs
    };
    
    // Write output
    const outputPath = path.join(OUTPUT_DIR, 'cross-references.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    // Also create minified version
    const minPath = path.join(OUTPUT_DIR, 'cross-references.min.json');
    fs.writeFileSync(minPath, JSON.stringify(output));
    
    console.log('📁 Output files:');
    console.log(`  ${outputPath}`);
    console.log(`  ${minPath}`);
    console.log(`\n🎉 Done! ${output.metadata.totalVerses} verses with ${output.metadata.totalReferences} cross-references`);
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
