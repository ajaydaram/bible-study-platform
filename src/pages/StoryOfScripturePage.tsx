import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Search, 
  Layers, 
  MapPin, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Bookmark,
  Play,
  Pause,
  Maximize2,
  X,
  Printer,
  Heart,
  Brain,
  Check
} from 'lucide-react'
import { 
  BOOK_THEMES, 
  OT_WALK_THRU, 
  LIFE_OF_JESUS_STAGES, 
  ACTS_MISSIONARY_STAGES,
  ERA_MNEMONICS,
  type BiblicalBookTheme,
  type WalkThruMilestone
} from '../data/storyOfScriptureData'

export default function StoryOfScripturePage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'otWalkThru' | 'ntJourneys' | 'mnemonics'>('matrix')
  const [selectedDivision, setSelectedDivision] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedOtEra, setSelectedOtEra] = useState<string>('all')

  // Presenter Mode State
  const [isPresenterOpen, setIsPresenterOpen] = useState(false)
  const [presenterStepIdx, setPresenterStepIdx] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  // Scripture Quick-Reader Modal State
  const [quickReaderRef, setQuickReaderRef] = useState<string | null>(null)
  const [copiedRef, setCopiedRef] = useState(false)

  const divisions = [
    { id: 'all', label: 'All Books (66)' },
    { id: 'Pentateuch', label: 'Pentateuch (5)' },
    { id: 'History', label: 'History (12)' },
    { id: 'Poetry', label: 'Poetry & Wisdom (5)' },
    { id: 'Prophets', label: 'Prophets (17)' },
    { id: 'Gospels', label: 'Gospels (4)' },
    { id: 'Pauline', label: 'Pauline Epistles (13)' },
    { id: 'General', label: 'General Epistles (8)' },
    { id: 'Prophecy', label: 'Prophecy (1)' },
  ]

  const otEras = [
    'all',
    'Beginnings',
    'Patriarchs',
    'Exodus & Wilderness',
    'Conquest & Settlement',
    'United Kingdom',
    'Divided Kingdom & Exile',
    'Return & Restoration',
    'Silence & Fulfillment'
  ]

  // Filter 66 books
  const filteredBooks = useMemo(() => {
    return BOOK_THEMES.filter(b => {
      const matchesDivision = selectedDivision === 'all' || b.division === selectedDivision
      const matchesSearch = 
        b.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.christInBook.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subdivision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.keyVerse.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesDivision && matchesSearch
    })
  }, [selectedDivision, searchQuery])

  // Filter OT Walk Thru
  const filteredOtMilestones = useMemo(() => {
    if (selectedOtEra === 'all') return OT_WALK_THRU
    return OT_WALK_THRU.filter(m => m.era === selectedOtEra)
  }, [selectedOtEra])

  // Keyboard navigation for presenter mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresenterOpen) return
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setPresenterStepIdx(prev => Math.min(OT_WALK_THRU.length - 1, prev + 1))
      } else if (e.key === 'ArrowLeft') {
        setPresenterStepIdx(prev => Math.max(0, prev - 1))
      } else if (e.key === 'Escape') {
        setIsPresenterOpen(false)
        setIsAutoPlaying(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresenterOpen])

  // Presenter autoplay timer
  useEffect(() => {
    let timer: any
    if (isPresenterOpen && isAutoPlaying) {
      timer = setInterval(() => {
        setPresenterStepIdx(prev => {
          if (prev >= OT_WALK_THRU.length - 1) {
            setIsAutoPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 5000)
    }
    return () => clearInterval(timer)
  }, [isPresenterOpen, isAutoPlaying])

  const currentPresenterMilestone: WalkThruMilestone = OT_WALK_THRU[presenterStepIdx]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Redemptive Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              The Story of Scripture
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore the unified, Christ-centered meta-narrative of God's Word across all 66 canonical books, 
              complete with Christological portraits, key memory verses, and the 91-step historical Walk Thru.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => {
                setPresenterStepIdx(0)
                setIsPresenterOpen(true)
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Guided Tour Mode</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Study Chart</span>
            </button>
          </div>
        </div>

        {/* Top-Level Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800 pt-6">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>66-Book Canonical Themes Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('otWalkThru')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'otWalkThru'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>91-Step Walk Thru OT</span>
          </button>

          <button
            onClick={() => setActiveTab('ntJourneys')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'ntJourneys'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Life of Jesus & Acts Journeys</span>
          </button>

          <button
            onClick={() => setActiveTab('mnemonics')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'mnemonics'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-amber-400" />
            <span>Mnemonics & Key Concepts</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 66-BOOK THEMES MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Controls: Search & Division Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search books, themes, Christ portraits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Showing {filteredBooks.length} of 66 Books
              </span>
            </div>

            {/* Division Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
              {divisions.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivision(div.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedDivision === div.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {div.label}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((item: BiblicalBookTheme) => (
              <div
                key={item.book}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-100 dark:border-gray-600 shadow-xs">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.book}
                        </h3>
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {item.division} • {item.subdivision}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] font-mono text-gray-500 dark:text-gray-400 rounded-md">
                      {item.date}
                    </span>
                  </div>

                  {/* Core Theme */}
                  <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Redemptive Theme
                    </span>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.theme}
                    </p>
                  </div>

                  {/* How this Book Points to Christ */}
                  <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      Christ in this Book
                    </span>
                    <p className="text-xs font-medium text-gray-800 dark:text-rose-200">
                      {item.christInBook}
                    </p>
                  </div>

                  {/* Key Theme Verse */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                      Key Verse:
                    </span>
                    <button
                      onClick={() => setQuickReaderRef(item.keyVerse)}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>{item.keyVerse}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <Link
                    to={`/bible?book=${encodeURIComponent(item.book)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Read Book</span>
                  </Link>

                  <Link
                    to={`/typology-matrix?query=${encodeURIComponent(item.theme)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-indigo-500"
                  >
                    <span>Typology</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 91-STEP WALK THRU THE OLD TESTAMENT */}
      {activeTab === 'otWalkThru' && (
        <div className="space-y-6">
          {/* Era Filter Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <span>Filter by Historical Era</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {filteredOtMilestones.length} Milestones
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {otEras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedOtEra(era)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedOtEra === era
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {era === 'all' ? 'All 91 Milestones' : era}
                </button>
              ))}
            </div>
          </div>

          {/* Milestone Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOtMilestones.map((m) => (
              <div
                key={m.step}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-extrabold flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-xs">
                        {m.step}
                      </span>
                      <span className="text-xl">{m.icon}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] font-semibold text-gray-600 dark:text-gray-300 rounded-full">
                      {m.era}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {m.title}
                  </h4>

                  {m.mnemonic && (
                    <span className="inline-block px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold rounded-md">
                      Mnemonic: {m.mnemonic}
                    </span>
                  )}

                  {m.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {m.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <button
                    onClick={() => setQuickReaderRef(m.scriptureRef)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{m.scriptureRef}</span>
                  </button>

                  <button
                    onClick={() => {
                      setPresenterStepIdx(m.step - 1)
                      setIsPresenterOpen(true)
                    }}
                    className="text-[11px] font-medium text-gray-400 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <span>Tour Step</span>
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIFE OF JESUS & ACTS MISSIONARY JOURNEYS */}
      {activeTab === 'ntJourneys' && (
        <div className="space-y-8">
          {/* Section 1: Life of Jesus in Luke */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">✝️</span>
                  <span>Walk Thru the Life of Jesus (Luke Chronology)</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  14 Chronological Stages from the Annunciation to the Resurrection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LIFE_OF_JESUS_STAGES.map((s) => (
                <div
                  key={s.stage}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold flex items-center justify-center">
                          {s.stage}
                        </span>
                        <span className="text-lg">{s.icon}</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        {s.location}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {s.title}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => setQuickReaderRef(s.scripture)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{s.scripture}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Acts & Paul's Missionary Journeys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span>Walk Thru Acts & Paul’s Missionary Journeys</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  15 Stages of the Early Church, 3 Missionary Journeys, and Rome Imprisonment
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTS_MISSIONARY_STAGES.map((s) => (
                <div
                  key={s.stage}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
                          {s.stage}
                        </span>
                        <span className="text-lg">{s.icon}</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {s.location}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {s.title}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => setQuickReaderRef(s.scripture)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{s.scripture}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MNEMONICS & KEY CONCEPTS STUDIO */}
      {activeTab === 'mnemonics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-500" />
              <span>Walk Thru Memory Mnemonics & Keyword Studio</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Master the entire storyline of Scripture with memorable acronyms and catchphrases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ERA_MNEMONICS.map(m => (
              <div
                key={m.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-lg uppercase">
                      {m.era}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{m.scripture}</span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {m.title}
                  </h4>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                    <span className="text-base sm:text-lg font-black text-amber-900 dark:text-amber-200 tracking-wider font-mono">
                      {m.acronymOrPhrase}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {m.breakdown.map((b, i) => (
                      <div key={i} className="text-xs flex items-start gap-2">
                        <span className="font-bold text-amber-600 min-w-[20px]">{b.label}:</span>
                        <span className="text-gray-700 dark:text-gray-300">{b.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setQuickReaderRef(m.scripture)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read {m.scripture}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL-SCREEN GUIDED TOUR / PRESENTER MODAL */}
      {isPresenterOpen && currentPresenterMilestone && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-xs font-bold text-indigo-300">
                  Step {currentPresenterMilestone.step} of {OT_WALK_THRU.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {currentPresenterMilestone.era}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isAutoPlaying ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                  title={isAutoPlaying ? 'Pause Autoplay' : 'Autoplay (5s)'}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isAutoPlaying ? 'Pause' : 'Autoplay'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsPresenterOpen(false)
                    setIsAutoPlaying(false)
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full transition-all duration-300"
                style={{ width: `${((currentPresenterMilestone.step) / OT_WALK_THRU.length) * 100}%` }}
              />
            </div>

            {/* Slide Main Content */}
            <div className="py-8 text-center space-y-6">
              <span className="text-6xl sm:text-7xl p-4 bg-slate-800/80 rounded-3xl inline-block border border-slate-700 shadow-xl">
                {currentPresenterMilestone.icon}
              </span>

              <div className="space-y-2 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {currentPresenterMilestone.title}
                </h2>
                {currentPresenterMilestone.mnemonic && (
                  <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold font-mono">
                    Mnemonic: {currentPresenterMilestone.mnemonic}
                  </span>
                )}
                {currentPresenterMilestone.description && (
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
                    {currentPresenterMilestone.description}
                  </p>
                )}
              </div>

              <div>
                <Link
                  to={`/bible?ref=${encodeURIComponent(currentPresenterMilestone.scriptureRef)}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Scripture: {currentPresenterMilestone.scriptureRef}</span>
                </Link>
              </div>
            </div>

            {/* Slide Navigation Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
              <button
                onClick={() => setPresenterStepIdx(prev => Math.max(0, prev - 1))}
                disabled={presenterStepIdx === 0}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <span className="hidden sm:inline font-mono">Use Left / Right Arrows on Keyboard</span>

              <button
                onClick={() => setPresenterStepIdx(prev => Math.min(OT_WALK_THRU.length - 1, prev + 1))}
                disabled={presenterStepIdx >= OT_WALK_THRU.length - 1}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCRIPTURE QUICK-READER MODAL */}
      {quickReaderRef && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  {quickReaderRef}
                </h3>
              </div>
              <button
                onClick={() => setQuickReaderRef(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-serif">
              <p>
                Open this passage directly inside the Scriptorium Reader with full versification, lexicon, commentaries, and cross-references.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(quickReaderRef)
                  setCopiedRef(true)
                  setTimeout(() => setCopiedRef(false), 2000)
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copied' : 'Copy Reference'}</span>
              </button>

              <Link
                to={`/bible?ref=${encodeURIComponent(quickReaderRef)}`}
                onClick={() => setQuickReaderRef(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Read in Bible</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
