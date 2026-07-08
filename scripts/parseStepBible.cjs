/**
 * STEPBible Data Parser
 * Converts STEPBible TSV/TXT files into JSON for the app
 * 
 * Usage: node scripts/parseStepBible.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data/stepbible');
const OUTPUT_DIR = path.join(__dirname, '../src/data/stepbible/json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse Hebrew Lexicon (TBESH.txt)
 */
function parseHebrewLexicon() {
  console.log('Parsing Hebrew Lexicon (TBESH.txt)...');
  const filePath = path.join(DATA_DIR, 'TBESH.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const lexicon = {};
  let dataStarted = false;
  
  for (const line of lines) {
    // Skip header lines until we reach the data
    if (line.startsWith('eStrong#\tdStrong')) {
      dataStarted = true;
      continue;
    }
    
    if (!dataStarted || line.trim() === '' || line.startsWith('===')) {
      continue;
    }
    
    // Parse tab-separated fields
    const parts = line.split('\t');
    if (parts.length >= 7 && parts[0].startsWith('H')) {
      const eStrong = parts[0].trim();
      const dStrongRaw = parts[1].trim();
      const uStrong = parts[2].trim();
      const hebrew = parts[3].trim();
      const transliteration = parts[4].trim();
      const morph = parts[5].trim();
      const gloss = parts[6].trim();
      const meaning = parts[7] ? parts[7].trim() : '';
      
      // Clean up the meaning - convert HTML breaks to newlines
      const cleanMeaning = meaning
        .replace(/<br>/gi, '\n')
        .replace(/<BR>/gi, '\n')
        .replace(/<i>/gi, '')
        .replace(/<\/i>/gi, '')
        .replace(/<b>/gi, '')
        .replace(/<\/b>/gi, '');
      
      // Extract clean dStrong (e.g., "H0001G = a Part of" -> "H0001G")
      const dStrongMatch = dStrongRaw.match(/^(H\d+[A-Z]?)/);
      const dStrong = dStrongMatch ? dStrongMatch[1] : null;
      
      // Use eStrong as primary key for consistency
      const key = eStrong;
      
      // Only add if we don't already have this entry (use first occurrence)
      if (!lexicon[key]) {
        lexicon[key] = {
          strongs: key,
          eStrong,
          hebrew,
          transliteration,
          morph,
          gloss,
          meaning: cleanMeaning
        };
      }
    }
  }
  
  // Write output
  const outputPath = path.join(OUTPUT_DIR, 'hebrewLexicon.json');
  fs.writeFileSync(outputPath, JSON.stringify(lexicon, null, 2));
  console.log(`  ✓ Wrote ${Object.keys(lexicon).length} Hebrew entries to hebrewLexicon.json`);
  
  // Also create a compact version for production
  const compactPath = path.join(OUTPUT_DIR, 'hebrewLexicon.min.json');
  fs.writeFileSync(compactPath, JSON.stringify(lexicon));
  console.log(`  ✓ Wrote compact version to hebrewLexicon.min.json`);
  
  return lexicon;
}

/**
 * Parse Greek Lexicon (TBESG.txt)
 */
function parseGreekLexicon() {
  console.log('Parsing Greek Lexicon (TBESG.txt)...');
  const filePath = path.join(DATA_DIR, 'TBESG.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const lexicon = {};
  let dataStarted = false;
  
  for (const line of lines) {
    // Skip header lines until we reach the actual data
    if (line.startsWith('G0001\tG0001G')) {
      dataStarted = true;
    }
    
    if (!dataStarted || line.trim() === '' || line.startsWith('===') || line.startsWith('$')) {
      continue;
    }
    
    // Parse tab-separated fields
    const parts = line.split('\t');
    if (parts.length >= 7 && parts[0].startsWith('G')) {
      const eStrong = parts[0].trim();
      const dStrongRaw = parts[1].trim();
      const uStrong = parts[2].trim();
      const greek = parts[3].trim();
      const transliteration = parts[4].trim();
      const morph = parts[5].trim();
      const gloss = parts[6].trim();
      const meaning = parts[7] ? parts[7].trim() : '';
      
      // Clean up the meaning - convert HTML to plain text
      const cleanMeaning = meaning
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<BR\s*\/?>/gi, '\n')
        .replace(/<i>/gi, '')
        .replace(/<\/i>/gi, '')
        .replace(/<b>/gi, '')
        .replace(/<\/b>/gi, '')
        .replace(/<ref='[^']*'>/gi, '')
        .replace(/<\/ref>/gi, '')
        .replace(/__/g, '  ');
      
      // Extract clean dStrong (e.g., "G0001G = a Part of" -> "G0001G")
      const dStrongMatch = dStrongRaw.match(/^(G\d+[A-Z]?)/);
      const dStrong = dStrongMatch ? dStrongMatch[1] : null;
      
      // Use eStrong as primary key for consistency
      const key = eStrong;
      
      // Only add if we don't already have this entry
      if (!lexicon[key]) {
        lexicon[key] = {
          strongs: key,
          eStrong,
          greek,
          transliteration,
          morph,
          gloss,
          meaning: cleanMeaning
        };
      }
    }
  }
  
  // Write output
  const outputPath = path.join(OUTPUT_DIR, 'greekLexicon.json');
  fs.writeFileSync(outputPath, JSON.stringify(lexicon, null, 2));
  console.log(`  ✓ Wrote ${Object.keys(lexicon).length} Greek entries to greekLexicon.json`);
  
  // Compact version
  const compactPath = path.join(OUTPUT_DIR, 'greekLexicon.min.json');
  fs.writeFileSync(compactPath, JSON.stringify(lexicon));
  console.log(`  ✓ Wrote compact version to greekLexicon.min.json`);
  
  return lexicon;
}

/**
 * Create a combined lookup index for quick searches
 */
function createSearchIndex(hebrewLexicon, greekLexicon) {
  console.log('Creating search index...');
  
  const index = {
    byGloss: {},      // gloss -> [strongs numbers]
    byWord: {},       // hebrew/greek word -> strongs number
    hebrew: Object.keys(hebrewLexicon),
    greek: Object.keys(greekLexicon)
  };
  
  // Index Hebrew words
  for (const [key, entry] of Object.entries(hebrewLexicon)) {
    // Index by gloss
    const gloss = entry.gloss.toLowerCase();
    if (!index.byGloss[gloss]) {
      index.byGloss[gloss] = [];
    }
    index.byGloss[gloss].push({ strongs: key, lang: 'hebrew' });
    
    // Index by Hebrew word
    if (entry.hebrew) {
      index.byWord[entry.hebrew] = { strongs: key, lang: 'hebrew' };
    }
  }
  
  // Index Greek words
  for (const [key, entry] of Object.entries(greekLexicon)) {
    const gloss = entry.gloss.toLowerCase();
    if (!index.byGloss[gloss]) {
      index.byGloss[gloss] = [];
    }
    index.byGloss[gloss].push({ strongs: key, lang: 'greek' });
    
    if (entry.greek) {
      index.byWord[entry.greek] = { strongs: key, lang: 'greek' };
    }
  }
  
  const outputPath = path.join(OUTPUT_DIR, 'searchIndex.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`  ✓ Wrote search index with ${Object.keys(index.byGloss).length} gloss entries`);
}

/**
 * Create a subset of common words for faster initial load
 */
function createCommonWordsSubset(hebrewLexicon, greekLexicon) {
  console.log('Creating common words subset...');
  
  // Common Hebrew Strong's numbers (most frequently used)
  const commonHebrewNumbers = [
    'H0001', 'H0113', 'H0120', 'H0136', 'H0157', 'H0160', 'H0430', 'H0559', 
    'H0776', 'H0802', 'H0834', 'H0935', 'H0996', 'H1004', 'H1121', 'H1242',
    'H1254', 'H1696', 'H1697', 'H1870', 'H1875', 'H2009', 'H2063', 'H2088',
    'H2617', 'H2896', 'H3045', 'H3068', 'H3117', 'H3201', 'H3212', 'H3220',
    'H3318', 'H3427', 'H3478', 'H3588', 'H3605', 'H3651', 'H3820', 'H4100',
    'H4191', 'H4310', 'H4428', 'H4725', 'H5002', 'H5046', 'H5186', 'H5414',
    'H5650', 'H5869', 'H5921', 'H5971', 'H6213', 'H6310', 'H6440', 'H6635',
    'H7200', 'H7223', 'H7307', 'H7451', 'H7725', 'H8034', 'H8064', 'H8085'
  ];
  
  // Common Greek Strong's numbers
  const commonGreekNumbers = [
    'G0001', 'G0018', 'G0025', 'G0026', 'G0032', 'G0080', 'G0165', 'G0166',
    'G0191', 'G0225', 'G0243', 'G0264', 'G0266', 'G0281', 'G0435', 'G0444',
    'G0450', 'G0513', 'G0514', 'G0530', 'G0536', 'G0563', 'G0639', 'G0652',
    'G0746', 'G0907', 'G0932', 'G0935', 'G0991', 'G1063', 'G1097', 'G1161',
    'G1223', 'G1321', 'G1342', 'G1380', 'G1411', 'G1515', 'G1537', 'G1680',
    'G1849', 'G2041', 'G2098', 'G2222', 'G2316', 'G2424', 'G2532', 'G2588',
    'G2889', 'G2962', 'G3004', 'G3056', 'G3306', 'G3361', 'G3588', 'G3739',
    'G3772', 'G3778', 'G3956', 'G3982', 'G4100', 'G4102', 'G4151', 'G4396',
    'G4561', 'G4592', 'G4678', 'G4982', 'G5043', 'G5046', 'G5207', 'G5485'
  ];
  
  const commonWords = {
    hebrew: {},
    greek: {}
  };
  
  for (const num of commonHebrewNumbers) {
    if (hebrewLexicon[num]) {
      commonWords.hebrew[num] = hebrewLexicon[num];
    }
  }
  
  for (const num of commonGreekNumbers) {
    if (greekLexicon[num]) {
      commonWords.greek[num] = greekLexicon[num];
    }
  }
  
  const outputPath = path.join(OUTPUT_DIR, 'commonWords.json');
  fs.writeFileSync(outputPath, JSON.stringify(commonWords, null, 2));
  console.log(`  ✓ Wrote ${Object.keys(commonWords.hebrew).length} Hebrew + ${Object.keys(commonWords.greek).length} Greek common words`);
}

// Main execution
console.log('\n=== STEPBible Data Parser ===\n');

try {
  const hebrewLexicon = parseHebrewLexicon();
  const greekLexicon = parseGreekLexicon();
  createSearchIndex(hebrewLexicon, greekLexicon);
  createCommonWordsSubset(hebrewLexicon, greekLexicon);
  
  console.log('\n✅ All parsing complete!\n');
  console.log('Generated files in src/data/stepbible/json/:');
  console.log('  - hebrewLexicon.json (full Hebrew lexicon)');
  console.log('  - hebrewLexicon.min.json (minified)');
  console.log('  - greekLexicon.json (full Greek lexicon)');
  console.log('  - greekLexicon.min.json (minified)');
  console.log('  - searchIndex.json (search index by gloss/word)');
  console.log('  - commonWords.json (frequently used words for quick load)');
} catch (error) {
  console.error('Error parsing files:', error);
  process.exit(1);
}
