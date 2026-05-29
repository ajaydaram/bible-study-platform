import { useState, useEffect } from 'react';
import { Search, ArrowLeft, BookOpen, X, Info } from 'lucide-react';
import { 
  getWord, 
  searchByGloss, 
  parseMorphology, 
  formatMeaning,
  type HebrewLexiconEntry,
  type GreekLexiconEntry,
  type SearchResult
} from '../lib/stepbibleData';
import { getMorphologyExplanation, getMorphologyColor } from '../lib/morphology';

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
  const [showMorphDetail, setShowMorphDetail] = useState(false);

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

  return (
    <div className="word-study-card max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Word Study
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hebrew & Greek Lexicon</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Box */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by Strong's # or English word..."
            className="w-full pl-12 pr-24 py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                     rounded-xl text-gray-900 dark:text-white placeholder-gray-400
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-200 font-medium"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 
                     bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                     shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </span>
            ) : 'Search'}
          </button>
        </div>
        <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 text-center">
          Try: <span className="font-mono text-primary-600 dark:text-primary-400">H3068</span> (YHWH), 
          <span className="font-mono text-primary-600 dark:text-primary-400 ml-1">G26</span> (agape), 
          or <span className="text-primary-600 dark:text-primary-400">"love"</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedWord && (
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            {searchResults.length} Results Found
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto stagger-children">
            {searchResults.map((result) => (
              <button
                key={result.strongs}
                onClick={() => loadWord(result.strongs)}
                className="w-full text-left p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700
                         hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft
                         transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl ${result.lang === 'hebrew' ? 'font-hebrew' : 'font-greek'}`}>
                      {result.word}
                    </span>
                    <div>
                      <p className="font-serif italic text-gray-600 dark:text-gray-400">
                        {result.transliteration}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                        {result.gloss}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                    ${result.lang === 'hebrew' 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    }`}>
                    {result.strongs}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Word Details */}
      {selectedWord && (
        <div className="animate-fade-in">
          {/* Word Header - Beautiful gradient */}
          <div className="word-study-header">
            <p className={`original-word ${isHebrewEntry(selectedWord) ? 'font-hebrew' : 'font-greek'}`}>
              {isHebrewEntry(selectedWord) ? selectedWord.hebrew : selectedWord.greek}
            </p>
            <p className="transliteration">
              {selectedWord.transliteration}
            </p>
            <div className="flex justify-center gap-3 mt-5">
              <span className="strongs-badge">
                {selectedWord.strongs}
              </span>
              <span className={`strongs-badge ${isHebrewEntry(selectedWord) 
                ? 'bg-amber-500/30' 
                : 'bg-emerald-500/30'}`}>
                {isHebrewEntry(selectedWord) ? '🇮🇱 Hebrew' : '🇬🇷 Greek'}
              </span>
            </div>
          </div>

          {/* Quick Definition */}
          <div className="definition-block">
            <p className="definition-label">Quick Definition</p>
            <p className="definition-text">{selectedWord.gloss}</p>
          </div>

          {/* Grammar */}
          <div className="definition-block">
            <div className="flex items-center justify-between">
              <p className="definition-label">Grammar</p>
              {morphDetail && (
                <button
                  onClick={() => setShowMorphDetail(!showMorphDetail)}
                  className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <Info className="w-3.5 h-3.5" />
                  {showMorphDetail ? 'Hide' : 'Details'}
                </button>
              )}
            </div>
            <p className="text-gray-900 dark:text-white font-medium">
              {morphDetail?.briefParsing || parseMorphology(selectedWord.morph)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: getMorphologyColor(selectedWord.morph) }}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                {selectedWord.morph}
              </p>
            </div>
            
            {/* Expanded morphology details */}
            {showMorphDetail && morphDetail && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
                {morphDetail.fullDescription && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Components
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {morphDetail.fullDescription}
                    </p>
                  </div>
                )}
                {morphDetail.explanation && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Explanation
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{morphDetail.explanation}"
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                  Source: STEPBible Morphology Codes (CC BY 4.0)
                </p>
              </div>
            )}
          </div>

          {/* Full Meaning */}
          <div className="p-6">
            <p className="definition-label mb-3">Full Definition</p>
            <div 
              className="meaning-text"
              dangerouslySetInnerHTML={{ __html: formatMeaning(selectedWord.meaning) }}
            />
          </div>

          {/* Back Button & Attribution */}
          <div className="px-6 pb-6">
            {searchResults.length > 0 && (
              <button
                onClick={() => setSelectedWord(null)}
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to results
              </button>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              Data: STEPBible.org / Tyndale House Cambridge (CC BY 4.0)
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && searchResults.length === 0 && !selectedWord && (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Explore Biblical Words
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Search for Hebrew or Greek words by their Strong's number or English meaning to discover their rich biblical significance.
          </p>
        </div>
      )}
    </div>
  );
}
