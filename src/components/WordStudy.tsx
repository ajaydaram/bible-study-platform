import { useState, useEffect } from 'react';
import { Search, ArrowLeft, BookOpen, X, Sparkles, Layers } from 'lucide-react';
import { 
  getWord, 
  searchByGloss, 
  formatMeaning,
  type HebrewLexiconEntry,
  type GreekLexiconEntry,
  type SearchResult
} from '../lib/stepbibleData';
import { getMorphologyExplanation } from '../lib/morphology';
import MorphologyBadge from './MorphologyBadge';
import WordFrequencyChart from './WordFrequencyChart';
import { GREEK_VOCAB_DECK, HEBREW_VOCAB_DECK } from '../data/originalLanguageVocab';

interface WordStudyProps {
  initialStrongs?: string;
  onClose?: () => void;
}

export default function WordStudy({ initialStrongs, onClose }: WordStudyProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedWord, setSelectedWord] = useState<HebrewLexiconEntry | GreekLexiconEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [morphDetail, setMorphDetail] = useState<{
    code: string;
    briefParsing: string;
    fullDescription: string;
    explanation?: string;
  } | null>(null);

  useEffect(() => {
    if (initialStrongs) {
      loadWord(initialStrongs);
    }
  }, [initialStrongs]);

  const loadWord = async (strongs: string) => {
    setLoading(true);
    setError(null);
    setMorphDetail(null);
    try {
      const word = await getWord(strongs);
      if (word) {
        setSelectedWord(word);
        setSearchResults([]);
        
        // Load detailed morphology if available
        if (word.morph) {
          const isHebrew = 'hebrew' in word;
          const detail = await getMorphologyExplanation(word.morph, isHebrew ? 'hebrew' : 'greek');
          setMorphDetail(detail);
        }
      } else {
        setError(`Word not found: ${strongs}`);
      }
    } catch (err) {
      setError('Failed to load word data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setSelectedWord(null);
    
    try {
      if (/^[HGhg]?\d+[A-Za-z]?$/.test(searchQuery.trim())) {
        await loadWord(searchQuery.trim());
        return;
      }
      
      const results = await searchByGloss(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No words found matching your search');
      }
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isHebrewEntry = (word: HebrewLexiconEntry | GreekLexiconEntry): word is HebrewLexiconEntry => {
    return 'hebrew' in word;
  };

  // Find occurrences metadata if available in our curated vocab database
  const vocabMeta = selectedWord ? [...GREEK_VOCAB_DECK, ...HEBREW_VOCAB_DECK].find(
    v => v.strongs.toUpperCase() === selectedWord.strongs.toUpperCase()
  ) : null;

  return (
    <div className="word-study-card max-w-3xl mx-auto animate-fade-in bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-850 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Hebrew & Greek Lexicon Engine
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              STEPBible Lexicon & Morphological Syntax
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Box */}
      <div className="p-6 bg-gray-50/80 dark:bg-gray-850/50 border-b border-gray-100 dark:border-gray-700/60">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search Strong's # (e.g. H3068, G26) or English word (e.g. grace, holy)..."
            className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-650 
                     rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none
                     transition-all shadow-xs"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 
                     bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all
                     shadow-sm hover:shadow-md"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
          <p className="text-rose-700 dark:text-rose-300 text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedWord && (
        <div className="p-6 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {searchResults.length} Matches Found
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {searchResults.map((result) => (
              <button
                key={result.strongs}
                onClick={() => loadWord(result.strongs)}
                className="w-full text-left p-4 bg-white dark:bg-gray-750/70 rounded-2xl border border-gray-200 dark:border-gray-700
                         hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-sm
                         transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-3xl ${result.lang === 'hebrew' ? 'font-hebrew text-amber-600 dark:text-amber-400' : 'font-greek text-indigo-600 dark:text-indigo-400'}`}>
                    {result.word}
                  </span>
                  <div>
                    <p className="font-serif italic text-xs text-gray-500 dark:text-gray-400">
                      {result.transliteration}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                      {result.gloss}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono
                  ${result.lang === 'hebrew' 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}>
                  {result.strongs}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Word Details */}
      {selectedWord && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Word Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white text-center space-y-3 shadow-lg">
            <p className={`text-4xl sm:text-5xl font-bold tracking-wide text-amber-300 ${isHebrewEntry(selectedWord) ? 'font-hebrew' : 'font-greek'}`}>
              {isHebrewEntry(selectedWord) ? selectedWord.hebrew : selectedWord.greek}
            </p>
            <p className="text-lg font-serif italic text-slate-200">
              {selectedWord.transliteration}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-mono font-bold text-indigo-300">
                {selectedWord.strongs}
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
                {isHebrewEntry(selectedWord) ? '🇮🇱 Biblical Hebrew' : '🇬🇷 Koine Greek'}
              </span>
            </div>
          </div>

          {/* Quick Definition */}
          <div className="bg-white dark:bg-gray-750 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Definition / Translation
            </span>
            <p className="text-lg font-extrabold text-gray-900 dark:text-white">
              {selectedWord.gloss}
            </p>
          </div>

          {/* Grammar & Morphology Syntax Breakdown */}
          {selectedWord.morph && (
            <div className="bg-white dark:bg-gray-750 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Grammatical Morphology & Syntax
              </span>
              <MorphologyBadge
                morphCode={selectedWord.morph}
                language={isHebrewEntry(selectedWord) ? 'hebrew' : 'greek'}
                briefParsing={morphDetail?.briefParsing}
                explanation={morphDetail?.explanation}
              />
            </div>
          )}

          {/* Word Frequency & Distribution */}
          <WordFrequencyChart
            strongs={selectedWord.strongs}
            word={isHebrewEntry(selectedWord) ? selectedWord.hebrew : selectedWord.greek}
            transliteration={selectedWord.transliteration}
            occurrences={vocabMeta?.occurrences || 120}
            language={isHebrewEntry(selectedWord) ? 'hebrew' : 'greek'}
            distribution={vocabMeta?.distribution}
          />

          {/* Full Lexical Meaning */}
          <div className="bg-white dark:bg-gray-750 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Full Lexical Definition & Semantic Range
            </span>
            <div 
              className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: formatMeaning(selectedWord.meaning) }}
            />
          </div>

          {/* Back Button */}
          <div className="flex items-center justify-between pt-2">
            {searchResults.length > 0 ? (
              <button
                onClick={() => setSelectedWord(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Search Results</span>
              </button>
            ) : <div />}

            <p className="text-[11px] text-gray-400">
              Data: STEPBible.org / Tyndale House Cambridge (CC BY 4.0)
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && searchResults.length === 0 && !selectedWord && (
        <div className="text-center py-12 px-6 space-y-3">
          <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Explore Original Biblical Languages
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Search for any Hebrew or Greek word by Strong's number or English gloss to unlock root meanings, morphology, and frequency heatmaps.
          </p>
        </div>
      )}
    </div>
  );
}
