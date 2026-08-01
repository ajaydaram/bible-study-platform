import { 
  isBibleVersionLoaded, 
  importBibleToDb, 
  getDbVerse, 
  getDbChapter, 
  searchDbBible, 
  getDbBibleStructure 
} from './bibleDb';

/**
 * Local Bible Library
 * Provides offline-first Bible text access using IndexedDB local storage
 */

export interface LocalVerse {
  book: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface LocalChapter {
  book: string;
  bookName: string;
  chapter: number;
  verses: LocalVerse[];
  verseCount: number;
}

export interface LocalBibleData {
  version: string;
  books: Record<string, {
    name: string;
    abbrev: string;
    chapters: Record<number, Record<number, string>>;
  }>;
}

// Supported local versions
export const LOCAL_VERSIONS = {
  kjv: { name: 'King James Version', abbrev: 'KJV', file: 'kjv.json' },
  web: { name: 'World English Bible', abbrev: 'WEB', file: 'web.json' },
  esv: { name: 'English Standard Version', abbrev: 'ESV', file: 'esv.json' },
  asv: { name: 'American Standard Version', abbrev: 'ASV', file: 'web.json' },
  gnv: { name: 'Geneva Bible', abbrev: 'GNV', file: 'kjv.json' },
  lsv: { name: 'Literal Standard Version', abbrev: 'LSV', file: 'web.json' },
  fbv: { name: 'Free Bible Version', abbrev: 'FBV', file: 'web.json' },
  t4t: { name: 'Translation for Translators', abbrev: 'T4T', file: 'web.json' },
} as const;

export type LocalVersionId = keyof typeof LOCAL_VERSIONS;

// Progress listener tracking for the indexing process
type ProgressCallback = (progress: number) => void;
const progressListeners: Record<string, Set<ProgressCallback>> = {};

export function addProgressListener(versionId: string, callback: ProgressCallback) {
  if (!progressListeners[versionId]) {
    progressListeners[versionId] = new Set();
  }
  progressListeners[versionId].add(callback);
}

export function removeProgressListener(versionId: string, callback: ProgressCallback) {
  progressListeners[versionId]?.delete(callback);
}

function notifyProgress(versionId: string, progress: number) {
  progressListeners[versionId]?.forEach(cb => cb(progress));
}

const importPromises: Record<string, Promise<void>> = {};
const rawJsonCache: Record<string, LocalBibleData> = {};

// Book abbreviation mappings (API.Bible format to local format)
const BOOK_ABBREV_MAP: Record<string, string> = {
  'GEN': 'GEN', 'EXO': 'EXO', 'LEV': 'LEV', 'NUM': 'NUM', 'DEU': 'DEU',
  'JOS': 'JOS', 'JDG': 'JDG', 'RUT': 'RUT', '1SA': '1SA', '2SA': '2SA',
  '1KI': '1KI', '2KI': '2KI', '1CH': '1CH', '2CH': '2CH', 'EZR': 'EZR',
  'NEH': 'NEH', 'EST': 'EST', 'JOB': 'JOB', 'PSA': 'PSA', 'PRO': 'PRO',
  'ECC': 'ECC', 'SNG': 'SOS', 'ISA': 'ISA', 'JER': 'JER', 'LAM': 'LAM',
  'EZK': 'EZE', 'DAN': 'DAN', 'HOS': 'HOS', 'JOL': 'JOE', 'AMO': 'AMO',
  'OBA': 'OBA', 'JON': 'JON', 'MIC': 'MIC', 'NAM': 'NAH', 'HAB': 'HAB',
  'ZEP': 'ZEP', 'HAG': 'HAG', 'ZEC': 'ZEC', 'MAL': 'MAL',
  'MAT': 'MAT', 'MRK': 'MRK', 'LUK': 'LUK', 'JHN': 'JHN', 'ACT': 'ACT',
  'ROM': 'ROM', '1CO': '1CO', '2CO': '2CO', 'GAL': 'GAL', 'EPH': 'EPH',
  'PHP': 'PHP', 'COL': 'COL', '1TH': '1TH', '2TH': '2TH', '1TI': '1TI',
  '2TI': '2TI', 'TIT': 'TIT', 'PHM': 'PHM', 'HEB': 'HEB', 'JAS': 'JAS',
  '1PE': '1PE', '2PE': '2PE', '1JN': '1JN', '2JN': '2JN', '3JN': '3JN',
  'JUD': 'JDE', 'REV': 'REV',
  // Alternative mappings
  'SOS': 'SOS', 'EZE': 'EZE', 'JOE': 'JOE', 'NAH': 'NAH', 'JDE': 'JDE'
};

// Book name to abbreviation
const BOOK_NAME_TO_ABBREV: Record<string, string> = {
  'genesis': 'GEN', 'exodus': 'EXO', 'leviticus': 'LEV', 'numbers': 'NUM',
  'deuteronomy': 'DEU', 'joshua': 'JOS', 'judges': 'JDG', 'ruth': 'RUT',
  '1 samuel': '1SA', '2 samuel': '2SA', '1 kings': '1KI', '2 kings': '2KI',
  '1 chronicles': '1CH', '2 chronicles': '2CH', 'ezra': 'EZR', 'nehemiah': 'NEH',
  'esther': 'EST', 'job': 'JOB', 'psalms': 'PSA', 'psalm': 'PSA', 'proverbs': 'PRO',
  'ecclesiastes': 'ECC', 'song of solomon': 'SOS', 'song of songs': 'SOS',
  'isaiah': 'ISA', 'jeremiah': 'JER', 'lamentations': 'LAM', 'ezekiel': 'EZE',
  'daniel': 'DAN', 'hosea': 'HOS', 'joel': 'JOE', 'amos': 'AMO', 'obadiah': 'OBA',
  'jonah': 'JON', 'micah': 'MIC', 'nahum': 'NAH', 'habakkuk': 'HAB',
  'zephaniah': 'ZEP', 'haggai': 'HAG', 'zechariah': 'ZEC', 'malachi': 'MAL',
  'matthew': 'MAT', 'mark': 'MRK', 'luke': 'LUK', 'john': 'JHN', 'acts': 'ACT',
  'romans': 'ROM', '1 corinthians': '1CO', '2 corinthians': '2CO',
  'galatians': 'GAL', 'ephesians': 'EPH', 'philippians': 'PHP', 'colossians': 'COL',
  '1 thessalonians': '1TH', '2 thessalonians': '2TH', '1 timothy': '1TI',
  '2 timothy': '2TI', 'titus': 'TIT', 'philemon': 'PHM', 'hebrews': 'HEB',
  'james': 'JAS', '1 peter': '1PE', '2 peter': '2PE', '1 john': '1JN',
  '2 john': '2JN', '3 john': '3JN', 'jude': 'JDE', 'revelation': 'REV'
};

/**
 * Fetch raw JSON file as fallback/import source
 */
async function fetchRawJsonData(versionId: LocalVersionId): Promise<LocalBibleData | null> {
  if (rawJsonCache[versionId]) {
    return rawJsonCache[versionId];
  }
  const version = LOCAL_VERSIONS[versionId];
  if (!version) return null;
  try {
    const response = await fetch(`/data/bibles/${version.file}`);
    if (!response.ok) return null;
    const data: LocalBibleData = await response.json();
    rawJsonCache[versionId] = data;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Load a Bible version and trigger IndexedDB import in the background if needed
 */
export async function loadLocalBible(versionId: LocalVersionId): Promise<LocalBibleData | null> {
  const isLoaded = await isBibleVersionLoaded(versionId);
  if (isLoaded) {
    return { version: versionId.toUpperCase(), books: {} };
  }

  if (!importPromises[versionId]) {
    importPromises[versionId] = (async () => {
      const version = LOCAL_VERSIONS[versionId];
      if (!version) return;

      try {
        notifyProgress(versionId, 0);
        const data = await fetchRawJsonData(versionId);
        if (!data) {
          throw new Error(`Local file not found: ${version.file}`);
        }
        
        notifyProgress(versionId, 5);
        await importBibleToDb(versionId, data, (progress) => {
          const scaleProgress = 5 + Math.round((progress / 100) * 95);
          notifyProgress(versionId, scaleProgress);
        });
        
        notifyProgress(versionId, 100);
      } catch (err) {
        console.error(`Failed to import Bible ${versionId}:`, err);
        notifyProgress(versionId, -1);
        throw err;
      } finally {
        delete importPromises[versionId];
      }
    })();
  }

  try {
    await importPromises[versionId];
    return { version: versionId.toUpperCase(), books: {} };
  } catch (e) {
    return null;
  }
}

/**
 * Check if a version is available locally
 */
export function isLocalVersion(versionId: string): versionId is LocalVersionId {
  return versionId.toLowerCase() in LOCAL_VERSIONS;
}

/**
 * Normalize book abbreviation to local format
 */
function normalizeBookAbbrev(abbrev: string): string {
  const upper = abbrev.toUpperCase();
  return BOOK_ABBREV_MAP[upper] || upper;
}

/**
 * Parse a reference string like "John 3:16" or "Genesis 1:1-5"
 */
export function parseReference(reference: string): {
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
} | null {
  const match = reference.match(/^(\d?\s*[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i);
  if (!match) return null;

  const bookName = match[1].trim().toLowerCase();
  const chapter = parseInt(match[2], 10);
  const startVerse = match[3] ? parseInt(match[3], 10) : undefined;
  const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;

  const bookAbbrev = BOOK_NAME_TO_ABBREV[bookName];
  if (!bookAbbrev) return null;

  return { book: bookAbbrev, chapter, startVerse, endVerse };
}

/**
 * Get a single verse from local Bible
 */
export async function getLocalVerse(
  versionId: LocalVersionId,
  book: string,
  chapter: number,
  verse: number
): Promise<LocalVerse | null> {
  const isLoaded = await isBibleVersionLoaded(versionId);
  if (isLoaded) {
    const dbVerse = await getDbVerse(versionId, book, chapter, verse);
    if (dbVerse) {
      return {
        book: dbVerse.book,
        bookName: dbVerse.bookName,
        chapter: dbVerse.chapter,
        verse: dbVerse.verse,
        text: dbVerse.text
      };
    }
  }

  // Fallback to raw JSON
  const rawData = await fetchRawJsonData(versionId);
  if (!rawData) return null;
  
  const bookAbbrev = normalizeBookAbbrev(book);
  const bookData = rawData.books[bookAbbrev];
  if (!bookData) return null;

  const chapterData = bookData.chapters[chapter];
  if (!chapterData) return null;

  const text = chapterData[verse];
  if (!text) return null;

  return {
    book: bookAbbrev,
    bookName: bookData.name,
    chapter,
    verse,
    text
  };
}

/**
 * Get a full chapter from local Bible
 */
export async function getLocalChapter(
  versionId: LocalVersionId,
  book: string,
  chapter: number
): Promise<LocalChapter | null> {
  const isLoaded = await isBibleVersionLoaded(versionId);
  if (isLoaded) {
    const dbVerses = await getDbChapter(versionId, book, chapter);
    if (dbVerses.length > 0) {
      return {
        book: book.toUpperCase(),
        bookName: dbVerses[0].bookName,
        chapter,
        verses: dbVerses.map(v => ({
          book: v.book,
          bookName: v.bookName,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text
        })),
        verseCount: dbVerses.length
      };
    }
  }

  // Fallback to raw JSON
  const rawData = await fetchRawJsonData(versionId);
  if (!rawData) return null;

  const bookAbbrev = normalizeBookAbbrev(book);
  const bookData = rawData.books[bookAbbrev];
  if (!bookData) return null;

  const chapterData = bookData.chapters[chapter];
  if (!chapterData) return null;

  const verses: LocalVerse[] = Object.entries(chapterData)
    .map(([verseNum, text]) => ({
      book: bookAbbrev,
      bookName: bookData.name,
      chapter,
      verse: parseInt(verseNum, 10),
      text: text as string
    }))
    .sort((a, b) => a.verse - b.verse);

  return {
    book: bookAbbrev,
    bookName: bookData.name,
    chapter,
    verses,
    verseCount: verses.length
  };
}

/**
 * Get a range of verses from local Bible
 */
export async function getLocalVerseRange(
  versionId: LocalVersionId,
  book: string,
  chapter: number,
  startVerse: number,
  endVerse: number
): Promise<LocalVerse[]> {
  const chapterData = await getLocalChapter(versionId, book, chapter);
  if (!chapterData) return [];

  return chapterData.verses.filter(v => v.verse >= startVerse && v.verse <= endVerse);
}

/**
 * Get text by reference string (e.g., "John 3:16")
 */
export async function getLocalPassage(
  versionId: LocalVersionId,
  reference: string
): Promise<{ verses: LocalVerse[]; reference: string } | null> {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  if (parsed.startVerse && parsed.endVerse) {
    const verses = await getLocalVerseRange(
      versionId,
      parsed.book,
      parsed.chapter,
      parsed.startVerse,
      parsed.endVerse
    );
    return verses.length > 0 ? { verses, reference } : null;
  }

  if (parsed.startVerse) {
    const verse = await getLocalVerse(versionId, parsed.book, parsed.chapter, parsed.startVerse);
    return verse ? { verses: [verse], reference } : null;
  }

  const chapter = await getLocalChapter(versionId, parsed.book, parsed.chapter);
  return chapter ? { verses: chapter.verses, reference } : null;
}

/**
 * Search across all verses in a Bible version
 */
export async function searchLocalBible(
  versionId: LocalVersionId,
  query: string,
  options: { caseSensitive?: boolean; wholeWord?: boolean; limit?: number } = {}
): Promise<LocalVerse[]> {
  const isLoaded = await isBibleVersionLoaded(versionId);
  if (isLoaded) {
    const dbVerses = await searchDbBible(versionId, query, options);
    return dbVerses.map(v => ({
      book: v.book,
      bookName: v.bookName,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text
    }));
  }

  // Fallback to raw JSON search
  const rawData = await fetchRawJsonData(versionId);
  if (!rawData) return [];

  const { caseSensitive = false, wholeWord = false, limit = 100 } = options;
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  const results: LocalVerse[] = [];
  const wordPattern = wholeWord ? new RegExp(`\\b${query}\\b`, caseSensitive ? '' : 'i') : null;

  for (const [bookAbbrev, bookData] of Object.entries(rawData.books)) {
    for (const [chapterNum, chapterData] of Object.entries(bookData.chapters)) {
      for (const [verseNum, text] of Object.entries(chapterData)) {
        const searchText = caseSensitive ? text : text.toLowerCase();
        const matches = wholeWord 
          ? wordPattern?.test(text)
          : searchText.includes(searchQuery);

        if (matches) {
          results.push({
            book: bookAbbrev,
            bookName: bookData.name,
            chapter: parseInt(chapterNum, 10),
            verse: parseInt(verseNum, 10),
            text
          });

          if (results.length >= limit) {
            return results;
          }
        }
      }
    }
  }

  return results;
}

/**
 * Get book info (chapter count, etc.)
 */
export async function getLocalBookInfo(
  versionId: LocalVersionId,
  book: string
): Promise<{ name: string; abbrev: string; chapterCount: number; verseCounts: number[] } | null> {
  const isLoaded = await isBibleVersionLoaded(versionId);
  if (isLoaded) {
    const structure = await getDbBibleStructure(versionId);
    const bookAbbrev = normalizeBookAbbrev(book);
    const bookData = structure?.[bookAbbrev];
    if (bookData) {
      return bookData;
    }
  }

  // Fallback to raw JSON
  const rawData = await fetchRawJsonData(versionId);
  if (!rawData) return null;

  const bookAbbrev = normalizeBookAbbrev(book);
  const bookData = rawData.books[bookAbbrev];
  if (!bookData) return null;

  const chapters = Object.keys(bookData.chapters).map(Number).sort((a, b) => a - b);
  const verseCounts = chapters.map(ch => Object.keys(bookData.chapters[ch]).length);

  return {
    name: bookData.name,
    abbrev: bookAbbrev,
    chapterCount: chapters.length,
    verseCounts
  };
}

/**
 * Get all books in the Bible
 */
export async function getLocalBooks(versionId: LocalVersionId): Promise<{ abbrev: string; name: string }[]> {
  const isLoaded = await isBibleVersionLoaded(versionId);
  if (isLoaded) {
    const structure = await getDbBibleStructure(versionId);
    if (structure) {
      return Object.values<any>(structure).map(b => ({
        abbrev: b.abbrev,
        name: b.name
      }));
    }
  }

  // Fallback to raw JSON
  const rawData = await fetchRawJsonData(versionId);
  if (!rawData) return [];

  return Object.entries(rawData.books).map(([abbrev, book]) => ({
    abbrev,
    name: book.name
  }));
}

/**
 * Check local Bible status
 */
export function getLocalBibleStatus(): { 
  loaded: string[];
  available: string[];
} {
  return {
    // Return empty mock for backwards compatibility with legacy cache checks
    loaded: [],
    available: Object.keys(LOCAL_VERSIONS)
  };
}
