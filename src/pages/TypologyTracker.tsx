import { useState } from 'react'
import { typologyThemes } from '../data/typologyThemes'
import {
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  GitCommit,
  Search,
  BookMarked
} from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export default function TypologyTracker() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('temple')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredThemes = typologyThemes.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const currentTheme =
    typologyThemes.find((t) => t.id === selectedThemeId) || filteredThemes[0] || typologyThemes[0]

  const categories = ['All', 'Sanctuary & Presence', 'Covenant & Priesthood', 'Sacrifice & Redemption', 'Kingdom & Royalty']

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-purple-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-300">
            <Layers className="w-4 h-4 text-purple-400" />
            Type to Antitype Biblical Theology Engine
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Typology Tracker: Shadow to Substance
          </h1>

          <p className="text-purple-100 text-base sm:text-lg leading-relaxed">
            Trace the organic development of central biblical institutions, symbols, and offices. Watch how Old Testament shadows (*types*) organically develop through redemptive history to reach their ultimate reality (*antitype*) in Jesus Christ.
          </p>
        </div>
      </div>

      {/* Main Grid: Theme Sidebar + Timeline Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Selector Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search biblical themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Themes List */}
          <div className="space-y-3">
            {filteredThemes.map((theme) => {
              const isSelected = theme.id === currentTheme.id
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={clsx(
                    'w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 relative overflow-hidden',
                    isSelected
                      ? 'bg-white dark:bg-gray-800 border-purple-600 dark:border-purple-500 shadow-xl ring-2 ring-purple-500/20 scale-[1.01]'
                      : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800'
                  )}
                >
                  <span className="text-2xl p-2 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-100 dark:border-purple-900 shrink-0">
                    {theme.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
                        {theme.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {theme.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {theme.subtitle}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-600" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Detail Panel (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {currentTheme ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    {currentTheme.icon}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      {currentTheme.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold">{currentTheme.title}</h2>
                  </div>
                </div>

                <p className="text-purple-100 text-sm sm:text-base leading-relaxed pt-2">
                  {currentTheme.summary}
                </p>
              </div>

              {/* Antitype Fulfillment Highlight Box */}
              <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border-b border-gray-200 dark:border-gray-700 text-emerald-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Ultimate Antitype Reality in Christ
                    </h4>
                    <p className="text-sm mt-1 leading-relaxed text-emerald-100 font-medium">
                      {currentTheme.antitypeSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Organic Stage Progression Timeline */}
              <div className="p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Organic Development Stage-by-Stage
                </h3>

                <div className="relative border-l-2 border-purple-200 dark:border-purple-900 ml-4 space-y-8 pl-6">
                  {currentTheme.stages.map((stage, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div
                        className={clsx(
                          'absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110',
                          stage.typeOrAntitype === 'shadow'
                            ? 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : stage.typeOrAntitype === 'development'
                            ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-500/20'
                        )}
                      >
                        {idx + 1}
                      </div>

                      {/* Stage Card */}
                      <div className="bg-gray-50 dark:bg-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2 hover:border-purple-300 dark:hover:border-purple-700 transition-colors shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={clsx(
                              'text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                              stage.typeOrAntitype === 'shadow'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : stage.typeOrAntitype === 'development'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            )}
                          >
                            {stage.epochName} • {stage.typeOrAntitype.toUpperCase()}
                          </span>

                          <Link
                            to="/bible"
                            className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            {stage.scripture}
                          </Link>
                        </div>

                        <h4 className="font-bold text-base text-gray-900 dark:text-white">
                          {stage.title}
                        </h4>

                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Side-by-Side Scripture Cross References */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-purple-600" />
                    Key Type-to-Antitype Scripture Pairs
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentTheme.keyCrossReferences.map((pair, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/60 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between font-mono font-bold text-purple-900 dark:text-purple-300">
                          <span>OT Shadow: {pair.ot}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
                          <span>NT Fulfillment: {pair.nt}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 italic pt-1">
                          "{pair.note}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">No matching typology themes found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
