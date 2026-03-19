/**
 * Church Fathers (Patristic) Commentaries Library
 * 
 * Provides access to 63,500+ commentaries from 334 Church Fathers
 * Source: HistoricalChristianFaith/Commentaries-Database
 * 
 * Data is loaded on-demand per book to avoid large initial bundle
 */

export interface PatristicCommentary {
  id: string;
  father: string;
  suffix: string;
  year: number;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  text: string;
  sourceUrl: string;
  sourceTitle: string;
}

export interface FatherMeta {
  year: number | null;
  wiki: string | null;
}

export interface BookData {
  book: string;
  count: number;
  commentaries: PatristicCommentary[];
}

export interface PatristicIndex {
  metadata: {
    source: string;
    description: string;
    license: string;
    generated: string;
    fatherCount: number;
    totalCommentaries: number;
  };
  books: Record<string, {
    displayName: string;
    count: number;
    file: string;
  }>;
  fathers: Record<string, FatherMeta>;
}

// Cache for loaded data
let indexCache: PatristicIndex | null = null;
const bookCache: Map<string, BookData> = new Map();

// Base path for data files
const DATA_BASE_PATH = '/data/patristic';

/**
 * Load the patristic index
 */
export async function loadPatristicIndex(): Promise<PatristicIndex> {
  if (indexCache) return indexCache;

  const response = await fetch(`${DATA_BASE_PATH}/index.json`);
  if (!response.ok) {
    throw new Error('Failed to load patristic index');
  }
  
  indexCache = await response.json();
  return indexCache!;
}

/**
 * Get the book key from a display name
 */
export function getBookKey(displayName: string): string {
  return displayName.toLowerCase().replace(/\s+/g, '');
}

/**
 * Load commentaries for a specific book
 */
export async function loadBookCommentaries(bookDisplayName: string): Promise<BookData | null> {
  const bookKey = getBookKey(bookDisplayName);
  
  // Check cache
  if (bookCache.has(bookKey)) {
    return bookCache.get(bookKey)!;
  }

  // Load index to get file name
  const index = await loadPatristicIndex();
  const bookInfo = index.books[bookKey];
  
  if (!bookInfo) {
    return null;
  }

  // Fetch book data
  const response = await fetch(`${DATA_BASE_PATH}/${bookInfo.file}`);
  if (!response.ok) {
    throw new Error(`Failed to load commentaries for ${bookDisplayName}`);
  }

  const bookData: BookData = await response.json();
  bookCache.set(bookKey, bookData);
  
  return bookData;
}

/**
 * Get commentaries for a specific verse range
 */
export async function getVerseCommentaries(
  book: string,
  chapter: number,
  verse: number
): Promise<PatristicCommentary[]> {
  const bookData = await loadBookCommentaries(book);
  
  if (!bookData) {
    return [];
  }

  // Find commentaries that include this verse
  return bookData.commentaries.filter(c => {
    return isVerseInRange(chapter, verse, c);
  });
}

/**
 * Get commentaries for a chapter
 */
export async function getChapterCommentaries(
  book: string,
  chapter: number
): Promise<PatristicCommentary[]> {
  const bookData = await loadBookCommentaries(book);
  
  if (!bookData) {
    return [];
  }

  // Find commentaries that touch this chapter
  return bookData.commentaries.filter(c => {
    return c.startChapter <= chapter && c.endChapter >= chapter;
  });
}

/**
 * Check if a verse falls within a commentary's range
 */
function isVerseInRange(
  chapter: number,
  verse: number,
  commentary: PatristicCommentary
): boolean {
  const { startChapter, startVerse, endChapter, endVerse } = commentary;

  // Single chapter commentary
  if (startChapter === endChapter && startChapter === chapter) {
    return verse >= startVerse && verse <= endVerse;
  }

  // Multi-chapter: check if in start chapter
  if (chapter === startChapter) {
    return verse >= startVerse;
  }

  // Multi-chapter: check if in end chapter
  if (chapter === endChapter) {
    return verse <= endVerse;
  }

  // Multi-chapter: check if between start and end
  return chapter > startChapter && chapter < endChapter;
}

/**
 * Format a verse reference for display
 */
export function formatVerseReference(c: PatristicCommentary): string {
  if (c.startChapter === c.endChapter) {
    if (c.startVerse === c.endVerse) {
      return `${c.startChapter}:${c.startVerse}`;
    }
    return `${c.startChapter}:${c.startVerse}-${c.endVerse}`;
  }
  return `${c.startChapter}:${c.startVerse}-${c.endChapter}:${c.endVerse}`;
}

/**
 * Get Father display name with optional suffix and year
 */
export function formatFatherName(c: PatristicCommentary, includeYear = true): string {
  let name = c.father;
  if (c.suffix) {
    name += c.suffix;
  }
  if (includeYear && c.year && c.year !== 9999999 && c.year < 9999) {
    const era = c.year < 0 ? 'BC' : 'AD';
    const year = Math.abs(c.year);
    name += ` (${era} ${year})`;
  }
  return name;
}

/**
 * Get available books that have patristic commentaries
 */
export async function getAvailableBooks(): Promise<string[]> {
  const index = await loadPatristicIndex();
  return Object.values(index.books).map(b => b.displayName);
}

/**
 * Get commentary count for a book
 */
export async function getBookCommentaryCount(book: string): Promise<number> {
  const index = await loadPatristicIndex();
  const bookKey = getBookKey(book);
  return index.books[bookKey]?.count || 0;
}

/**
 * Get all unique fathers who commented on a book
 */
export async function getBookFathers(book: string): Promise<string[]> {
  const bookData = await loadBookCommentaries(book);
  if (!bookData) return [];
  
  const fathers = new Set<string>();
  for (const c of bookData.commentaries) {
    fathers.add(c.father);
  }
  return Array.from(fathers).sort();
}
