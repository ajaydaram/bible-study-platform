/**
 * Advanced Search System
 * 
 * Provides fuzzy search, filters, and comprehensive search across Bible text,
 * journal entries, sermons, annotations, and more.
 */

import { trackEvent, AnalyticsEvents } from './firebase'

export type SearchCategory = 'all' | 'bible' | 'journal' | 'sermon' | 'annotation' | 'hymn' | 'people'

export interface SearchFilters {
  category: SearchCategory
  book?: string
  testament?: 'old' | 'new' | 'all'
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
}

export interface SearchResult {
  id: string
  type: SearchCategory
  title: string
  content: string
  highlight?: string
  reference?: string
  href: string
  relevance: number
  metadata?: Record<string, unknown>
}

// Fuzzy string matching using Levenshtein distance
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Calculate fuzzy match score (0-1, higher is better)
export function fuzzyMatch(needle: string, haystack: string): number {
  const normalizedNeedle = needle.toLowerCase().trim()
  const normalizedHaystack = haystack.toLowerCase().trim()

  // Exact match
  if (normalizedHaystack === normalizedNeedle) return 1

  // Contains match
  if (normalizedHaystack.includes(normalizedNeedle)) {
    const position = normalizedHaystack.indexOf(normalizedNeedle)
    // Bonus for matches at the start
    return 0.9 - (position / normalizedHaystack.length * 0.2)
  }

  // Word starts with query
  const words = normalizedHaystack.split(/\s+/)
  for (const word of words) {
    if (word.startsWith(normalizedNeedle)) {
      return 0.85
    }
  }

  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(normalizedNeedle, normalizedHaystack)
  const maxLength = Math.max(normalizedNeedle.length, normalizedHaystack.length)
  const score = 1 - (distance / maxLength)

  return Math.max(0, score - 0.3) // Threshold for fuzzy matches
}

// Highlight matching text in result
export function highlightMatch(text: string, query: string, maxLength = 200): string {
  if (!query) return text.substring(0, maxLength)

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) {
    return text.substring(0, maxLength)
  }

  // Get context around the match
  const contextStart = Math.max(0, index - 50)
  const contextEnd = Math.min(text.length, index + query.length + 100)
  
  let result = ''
  if (contextStart > 0) result += '...'
  result += text.substring(contextStart, index)
  result += `<mark>${text.substring(index, index + query.length)}</mark>`
  result += text.substring(index + query.length, contextEnd)
  if (contextEnd < text.length) result += '...'

  return result
}

// Bible books data
export const bibleBooks = {
  old: [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ],
  new: [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
    '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ]
}

// Parse Bible reference
export function parseBibleReference(query: string): { book?: string; chapter?: number; verse?: number } | null {
  // Pattern: Book Chapter:Verse or Book Chapter
  const patterns = [
    /^(\d?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+(\d+):(\d+)$/i,  // John 3:16
    /^(\d?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+(\d+)$/i,        // John 3
    /^(\d?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)?)$/i                 // John
  ]

  for (const pattern of patterns) {
    const match = query.match(pattern)
    if (match) {
      const bookQuery = match[1].trim()
      const allBooks = [...bibleBooks.old, ...bibleBooks.new]
      
      // Find best matching book
      let bestMatch = ''
      let bestScore = 0
      
      for (const book of allBooks) {
        const score = fuzzyMatch(bookQuery, book)
        if (score > bestScore) {
          bestScore = score
          bestMatch = book
        }
      }

      if (bestScore > 0.6) {
        return {
          book: bestMatch,
          chapter: match[2] ? parseInt(match[2]) : undefined,
          verse: match[3] ? parseInt(match[3]) : undefined
        }
      }
    }
  }

  return null
}

// Search local storage data
function searchLocalStorage<T>(
  key: string, 
  _query: string, 
  mapFn: (item: T) => SearchResult | null
): SearchResult[] {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return []

    const items: T[] = JSON.parse(stored)
    const results: SearchResult[] = []

    for (const item of items) {
      const result = mapFn(item)
      if (result && result.relevance > 0) {
        results.push(result)
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance)
  } catch {
    return []
  }
}

// Search journal entries
export function searchJournal(query: string): SearchResult[] {
  interface JournalEntry {
    id: string
    title: string
    content: string
    passage?: string
    tags: string[]
    createdAt: string
  }

  return searchLocalStorage<JournalEntry>(
    'scriptorium_journal',
    query,
    (entry) => {
      const titleScore = fuzzyMatch(query, entry.title)
      const contentScore = fuzzyMatch(query, entry.content) * 0.8
      const tagScore = entry.tags.some(tag => 
        fuzzyMatch(query, tag) > 0.7
      ) ? 0.6 : 0
      const passageScore = entry.passage && fuzzyMatch(query, entry.passage) > 0.7 ? 0.7 : 0

      const relevance = Math.max(titleScore, contentScore, tagScore, passageScore)
      if (relevance < 0.3) return null

      return {
        id: entry.id,
        type: 'journal',
        title: entry.title,
        content: entry.content,
        highlight: highlightMatch(entry.content, query),
        reference: entry.passage,
        href: `/journal/edit/${entry.id}`,
        relevance,
        metadata: { tags: entry.tags, date: entry.createdAt }
      }
    }
  )
}

// Search sermons
export function searchSermons(query: string): SearchResult[] {
  interface SermonEntry {
    id: string
    title: string
    passage: string
    notes: string
    date: string
  }

  return searchLocalStorage<SermonEntry>(
    'scriptorium_sermons',
    query,
    (sermon) => {
      const titleScore = fuzzyMatch(query, sermon.title)
      const notesScore = fuzzyMatch(query, sermon.notes) * 0.8
      const passageScore = fuzzyMatch(query, sermon.passage) > 0.7 ? 0.7 : 0

      const relevance = Math.max(titleScore, notesScore, passageScore)
      if (relevance < 0.3) return null

      return {
        id: sermon.id,
        type: 'sermon',
        title: sermon.title,
        content: sermon.notes,
        highlight: highlightMatch(sermon.notes, query),
        reference: sermon.passage,
        href: `/sermons/edit/${sermon.id}`,
        relevance,
        metadata: { date: sermon.date }
      }
    }
  )
}

// Perform comprehensive search
export async function performSearch(
  query: string, 
  filters: SearchFilters = { category: 'all' }
): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  const normalizedQuery = query.trim()

  if (!normalizedQuery) return []

  // Check if it's a Bible reference
  const bibleRef = parseBibleReference(normalizedQuery)
  if (bibleRef?.book) {
    const href = bibleRef.verse 
      ? `/bible?book=${encodeURIComponent(bibleRef.book)}&chapter=${bibleRef.chapter}&verse=${bibleRef.verse}`
      : bibleRef.chapter
        ? `/bible?book=${encodeURIComponent(bibleRef.book)}&chapter=${bibleRef.chapter}`
        : `/bible?book=${encodeURIComponent(bibleRef.book)}`

    results.push({
      id: `bible_${bibleRef.book}_${bibleRef.chapter}_${bibleRef.verse}`,
      type: 'bible',
      title: bibleRef.verse 
        ? `${bibleRef.book} ${bibleRef.chapter}:${bibleRef.verse}`
        : bibleRef.chapter 
          ? `${bibleRef.book} ${bibleRef.chapter}`
          : bibleRef.book,
      content: 'Go to this passage in the Bible reader',
      href,
      relevance: 1
    })
  }

  // Search Bible books (fuzzy)
  if (filters.category === 'all' || filters.category === 'bible') {
    const allBooks = filters.testament === 'old' 
      ? bibleBooks.old 
      : filters.testament === 'new'
        ? bibleBooks.new
        : [...bibleBooks.old, ...bibleBooks.new]

    for (const book of allBooks) {
      const score = fuzzyMatch(normalizedQuery, book)
      if (score > 0.4) {
        results.push({
          id: `book_${book}`,
          type: 'bible',
          title: book,
          content: 'Bible book',
          href: `/bible?book=${encodeURIComponent(book)}`,
          relevance: score * 0.9
        })
      }
    }
  }

  // Search journal entries
  if (filters.category === 'all' || filters.category === 'journal') {
    const journalResults = searchJournal(normalizedQuery)
    results.push(...journalResults)
  }

  // Search sermons
  if (filters.category === 'all' || filters.category === 'sermon') {
    const sermonResults = searchSermons(normalizedQuery)
    results.push(...sermonResults)
  }

  // Track search analytics
  trackEvent(AnalyticsEvents.SEARCH || 'search', {
    query: normalizedQuery.substring(0, 50),
    category: filters.category,
    result_count: results.length
  })

  // Sort by relevance and deduplicate
  return results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 50)
}

// Get search suggestions based on recent searches
export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem('scriptorium_recent_searches')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addRecentSearch(query: string): void {
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(q => q !== query)
    const updated = [query, ...filtered].slice(0, 10)
    localStorage.setItem('scriptorium_recent_searches', JSON.stringify(updated))
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentSearches(): void {
  localStorage.removeItem('scriptorium_recent_searches')
}
