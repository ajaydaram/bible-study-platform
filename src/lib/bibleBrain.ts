/**
 * BibleBrain API Integration for Audio Bible Playback
 * 
 * API Documentation: https://www.faithcomesbyhearing.com/bible-brain/developer-documentation
 * API Base: https://4.dbt.io/api
 * 
 * To get an API key: https://4.dbt.io/api_key/request
 */

const BIBLE_BRAIN_API = 'https://4.dbt.io/api'
const API_VERSION = 4

// API key from environment (set VITE_BIBLE_BRAIN_KEY in .env)
const getApiKey = () => import.meta.env.VITE_BIBLE_BRAIN_KEY || ''

// ============================================================================
// Types
// ============================================================================

export interface BibleBrainBible {
  abbr: string
  name: string
  vname?: string
  language: string
  iso: string
  date?: string
  filesets: Record<string, BibleBrainFileset[]>
}

export interface BibleBrainFileset {
  id: string
  type: string
  size: string
  codec?: string
  container?: string
  bitrate?: number
}

export interface AudioFile {
  book_id: string
  book_name: string
  chapter_start: number
  chapter_end?: number
  verse_start: number
  verse_end?: number
  path: string  // Signed URL to audio file
  duration?: number
  thumbnail?: string
}

export interface AudioTimestamp {
  book: string
  chapter: number
  verse_start: number
  verse_end?: number
  timestamp: number  // seconds
}

export interface BibleBrainBook {
  book_id: string
  book_id_usfx: string
  book_id_osis: string
  name: string
  testament: string
  testament_order: number
  book_order: number
  book_group: string
  chapters: number[]
}

// Book ID mapping (common names to USFM codes)
export const BOOK_ID_MAP: Record<string, string> = {
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

// Popular English Audio Bible filesets
export const AUDIO_FILESETS = {
  // KJV Audio Bibles
  KJV_DRAMA: 'ENGKJVC2DA',      // KJV Dramatized Audio (complete)
  KJV_NON_DRAMA: 'ENGKJVC1DA',  // KJV Non-Drama Audio (complete)
  
  // ESV Audio
  ESV_DRAMA: 'ENGESVC2DA',      // ESV Dramatized 
  
  // WEB (World English Bible) - Public Domain
  WEB_DRAMA: 'ENGWEBC2DA',      // WEB Dramatized
  WEB_NON_DRAMA: 'ENGWEBC1DA',  // WEB Non-Drama
  
  // NIV Audio
  NIV_DRAMA: 'ENGNIVC2DA',      // NIV Dramatized
} as const

// Default fileset for audio
export const DEFAULT_AUDIO_FILESET = AUDIO_FILESETS.KJV_DRAMA

// ============================================================================
// API Helpers
// ============================================================================

async function apiFetch<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('BibleBrain API key not configured. Set VITE_BIBLE_BRAIN_KEY in your .env file.')
  }
  
  const url = new URL(`${BIBLE_BRAIN_API}${endpoint}`)
  url.searchParams.set('v', String(API_VERSION))
  url.searchParams.set('key', apiKey)
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })
  
  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`BibleBrain API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Check if BibleBrain API is configured
 */
export function isBibleBrainConfigured(): boolean {
  return !!getApiKey()
}

/**
 * Get available Bibles filtered by language and/or media type
 */
export async function getBibles(options: {
  languageCode?: string
  media?: 'audio' | 'audio_drama' | 'text_plain' | 'text_format' | 'video_stream'
  audioTiming?: boolean
} = {}): Promise<{ data: BibleBrainBible[] }> {
  const params: Record<string, string | number | boolean> = {}
  
  if (options.languageCode) params.language_code = options.languageCode
  if (options.media) params.media = options.media
  if (options.audioTiming) params.audio_timing = true
  
  return apiFetch('/bibles', params)
}

/**
 * Get details for a specific Bible
 */
export async function getBible(bibleId: string): Promise<{ data: BibleBrainBible }> {
  return apiFetch(`/bibles/${bibleId}`)
}

/**
 * Get books for a Bible
 */
export async function getBibleBooks(bibleId: string): Promise<{ data: BibleBrainBook[] }> {
  return apiFetch(`/bibles/${bibleId}/book`)
}

/**
 * Get audio for a specific chapter
 * Returns signed URL(s) to the audio file(s)
 */
export async function getChapterAudio(
  filesetId: string,
  bookId: string,
  chapter: number
): Promise<{ data: AudioFile[] }> {
  return apiFetch(`/bibles/filesets/${filesetId}/${bookId}/${chapter}`)
}

/**
 * Get audio timestamps for karaoke-style verse highlighting
 */
export async function getAudioTimestamps(
  filesetId: string,
  bookId: string,
  chapter: number
): Promise<{ data: AudioTimestamp[] }> {
  return apiFetch(`/timestamps/${filesetId}/${bookId}/${chapter}`)
}

/**
 * Search for Bibles by version name
 */
export async function searchBibles(searchText: string): Promise<{ data: BibleBrainBible[] }> {
  return apiFetch(`/bibles/search/${encodeURIComponent(searchText)}`)
}

/**
 * Get list of filesets that have audio timestamps available
 */
export async function getTimestampFilesets(): Promise<{ data: { fileset_id: string }[] }> {
  return apiFetch('/timestamps')
}

// ============================================================================
// High-Level Helper Functions
// ============================================================================

/**
 * Get audio URL for a chapter with optional timestamps
 */
export async function getChapterAudioWithTimestamps(
  bookName: string,
  chapter: number,
  filesetId: string = DEFAULT_AUDIO_FILESET
): Promise<{
  audioUrl: string | null
  duration: number | null
  timestamps: AudioTimestamp[]
  error?: string
}> {
  const bookId = BOOK_ID_MAP[bookName]
  
  if (!bookId) {
    return {
      audioUrl: null,
      duration: null,
      timestamps: [],
      error: `Unknown book: ${bookName}`
    }
  }
  
  try {
    // Fetch audio file
    const audioResponse = await getChapterAudio(filesetId, bookId, chapter)
    
    if (!audioResponse.data || audioResponse.data.length === 0) {
      return {
        audioUrl: null,
        duration: null,
        timestamps: [],
        error: 'No audio available for this chapter'
      }
    }
    
    const audioFile = audioResponse.data[0]
    
    // Try to fetch timestamps (may not be available for all filesets)
    let timestamps: AudioTimestamp[] = []
    try {
      const timestampResponse = await getAudioTimestamps(filesetId, bookId, chapter)
      timestamps = timestampResponse.data || []
    } catch {
      // Timestamps not available for this fileset
      console.log('Audio timestamps not available for this fileset')
    }
    
    return {
      audioUrl: audioFile.path,
      duration: audioFile.duration || null,
      timestamps
    }
  } catch (error) {
    console.error('Error fetching audio:', error)
    return {
      audioUrl: null,
      duration: null,
      timestamps: [],
      error: error instanceof Error ? error.message : 'Failed to load audio'
    }
  }
}

/**
 * Check if audio is available for a given Bible version
 */
export function getAudioFilesetForVersion(versionId: string): string | null {
  // Map common Bible version IDs to their audio filesets
  const versionToFileset: Record<string, string> = {
    'de4e12af7f28f599-02': AUDIO_FILESETS.KJV_DRAMA,      // KJV
    'de4e12af7f28f599-01': AUDIO_FILESETS.KJV_NON_DRAMA,  // KJV
    '9879dbb7cfe39e4d-04': AUDIO_FILESETS.WEB_DRAMA,      // WEB
    // Add more mappings as needed
  }
  
  return versionToFileset[versionId] || AUDIO_FILESETS.KJV_DRAMA
}

/**
 * Available audio versions for dropdown
 */
export const AUDIO_VERSIONS = [
  { id: AUDIO_FILESETS.KJV_DRAMA, name: 'KJV Dramatized', abbr: 'KJV Drama' },
  { id: AUDIO_FILESETS.KJV_NON_DRAMA, name: 'KJV Non-Dramatized', abbr: 'KJV' },
  { id: AUDIO_FILESETS.WEB_DRAMA, name: 'World English Bible Dramatized', abbr: 'WEB Drama' },
  { id: AUDIO_FILESETS.WEB_NON_DRAMA, name: 'World English Bible', abbr: 'WEB' },
] as const
