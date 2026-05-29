/**
 * Morphology Utilities
 * Parse and explain Greek/Hebrew morphology codes from STEPBible data
 * 
 * Data source: STEPBible TEGMC (Greek) and TEHMC (Hebrew) morphology codes
 * License: CC BY 4.0
 */

// Type definitions
export interface MorphologyCode {
  fullDescription?: string
  components?: Record<string, string>
  briefParsing?: string
  explanation?: string
  example?: string
}

export interface MorphologyLookups {
  partOfSpeech: Record<string, string>
  case: Record<string, string>
  number: Record<string, string>
  gender: Record<string, string>
  tense: Record<string, string>
  voice: Record<string, string>
  mood: Record<string, string>
  person: Record<string, string>
  degree: Record<string, string>
  hebrewState: Record<string, string>
  hebrewStem: Record<string, string>
}

// Lazy-loaded data
let greekMorphology: Record<string, MorphologyCode> | null = null
let hebrewMorphology: Record<string, MorphologyCode> | null = null
let lookups: MorphologyLookups | null = null

/**
 * Load Greek morphology codes
 */
export async function loadGreekMorphology(): Promise<Record<string, MorphologyCode>> {
  if (!greekMorphology) {
    const response = await fetch('/data/stepbible/json/greekMorphology.min.json')
    if (response.ok) {
      greekMorphology = await response.json()
    } else {
      // Fallback to empty object
      greekMorphology = {}
    }
  }
  return greekMorphology!
}

/**
 * Load Hebrew morphology codes
 */
export async function loadHebrewMorphology(): Promise<Record<string, MorphologyCode>> {
  if (!hebrewMorphology) {
    const response = await fetch('/data/stepbible/json/hebrewMorphology.min.json')
    if (response.ok) {
      hebrewMorphology = await response.json()
    } else {
      hebrewMorphology = {}
    }
  }
  return hebrewMorphology!
}

/**
 * Load morphology lookups
 */
export async function loadMorphologyLookups(): Promise<MorphologyLookups> {
  if (!lookups) {
    const response = await fetch('/data/stepbible/json/morphologyLookups.json')
    if (response.ok) {
      lookups = await response.json()
    } else {
      // Fallback to basic lookups
      lookups = getDefaultLookups()
    }
  }
  return lookups!
}

/**
 * Get default morphology lookups (fallback)
 */
function getDefaultLookups(): MorphologyLookups {
  return {
    partOfSpeech: {
      'A': 'Adjective', 'C': 'Conjunction', 'D': 'Adverb',
      'I': 'Interjection', 'N': 'Noun', 'P': 'Preposition',
      'RA': 'Aramaic', 'T': 'Particle', 'V': 'Verb', 'X': 'Pronoun'
    },
    case: {
      'N': 'Nominative', 'G': 'Genitive', 'D': 'Dative',
      'A': 'Accusative', 'V': 'Vocative'
    },
    number: { 'S': 'Singular', 'P': 'Plural', 'D': 'Dual' },
    gender: { 'M': 'Masculine', 'F': 'Feminine', 'N': 'Neuter', 'C': 'Common' },
    tense: {
      'P': 'Present', 'I': 'Imperfect', 'F': 'Future',
      'A': 'Aorist', 'X': 'Perfect', 'Y': 'Pluperfect'
    },
    voice: {
      'A': 'Active', 'M': 'Middle', 'P': 'Passive',
      'E': 'Middle/Passive', 'D': 'Middle Deponent',
      'O': 'Passive Deponent', 'N': 'Middle or Passive Deponent'
    },
    mood: {
      'I': 'Indicative', 'S': 'Subjunctive', 'O': 'Optative',
      'M': 'Imperative', 'N': 'Infinitive', 'P': 'Participle'
    },
    person: { '1': '1st Person', '2': '2nd Person', '3': '3rd Person' },
    degree: { 'C': 'Comparative', 'S': 'Superlative' },
    hebrewState: { 'a': 'Absolute', 'c': 'Construct', 'd': 'Determined' },
    hebrewStem: {
      'q': 'Qal', 'N': 'Niphal', 'p': 'Piel', 'P': 'Pual',
      'h': 'Hiphil', 'H': 'Hophal', 't': 'Hithpael'
    }
  }
}

/**
 * Get morphology explanation for a code
 * Returns the full explanation if available in the database,
 * otherwise generates one from the code.
 */
export async function getMorphologyExplanation(
  code: string,
  language: 'greek' | 'hebrew' = 'greek'
): Promise<{
  code: string
  briefParsing: string
  fullDescription: string
  explanation?: string
  example?: string
}> {
  const morphData = language === 'greek' 
    ? await loadGreekMorphology()
    : await loadHebrewMorphology()
  
  // Check if we have this exact code
  if (morphData[code]) {
    const data = morphData[code]
    return {
      code,
      briefParsing: data.briefParsing || expandMorphCode(code, language),
      fullDescription: data.fullDescription || '',
      explanation: data.explanation,
      example: data.example
    }
  }
  
  // Generate from code
  return {
    code,
    briefParsing: expandMorphCode(code, language),
    fullDescription: '',
    explanation: undefined,
    example: undefined
  }
}

/**
 * Expand a morphology code to human-readable form
 */
export function expandMorphCode(code: string, _language: 'greek' | 'hebrew' = 'greek'): string {
  const lookupTables = lookups || getDefaultLookups()
  const parts = code.split('-')
  const result: string[] = []
  
  if (parts.length === 0) return code
  
  // Part of Speech
  const pos = parts[0]
  if (lookupTables.partOfSpeech[pos]) {
    result.push(lookupTables.partOfSpeech[pos])
  }
  
  // For verbs: V-{Tense}{Voice}{Mood}-{Person}{Number}{Gender}
  if (pos === 'V' && parts.length >= 2) {
    const tvm = parts[1]
    if (tvm.length >= 1 && lookupTables.tense[tvm[0]]) result.push(lookupTables.tense[tvm[0]])
    if (tvm.length >= 2 && lookupTables.voice[tvm[1]]) result.push(lookupTables.voice[tvm[1]])
    if (tvm.length >= 3 && lookupTables.mood[tvm[2]]) result.push(lookupTables.mood[tvm[2]])
    
    if (parts.length >= 3) {
      const png = parts[2]
      if (png.length >= 1 && lookupTables.person[png[0]]) result.push(lookupTables.person[png[0]])
      if (png.length >= 2 && lookupTables.number[png[1]]) result.push(lookupTables.number[png[1]])
      if (png.length >= 3 && lookupTables.gender[png[2]]) result.push(lookupTables.gender[png[2]])
    }
  }
  // For nouns/adjectives: N-{Case}{Number}{Gender}
  else if ((pos === 'N' || pos === 'A') && parts.length >= 2) {
    const cng = parts[1]
    if (cng.length >= 1 && lookupTables.case[cng[0]]) result.push(lookupTables.case[cng[0]])
    if (cng.length >= 2 && lookupTables.number[cng[1]]) result.push(lookupTables.number[cng[1]])
    if (cng.length >= 3 && lookupTables.gender[cng[2]]) result.push(lookupTables.gender[cng[2]])
  }
  // For pronouns: X-{Case}{Number}{Gender}-{Person}
  else if (pos === 'X' && parts.length >= 2) {
    const cng = parts[1]
    if (cng.length >= 1 && lookupTables.case[cng[0]]) result.push(lookupTables.case[cng[0]])
    if (cng.length >= 2 && lookupTables.number[cng[1]]) result.push(lookupTables.number[cng[1]])
    if (cng.length >= 3 && lookupTables.gender[cng[2]]) result.push(lookupTables.gender[cng[2]])
    
    if (parts.length >= 3) {
      const p = parts[2]
      if (lookupTables.person[p]) result.push(lookupTables.person[p])
    }
  }
  
  return result.length > 0 ? result.join(' ') : code
}

/**
 * Get a brief, user-friendly explanation for a morphology code
 */
export function getMorphologyBrief(code: string, language: 'greek' | 'hebrew' = 'greek'): string {
  const explanation = expandMorphCode(code, language)
  
  // Add grammar-appropriate context
  const pos = code.split('-')[0]
  switch (pos) {
    case 'V':
      return `Verb: ${explanation}`
    case 'N':
      return `Noun: ${explanation}`
    case 'A':
      return `Adjective: ${explanation}`
    case 'P':
      return `Preposition`
    case 'C':
      return `Conjunction`
    case 'D':
      return `Adverb`
    case 'X':
      return `Pronoun: ${explanation}`
    case 'T':
      return `Particle`
    default:
      return explanation || code
  }
}

/**
 * Parse multiple morphology codes (for interlinear text)
 */
export async function parseMorphologyCodes(
  codes: string[],
  language: 'greek' | 'hebrew' = 'greek'
): Promise<Array<{ code: string; brief: string; full: string }>> {
  // Pre-load the data
  await (language === 'greek' ? loadGreekMorphology() : loadHebrewMorphology())
  await loadMorphologyLookups()
  
  return Promise.all(
    codes.map(async (code) => {
      const explanation = await getMorphologyExplanation(code, language)
      return {
        code,
        brief: getMorphologyBrief(code, language),
        full: explanation.fullDescription || explanation.briefParsing
      }
    })
  )
}

/**
 * Get morphology color coding for UI display
 */
export function getMorphologyColor(code: string): string {
  const pos = code.split('-')[0]
  switch (pos) {
    case 'V': return '#4CAF50'  // Verb - green
    case 'N': return '#2196F3'  // Noun - blue
    case 'A': return '#9C27B0'  // Adjective - purple
    case 'X': return '#FF9800'  // Pronoun - orange
    case 'P': return '#607D8B'  // Preposition - gray
    case 'C': return '#795548'  // Conjunction - brown
    case 'D': return '#E91E63'  // Adverb - pink
    case 'T': return '#00BCD4'  // Particle - cyan
    default: return '#9E9E9E'    // Other - gray
  }
}
