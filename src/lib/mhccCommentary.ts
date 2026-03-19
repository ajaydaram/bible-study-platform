/**
 * Matthew Henry Concise Commentary Library
 * 
 * Provides access to Matthew Henry's Concise Commentary on the Whole Bible.
 * Commentary is organized by book → chapter → verse ranges.
 */

export interface CommentaryEntry {
  verseRange: string; // e.g., "1-2", "3", "4-7"
  text: string;
}

export interface ChapterCommentary {
  intro?: string;
  verses: Record<string, string>; // verseRange -> commentary text
}

export interface BookCommentary {
  [chapter: string]: ChapterCommentary;
}

export interface MHCCData {
  metadata: {
    source: string;
    provider: string;
    license: string;
    generated: string;
    totalBooks: number;
    totalEntries: number;
  };
  commentary: Record<string, BookCommentary>;
}

// Cache for loaded commentary data
let commentaryCache: MHCCData | null = null;
let loadingPromise: Promise<MHCCData> | null = null;

/**
 * Load the Matthew Henry Concise Commentary data
 */
export async function loadCommentary(): Promise<MHCCData> {
  if (commentaryCache) {
    return commentaryCache;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = import('../data/mhcc-commentary.json')
    .then((module) => {
      commentaryCache = module.default as MHCCData;
      return commentaryCache;
    });

  return loadingPromise;
}

// Book name mappings (standard name -> MHCC key)
export const BOOK_TO_MHCC: Record<string, string> = {
  'Genesis': 'Genesis',
  'Exodus': 'Exodus',
  'Leviticus': 'Leviticus',
  'Numbers': 'Numbers',
  'Deuteronomy': 'Deuteronomy',
  'Joshua': 'Joshua',
  'Judges': 'Judges',
  'Ruth': 'Ruth',
  '1 Samuel': '1 Samuel',
  '2 Samuel': '2 Samuel',
  '1 Kings': '1 Kings',
  '2 Kings': '2 Kings',
  '1 Chronicles': '1 Chronicles',
  '2 Chronicles': '2 Chronicles',
  'Ezra': 'Ezra',
  'Nehemiah': 'Nehemiah',
  'Esther': 'Esther',
  'Job': 'Job',
  'Psalms': 'Psalms',
  'Psalm': 'Psalms',
  'Proverbs': 'Proverbs',
  'Ecclesiastes': 'Ecclesiastes',
  'Song of Solomon': 'Song of Solomon',
  'Song of Songs': 'Song of Solomon',
  'Isaiah': 'Isaiah',
  'Jeremiah': 'Jeremiah',
  'Lamentations': 'Lamentations',
  'Ezekiel': 'Ezekiel',
  'Daniel': 'Daniel',
  'Hosea': 'Hosea',
  'Joel': 'Joel',
  'Amos': 'Amos',
  'Obadiah': 'Obadiah',
  'Jonah': 'Jonah',
  'Micah': 'Micah',
  'Nahum': 'Nahum',
  'Habakkuk': 'Habakkuk',
  'Zephaniah': 'Zephaniah',
  'Haggai': 'Haggai',
  'Zechariah': 'Zechariah',
  'Malachi': 'Malachi',
  'Matthew': 'Matthew',
  'Mark': 'Mark',
  'Luke': 'Luke',
  'John': 'John',
  'Acts': 'Acts',
  'Romans': 'Romans',
  '1 Corinthians': '1 Corinthians',
  '2 Corinthians': '2 Corinthians',
  'Galatians': 'Galatians',
  'Ephesians': 'Ephesians',
  'Philippians': 'Philippians',
  'Colossians': 'Colossians',
  '1 Thessalonians': '1 Thessalonians',
  '2 Thessalonians': '2 Thessalonians',
  '1 Timothy': '1 Timothy',
  '2 Timothy': '2 Timothy',
  'Titus': 'Titus',
  'Philemon': 'Philemon',
  'Hebrews': 'Hebrews',
  'James': 'James',
  '1 Peter': '1 Peter',
  '2 Peter': '2 Peter',
  '1 John': '1 John',
  '2 John': '2 John',
  '3 John': '3 John',
  'Jude': 'Jude',
  'Revelation': 'Revelation'
};

/**
 * Get commentary for a specific chapter
 */
export async function getChapterCommentary(
  book: string,
  chapter: number
): Promise<CommentaryEntry[]> {
  const data = await loadCommentary();
  
  const mhccBook = BOOK_TO_MHCC[book] || book;
  const bookData = data.commentary[mhccBook];
  
  if (!bookData) {
    return [];
  }

  const chapterData = bookData[chapter.toString()];
  
  if (!chapterData) {
    return [];
  }

  const entries: CommentaryEntry[] = [];

  // Add intro if present
  if (chapterData.intro) {
    entries.push({
      verseRange: 'intro',
      text: chapterData.intro
    });
  }

  // Add verse commentaries, sorted by starting verse
  const verseRanges = Object.keys(chapterData.verses || {}).sort((a, b) => {
    const startA = parseInt(a.split('-')[0]) || 0;
    const startB = parseInt(b.split('-')[0]) || 0;
    return startA - startB;
  });

  for (const range of verseRanges) {
    entries.push({
      verseRange: range,
      text: chapterData.verses[range]
    });
  }

  return entries;
}

/**
 * Get commentary for a specific verse
 * Returns the commentary entry that contains this verse
 */
export async function getVerseCommentary(
  book: string,
  chapter: number,
  verse: number
): Promise<CommentaryEntry | null> {
  const chapterCommentary = await getChapterCommentary(book, chapter);
  
  for (const entry of chapterCommentary) {
    if (entry.verseRange === 'intro') continue;
    
    if (isVerseInRange(verse, entry.verseRange)) {
      return entry;
    }
  }

  return null;
}

/**
 * Check if a verse number falls within a verse range
 */
function isVerseInRange(verse: number, range: string): boolean {
  if (range.includes('-')) {
    const [start, end] = range.split('-').map(Number);
    return verse >= start && verse <= end;
  }
  return verse === parseInt(range);
}

/**
 * Format a verse range for display
 */
export function formatVerseRange(range: string): string {
  if (range === 'intro') {
    return 'Introduction';
  }
  if (range.includes('-')) {
    return `Verses ${range.replace('-', '–')}`;
  }
  return `Verse ${range}`;
}

/**
 * Get list of available books in the commentary
 */
export async function getAvailableBooks(): Promise<string[]> {
  const data = await loadCommentary();
  return Object.keys(data.commentary);
}

/**
 * Get list of available chapters for a book
 */
export async function getAvailableChapters(book: string): Promise<number[]> {
  const data = await loadCommentary();
  
  const mhccBook = BOOK_TO_MHCC[book] || book;
  const bookData = data.commentary[mhccBook];
  
  if (!bookData) {
    return [];
  }

  return Object.keys(bookData)
    .map(Number)
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);
}
