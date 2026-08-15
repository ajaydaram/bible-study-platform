import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Search, 
  MapPin, 
  ExternalLink
} from 'lucide-react'
import { 
  GOSPEL_HARMONY_DATA 
} from '../../data/gospelHarmonyData'

export default function GospelHarmonyPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [selectedUnique, setSelectedUnique] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const periods = [
    'Incarnation & Early Life',
    'Inauguration & Early Ministry',
    'Great Galilean Ministry',
    'Later Judean & Perea',
    'Passion Week',
    'Crucifixion & Burial',
    'Resurrection & Ascension'
  ]

  const filteredEpisodes = useMemo(() => {
    return GOSPEL_HARMONY_DATA.filter((ep) => {
      const matchesPeriod = selectedPeriod === 'all' || ep.period === selectedPeriod
      const matchesUnique = selectedUnique === 'all' || ep.uniqueTo === selectedUnique
      const matchesSearch = 
        ep.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.theologicalTheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ep.matthew && `matthew ${ep.matthew}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ep.mark && `mark ${ep.mark}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ep.luke && `luke ${ep.luke}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ep.john && `john ${ep.john}`.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesPeriod && matchesUnique && matchesSearch
    })
  }, [selectedPeriod, selectedUnique, searchQuery])

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Chronological Synoptic Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Four-Gospel Harmony Studio
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Explore the life, miracles, passion, and resurrection of Jesus Christ in synchronized chronological order 
            across Matthew, Mark, Luke, and John.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes, themes, locations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Unique Material Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Filter:
            </span>
            <button
              onClick={() => setSelectedUnique('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedUnique === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              All Parallels ({GOSPEL_HARMONY_DATA.length})
            </button>
            <button
              onClick={() => setSelectedUnique('John')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedUnique === 'John'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              Unique to John
            </button>
            <button
              onClick={() => setSelectedUnique('Luke')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedUnique === 'Luke'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-700 text-purple-700 dark:text-purple-300'
              }`}
            >
              Unique to Luke
            </button>
            <button
              onClick={() => setSelectedUnique('Matthew')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedUnique === 'Matthew'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300'
              }`}
            >
              Unique to Matthew
            </button>
          </div>
        </div>

        {/* Chronological Period Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPeriod === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Periods
          </button>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPeriod === p
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Synoptic 4-Column Table / Card Grid */}
      <div className="space-y-4">
        {filteredEpisodes.map((ep, idx) => (
          <div
            key={ep.id}
            className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 hover:border-indigo-400 transition-all"
          >
            {/* Episode Title & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {ep.episodeTitle}
                  </h3>
                  {ep.uniqueTo && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Unique to {ep.uniqueTo}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{ep.location}</span>
                  </span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {ep.period}
                  </span>
                </p>
              </div>

              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-xs font-semibold text-purple-800 dark:text-purple-300 self-start sm:self-center border border-purple-200 dark:border-purple-900">
                ✝️ {ep.theologicalTheme}
              </span>
            </div>

            {/* 4 Gospels Parallel Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Matthew */}
              <div className={`p-3 rounded-2xl border flex flex-col justify-between ${ep.matthew ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900' : 'bg-gray-50 dark:bg-gray-850/50 border-gray-200 dark:border-gray-800 opacity-40'}`}>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
                    Matthew (King)
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {ep.matthew ? `Matt ${ep.matthew}` : '—'}
                  </p>
                </div>
                {ep.matthew && (
                  <Link
                    to={`/bible?ref=${encodeURIComponent(`Matthew ${ep.matthew}`)}`}
                    className="mt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Text</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Mark */}
              <div className={`p-3 rounded-2xl border flex flex-col justify-between ${ep.mark ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900' : 'bg-gray-50 dark:bg-gray-850/50 border-gray-200 dark:border-gray-800 opacity-40'}`}>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-1">
                    Mark (Servant)
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {ep.mark ? `Mark ${ep.mark}` : '—'}
                  </p>
                </div>
                {ep.mark && (
                  <Link
                    to={`/bible?ref=${encodeURIComponent(`Mark ${ep.mark}`)}`}
                    className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Text</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Luke */}
              <div className={`p-3 rounded-2xl border flex flex-col justify-between ${ep.luke ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900' : 'bg-gray-50 dark:bg-gray-850/50 border-gray-200 dark:border-gray-800 opacity-40'}`}>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 block mb-1">
                    Luke (Son of Man)
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {ep.luke ? `Luke ${ep.luke}` : '—'}
                  </p>
                </div>
                {ep.luke && (
                  <Link
                    to={`/bible?ref=${encodeURIComponent(`Luke ${ep.luke}`)}`}
                    className="mt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Text</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* John */}
              <div className={`p-3 rounded-2xl border flex flex-col justify-between ${ep.john ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900' : 'bg-gray-50 dark:bg-gray-850/50 border-gray-200 dark:border-gray-800 opacity-40'}`}>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-1">
                    John (Son of God)
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {ep.john ? `John ${ep.john}` : '—'}
                  </p>
                </div>
                {ep.john && (
                  <Link
                    to={`/bible?ref=${encodeURIComponent(`John ${ep.john}`)}`}
                    className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Text</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
