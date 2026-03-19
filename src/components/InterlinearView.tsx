import { useState, useEffect } from 'react';
import { Languages, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { 
  getInterlinearChapter, 
  INTERLINEAR_VERSIONS,
  SAMPLE_JOHN_1_1,
  type InterlinearWord,
  type InterlinearChapter
} from '../lib/interlinearApi';
import { getWord } from '../lib/stepbibleData';

interface InterlinearViewProps {
  book?: string;
  chapter?: number;
  verse?: number;
  onWordClick?: (strongs: string) => void;
}

export default function InterlinearView({ 
  book = 'John', 
  chapter = 1, 
  verse,
  onWordClick 
}: InterlinearViewProps) {
  const [data, setData] = useState<InterlinearChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('TISCH');
  const [expandedVerse, setExpandedVerse] = useState<number | null>(verse || 1);
  const [selectedWord, setSelectedWord] = useState<InterlinearWord | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  // Fetch interlinear data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getInterlinearChapter(book, chapter, selectedVersion);
        if (result) {
          setData(result);
        } else {
          setError('Failed to load interlinear data');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Unable to fetch interlinear text');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [book, chapter, selectedVersion]);

  const handleWordClick = async (word: InterlinearWord) => {
    setSelectedWord(word);
    
    // If we have an external handler, call it
    if (onWordClick) {
      onWordClick(word.strongs);
    }
    
    // Load full lexicon data if not already present
    if (!word.meaning) {
      const lexEntry = await getWord(word.strongs);
      if (lexEntry) {
        setSelectedWord({
          ...word,
          meaning: lexEntry.meaning,
          morph: lexEntry.morph
        });
      }
    }
  };

  // Demo mode with John 1:1
  if (showDemo) {
    return (
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Languages className="h-6 w-6 text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interlinear Sample: John 1:1
              </h2>
              <p className="text-xs text-gray-500">Click any word to explore</p>
            </div>
          </div>
          <button
            onClick={() => setShowDemo(false)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Load Full Chapter
          </button>
        </div>

        <div className="interlinear-container">
          {SAMPLE_JOHN_1_1.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handleWordClick(word)}
              className={`interlinear-word group ${
                selectedWord?.strongs === word.strongs 
                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                  : ''
              }`}
            >
              <span className="original-text font-greek">{word.original}</span>
              <span className="transliteration">{word.transliteration}</span>
              <span className="gloss">{word.gloss}</span>
              <span className="strongs-num">{word.strongs}</span>
            </button>
          ))}
        </div>

        {selectedWord && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <span className="text-3xl font-greek">{selectedWord.original}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-serif italic text-lg text-gray-700 dark:text-gray-300">
                    {selectedWord.transliteration}
                  </span>
                  <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 rounded text-xs font-mono">
                    {selectedWord.strongs}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedWord.gloss}
                </p>
                {selectedWord.meaning && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {selectedWord.meaning.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Languages className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interlinear Bible
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Word-by-word Greek/Hebrew with transliteration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Demo
            </button>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              {INTERLINEAR_VERSIONS.map(v => (
                <option key={v.id} value={v.id}>{v.abbr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Loading interlinear text...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => setShowDemo(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Demo Mode
            </button>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.book} {data.chapter}
              </h3>
              <span className="text-sm text-gray-500">{data.verses.length} verses</span>
            </div>

            {/* Verses */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {data.verses.map((verseData) => (
                <div 
                  key={verseData.verse}
                  className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                  {/* Verse header */}
                  <button
                    onClick={() => setExpandedVerse(
                      expandedVerse === verseData.verse ? null : verseData.verse
                    )}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
                        {verseData.verse}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-greek truncate max-w-xs">
                        {verseData.words.slice(0, 5).map(w => w.original).join(' ')}...
                      </span>
                    </span>
                    {expandedVerse === verseData.verse ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Expanded interlinear view */}
                  {expandedVerse === verseData.verse && (
                    <div className="p-4 bg-white dark:bg-gray-900/50 animate-fade-in">
                      <div className="interlinear-container">
                        {verseData.words.map((word, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleWordClick(word)}
                            className={`interlinear-word group ${
                              selectedWord?.strongs === word.strongs && selectedWord?.original === word.original
                                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                                : ''
                            }`}
                          >
                            <span className="original-text font-greek">{word.original}</span>
                            <span className="transliteration">{word.transliteration}</span>
                            <span className="gloss">{word.gloss}</span>
                            <span className="strongs-num">{word.strongs}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Selected word detail panel */}
        {selectedWord && (
          <div className="mt-6 p-5 bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-primary-100 dark:border-primary-800 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <span className="text-4xl font-greek block text-center">{selectedWord.original}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-serif italic text-xl text-gray-700 dark:text-gray-300">
                    {selectedWord.transliteration}
                  </span>
                  <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 rounded-lg text-xs font-mono font-semibold">
                    {selectedWord.strongs}
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  "{selectedWord.gloss}"
                </p>
                {selectedWord.morph && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Grammar: {selectedWord.morph}
                  </p>
                )}
                {selectedWord.meaning && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedWord.meaning.replace(/<[^>]*>/g, '').substring(0, 300)}
                    {selectedWord.meaning.length > 300 ? '...' : ''}
                  </p>
                )}
                <button
                  onClick={() => onWordClick?.(selectedWord.strongs)}
                  className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Open full word study →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attribution */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Greek text: Bolls.life API • Lexicon: STEPBible.org / Tyndale House (CC BY 4.0)
        </p>
      </div>
    </div>
  );
}
