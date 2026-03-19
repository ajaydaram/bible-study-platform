/**
 * Bible Versification Utilities
 * Handle mappings between different Bible versification systems
 * (English/KJV, Hebrew, Latin Vulgate, Greek LXX, etc.)
 * 
 * Data source: STEPBible TVTMS (Translators Versification Traditions)
 * License: CC BY 4.0
 */

// Common versification differences between English and other traditions
// These are the key mappings that affect cross-referencing

export type VersificationTradition = 'english' | 'hebrew' | 'latin' | 'greek'

export interface VersificationMapping {
  source: string
  target: string
  note?: string
}

/**
 * Known versification differences between KJV/English and other versions
 * Format: OSIS book.chapter.verse
 */
export const NT_VERSIFICATION_DIFFERENCES: VersificationMapping[] = [
  // Acts 19:40-41 differences
  { source: 'Acts.19.40!a', target: 'Acts.19.40', note: 'First half' },
  { source: 'Acts.19.40!b', target: 'Acts.19.41', note: 'Second half' },
  
  // 2 Corinthians 13 differences  
  { source: '2Cor.13.12!a', target: '2Cor.13.12', note: 'First half' },
  { source: '2Cor.13.12!b', target: '2Cor.13.13', note: 'Second half' },
  { source: '2Cor.13.13', target: '2Cor.13.14', note: 'Shifted verse' },
  
  // Philippians 1:16-17 swap
  { source: 'Phil.1.16', target: 'Phil.1.17', note: 'Swapped in critical text' },
  { source: 'Phil.1.17', target: 'Phil.1.16', note: 'Swapped in critical text' },
  
  // 3 John differences
  { source: '3John.1.14', target: '3John.1.15!a', note: 'Combined in some editions' },
  { source: '3John.1.15', target: '3John.1.15!b', note: 'Combined in some editions' },
  
  // Revelation 12:17-13:1 differences
  { source: 'Rev.12.18', target: 'Rev.13.1!a', note: 'Part of Rev 13:1 in some editions' },
  { source: 'Rev.13.1', target: 'Rev.13.1!b', note: 'Verse numbering differs' },
]

/**
 * Major OT versification differences between English and Hebrew
 * (There are many more - this covers key examples)
 */
export const OT_VERSIFICATION_DIFFERENCES: VersificationMapping[] = [
  // Psalms - Hebrew counts superscriptions as verse 1
  // English Psalm 3:1 = Hebrew Psalm 3:2, etc.
  // This affects many Psalms with superscriptions
  
  // Joel 2:28-32 = Hebrew Joel 3:1-5
  { source: 'Joel.2.28', target: 'Joel.3.1', note: 'Hebrew Joel chapter 3 starts here' },
  { source: 'Joel.2.29', target: 'Joel.3.2', note: 'Hebrew versification' },
  { source: 'Joel.2.30', target: 'Joel.3.3', note: 'Hebrew versification' },
  { source: 'Joel.2.31', target: 'Joel.3.4', note: 'Hebrew versification' },
  { source: 'Joel.2.32', target: 'Joel.3.5', note: 'Hebrew versification' },
  
  // Malachi 3:19-24 = English Malachi 4:1-6
  { source: 'Mal.4.1', target: 'Mal.3.19', note: 'Hebrew versification' },
  { source: 'Mal.4.2', target: 'Mal.3.20', note: 'Hebrew versification' },
  { source: 'Mal.4.3', target: 'Mal.3.21', note: 'Hebrew versification' },
  { source: 'Mal.4.4', target: 'Mal.3.22', note: 'Hebrew versification' },
  { source: 'Mal.4.5', target: 'Mal.3.23', note: 'Hebrew versification' },
  { source: 'Mal.4.6', target: 'Mal.3.24', note: 'Hebrew versification' },
]

/**
 * Psalms with superscriptions (where Hebrew verse 1 = English title)
 */
export const PSALMS_WITH_SUPERSCRIPTIONS = [
  3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 
  28, 29, 30, 31, 32, 34, 35, 36, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 
  69, 70, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 
  92, 98, 100, 101, 102, 103, 108, 109, 110, 120, 121, 122, 123, 124, 125, 
  126, 127, 128, 129, 130, 131, 132, 133, 134, 138, 139, 140, 141, 142, 143, 144, 145
]

/**
 * Parse a reference string into components
 */
export function parseReference(ref: string): {
  book: string
  chapter: number
  verse: number
  part?: string
} | null {
  const match = ref.match(/^(\d?\w+)\.(\d+)\.(\d+)(!([ab]))?$/)
  if (!match) return null
  
  return {
    book: match[1],
    chapter: parseInt(match[2]),
    verse: parseInt(match[3]),
    part: match[5]
  }
}

/**
 * Convert verse number from English to Hebrew versification for Psalms
 */
export function englishToHebrewPsalm(psalm: number, verse: number): number {
  if (PSALMS_WITH_SUPERSCRIPTIONS.includes(psalm)) {
    return verse + 1
  }
  return verse
}

/**
 * Convert verse number from Hebrew to English versification for Psalms
 */
export function hebrewToEnglishPsalm(psalm: number, verse: number): number {
  if (PSALMS_WITH_SUPERSCRIPTIONS.includes(psalm) && verse > 1) {
    return verse - 1
  }
  return verse
}

/**
 * Check if a reference has versification differences
 */
export function hasVersificationDifference(
  book: string, 
  chapter: number, 
  verse: number,
  tradition: VersificationTradition = 'hebrew'
): boolean {
  // Psalms with superscriptions
  if (book === 'Psa' && tradition === 'hebrew') {
    return PSALMS_WITH_SUPERSCRIPTIONS.includes(chapter)
  }
  
  // Joel 2:28-32
  if (book === 'Joel' && chapter === 2 && verse >= 28) {
    return true
  }
  
  // Malachi 4
  if (book === 'Mal' && chapter === 4) {
    return true
  }
  
  // NT differences
  const refKey = `${book}.${chapter}.${verse}`
  return NT_VERSIFICATION_DIFFERENCES.some(m => 
    m.source.startsWith(refKey) || m.target.startsWith(refKey)
  )
}

/**
 * Get versification note for a reference
 */
export function getVersificationNote(
  book: string,
  chapter: number,
  verse: number
): string | null {
  // Psalms
  if (book === 'Psa' && PSALMS_WITH_SUPERSCRIPTIONS.includes(chapter)) {
    return `In Hebrew Bibles, this is verse ${verse + 1} (the superscription is counted as verse 1)`
  }
  
  // Joel 2:28-32
  if (book === 'Joel' && chapter === 2 && verse >= 28) {
    const hebrewVerse = verse - 27
    return `In Hebrew Bibles, this is Joel 3:${hebrewVerse}`
  }
  
  // Malachi 4
  if (book === 'Mal' && chapter === 4) {
    const hebrewVerse = verse + 18
    return `In Hebrew Bibles, this is Malachi 3:${hebrewVerse}`
  }
  
  return null
}

/**
 * Convert a reference between versification traditions
 */
export function convertVersification(
  book: string,
  chapter: number,
  verse: number,
  fromTradition: VersificationTradition,
  toTradition: VersificationTradition
): { book: string; chapter: number; verse: number; note?: string } {
  // Same tradition - no conversion needed
  if (fromTradition === toTradition) {
    return { book, chapter, verse }
  }
  
  // Psalms with superscriptions
  if (book === 'Psa' && PSALMS_WITH_SUPERSCRIPTIONS.includes(chapter)) {
    if (fromTradition === 'english' && toTradition === 'hebrew') {
      return {
        book, chapter,
        verse: verse + 1,
        note: 'Hebrew includes superscription as verse 1'
      }
    }
    if (fromTradition === 'hebrew' && toTradition === 'english') {
      return {
        book, chapter,
        verse: Math.max(1, verse - 1),
        note: 'English does not count superscription as verse'
      }
    }
  }
  
  // Joel chapter 3 in Hebrew
  if (book === 'Joel') {
    if (fromTradition === 'english' && toTradition === 'hebrew' && chapter === 2 && verse >= 28) {
      return {
        book, chapter: 3,
        verse: verse - 27,
        note: 'Hebrew starts chapter 3 at English 2:28'
      }
    }
    if (fromTradition === 'hebrew' && toTradition === 'english' && chapter === 3) {
      return {
        book, chapter: 2,
        verse: verse + 27,
        note: 'English continues chapter 2'
      }
    }
  }
  
  // Malachi chapter 4 differences
  if (book === 'Mal') {
    if (fromTradition === 'english' && toTradition === 'hebrew' && chapter === 4) {
      return {
        book, chapter: 3,
        verse: verse + 18,
        note: 'Hebrew Malachi has only 3 chapters'
      }
    }
    if (fromTradition === 'hebrew' && toTradition === 'english' && chapter === 3 && verse > 18) {
      return {
        book, chapter: 4,
        verse: verse - 18,
        note: 'English splits into chapter 4'
      }
    }
  }
  
  // Default - no change
  return { book, chapter, verse }
}

/**
 * Detect which versification tradition a Bible might be using
 * based on the number of verses in key chapters
 */
export function detectVersificationTradition(
  checkData: { book: string; chapter: number; verseCount: number }[]
): VersificationTradition {
  for (const { book, chapter, verseCount } of checkData) {
    // Joel chapter 2
    if (book === 'Joel' && chapter === 2) {
      if (verseCount === 32) return 'english'
      if (verseCount === 27) return 'hebrew'
    }
    
    // Joel chapter 3
    if (book === 'Joel' && chapter === 3) {
      if (verseCount === 21) return 'english'
      if (verseCount === 5) return 'hebrew' // Hebrew Joel 4 exists
    }
    
    // Malachi chapter 3
    if (book === 'Mal' && chapter === 3) {
      if (verseCount === 18) return 'english'
      if (verseCount === 24) return 'hebrew'
    }
    
    // Malachi chapter 4
    if (book === 'Mal' && chapter === 4) {
      if (verseCount === 6) return 'english'
      if (verseCount === 0) return 'hebrew' // Hebrew has no chapter 4
    }
  }
  
  return 'english' // Default assumption
}

/**
 * Format a verse reference with versification note
 */
export function formatReferenceWithVersification(
  book: string,
  chapter: number,
  verse: number,
  showAlternate: boolean = false,
  alternateTradition: VersificationTradition = 'hebrew'
): string {
  const baseRef = `${book} ${chapter}:${verse}`
  
  if (!showAlternate) return baseRef
  
  const note = getVersificationNote(book, chapter, verse)
  if (note) {
    const converted = convertVersification(book, chapter, verse, 'english', alternateTradition)
    return `${baseRef} [Heb: ${converted.chapter}:${converted.verse}]`
  }
  
  return baseRef
}
