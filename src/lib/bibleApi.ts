/**
 * API.Bible Service
 * Documentation: https://scripture.api.bible/livedocs
 * 
 * Also integrates ESV API for English Standard Version
 * Uses local Bible data when available for offline-first experience
 */

import { getESVChapter } from './esvApi'
import { 
  getLocalChapter, 
  getLocalVerse, 
  getLocalVerseRange,
  searchLocalBible,
  type LocalVersionId 
} from './localBible'

const API_KEY = '84SOJ2EX4_yjdudFzoEDs'
const BASE_URL = 'https://rest.api.bible/v1'

// Popular Bible versions available
// Versions with local: true use offline JSON files first
export const BIBLE_VERSIONS = [
  { id: 'ESV', name: 'English Standard Version', abbr: 'ESV', api: 'esv' as const, local: false },
  { id: 'de4e12af7f28f599-02', name: 'King James Version', abbr: 'KJV', api: 'apibible' as const, local: true, localId: 'kjv' as LocalVersionId },
  { id: '9879dbb7cfe39e4d-04', name: 'World English Bible', abbr: 'WEB', api: 'apibible' as const, local: true, localId: 'web' as LocalVersionId },
  { id: '06125adad2d5898a-01', name: 'American Standard Version', abbr: 'ASV', api: 'apibible' as const, local: false },
  { id: '65eec8e0b60e656b-01', name: 'Free Bible Version', abbr: 'FBV', api: 'apibible' as const, local: false },
  { id: '01b29f4b342acc35-01', name: 'Literal Standard Version', abbr: 'LSV', api: 'apibible' as const, local: false },
  { id: '66c22495370cdfc0-01', name: 'Translation for Translators', abbr: 'T4T', api: 'apibible' as const, local: false },
  { id: 'c315fa9f71d4af3a-01', name: 'Geneva Bible', abbr: 'GNV', api: 'apibible' as const, local: false },
] as const

export type BibleVersion = typeof BIBLE_VERSIONS[number]

// Book ID mapping for API.Bible
export const BOOK_IDS: Record<string, string> = {
  'Genesis': 'GEN',
  'Exodus': 'EXO',
  'Leviticus': 'LEV',
  'Numbers': 'NUM',
  'Deuteronomy': 'DEU',
  'Joshua': 'JOS',
  'Judges': 'JDG',
  'Ruth': 'RUT',
  '1 Samuel': '1SA',
  '2 Samuel': '2SA',
  '1 Kings': '1KI',
  '2 Kings': '2KI',
  '1 Chronicles': '1CH',
  '2 Chronicles': '2CH',
  'Ezra': 'EZR',
  'Nehemiah': 'NEH',
  'Esther': 'EST',
  'Job': 'JOB',
  'Psalms': 'PSA',
  'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC',
  'Song of Solomon': 'SNG',
  'Isaiah': 'ISA',
  'Jeremiah': 'JER',
  'Lamentations': 'LAM',
  'Ezekiel': 'EZK',
  'Daniel': 'DAN',
  'Hosea': 'HOS',
  'Joel': 'JOL',
  'Amos': 'AMO',
  'Obadiah': 'OBA',
  'Jonah': 'JON',
  'Micah': 'MIC',
  'Nahum': 'NAM',
  'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP',
  'Haggai': 'HAG',
  'Zechariah': 'ZEC',
  'Malachi': 'MAL',
  'Matthew': 'MAT',
  'Mark': 'MRK',
  'Luke': 'LUK',
  'John': 'JHN',
  'Acts': 'ACT',
  'Romans': 'ROM',
  '1 Corinthians': '1CO',
  '2 Corinthians': '2CO',
  'Galatians': 'GAL',
  'Ephesians': 'EPH',
  'Philippians': 'PHP',
  'Colossians': 'COL',
  '1 Thessalonians': '1TH',
  '2 Thessalonians': '2TH',
  '1 Timothy': '1TI',
  '2 Timothy': '2TI',
  'Titus': 'TIT',
  'Philemon': 'PHM',
  'Hebrews': 'HEB',
  'James': 'JAS',
  '1 Peter': '1PE',
  '2 Peter': '2PE',
  '1 John': '1JN',
  '2 John': '2JN',
  '3 John': '3JN',
  'Jude': 'JUD',
  'Revelation': 'REV',
}

interface ApiBibleVerse {
  id: string
  orgId: string
  bookId: string
  chapterId: string
  bibleId: string
  reference: string
  content: string
}

interface ApiBibleChapter {
  id: string
  bibleId: string
  number: string
  bookId: string
  reference: string
  content: string
  verseCount: number
  next?: { id: string; number: string }
  previous?: { id: string; number: string }
}

interface ApiBibleResponse<T> {
  data: T
  meta?: {
    fums: string
    fumsId: string
    fumsJsInclude: string
    fumsJs: string
    fumsNoScript: string
  }
}

export interface ParsedVerse {
  verse: number
  text: string
}

export interface ParsedPassage {
  reference: string
  verses: ParsedVerse[]
  text: string
  copyright?: string
  next?: { id: string; number: string }
  previous?: { id: string; number: string }
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'api-key': API_KEY,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('API.Bible error:', error)
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Get list of available Bible versions
 */
export async function getBibles() {
  const response = await apiFetch<ApiBibleResponse<Array<{
    id: string
    name: string
    abbreviation: string
    description: string
    language: { id: string; name: string }
  }>>>('/bibles?language=eng')
  
  return response.data
}

/**
 * Get a specific chapter
 * Supports local Bible, ESV API, and API.Bible (in that priority)
 */
export async function getChapter(
  bibleId: string,
  bookName: string,
  chapter: number
): Promise<ParsedPassage> {
  // Check if this is an ESV request
  const version = BIBLE_VERSIONS.find(v => v.id === bibleId)
  
  // Try local Bible first for supported versions
  if (version?.local && version.localId) {
    try {
      const bookId = BOOK_IDS[bookName]
      if (bookId) {
        const localChapter = await getLocalChapter(version.localId, bookId, chapter)
        if (localChapter) {
          console.log(`[LocalBible] Loaded ${bookName} ${chapter} from local ${version.abbr}`)
          return {
            reference: `${bookName} ${chapter}`,
            verses: localChapter.verses.map(v => ({ verse: v.verse, text: v.text })),
            text: localChapter.verses.map(v => v.text).join(' '),
            next: chapter < 150 ? { id: `${bookId}.${chapter + 1}`, number: String(chapter + 1) } : undefined,
            previous: chapter > 1 ? { id: `${bookId}.${chapter - 1}`, number: String(chapter - 1) } : undefined,
          }
        }
      }
    } catch (error) {
      console.warn(`[LocalBible] Falling back to API for ${bookName} ${chapter}:`, error)
    }
  }
  
  if (version?.api === 'esv') {
    // Use ESV API
    const esvResult = await getESVChapter(bookName, chapter)
    return {
      reference: esvResult.reference,
      verses: esvResult.verses,
      text: esvResult.text,
      copyright: esvResult.copyright,
      // Convert ESV navigation format to API.Bible format
      next: esvResult.nextChapter ? { 
        id: `${BOOK_IDS[bookName]}.${esvResult.nextChapter[1]}`, 
        number: String(esvResult.nextChapter[1]) 
      } : undefined,
      previous: esvResult.prevChapter ? { 
        id: `${BOOK_IDS[bookName]}.${esvResult.prevChapter[1]}`, 
        number: String(esvResult.prevChapter[1]) 
      } : undefined,
    }
  }

  // Use API.Bible
  const bookId = BOOK_IDS[bookName]
  if (!bookId) {
    throw new Error(`Unknown book: ${bookName}`)
  }

  const chapterId = `${bookId}.${chapter}`
  
  const response = await apiFetch<ApiBibleResponse<ApiBibleChapter>>(
    `/bibles/${bibleId}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`
  )

  const { data } = response
  
  // Parse HTML content to extract verses
  const verses = parseHtmlToVerses(data.content)
  
  return {
    reference: `${bookName} ${chapter}`,
    verses,
    text: verses.map(v => v.text).join(' '),
    next: data.next,
    previous: data.previous,
  }
}

/**
 * Get a specific verse
 * Uses local Bible when available
 */
export async function getVerse(
  bibleId: string,
  bookName: string,
  chapter: number,
  verse: number
): Promise<ParsedPassage> {
  const bookId = BOOK_IDS[bookName]
  if (!bookId) {
    throw new Error(`Unknown book: ${bookName}`)
  }

  // Try local Bible first for supported versions
  const version = BIBLE_VERSIONS.find(v => v.id === bibleId)
  if (version?.local && version.localId) {
    try {
      const localVerse = await getLocalVerse(version.localId, bookId, chapter, verse)
      if (localVerse) {
        return {
          reference: `${bookName} ${chapter}:${verse}`,
          verses: [{ verse, text: localVerse.text }],
          text: localVerse.text,
        }
      }
    } catch (error) {
      console.warn(`[LocalBible] Falling back to API for ${bookName} ${chapter}:${verse}:`, error)
    }
  }

  const verseId = `${bookId}.${chapter}.${verse}`
  
  const response = await apiFetch<ApiBibleResponse<ApiBibleVerse>>(
    `/bibles/${bibleId}/verses/${verseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`
  )

  const { data } = response
  
  return {
    reference: `${bookName} ${chapter}:${verse}`,
    verses: [{ verse, text: data.content.trim() }],
    text: data.content.trim(),
  }
}

/**
 * Get a passage (range of verses)
 * Uses local Bible when available
 */
export async function getPassage(
  bibleId: string,
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse: number
): Promise<ParsedPassage> {
  const bookId = BOOK_IDS[bookName]
  if (!bookId) {
    throw new Error(`Unknown book: ${bookName}`)
  }

  // Try local Bible first for supported versions
  const version = BIBLE_VERSIONS.find(v => v.id === bibleId)
  if (version?.local && version.localId) {
    try {
      const localVerses = await getLocalVerseRange(version.localId, bookId, chapter, startVerse, endVerse)
      if (localVerses.length > 0) {
        return {
          reference: `${bookName} ${chapter}:${startVerse}-${endVerse}`,
          verses: localVerses.map(v => ({ verse: v.verse, text: v.text })),
          text: localVerses.map(v => v.text).join(' '),
        }
      }
    } catch (error) {
      console.warn(`[LocalBible] Falling back to API for ${bookName} ${chapter}:${startVerse}-${endVerse}:`, error)
    }
  }

  const passageId = `${bookId}.${chapter}.${startVerse}-${bookId}.${chapter}.${endVerse}`
  
  const response = await apiFetch<ApiBibleResponse<{
    id: string
    reference: string
    content: string
  }>>(
    `/bibles/${bibleId}/passages/${passageId}?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`
  )

  const { data } = response
  const verses = parseHtmlToVerses(data.content)
  
  return {
    reference: `${bookName} ${chapter}:${startVerse}-${endVerse}`,
    verses,
    text: verses.map(v => v.text).join(' '),
  }
}

/**
 * Search the Bible
 * Uses local search for supported versions (much faster!)
 */
export async function searchBible(
  bibleId: string,
  query: string,
  limit: number = 20
): Promise<Array<{ reference: string; text: string }>> {
  // Try local search first for supported versions
  const version = BIBLE_VERSIONS.find(v => v.id === bibleId)
  if (version?.local && version.localId) {
    try {
      const localResults = await searchLocalBible(version.localId, query, { limit })
      if (localResults.length > 0) {
        console.log(`[LocalBible] Found ${localResults.length} results for "${query}" in local ${version.abbr}`)
        return localResults.map(v => ({
          reference: `${v.bookName} ${v.chapter}:${v.verse}`,
          text: v.text,
        }))
      }
    } catch (error) {
      console.warn(`[LocalBible] Falling back to API search:`, error)
    }
  }

  const response = await apiFetch<ApiBibleResponse<{
    query: string
    limit: number
    offset: number
    total: number
    verseCount: number
    verses: Array<{
      id: string
      reference: string
      text: string
    }>
  }>>(
    `/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=${limit}`
  )

  return response.data.verses.map(v => ({
    reference: v.reference,
    text: v.text,
  }))
}

/**
 * Parse HTML content from API.Bible into verses
 */
function parseHtmlToVerses(html: string): ParsedVerse[] {
  const verses: ParsedVerse[] = []
  
  // Create a temporary div to parse HTML (works in browser)
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = html
    
    // API.Bible format: verse spans have data-verse-id attributes like "JHN.2.1"
    // Group all text by verse ID
    const verseMap = new Map<number, string[]>()
    
    const verseSpans = div.querySelectorAll('[data-verse-id]')
    
    if (verseSpans.length > 0) {
      verseSpans.forEach((span) => {
        const verseId = span.getAttribute('data-verse-id') || ''
        // Extract verse number from ID like "JHN.2.1" -> 1
        const parts = verseId.split('.')
        const verseNum = parseInt(parts[parts.length - 1] || '0', 10)
        
        if (verseNum > 0) {
          // Get text but exclude the verse number span
          const clone = span.cloneNode(true) as HTMLElement
          const numberSpan = clone.querySelector('[data-number]')
          if (numberSpan) {
            numberSpan.remove()
          }
          const text = clone.textContent?.trim() || ''
          
          if (text) {
            if (!verseMap.has(verseNum)) {
              verseMap.set(verseNum, [])
            }
            verseMap.get(verseNum)!.push(text)
          }
        }
      })
      
      // Convert map to array of verses
      const sortedVerses = Array.from(verseMap.entries()).sort((a, b) => a[0] - b[0])
      for (const [verseNum, texts] of sortedVerses) {
        verses.push({
          verse: verseNum,
          text: texts.join(' ').replace(/\s+/g, ' ').trim()
        })
      }
    }
    
    // Fallback: if still no verses, try basic text extraction
    if (verses.length === 0) {
      const text = div.textContent || ''
      // Try to split by verse numbers
      const parts = text.split(/(\d+)/).filter(p => p.trim())
      let currentVerse = 0
      let currentText = ''
      
      for (const part of parts) {
        const num = parseInt(part, 10)
        if (!isNaN(num) && num > 0 && num < 200) {
          if (currentVerse > 0 && currentText.trim()) {
            verses.push({ verse: currentVerse, text: currentText.trim() })
          }
          currentVerse = num
          currentText = ''
        } else {
          currentText += part
        }
      }
      // Add last verse
      if (currentVerse > 0 && currentText.trim()) {
        verses.push({ verse: currentVerse, text: currentText.trim() })
      }
    }
  }
  
  return verses
}

/**
 * Get books for a Bible
 */
export async function getBooks(bibleId: string) {
  const response = await apiFetch<ApiBibleResponse<Array<{
    id: string
    bibleId: string
    abbreviation: string
    name: string
    nameLong: string
  }>>>(`/bibles/${bibleId}/books`)
  
  return response.data
}

/**
 * Get chapters for a book
 */
export async function getChapters(bibleId: string, bookId: string) {
  const response = await apiFetch<ApiBibleResponse<Array<{
    id: string
    bibleId: string
    bookId: string
    number: string
    reference: string
  }>>>(`/bibles/${bibleId}/books/${bookId}/chapters`)
  
  return response.data
}

// Default Bible version (KJV)
export const DEFAULT_BIBLE_ID = 'de4e12af7f28f599-02'
