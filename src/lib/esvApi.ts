/**
 * ESV API Service
 * Documentation: https://api.esv.org/docs/
 * 
 * The ESV (English Standard Version) API by Crossway
 * Requires an API key from https://api.esv.org/account/create-application/
 */

// Get API key from environment variable
const ESV_API_KEY = import.meta.env.VITE_ESV_API_KEY || ''
const ESV_BASE_URL = 'https://api.esv.org/v3/passage'

export interface ESVPassage {
  query: string
  canonical: string
  parsed: number[][]
  passage_meta: Array<{
    canonical: string
    chapter_start: number[]
    chapter_end: number[]
    prev_verse: number | null
    next_verse: number | null
    prev_chapter: number[] | null
    next_chapter: number[] | null
  }>
  passages: string[]
}

export interface ESVSearchResult {
  page: number
  total_results: number
  results: Array<{
    reference: string
    content: string
  }>
  total_pages: number
}

export interface ParsedESVVerse {
  verse: number
  text: string
}

export interface ParsedESVPassage {
  reference: string
  verses: ParsedESVVerse[]
  text: string
  copyright: string
  prevChapter?: number[] | null
  nextChapter?: number[] | null
}

/**
 * Check if ESV API key is configured
 */
export function isESVConfigured(): boolean {
  return ESV_API_KEY.length > 10
}

/**
 * Fetch from ESV API with authorization
 */
async function esvFetch<T>(endpoint: string, params: Record<string, string | boolean | number>): Promise<T> {
  const searchParams = new URLSearchParams()
  
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key.replace(/([A-Z])/g, '-$1').toLowerCase(), String(value))
  }
  
  const url = `${ESV_BASE_URL}${endpoint}?${searchParams.toString()}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Token ${ESV_API_KEY}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('ESV API error:', error)
    throw new Error(`ESV API request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Get passage as plain text
 */
export async function getESVPassageText(
  query: string,
  options: {
    includePassageReferences?: boolean
    includeVerseNumbers?: boolean
    includeFirstVerseNumbers?: boolean
    includeFootnotes?: boolean
    includeFootnoteBody?: boolean
    includeHeadings?: boolean
    includeShortCopyright?: boolean
    includeCopyright?: boolean
    includePassageHorizontalLines?: boolean
    includeHeadingHorizontalLines?: boolean
    horizontalLineLength?: number
    includeSelahs?: boolean
    indentUsing?: 'space' | 'tab'
    indentParagraphs?: number
    indentPoetry?: boolean
    indentPoetryLines?: number
    indentDeclares?: number
    indentPsalmDoxology?: number
    lineLength?: number
  } = {}
): Promise<ESVPassage> {
  const params: Record<string, string | boolean | number> = {
    q: query,
    'include-passage-references': options.includePassageReferences ?? true,
    'include-verse-numbers': options.includeVerseNumbers ?? true,
    'include-first-verse-numbers': options.includeFirstVerseNumbers ?? true,
    'include-footnotes': options.includeFootnotes ?? false,
    'include-footnote-body': options.includeFootnoteBody ?? false,
    'include-headings': options.includeHeadings ?? true,
    'include-short-copyright': options.includeShortCopyright ?? true,
    'include-copyright': options.includeCopyright ?? false,
    'include-passage-horizontal-lines': options.includePassageHorizontalLines ?? false,
    'include-heading-horizontal-lines': options.includeHeadingHorizontalLines ?? false,
    'include-selahs': options.includeSelahs ?? true,
    'indent-using': options.indentUsing ?? 'space',
    'indent-paragraphs': options.indentParagraphs ?? 2,
    'indent-poetry': options.indentPoetry ?? true,
    'indent-poetry-lines': options.indentPoetryLines ?? 4,
    'indent-declares': options.indentDeclares ?? 40,
    'indent-psalm-doxology': options.indentPsalmDoxology ?? 30,
    'line-length': options.lineLength ?? 0, // 0 = no wrapping
  }

  if (options.horizontalLineLength) {
    params['horizontal-line-length'] = options.horizontalLineLength
  }

  return esvFetch<ESVPassage>('/text/', params)
}

/**
 * Get passage as HTML
 */
export async function getESVPassageHtml(
  query: string,
  options: {
    includePassageReferences?: boolean
    includeVerseNumbers?: boolean
    includeFirstVerseNumbers?: boolean
    includeFootnotes?: boolean
    includeFootnoteBody?: boolean
    includeHeadings?: boolean
    includeShortCopyright?: boolean
    includeCopyright?: boolean
    includeAudioLink?: boolean
    attachAudioLinkTo?: 'passage' | 'heading'
    includeChapterNumbers?: boolean
    includeSubheadings?: boolean
    includeVerseAnchors?: boolean
    includeSelahs?: boolean
    inlineStyles?: boolean
    wrapperDiv?: boolean
    divClasses?: string
    paragraphTag?: string
    includeBookTitles?: boolean
    includeSurroundingChapters?: boolean
  } = {}
): Promise<ESVPassage> {
  const params: Record<string, string | boolean | number> = {
    q: query,
    'include-passage-references': options.includePassageReferences ?? true,
    'include-verse-numbers': options.includeVerseNumbers ?? true,
    'include-first-verse-numbers': options.includeFirstVerseNumbers ?? true,
    'include-footnotes': options.includeFootnotes ?? false,
    'include-footnote-body': options.includeFootnoteBody ?? false,
    'include-headings': options.includeHeadings ?? true,
    'include-short-copyright': options.includeShortCopyright ?? true,
    'include-copyright': options.includeCopyright ?? false,
    'include-audio-link': options.includeAudioLink ?? false,
    'include-chapter-numbers': options.includeChapterNumbers ?? false,
    'include-subheadings': options.includeSubheadings ?? true,
    'include-verse-anchors': options.includeVerseAnchors ?? false,
    'include-selahs': options.includeSelahs ?? true,
    'inline-styles': options.inlineStyles ?? false,
    'wrapping-div': options.wrapperDiv ?? true,
    'include-book-titles': options.includeBookTitles ?? false,
    'include-surrounding-chapters': options.includeSurroundingChapters ?? false,
  }

  if (options.attachAudioLinkTo) {
    params['attach-audio-link-to'] = options.attachAudioLinkTo
  }
  if (options.divClasses) {
    params['div-classes'] = options.divClasses
  }
  if (options.paragraphTag) {
    params['paragraph-tag'] = options.paragraphTag
  }

  return esvFetch<ESVPassage>('/html/', params)
}

/**
 * Search the ESV text
 */
export async function searchESV(
  query: string,
  options: {
    pageSize?: number
    page?: number
  } = {}
): Promise<ESVSearchResult> {
  const params: Record<string, string | boolean | number> = {
    q: query,
    'page-size': options.pageSize ?? 20,
    page: options.page ?? 1,
  }

  return esvFetch<ESVSearchResult>('/search/', params)
}

/**
 * Get audio URL for a passage
 */
export function getESVAudioUrl(query: string): string {
  return `${ESV_BASE_URL}/audio/?q=${encodeURIComponent(query)}`
}

/**
 * Parse ESV text response into verse objects
 */
export function parseESVTextToVerses(passage: string): ParsedESVVerse[] {
  const verses: ParsedESVVerse[] = []
  
  // ESV text format: [1] In the beginning... [2] The earth was...
  const verseRegex = /\[(\d+)\]\s*([^[]+)/g
  let match
  
  while ((match = verseRegex.exec(passage)) !== null) {
    const verseNum = parseInt(match[1], 10)
    const text = match[2].trim()
    
    if (text) {
      verses.push({
        verse: verseNum,
        text: text.replace(/\s+/g, ' ').trim()
      })
    }
  }
  
  return verses
}

/**
 * Parse ESV HTML response into verse objects
 */
export function parseESVHtmlToVerses(html: string): ParsedESVVerse[] {
  const verses: ParsedESVVerse[] = []
  
  // Create a temporary element to parse HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Find verse numbers and their text
  const verseNums = doc.querySelectorAll('.verse-num')
  
  verseNums.forEach((verseEl) => {
    const verseNumText = verseEl.textContent?.trim() || ''
    const verseNum = parseInt(verseNumText, 10)
    
    if (isNaN(verseNum)) return
    
    // Get text following this verse number until next verse
    let text = ''
    let sibling = verseEl.nextSibling
    
    while (sibling) {
      if (sibling.nodeType === Node.TEXT_NODE) {
        text += sibling.textContent
      } else if (sibling.nodeType === Node.ELEMENT_NODE) {
        const el = sibling as Element
        if (el.classList.contains('verse-num')) break
        text += el.textContent
      }
      sibling = sibling.nextSibling
    }
    
    verses.push({
      verse: verseNum,
      text: text.replace(/\s+/g, ' ').trim()
    })
  })
  
  return verses
}

/**
 * Get a chapter from ESV API
 */
export async function getESVChapter(
  bookName: string,
  chapter: number
): Promise<ParsedESVPassage> {
  if (!isESVConfigured()) {
    throw new Error('ESV API key not configured. Get one at https://api.esv.org/account/create-application/')
  }

  const query = `${bookName} ${chapter}`
  
  const response = await getESVPassageText(query, {
    includePassageReferences: true,
    includeVerseNumbers: true,
    includeHeadings: false,
    includeFootnotes: false,
    includeShortCopyright: true,
  })

  const passageText = response.passages[0] || ''
  const verses = parseESVTextToVerses(passageText)
  const meta = response.passage_meta[0]

  return {
    reference: response.canonical,
    verses,
    text: verses.map(v => v.text).join(' '),
    copyright: '(ESV)',
    prevChapter: meta?.prev_chapter,
    nextChapter: meta?.next_chapter,
  }
}

/**
 * Get a specific verse range from ESV API
 */
export async function getESVVerses(
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse?: number
): Promise<ParsedESVPassage> {
  if (!isESVConfigured()) {
    throw new Error('ESV API key not configured')
  }

  const query = endVerse 
    ? `${bookName} ${chapter}:${startVerse}-${endVerse}`
    : `${bookName} ${chapter}:${startVerse}`
  
  const response = await getESVPassageText(query, {
    includePassageReferences: true,
    includeVerseNumbers: true,
    includeHeadings: false,
    includeFootnotes: false,
    includeShortCopyright: true,
  })

  const passageText = response.passages[0] || ''
  const verses = parseESVTextToVerses(passageText)

  return {
    reference: response.canonical,
    verses,
    text: verses.map(v => v.text).join(' '),
    copyright: '(ESV)',
  }
}

/**
 * Get multiple passages at once
 */
export async function getESVMultiplePassages(
  queries: string[]
): Promise<ParsedESVPassage[]> {
  if (!isESVConfigured()) {
    throw new Error('ESV API key not configured')
  }

  // ESV API supports comma-separated queries
  const query = queries.join('; ')
  
  const response = await getESVPassageText(query, {
    includePassageReferences: true,
    includeVerseNumbers: true,
    includeHeadings: false,
    includeFootnotes: false,
    includeShortCopyright: true,
  })

  return response.passages.map((passageText, index) => {
    const verses = parseESVTextToVerses(passageText)
    const meta = response.passage_meta[index]
    
    return {
      reference: meta?.canonical || queries[index],
      verses,
      text: verses.map(v => v.text).join(' '),
      copyright: '(ESV)',
    }
  })
}
