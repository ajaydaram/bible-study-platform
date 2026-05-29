/**
 * Interlinear Bible API Service
 * Fetches Greek/Hebrew text with Strong's numbers from Bolls.life API
 * and enriches with transliteration data from our STEPBible lexicon
 */

import { getWord, type HebrewLexiconEntry, type GreekLexiconEntry } from './stepbibleData';

// API Configuration
const BOLLS_API_BASE = 'https://bolls.life';

// Book name to number mapping (Bolls uses book numbers)
const BOOK_MAP: Record<string, number> = {
  // Old Testament
  'genesis': 1, 'exodus': 2, 'leviticus': 3, 'numbers': 4, 'deuteronomy': 5,
  'joshua': 6, 'judges': 7, 'ruth': 8, '1 samuel': 9, '2 samuel': 10,
  '1 kings': 11, '2 kings': 12, '1 chronicles': 13, '2 chronicles': 14,
  'ezra': 15, 'nehemiah': 16, 'esther': 17, 'job': 18, 'psalms': 19,
  'proverbs': 20, 'ecclesiastes': 21, 'song of solomon': 22, 'isaiah': 23,
  'jeremiah': 24, 'lamentations': 25, 'ezekiel': 26, 'daniel': 27,
  'hosea': 28, 'joel': 29, 'amos': 30, 'obadiah': 31, 'jonah': 32,
  'micah': 33, 'nahum': 34, 'habakkuk': 35, 'zephaniah': 36, 'haggai': 37,
  'zechariah': 38, 'malachi': 39,
  // New Testament
  'matthew': 40, 'mark': 41, 'luke': 42, 'john': 43, 'acts': 44,
  'romans': 45, '1 corinthians': 46, '2 corinthians': 47, 'galatians': 48,
  'ephesians': 49, 'philippians': 50, 'colossians': 51, '1 thessalonians': 52,
  '2 thessalonians': 53, '1 timothy': 54, '2 timothy': 55, 'titus': 56,
  'philemon': 57, 'hebrews': 58, 'james': 59, '1 peter': 60, '2 peter': 61,
  '1 john': 62, '2 john': 63, '3 john': 64, 'jude': 65, 'revelation': 66,
};

// Available translations with Strong's numbers
export const INTERLINEAR_VERSIONS = [
  { id: 'TISCH', name: 'Tischendorf Greek NT', abbr: 'TISCH', lang: 'greek' },
  { id: 'TR', name: 'Textus Receptus', abbr: 'TR', lang: 'greek' },
  { id: 'WLCO', name: 'Westminster Leningrad OT', abbr: 'WLC', lang: 'hebrew' },
] as const;

// Types
export interface InterlinearWord {
  original: string;           // Greek/Hebrew text
  strongs: string;            // Strong's number (e.g., "G3056")
  transliteration: string;    // Latin transliteration
  gloss: string;              // English gloss
  morph?: string;             // Morphological code
  meaning?: string;           // Full meaning (from lexicon)
}

export interface InterlinearVerse {
  verse: number;
  words: InterlinearWord[];
  rawText: string;
}

export interface InterlinearChapter {
  book: string;
  chapter: number;
  version: string;
  verses: InterlinearVerse[];
}

// Cache for parsed interlinear data
const interlinearCache: Record<string, InterlinearChapter> = {};

/**
 * Parse Strong's-tagged text into word array
 * Format: "Ἐν<S>1722</S> ἀρχῇ<S>746</S> ἦν<S>1510</S>"
 */
function parseStrongsText(text: string, lang: 'greek' | 'hebrew'): { original: string; strongs: string }[] {
  const words: { original: string; strongs: string }[] = [];
  
  // Regex to match word<S>number</S> pattern
  const regex = /([^\s<]+)<S>(\d+)<\/S>/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const original = match[1].replace(/[,;.:·]/g, ''); // Clean punctuation
    const strongsNum = match[2];
    const prefix = lang === 'greek' ? 'G' : 'H';
    
    words.push({
      original,
      strongs: `${prefix}${strongsNum.padStart(4, '0')}`
    });
  }
  
  return words;
}

/**
 * Fetch interlinear chapter data from Bolls.life API
 */
export async function getInterlinearChapter(
  book: string,
  chapter: number,
  version: string = 'TISCH'
): Promise<InterlinearChapter | null> {
  const cacheKey = `${version}-${book}-${chapter}`;
  
  // Check cache first
  if (interlinearCache[cacheKey]) {
    return interlinearCache[cacheKey];
  }
  
  const bookNum = BOOK_MAP[book.toLowerCase()];
  if (!bookNum) {
    console.error(`Unknown book: ${book}`);
    return null;
  }
  
  const versionConfig = INTERLINEAR_VERSIONS.find(v => v.id === version);
  const lang = versionConfig?.lang || 'greek';
  
  try {
    const response = await fetch(`${BOLLS_API_BASE}/get-chapter/${version}/${bookNum}/${chapter}/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse each verse
    const verses: InterlinearVerse[] = await Promise.all(
      data.map(async (verseData: { verse: number; text: string }) => {
        const parsedWords = parseStrongsText(verseData.text, lang);
        
        // Enrich with lexicon data
        const enrichedWords: InterlinearWord[] = await Promise.all(
          parsedWords.map(async (word) => {
            const lexiconEntry = await getWord(word.strongs);
            
            if (lexiconEntry) {
              return {
                original: word.original,
                strongs: word.strongs,
                transliteration: lexiconEntry.transliteration,
                gloss: lexiconEntry.gloss,
                morph: lexiconEntry.morph,
                meaning: lexiconEntry.meaning
              };
            }
            
            // Fallback if not in lexicon
            return {
              original: word.original,
              strongs: word.strongs,
              transliteration: word.original, // Use original as fallback
              gloss: '—'
            };
          })
        );
        
        return {
          verse: verseData.verse,
          words: enrichedWords,
          rawText: verseData.text
        };
      })
    );
    
    const result: InterlinearChapter = {
      book,
      chapter,
      version,
      verses
    };
    
    // Cache the result
    interlinearCache[cacheKey] = result;
    
    return result;
  } catch (error) {
    console.error('Error fetching interlinear data:', error);
    return null;
  }
}

/**
 * Fetch a single verse interlinear data
 */
export async function getInterlinearVerse(
  book: string,
  chapter: number,
  verse: number,
  version: string = 'TISCH'
): Promise<InterlinearVerse | null> {
  const chapterData = await getInterlinearChapter(book, chapter, version);
  
  if (!chapterData) return null;
  
  return chapterData.verses.find(v => v.verse === verse) || null;
}

/**
 * Get word study data for a specific Strong's number
 * Returns full lexicon entry with transliteration
 */
export async function getWordStudy(strongs: string): Promise<HebrewLexiconEntry | GreekLexiconEntry | null> {
  return await getWord(strongs);
}

/**
 * Format John 1:1 as sample interlinear data (for testing/demo)
 */
export const SAMPLE_JOHN_1_1: InterlinearWord[] = [
  { original: 'Ἐν', strongs: 'G1722', transliteration: 'en', gloss: 'In' },
  { original: 'ἀρχῇ', strongs: 'G0746', transliteration: 'archē', gloss: 'beginning' },
  { original: 'ἦν', strongs: 'G1510', transliteration: 'ēn', gloss: 'was' },
  { original: 'ὁ', strongs: 'G3588', transliteration: 'ho', gloss: 'the' },
  { original: 'λόγος', strongs: 'G3056', transliteration: 'logos', gloss: 'Word' },
  { original: 'καὶ', strongs: 'G2532', transliteration: 'kai', gloss: 'and' },
  { original: 'ὁ', strongs: 'G3588', transliteration: 'ho', gloss: 'the' },
  { original: 'λόγος', strongs: 'G3056', transliteration: 'logos', gloss: 'Word' },
  { original: 'ἦν', strongs: 'G1510', transliteration: 'ēn', gloss: 'was' },
  { original: 'πρὸς', strongs: 'G4314', transliteration: 'pros', gloss: 'with' },
  { original: 'τὸν', strongs: 'G3588', transliteration: 'ton', gloss: 'the' },
  { original: 'θεόν', strongs: 'G2316', transliteration: 'theon', gloss: 'God' },
  { original: 'καὶ', strongs: 'G2532', transliteration: 'kai', gloss: 'and' },
  { original: 'θεὸς', strongs: 'G2316', transliteration: 'theos', gloss: 'God' },
  { original: 'ἦν', strongs: 'G1510', transliteration: 'ēn', gloss: 'was' },
  { original: 'ὁ', strongs: 'G3588', transliteration: 'ho', gloss: 'the' },
  { original: 'λόγος', strongs: 'G3056', transliteration: 'logos', gloss: 'Word' },
];
