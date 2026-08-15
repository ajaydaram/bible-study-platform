import { useState, useEffect, useMemo } from 'react'
import { 
  Brain, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  Flame
} from 'lucide-react'
import { 
  MEMORY_VERSE_DECKS, 
  type MemoryVerseItem 
} from '../../data/memoryVerseData'

export default function MemoryGymPage() {
  const [selectedDeckKey, setSelectedDeckKey] = useState<string>('romans-road')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [practiceMode, setPracticeMode] = useState<'full' | 'mnemonic' | 'disappear' | 'cloze'>('full')
  const [disappearLevel, setDisappearLevel] = useState<number>(0) // 0 to 4 (0%, 25%, 50%, 75%, 100%)
  const [clozeAnswers, setClozeAnswers] = useState<Record<string, string>>({})
  const [clozeChecked, setClozeChecked] = useState(false)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('scriptorium_mastered_verses')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [isSpeaking, setIsSpeaking] = useState(false)

  const activeDeck = MEMORY_VERSE_DECKS[selectedDeckKey] || MEMORY_VERSE_DECKS['romans-road']
  const currentItem: MemoryVerseItem = activeDeck.items[currentIndex] || activeDeck.items[0]

  useEffect(() => {
    try {
      localStorage.setItem('scriptorium_mastered_verses', JSON.stringify(Array.from(masteredIds)))
    } catch {
      // ignore
    }
  }, [masteredIds])

  // Reset cloze when changing item
  useEffect(() => {
    setClozeAnswers({})
    setClozeChecked(false)
    setDisappearLevel(0)
  }, [currentIndex, selectedDeckKey])

  // Audio Speech Synthesis
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(`${currentItem.reference}. ${currentItem.text}`)
    utterance.rate = 0.9
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // First-Letter Mnemonic Generator
  const mnemonicText = useMemo(() => {
    if (!currentItem) return ''
    return currentItem.text
      .split(' ')
      .map(word => {
        const clean = word.replace(/[^a-zA-Z0-9]/g, '')
        const punctuation = word.replace(/[a-zA-Z0-9]/g, '')
        return clean.length > 0 ? `${clean[0].toUpperCase()}_${punctuation}` : word
      })
      .join(' ')
  }, [currentItem])

  // Disappearing Words Generator
  const renderedDisappearWords = useMemo(() => {
    if (!currentItem) return []
    const words = currentItem.text.split(' ')
    return words.map((word, idx) => {
      // Deterministic hiding based on disappearLevel
      const shouldHide = (idx % 4) < disappearLevel
      return {
        original: word,
        hidden: shouldHide
      }
    })
  }, [currentItem, disappearLevel])

  // Cloze Words Splitter
  const clozeParts = useMemo(() => {
    if (!currentItem) return []
    const words = currentItem.text.split(' ')
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      const isTarget = currentItem.clozeWords.some(cw => cw.toLowerCase() === cleanWord)
      return {
        word,
        cleanWord,
        isTarget,
        key: `word_${idx}`
      }
    })
  }, [currentItem])

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>Scripture Memory & Spaced Repetition Gym</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Biblical Memory & Recitation Studio
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Internalize God's Word with 4 interactive practice modes: Full recitation, first-letter mnemonics, 
            progressive disappearing words, and fill-in-the-blank cloze tests.
          </p>
        </div>
      </div>

      {/* Main Deck Switcher & Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Deck Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(MEMORY_VERSE_DECKS).map(([key, deck]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedDeckKey(key)
                setCurrentIndex(0)
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedDeckKey === key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {deck.title} ({deck.items.length})
            </button>
          ))}
        </div>

        {/* Total Mastered Count */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 self-start md:self-center">
          <Flame className="w-4 h-4 text-emerald-500" />
          <span>{masteredIds.size} Verses Mastered</span>
        </div>
      </div>

      {/* Practice Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl max-w-xl mx-auto border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setPracticeMode('full')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            practiceMode === 'full' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Full Text</span>
        </button>

        <button
          onClick={() => setPracticeMode('mnemonic')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            practiceMode === 'mnemonic' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span>🔤 First Letters</span>
        </button>

        <button
          onClick={() => setPracticeMode('disappear')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            practiceMode === 'disappear' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Disappearing</span>
        </button>

        <button
          onClick={() => setPracticeMode('cloze')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            practiceMode === 'cloze' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span>✍️ Fill Blank</span>
        </button>
      </div>

      {/* Main Flashcard & Practice Arena */}
      {currentItem && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 shadow-xl max-w-4xl mx-auto space-y-6 animate-scale-up">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentItem.topic}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {currentItem.reference}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSpeaking ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200'
                }`}
                title="Audio Recitation"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => toggleMastered(currentItem.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  masteredIds.has(currentItem.id)
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{masteredIds.has(currentItem.id) ? 'Mastered ✓' : 'Mark Mastered'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Text Display Area */}
          <div className="min-h-[160px] flex items-center justify-center p-6 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
            {/* Mode 1: Full View */}
            {practiceMode === 'full' && (
              <p className="text-lg sm:text-2xl font-serif font-medium text-gray-900 dark:text-slate-100 text-center leading-relaxed">
                "{currentItem.text}"
              </p>
            )}

            {/* Mode 2: First-Letter Mnemonic */}
            {practiceMode === 'mnemonic' && (
              <p className="text-xl sm:text-2xl font-mono font-bold text-indigo-700 dark:text-indigo-300 text-center leading-relaxed tracking-wider">
                {mnemonicText}
              </p>
            )}

            {/* Mode 3: Disappearing Words */}
            {practiceMode === 'disappear' && (
              <div className="space-y-6 w-full">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-lg sm:text-2xl font-serif text-center leading-relaxed">
                  {renderedDisappearWords.map((w, idx) => (
                    <span
                      key={idx}
                      className={`transition-all duration-300 ${
                        w.hidden
                          ? 'opacity-0 scale-75 select-none w-10 border-b-2 border-indigo-400 inline-block'
                          : 'text-gray-900 dark:text-slate-100 font-medium'
                      }`}
                    >
                      {w.hidden ? '' : w.original}
                    </span>
                  ))}
                </div>

                {/* Disappear Slider / Step Controls */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Fade Level:</span>
                  {[0, 1, 2, 3, 4].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setDisappearLevel(lvl)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        disappearLevel === lvl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {lvl === 0 ? '0%' : lvl === 4 ? '100%' : `${lvl * 25}%`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 4: Fill-in-the-Blank Cloze Quiz */}
            {practiceMode === 'cloze' && (
              <div className="space-y-6 w-full">
                <div className="flex flex-wrap items-center justify-center gap-2 text-base sm:text-xl font-serif text-gray-900 dark:text-slate-100 leading-loose">
                  {clozeParts.map((part) => {
                    if (!part.isTarget) {
                      return <span key={part.key}>{part.word}</span>
                    }

                    const userAns = (clozeAnswers[part.key] || '').trim().toLowerCase()
                    const isCorrect = userAns === part.cleanWord

                    return (
                      <span key={part.key} className="inline-block mx-0.5">
                        <input
                          type="text"
                          value={clozeAnswers[part.key] || ''}
                          onChange={(e) => setClozeAnswers(prev => ({ ...prev, [part.key]: e.target.value }))}
                          placeholder="___"
                          className={`w-24 px-2 py-1 text-center font-sans font-bold text-sm rounded-lg border outline-none transition-all ${
                            clozeChecked
                              ? isCorrect
                                ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                                : 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-800 dark:text-rose-200'
                              : 'bg-white dark:bg-gray-700 border-indigo-300 dark:border-indigo-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500'
                          }`}
                        />
                      </span>
                    )
                  })}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setClozeChecked(true)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    Check Answers
                  </button>
                  <button
                    onClick={() => {
                      setClozeAnswers({})
                      setClozeChecked(false)
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : activeDeck.items.length - 1))}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Verse</span>
            </button>

            <span className="text-xs font-bold text-gray-400 font-mono">
              {currentIndex + 1} of {activeDeck.items.length}
            </span>

            <button
              onClick={() => setCurrentIndex(prev => (prev < activeDeck.items.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <span>Next Verse</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
