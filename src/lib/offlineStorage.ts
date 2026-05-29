/**
 * Offline Bible Storage Service
 * 
 * Uses IndexedDB to cache Bible text locally for offline reading.
 * Integrates with the PWA service worker for complete offline support.
 */

const DB_NAME = 'scriptorium-offline'
const DB_VERSION = 1
const STORES = {
  BIBLE_TEXT: 'bible-text',
  READING_PLAN: 'reading-plan',
  USER_PROGRESS: 'user-progress',
  CACHED_DAYS: 'cached-days'
}

let db: IDBDatabase | null = null

// Initialize IndexedDB
export async function initOfflineStorage(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(true)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      console.log('Offline storage initialized')
      resolve(true)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Bible text cache - keyed by reference (e.g., "Genesis 1:1-31")
      if (!database.objectStoreNames.contains(STORES.BIBLE_TEXT)) {
        const bibleStore = database.createObjectStore(STORES.BIBLE_TEXT, { keyPath: 'reference' })
        bibleStore.createIndex('book', 'book', { unique: false })
        bibleStore.createIndex('cachedAt', 'cachedAt', { unique: false })
      }

      // Reading plan days cache
      if (!database.objectStoreNames.contains(STORES.READING_PLAN)) {
        database.createObjectStore(STORES.READING_PLAN, { keyPath: 'day' })
      }

      // User progress (for offline tracking)
      if (!database.objectStoreNames.contains(STORES.USER_PROGRESS)) {
        const progressStore = database.createObjectStore(STORES.USER_PROGRESS, { keyPath: 'id' })
        progressStore.createIndex('synced', 'synced', { unique: false })
      }

      // Track which days are cached for offline
      if (!database.objectStoreNames.contains(STORES.CACHED_DAYS)) {
        database.createObjectStore(STORES.CACHED_DAYS, { keyPath: 'day' })
      }
    }
  })
}

// Save Bible text to cache
export async function cacheBibleText(
  reference: string, 
  text: string, 
  translation: string = 'KJV'
): Promise<void> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.BIBLE_TEXT], 'readwrite')
    const store = transaction.objectStore(STORES.BIBLE_TEXT)
    
    const book = reference.split(' ')[0]
    
    const request = store.put({
      reference,
      text,
      translation,
      book,
      cachedAt: new Date().toISOString()
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Get cached Bible text
export async function getCachedBibleText(reference: string): Promise<string | null> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.BIBLE_TEXT], 'readonly')
    const store = transaction.objectStore(STORES.BIBLE_TEXT)
    const request = store.get(reference)

    request.onsuccess = () => {
      resolve(request.result?.text || null)
    }
    request.onerror = () => reject(request.error)
  })
}

// Cache a reading day's content
export async function cacheReadingDay(day: number, content: {
  title: string
  passages: Array<{ reference: string; text: string }>
  themes: string[]
}): Promise<void> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.READING_PLAN, STORES.CACHED_DAYS], 'readwrite')
    
    // Store the day's content
    const planStore = transaction.objectStore(STORES.READING_PLAN)
    planStore.put({ day, ...content, cachedAt: new Date().toISOString() })
    
    // Mark day as cached
    const cachedStore = transaction.objectStore(STORES.CACHED_DAYS)
    cachedStore.put({ day, cachedAt: new Date().toISOString() })

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

// Get cached reading day
export async function getCachedReadingDay(day: number): Promise<{
  title: string
  passages: Array<{ reference: string; text: string }>
  themes: string[]
} | null> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.READING_PLAN], 'readonly')
    const store = transaction.objectStore(STORES.READING_PLAN)
    const request = store.get(day)

    request.onsuccess = () => {
      resolve(request.result || null)
    }
    request.onerror = () => reject(request.error)
  })
}

// Check which days are cached
export async function getCachedDays(): Promise<number[]> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.CACHED_DAYS], 'readonly')
    const store = transaction.objectStore(STORES.CACHED_DAYS)
    const request = store.getAllKeys()

    request.onsuccess = () => {
      resolve(request.result as number[])
    }
    request.onerror = () => reject(request.error)
  })
}

// Save progress offline (syncs when back online)
export async function saveProgressOffline(progress: {
  id: string
  dayNumber: number
  completed: boolean
  completedAt?: string
  userId: string
}): Promise<void> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.USER_PROGRESS], 'readwrite')
    const store = transaction.objectStore(STORES.USER_PROGRESS)
    
    const request = store.put({
      ...progress,
      synced: false,
      savedAt: new Date().toISOString()
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Get unsynced progress to sync when online
export async function getUnsyncedProgress(): Promise<Array<{
  id: string
  dayNumber: number
  completed: boolean
  completedAt?: string
  userId: string
}>> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.USER_PROGRESS], 'readonly')
    const store = transaction.objectStore(STORES.USER_PROGRESS)
    const index = store.index('synced')
    const request = index.getAll(IDBKeyRange.only(0))

    request.onsuccess = () => {
      resolve(request.result || [])
    }
    request.onerror = () => reject(request.error)
  })
}

// Mark progress as synced
export async function markProgressSynced(id: string): Promise<void> {
  if (!db) await initOfflineStorage()
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.USER_PROGRESS], 'readwrite')
    const store = transaction.objectStore(STORES.USER_PROGRESS)
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        const putRequest = store.put({ ...getRequest.result, synced: true })
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      } else {
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

// Pre-cache upcoming days (e.g., next 7 days)
export async function prefetchUpcomingDays(
  currentDay: number, 
  fetchDayContent: (day: number) => Promise<{
    title: string
    passages: Array<{ reference: string; text: string }>
    themes: string[]
  }>
): Promise<void> {
  const daysToCache = 7
  const cached = await getCachedDays()
  
  for (let i = 0; i < daysToCache; i++) {
    const day = currentDay + i
    if (day <= 502 && !cached.includes(day)) {
      try {
        const content = await fetchDayContent(day)
        await cacheReadingDay(day, content)
        console.log(`Cached day ${day} for offline reading`)
      } catch (error) {
        console.error(`Failed to cache day ${day}:`, error)
      }
    }
  }
}

// Get cache statistics
export async function getCacheStats(): Promise<{
  cachedDaysCount: number
  cachedVersesCount: number
  cacheSize: string
}> {
  if (!db) await initOfflineStorage()
  
  const transaction = db!.transaction([STORES.CACHED_DAYS, STORES.BIBLE_TEXT], 'readonly')
  
  const daysCount = await new Promise<number>((resolve) => {
    const store = transaction.objectStore(STORES.CACHED_DAYS)
    const request = store.count()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(0)
  })
  
  const versesCount = await new Promise<number>((resolve) => {
    const store = transaction.objectStore(STORES.BIBLE_TEXT)
    const request = store.count()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(0)
  })

  // Estimate cache size (rough approximation)
  const estimatedSize = (daysCount * 10 + versesCount * 2) // KB estimate
  const cacheSize = estimatedSize > 1024 
    ? `${(estimatedSize / 1024).toFixed(1)} MB` 
    : `${estimatedSize} KB`

  return {
    cachedDaysCount: daysCount,
    cachedVersesCount: versesCount,
    cacheSize
  }
}

// Clear cache
export async function clearOfflineCache(): Promise<void> {
  if (!db) await initOfflineStorage()
  
  const transaction = db!.transaction(
    [STORES.BIBLE_TEXT, STORES.READING_PLAN, STORES.CACHED_DAYS], 
    'readwrite'
  )
  
  transaction.objectStore(STORES.BIBLE_TEXT).clear()
  transaction.objectStore(STORES.READING_PLAN).clear()
  transaction.objectStore(STORES.CACHED_DAYS).clear()
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

// Check if app is online
export function isOnline(): boolean {
  return navigator.onLine
}

// Listen for online/offline events
export function onConnectivityChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}
