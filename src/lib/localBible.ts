/**
 * Local Bible Library
 * Provides offline-first Bible text access using locally stored JSON files
 * Falls back to API.Bible/ESV API only when local data is unavailable
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

// Cache for loaded Bible versions
const bibleCache: Record<string, LocalBibleData> = {};

// Supported local versions
export const LOCAL_VERSIONS = {
  kjv: { name: 'King James Version', abbrev: 'KJV', file: 'kjv.json' },
  web: { name: 'World English Bible', abbrev: 'WEB', file: 'web.json' },
  // bbe: { name: 'Bible in Basic English', abbrev: 'BBE', file: 'bbe.json' },
} as const;

export type LocalVersionId = keyof typeof LOCAL_VERSIONS;

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
 * Load a Bible version from local JSON
 */
export async function loadLocalBible(versionId: LocalVersionId): Promise<LocalBibleData | null> {
  if (bibleCache[versionId]) {
    return bibleCache[versionId];
  }

  const version = LOCAL_VERSIONS[versionId];
  if (!version) return null;

  try {
    const response = await fetch(`/data/bibles/${version.file}`);
    if (!response.ok) {
      console.warn(`Local Bible ${versionId} not available`);
      return null;
    }
    const data: LocalBibleData = await response.json();
    bibleCache[versionId] = data;
    return data;
  } catch (error) {
    console.warn(`Error loading local Bible ${versionId}:`, error);
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
  // Match patterns like "John 3:16", "1 John 2:1-3", "Genesis 1"
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
  const bible = await loadLocalBible(versionId);
  if (!bible) return null;

  const bookAbbrev = normalizeBookAbbrev(book);
  const bookData = bible.books[bookAbbrev];
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
  const bible = await loadLocalBible(versionId);
  if (!bible) return null;

  const bookAbbrev = normalizeBookAbbrev(book);
  const bookData = bible.books[bookAbbrev];
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
  const bible = await loadLocalBible(versionId);
  if (!bible) return [];

  const { caseSensitive = false, wholeWord = false, limit = 100 } = options;
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  const results: LocalVerse[] = [];

  const wordPattern = wholeWord ? new RegExp(`\\b${query}\\b`, caseSensitive ? '' : 'i') : null;

  for (const [bookAbbrev, bookData] of Object.entries(bible.books)) {
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
  const bible = await loadLocalBible(versionId);
  if (!bible) return null;

  const bookAbbrev = normalizeBookAbbrev(book);
  const bookData = bible.books[bookAbbrev];
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
  const bible = await loadLocalBible(versionId);
  if (!bible) return [];

  return Object.entries(bible.books).map(([abbrev, book]) => ({
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
    loaded: Object.keys(bibleCache),
    available: Object.keys(LOCAL_VERSIONS)
  };
}
