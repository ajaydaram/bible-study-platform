/**
 * STEPBible Lexicon Service
 * Provides access to Greek and Hebrew word study data from STEPBible
 * Data: CC BY 4.0 - STEPBible.org / Tyndale House Cambridge
 */

// Types for lexicon entries
export interface HebrewLexiconEntry {
  strongs: string;
  eStrong: string;
  hebrew: string;
  transliteration: string;
  morph: string;
  gloss: string;
  meaning: string;
}

export interface GreekLexiconEntry {
  strongs: string;
  eStrong: string;
  greek: string;
  transliteration: string;
  morph: string;
  gloss: string;
  meaning: string;
}

export interface SearchResult {
  strongs: string;
  lang: 'hebrew' | 'greek';
  gloss: string;
  word: string;
  transliteration: string;
}

// Lazy-loaded data stores
let hebrewLexicon: Record<string, HebrewLexiconEntry> | null = null;
let greekLexicon: Record<string, GreekLexiconEntry> | null = null;
let commonWords: { hebrew: Record<string, HebrewLexiconEntry>; greek: Record<string, GreekLexiconEntry> } | null = null;
let searchIndex: { byGloss: Record<string, Array<{ strongs: string; lang: string }>>; byWord: Record<string, { strongs: string; lang: string }> } | null = null;

/**
 * Load the common words subset (fast initial load)
 */
export async function loadCommonWords(): Promise<void> {
  if (commonWords) return;
  
  try {
    const module = await import('../data/stepbible/json/commonWords.json');
    commonWords = module.default;
  } catch (error) {
    console.error('Failed to load common words:', error);
    commonWords = { hebrew: {}, greek: {} };
  }
}

/**
 * Load the full Hebrew lexicon
 */
export async function loadHebrewLexicon(): Promise<void> {
  if (hebrewLexicon) return;
  
  try {
    const module = await import('../data/stepbible/json/hebrewLexicon.json');
    hebrewLexicon = module.default;
  } catch (error) {
    console.error('Failed to load Hebrew lexicon:', error);
    hebrewLexicon = {};
  }
}

/**
 * Load the full Greek lexicon
 */
export async function loadGreekLexicon(): Promise<void> {
  if (greekLexicon) return;
  
  try {
    const module = await import('../data/stepbible/json/greekLexicon.json');
    greekLexicon = module.default;
  } catch (error) {
    console.error('Failed to load Greek lexicon:', error);
    greekLexicon = {};
  }
}

/**
 * Load the search index
 */
export async function loadSearchIndex(): Promise<void> {
  if (searchIndex) return;
  
  try {
    const module = await import('../data/stepbible/json/searchIndex.json');
    searchIndex = module.default;
  } catch (error) {
    console.error('Failed to load search index:', error);
    searchIndex = { byGloss: {}, byWord: {} };
  }
}

/**
 * Get a Hebrew word by Strong's number
 */
export async function getHebrewWord(strongs: string): Promise<HebrewLexiconEntry | null> {
  // Normalize the Strong's number (e.g., "H1" -> "H0001")
  const normalized = normalizeStrongs(strongs, 'H');
  
  // Try common words first
  await loadCommonWords();
  if (commonWords?.hebrew[normalized]) {
    return commonWords.hebrew[normalized];
  }
  
  // Load full lexicon if needed
  await loadHebrewLexicon();
  return hebrewLexicon?.[normalized] || null;
}

/**
 * Get a Greek word by Strong's number
 */
export async function getGreekWord(strongs: string): Promise<GreekLexiconEntry | null> {
  const normalized = normalizeStrongs(strongs, 'G');
  
  await loadCommonWords();
  if (commonWords?.greek[normalized]) {
    return commonWords.greek[normalized];
  }
  
  await loadGreekLexicon();
  return greekLexicon?.[normalized] || null;
}

/**
 * Get a word by Strong's number (auto-detects Hebrew or Greek)
 */
export async function getWord(strongs: string): Promise<HebrewLexiconEntry | GreekLexiconEntry | null> {
  const upper = strongs.toUpperCase();
  
  if (upper.startsWith('H')) {
    return getHebrewWord(upper);
  } else if (upper.startsWith('G')) {
    return getGreekWord(upper);
  }
  
  // Try both if no prefix
  const hebrew = await getHebrewWord('H' + strongs);
  if (hebrew) return hebrew;
  
  return getGreekWord('G' + strongs);
}

/**
 * Search for words by English gloss
 */
export async function searchByGloss(query: string): Promise<SearchResult[]> {
  await loadSearchIndex();
  if (!searchIndex) return [];
  
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase().trim();
  
  // Exact match
  if (searchIndex.byGloss[queryLower]) {
    for (const match of searchIndex.byGloss[queryLower]) {
      const word = match.lang === 'hebrew' 
        ? await getHebrewWord(match.strongs)
        : await getGreekWord(match.strongs);
      
      if (word) {
        results.push({
          strongs: match.strongs,
          lang: match.lang as 'hebrew' | 'greek',
          gloss: word.gloss,
          word: 'hebrew' in word ? (word as HebrewLexiconEntry).hebrew : (word as GreekLexiconEntry).greek,
          transliteration: word.transliteration
        });
      }
    }
  }
  
  // Partial matches (limit to prevent performance issues)
  if (results.length < 20) {
    for (const [gloss, matches] of Object.entries(searchIndex.byGloss)) {
      if (gloss.includes(queryLower) && gloss !== queryLower) {
        for (const match of matches.slice(0, 5)) {
          if (results.length >= 50) break;
          
          const word = match.lang === 'hebrew'
            ? await getHebrewWord(match.strongs)
            : await getGreekWord(match.strongs);
          
          if (word && !results.find(r => r.strongs === match.strongs)) {
            results.push({
              strongs: match.strongs,
              lang: match.lang as 'hebrew' | 'greek',
              gloss: word.gloss,
              word: 'hebrew' in word ? (word as HebrewLexiconEntry).hebrew : (word as GreekLexiconEntry).greek,
              transliteration: word.transliteration
            });
          }
        }
      }
    }
  }
  
  return results;
}

/**
 * Search by Hebrew or Greek word
 */
export async function searchByOriginalWord(word: string): Promise<SearchResult | null> {
  await loadSearchIndex();
  if (!searchIndex) return null;
  
  const match = searchIndex.byWord[word];
  if (!match) return null;
  
  const entry = match.lang === 'hebrew'
    ? await getHebrewWord(match.strongs)
    : await getGreekWord(match.strongs);
  
  if (!entry) return null;
  
  return {
    strongs: match.strongs,
    lang: match.lang as 'hebrew' | 'greek',
    gloss: entry.gloss,
    word: 'hebrew' in entry ? (entry as HebrewLexiconEntry).hebrew : (entry as GreekLexiconEntry).greek,
    transliteration: entry.transliteration
  };
}

/**
 * Get multiple words at once (batch lookup)
 */
export async function getWords(strongsNumbers: string[]): Promise<Record<string, HebrewLexiconEntry | GreekLexiconEntry>> {
  const results: Record<string, HebrewLexiconEntry | GreekLexiconEntry> = {};
  
  await Promise.all(
    strongsNumbers.map(async (strongs) => {
      const word = await getWord(strongs);
      if (word) {
        results[strongs] = word;
      }
    })
  );
  
  return results;
}

/**
 * Parse morphology code to human-readable description
 */
export function parseMorphology(morph: string): string {
  const parts = morph.split(':');
  const language = parts[0];
  const grammar = parts[1] || '';
  
  const langMap: Record<string, string> = {
    'H': 'Hebrew',
    'A': 'Aramaic',
    'G': 'Greek',
    'N': 'Name'
  };
  
  const typeMap: Record<string, string> = {
    'N': 'Noun',
    'V': 'Verb',
    'A': 'Adjective',
    'Adv': 'Adverb',
    'Art': 'Article',
    'Conj': 'Conjunction',
    'Prep': 'Preposition',
    'Part': 'Particle',
    'Intj': 'Interjection',
    'PerP': 'Personal Pronoun',
    'DemP': 'Demonstrative Pronoun',
    'RelP': 'Relative Pronoun',
    'Intg': 'Interrogative',
    'Neg': 'Negative'
  };
  
  const genderMap: Record<string, string> = {
    'M': 'Masculine',
    'F': 'Feminine',
    'N': 'Neuter',
    'C': 'Common'
  };
  
  const extraMap: Record<string, string> = {
    'P': 'Person',
    'L': 'Location',
    'PG': 'Gentilic (Person)',
    'LG': 'Gentilic (Location)',
    'T': 'Title'
  };
  
  const grammarParts = grammar.split('-');
  const descriptions: string[] = [];
  
  if (langMap[language]) {
    descriptions.push(langMap[language]);
  }
  
  if (grammarParts[0] && typeMap[grammarParts[0]]) {
    descriptions.push(typeMap[grammarParts[0]]);
  }
  
  if (grammarParts[1] && genderMap[grammarParts[1]]) {
    descriptions.push(genderMap[grammarParts[1]]);
  }
  
  if (grammarParts[2] && extraMap[grammarParts[2]]) {
    descriptions.push(`(${extraMap[grammarParts[2]]})`);
  }
  
  return descriptions.join(' ') || morph;
}

/**
 * Normalize Strong's number to standard format
 */
function normalizeStrongs(strongs: string, prefix: string): string {
  // Remove any existing prefix
  let num = strongs.toUpperCase().replace(/^[HG]/, '');
  
  // Handle suffix letters (e.g., "1234A")
  const match = num.match(/^(\d+)([A-Z])?$/);
  if (!match) return prefix + strongs;
  
  // Pad to 4 digits
  const padded = match[1].padStart(4, '0');
  const suffix = match[2] || '';
  
  return prefix + padded + suffix;
}

/**
 * Format meaning text for display (converts newlines, etc.)
 */
export function formatMeaning(meaning: string): string {
  return meaning
    .replace(/\n/g, '<br/>')
    .replace(/(\d+\))/g, '<strong>$1</strong>')
    .replace(/(\d+[a-z]\))/g, '<em>$1</em>');
}

/**
 * Check if lexicons are loaded
 */
export function isLexiconLoaded(): { hebrew: boolean; greek: boolean; common: boolean } {
  return {
    hebrew: hebrewLexicon !== null,
    greek: greekLexicon !== null,
    common: commonWords !== null
  };
}

// Pre-load common words on module import for faster initial lookups
loadCommonWords().catch(console.error);
