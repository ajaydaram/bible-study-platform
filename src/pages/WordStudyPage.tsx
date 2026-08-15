import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Languages, 
  BookOpen, 
  Sparkles, 
  RotateCw, 
  Layers
} from 'lucide-react'
import WordStudy from '../components/WordStudy'
import OriginalLanguageFlashcards from '../components/OriginalLanguageFlashcards'
import { GREEK_VOCAB_DECK, HEBREW_VOCAB_DECK } from '../data/originalLanguageVocab'

export default function WordStudyPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const strongsParam = searchParams.get('strongs')
  const [activeTab, setActiveTab] = useState<'lexicon' | 'flashcards' | 'keywords' | 'grammarGuide'>('lexicon')
  const [selectedStrongs, setSelectedStrongs] = useState<string | undefined>(strongsParam || undefined)

  const handleSelectStrongs = (strongs: string) => {
    setSelectedStrongs(strongs)
    setSearchParams({ strongs })
    setActiveTab('lexicon')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>Biblical Greek & Hebrew Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Original Language Lexicon & Morphology
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Examine the original text of Scripture with STEPBible lexicon data, full grammatical parsing, 
            canonical word frequency heatmaps, and interactive vocabulary flashcards.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800 pt-6">
          <button
            onClick={() => setActiveTab('lexicon')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'lexicon'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lexicon & Syntax Study</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'flashcards'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <RotateCw className="w-4 h-4 text-amber-400" />
            <span>Vocab Flashcard Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'keywords'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Theological Power Words</span>
          </button>

          <button
            onClick={() => setActiveTab('grammarGuide')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'grammarGuide'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Grammar & Syntax Guide</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LEXICON & WORD STUDY */}
      {activeTab === 'lexicon' && (
        <div className="space-y-6">
          <WordStudy initialStrongs={selectedStrongs} />
        </div>
      )}

      {/* TAB 2: ORIGINAL LANGUAGE FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <OriginalLanguageFlashcards onSelectWord={handleSelectStrongs} />
        </div>
      )}

      {/* TAB 3: THEOLOGICAL POWER WORDS */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Core Theological Vocabulary Index</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Key covenantal, soteriological, and christological terms in Hebrew and Greek. Click any term to launch full morphological study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hebrew Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🇮🇱</span>
                  <span>Hebrew Old Testament Core Roots</span>
                </h4>
                <span className="text-xs text-gray-400 font-mono">STEPBible Data</span>
              </div>

              <div className="space-y-2">
                {HEBREW_VOCAB_DECK.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectStrongs(item.strongs)}
                    className="w-full text-left p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-hebrew text-amber-600 dark:text-amber-400 min-w-[70px]">
                        {item.word}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-gray-900 dark:text-white">
                          {item.transliteration} <span className="font-normal text-gray-500">— {item.gloss}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs mt-0.5">
                          {item.theologicalNote}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {item.strongs}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Greek Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🇬🇷</span>
                  <span>Greek New Testament Core Roots</span>
                </h4>
                <span className="text-xs text-gray-400 font-mono">STEPBible Data</span>
              </div>

              <div className="space-y-2">
                {GREEK_VOCAB_DECK.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectStrongs(item.strongs)}
                    className="w-full text-left p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-greek text-indigo-600 dark:text-indigo-400 min-w-[70px]">
                        {item.word}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-gray-900 dark:text-white">
                          {item.transliteration} <span className="font-normal text-gray-500">— {item.gloss}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs mt-0.5">
                          {item.theologicalNote}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                      {item.strongs}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GRAMMAR & SYNTAX GUIDE */}
      {activeTab === 'grammarGuide' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Biblical Grammar & Morphological Syntax Guide</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Understanding the theological significance of original language tense, voice, mood, and stems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Greek Tenses & Moods */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                🇬🇷 Greek Verbal Aspect & Tenses
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-200">Aorist (Punctiliar Action):</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Views action as a single, complete whole without reference to internal duration. Often used for decisive, completed redemptive acts (e.g. Christ died once for all).
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Present (Linear / Continuous Action):</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Depicts an action as ongoing, continuous, or in-progress (e.g. "Whoever continually believes in Him shall not perish").
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 space-y-1">
                  <span className="font-bold text-purple-900 dark:text-purple-200">Perfect (Abiding Present State):</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    A past completed action with permanent, abiding present results (e.g. "Tetelestai — It is finished and forever stands finished!").
                  </p>
                </div>
              </div>
            </div>

            {/* Hebrew Stems */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                🇮🇱 Hebrew Verbal Stems (Binyanim)
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Qal (Simple Active):</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The basic, unaugmented active verbal form (e.g. "he killed", "he wrote", "he spoke").
                  </p>
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 space-y-1">
                  <span className="font-bold text-rose-900 dark:text-rose-200">Piel (Intensive Active):</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Expresses heightened intensity, repeated action, or causative force (e.g. "to shatter into pieces", "to make atonement").
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 space-y-1">
                  <span className="font-bold text-purple-900 dark:text-purple-200">Hiphil (Causative Active):</span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The subject causes another to perform the action (e.g. "to cause to reign", "to justify / declare righteous").
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
