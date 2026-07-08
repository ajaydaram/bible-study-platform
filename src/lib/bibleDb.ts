const DB_NAME = 'scriptorium-bible-db';
const DB_VERSION = 1;

export interface DbVerse {
  id: string; // "version:book:chapter:verse"
  versionId: string;
  book: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Open the IndexedDB database
 */
function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create verses store with compound indexes
      if (!db.objectStoreNames.contains('verses')) {
        const verseStore = db.createObjectStore('verses', { keyPath: 'id' });
        verseStore.createIndex('versionIndex', 'versionId', { unique: false });
        verseStore.createIndex('chapterIndex', ['versionId', 'book', 'chapter'], { unique: false });
      }

      // Create metadata store for loaded state tracking
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Check if a Bible version is fully loaded in IndexedDB
 */
export async function isBibleVersionLoaded(versionId: string): Promise<boolean> {
  const db = await openDb();
  return new Promise((resolve) => {
    const transaction = db.transaction('metadata', 'readonly');
    const store = transaction.objectStore('metadata');
    const request = store.get(`${versionId}_loaded`);

    request.onsuccess = () => {
      resolve(!!request.result?.value);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
}

/**
 * Import a Bible version JSON data into IndexedDB
 */
export async function importBibleToDb(
  versionId: string,
  rawJsonData: any,
  onProgress?: (progress: number) => void
): Promise<void> {
  const db = await openDb();

  // Convert raw JSON data to array of DbVerse
  // Format is: { version: 'KJV', books: { GEN: { name: 'Genesis', abbrev: 'GEN', chapters: { '1': { '1': 'In the beginning...' } } } } }
  const versesToStore: DbVerse[] = [];
  const books = rawJsonData.books || {};

  // Compute structure info to cache separately
  const bookStructure: Record<string, {
    name: string;
    abbrev: string;
    chapterCount: number;
    verseCounts: number[];
  }> = {};

  for (const [bookAbbrev, bookData] of Object.entries<any>(books)) {
    const bookName = bookData.name;
    const chapters = bookData.chapters || {};
    const sortedChapters = Object.keys(chapters).map(Number).sort((a, b) => a - b);
    const verseCounts = sortedChapters.map(ch => Object.keys(chapters[ch]).length);

    bookStructure[bookAbbrev.toUpperCase()] = {
      name: bookName,
      abbrev: bookAbbrev.toUpperCase(),
      chapterCount: sortedChapters.length,
      verseCounts
    };

    for (const [chapterNum, chapterData] of Object.entries<any>(chapters)) {
      const chapter = parseInt(chapterNum, 10);
      for (const [verseNum, text] of Object.entries<any>(chapterData)) {
        const verse = parseInt(verseNum, 10);
        versesToStore.push({
          id: `${versionId.toLowerCase()}:${bookAbbrev.toUpperCase()}:${chapter}:${verse}`,
          versionId: versionId.toLowerCase(),
          book: bookAbbrev.toUpperCase(),
          bookName,
          chapter,
          verse,
          text: String(text)
        });
      }
    }
  }

  const totalVerses = versesToStore.length;
  if (totalVerses === 0) return;

  return new Promise((resolve, reject) => {
    // Large batch inserts are best done in transaction chunks to keep it responsive
    const chunkSize = 1000;
    let index = 0;

    function insertNextChunk() {
      const transaction = db.transaction(['verses', 'metadata'], 'readwrite');
      const verseStore = transaction.objectStore('verses');
      
      const end = Math.min(index + chunkSize, totalVerses);
      
      for (let i = index; i < end; i++) {
        verseStore.put(versesToStore[i]);
      }

      index = end;

      if (onProgress) {
        onProgress(Math.round((index / totalVerses) * 100));
      }

      transaction.oncomplete = () => {
        if (index < totalVerses) {
          // Pause slightly to keep browser UI thread responsive
          setTimeout(insertNextChunk, 10);
        } else {
          // Save metadata state
          const metaTransaction = db.transaction('metadata', 'readwrite');
          const metaStore = metaTransaction.objectStore('metadata');
          metaStore.put({ key: `${versionId}_loaded`, value: true, importedAt: new Date().toISOString() });
          metaStore.put({ key: `${versionId}_structure`, value: bookStructure });
          
          metaTransaction.oncomplete = () => resolve();
          metaTransaction.onerror = () => reject(metaTransaction.error);
        }
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    }

    insertNextChunk();
  });
}

/**
 * Get the cached Bible book structure
 */
export async function getDbBibleStructure(versionId: string): Promise<any | null> {
  const db = await openDb();
  return new Promise((resolve) => {
    const transaction = db.transaction('metadata', 'readonly');
    const store = transaction.objectStore('metadata');
    const request = store.get(`${versionId}_structure`);

    request.onsuccess = () => {
      resolve(request.result?.value || null);
    };

    request.onerror = () => {
      resolve(null);
    };
  });
}

/**
 * Get a single verse from IndexedDB
 */
export async function getDbVerse(
  versionId: string,
  book: string,
  chapter: number,
  verse: number
): Promise<DbVerse | null> {
  const db = await openDb();
  const id = `${versionId.toLowerCase()}:${book.toUpperCase()}:${chapter}:${verse}`;

  return new Promise((resolve) => {
    const transaction = db.transaction('verses', 'readonly');
    const store = transaction.objectStore('verses');
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      resolve(null);
    };
  });
}

/**
 * Get a full chapter from IndexedDB
 */
export async function getDbChapter(
  versionId: string,
  book: string,
  chapter: number
): Promise<DbVerse[]> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('verses', 'readonly');
    const store = transaction.objectStore('verses');
    const index = store.index('chapterIndex');
    
    // Query by compound chapter key
    const range = IDBKeyRange.only([versionId.toLowerCase(), book.toUpperCase(), chapter]);
    const request = index.getAll(range);

    request.onsuccess = () => {
      // Sort in place by verse number
      const results = request.result || [];
      results.sort((a, b) => a.verse - b.verse);
      resolve(results);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Search local database using a cursor index filter
 */
export async function searchDbBible(
  versionId: string,
  query: string,
  options: { caseSensitive?: boolean; wholeWord?: boolean; limit?: number } = {}
): Promise<DbVerse[]> {
  const db = await openDb();
  const { caseSensitive = false, wholeWord = false, limit = 100 } = options;
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  const wordPattern = wholeWord ? new RegExp(`\\b${query}\\b`, caseSensitive ? '' : 'i') : null;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('verses', 'readonly');
    const store = transaction.objectStore('verses');
    const index = store.index('versionIndex');
    
    // Search only matching version verses
    const range = IDBKeyRange.only(versionId.toLowerCase());
    const request = index.openCursor(range);
    const results: DbVerse[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
      if (!cursor) {
        resolve(results);
        return;
      }

      const verse = cursor.value as DbVerse;
      const text = verse.text;
      const searchText = caseSensitive ? text : text.toLowerCase();
      
      const matches = wholeWord 
        ? wordPattern?.test(text)
        : searchText.includes(searchQuery);

      if (matches) {
        results.push(verse);
        if (results.length >= limit) {
          resolve(results);
          return;
        }
      }

      cursor.continue();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
