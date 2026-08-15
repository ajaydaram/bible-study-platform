import { useState, useMemo } from 'react'
import { 
  Sparkles, 
  Shuffle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  Check, 
  Trophy
} from 'lucide-react'
import { 
  GREEK_VOCAB_DECK, 
  HEBREW_VOCAB_DECK, 
  type VocabCard 
} from '../data/originalLanguageVocab'

interface OriginalLanguageFlashcardsProps {
  onSelectWord?: (strongs: string) => void
}

export default function OriginalLanguageFlashcards({ onSelectWord }: OriginalLanguageFlashcardsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'greek' | 'hebrew'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())

  // Build deck
  const currentDeck: VocabCard[] = useMemo(() => {
    let pool: VocabCard[] = []
    if (selectedLanguage === 'all') {
      pool = [...GREEK_VOCAB_DECK, ...HEBREW_VOCAB_DECK]
    } else if (selectedLanguage === 'greek') {
      pool = GREEK_VOCAB_DECK
    } else {
      pool = HEBREW_VOCAB_DECK
    }

    if (selectedCategory !== 'all') {
      pool = pool.filter(c => c.category === selectedCategory)
    }

    return pool
  }, [selectedLanguage, selectedCategory])

  const currentCard: VocabCard | undefined = currentDeck[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev + 1) % currentDeck.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev - 1 + currentDeck.length) % currentDeck.length)
  }

  const handleShuffle = () => {
    setIsFlipped(false)
    setCurrentIndex(Math.floor(Math.random() * currentDeck.length))
  }

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (!currentCard) return null

  const isMastered = masteredIds.has(currentCard.id)

  return (
    <div className="space-y-6">
      {/* Controls & Filter Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Language Tabs & Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedLanguage('all')
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLanguage === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Decks ({GREEK_VOCAB_DECK.length + HEBREW_VOCAB_DECK.length})
          </button>

          <button
            onClick={() => {
              setSelectedLanguage('greek')
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedLanguage === 'greek'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <span>🇬🇷 Greek NT</span>
            <span className="text-[10px] opacity-75">({GREEK_VOCAB_DECK.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedLanguage('hebrew')
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedLanguage === 'hebrew'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <span>🇮🇱 Hebrew OT</span>
            <span className="text-[10px] opacity-75">({HEBREW_VOCAB_DECK.length})</span>
          </button>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="theological">Theological Terms</option>
            <option value="frequency">Top Frequencies</option>
            <option value="verbs">Verbs</option>
          </select>
        </div>

        {/* Category & Mastery Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{masteredIds.size} of {currentDeck.length} Mastered</span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="max-w-2xl mx-auto">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer min-h-[380px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-8 text-white shadow-2xl relative flex flex-col justify-between select-none transition-all hover:border-indigo-400 transform hover:scale-[1.01]"
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-mono font-bold text-indigo-300">
                {currentCard.strongs}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {currentCard.language === 'greek' ? 'Koine Greek' : 'Biblical Hebrew'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {currentDeck.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMastered(currentCard.id)
                }}
                className={`p-2 rounded-xl border transition-colors ${
                  isMastered
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isMastered ? 'Mastered!' : 'Mark as Mastered'}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FRONT: Word & Pronunciation */}
          {!isFlipped ? (
            <div className="py-8 text-center space-y-4">
              <div 
                className={`text-5xl sm:text-6xl font-bold tracking-wide text-amber-300 ${
                  currentCard.language === 'hebrew' ? 'font-hebrew' : 'font-greek'
                }`}
              >
                {currentCard.word}
              </div>

              <div className="space-y-1">
                <p className="text-xl font-medium text-slate-200 font-serif italic">
                  {currentCard.transliteration}
                </p>
                <span className="text-xs text-slate-400">
                  Pronunciation: <span className="font-mono text-amber-200">/{currentCard.pronunciation}/</span>
                </span>
              </div>

              <div className="inline-block px-3 py-1 bg-slate-800/80 rounded-full text-xs text-slate-300 border border-slate-700">
                {currentCard.partOfSpeech} • {currentCard.occurrences.toLocaleString()} occurrences
              </div>
            </div>
          ) : (
            /* BACK: Gloss & Exegetical Insight */
            <div className="py-4 space-y-4 text-center animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  English Gloss / Translation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentCard.gloss}
                </h3>
              </div>

              <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Theological & Exegetical Significance</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentCard.theologicalNote}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Key Reference:</span>
                <span className="font-bold text-indigo-300">{currentCard.keyVerseRef}</span>
              </div>
            </div>
          )}

          {/* Card Footer Hint */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Click card to {isFlipped ? 'see Word' : 'reveal Definition'}</span>
            </span>

            {onSelectWord && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectWord(currentCard.strongs)
                }}
                className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
              >
                <span>Full Lexicon Study →</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Word</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <span>Next Word</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
