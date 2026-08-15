import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Search, 
  Layers, 
  MapPin, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  ArrowRight,
  Bookmark
} from 'lucide-react'
import { 
  BOOK_THEMES, 
  OT_WALK_THRU, 
  LIFE_OF_JESUS_STAGES, 
  ACTS_MISSIONARY_STAGES,
  type BiblicalBookTheme 
} from '../data/storyOfScriptureData'

export default function StoryOfScripturePage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'otWalkThru' | 'ntJourneys'>('matrix')
  const [selectedDivision, setSelectedDivision] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedOtEra, setSelectedOtEra] = useState<string>('all')

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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Redemptive Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            The Story of Scripture
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore the unified, Christ-centered meta-narrative of God's Word across all 66 canonical books, 
            complete with core redemptive themes, key verses, and the 91-step historical Walk Thru.
          </p>
        </div>

        {/* Top-Level Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800 pt-6">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
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
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'otWalkThru'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>91-Step Walk Thru the Old Testament</span>
          </button>

          <button
            onClick={() => setActiveTab('ntJourneys')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'ntJourneys'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Life of Jesus & Acts Journeys</span>
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
                  placeholder="Search books, themes, key verses..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.theme}
                    </p>
                  </div>

                  {/* Key Theme Verse */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                      Key Verse:
                    </span>
                    <Link
                      to={`/bible?ref=${encodeURIComponent(item.keyVerse)}`}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>{item.keyVerse}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <Link
                    to={`/bible?book=${encodeURIComponent(item.book)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Read in Bible</span>
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

                  {m.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {m.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <Link
                    to={`/bible?ref=${encodeURIComponent(m.scriptureRef)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{m.scriptureRef}</span>
                  </Link>

                  <Link
                    to={`/paths/chronological`}
                    className="text-[11px] font-medium text-gray-400 hover:text-indigo-600"
                  >
                    <span>Timeline Path</span>
                  </Link>
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
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      to={`/bible?ref=${encodeURIComponent(s.scripture)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{s.scripture}</span>
                    </Link>
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
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      to={`/bible?ref=${encodeURIComponent(s.scripture)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{s.scripture}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
