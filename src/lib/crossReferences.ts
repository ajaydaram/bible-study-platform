/**
 * Cross-References Library
 * Enhanced with 30,000+ verses from josephilipraja/bible-cross-reference-json
 * Original: Treasury of Scripture Knowledge (TSK)
 * 
 * Provides related verses for any given Bible verse
 * Uses two-tier loading: embedded popular verses + on-demand full book data
 */

export interface CrossReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  votes?: number;
}

export interface CrossReferencesData {
  metadata: {
    source: string;
    generated: string;
    totalVerses: number;
    minVotes?: number;
  };
  bookAbbreviations: Record<string, string>;
  crossReferences: Record<string, CrossReference[]>;
}

// Book code to full name mapping
export const BOOK_NAMES: Record<string, string> = {
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

// Book codes array for index-based lookups
const BOOK_CODES_ARRAY = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
  'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
  'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS',
  '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
];

// Name to code mapping
export const BOOK_CODES: Record<string, string> = Object.fromEntries(
  Object.entries(BOOK_NAMES).map(([code, name]) => [name, code])
);

// Cached data: embedded popular verses
let embeddedData: CrossReferencesData | null = null;

// Cached book data loaded from public folder
const bookDataCache: Record<string, Record<number, Record<number, string>>> = {};

// Track loading promises to avoid duplicate fetches
const loadingPromises: Record<string, Promise<void> | undefined> = {};

/**
 * Load embedded cross-references (popular verses, bundled)
 */
export async function loadCrossReferences(): Promise<CrossReferencesData> {
  if (embeddedData) return embeddedData;
  
  const data = await import('../data/cross-references.json');
  embeddedData = data.default as CrossReferencesData;
  return embeddedData;
}

/**
 * Parse compact reference format "bookIndex:chapter:verse" 
 */
function parseCompactRef(refStr: string): CrossReference | null {
  const parts = refStr.split(':');
  if (parts.length < 3) return null;
  
  const bookIndex = parseInt(parts[0], 10);
  const chapter = parseInt(parts[1], 10);
  const verse = parseInt(parts[2], 10);
  
  if (isNaN(bookIndex) || bookIndex < 0 || bookIndex >= BOOK_CODES_ARRAY.length) return null;
  
  return {
    book: BOOK_CODES_ARRAY[bookIndex],
    chapter,
    verseStart: verse,
    verseEnd: verse
  };
}

/**
 * Load book-specific cross-reference data from public folder
 */
async function loadBookData(bookCode: string): Promise<void> {
  if (bookDataCache[bookCode]) return;
  
  // Avoid duplicate loads
  const existingPromise = loadingPromises[bookCode];
  if (existingPromise) {
    await existingPromise;
    return;
  }
  
  loadingPromises[bookCode] = (async () => {
    try {
      const response = await fetch(`/data/cross-refs/${bookCode.toLowerCase()}.json`);
      if (response.ok) {
        bookDataCache[bookCode] = await response.json();
      } else {
        console.warn(`Cross-refs not found for ${bookCode}`);
        bookDataCache[bookCode] = {};
      }
    } catch (err) {
      console.warn(`Failed to load cross-refs for ${bookCode}:`, err);
      bookDataCache[bookCode] = {};
    }
  })();
  
  await loadingPromises[bookCode];
  delete loadingPromises[bookCode];
}

/**
 * Get cross-references for a specific verse
 * First checks embedded data, then loads from book-specific files
 */
export async function getCrossReferences(
  book: string,
  chapter: number,
  verse: number
): Promise<CrossReference[]> {
  // Convert book name to code if needed
  const bookCode = BOOK_CODES[book] || book;
  const key = `${bookCode}.${chapter}.${verse}`;
  
  // Try embedded data first
  const embedded = await loadCrossReferences();
  const embeddedRefs = embedded.crossReferences[key];
  if (embeddedRefs && embeddedRefs.length > 0) {
    return embeddedRefs;
  }
  
  // Load from book-specific file
  await loadBookData(bookCode);
  const bookData = bookDataCache[bookCode];
  
  if (!bookData || !bookData[chapter] || !bookData[chapter][verse]) {
    return [];
  }
  
  // Parse compact format
  const compactRefs = bookData[chapter][verse];
  const refs: CrossReference[] = [];
  
  for (const refStr of compactRefs.split(',')) {
    const ref = parseCompactRef(refStr.trim());
    if (ref) refs.push(ref);
  }
  
  return refs;
}

/**
 * Get cross-references for a chapter (all verses)
 */
export async function getChapterCrossReferences(
  book: string,
  chapter: number
): Promise<Record<number, CrossReference[]>> {
  const bookCode = BOOK_CODES[book] || book;
  const result: Record<number, CrossReference[]> = {};
  
  // Load book data
  await loadBookData(bookCode);
  const bookData = bookDataCache[bookCode];
  
  if (bookData && bookData[chapter]) {
    for (const [verseStr, compactRefs] of Object.entries(bookData[chapter])) {
      const verse = parseInt(verseStr, 10);
      const refs: CrossReference[] = [];
      
      for (const refStr of (compactRefs as string).split(',')) {
        const ref = parseCompactRef(refStr.trim());
        if (ref) refs.push(ref);
      }
      
      if (refs.length > 0) {
        result[verse] = refs;
      }
    }
  }
  
  // Also check embedded data
  const embedded = await loadCrossReferences();
  const prefix = `${bookCode}.${chapter}.`;
  for (const [key, refs] of Object.entries(embedded.crossReferences)) {
    if (key.startsWith(prefix)) {
      const verse = parseInt(key.split('.')[2], 10);
      if (!result[verse]) {
        result[verse] = refs;
      }
    }
  }
  
  return result;
}

/**
 * Format a cross-reference for display
 */
export function formatCrossReference(ref: CrossReference): string {
  const bookName = BOOK_NAMES[ref.book] || ref.book;
  
  if (ref.verseStart === ref.verseEnd) {
    return `${bookName} ${ref.chapter}:${ref.verseStart}`;
  }
  return `${bookName} ${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`;
}

/**
 * Get a short reference format (abbreviated book name)
 */
export function formatShortReference(ref: CrossReference): string {
  if (ref.verseStart === ref.verseEnd) {
    return `${ref.book} ${ref.chapter}:${ref.verseStart}`;
  }
  return `${ref.book} ${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`;
}
