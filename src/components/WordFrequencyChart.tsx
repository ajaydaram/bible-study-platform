import { Link } from 'react-router-dom'
import { BarChart3, BookOpen, Layers } from 'lucide-react'

interface WordFrequencyChartProps {
  strongs: string
  word: string
  transliteration?: string
  occurrences: number
  language: 'hebrew' | 'greek'
  distribution?: {
    pentateuchOrGospels: number
    historyOrActs: number
    poetryOrPauline: number
    prophetsOrGeneral: number
  }
}

export default function WordFrequencyChart({
  strongs,
  word,
  transliteration,
  occurrences,
  language,
  distribution
}: WordFrequencyChartProps) {
  // Default estimate if exact distribution not provided
  const dist = distribution || {
    pentateuchOrGospels: Math.round(occurrences * 0.35),
    historyOrActs: Math.round(occurrences * 0.20),
    poetryOrPauline: Math.round(occurrences * 0.30),
    prophetsOrGeneral: Math.round(occurrences * 0.15)
  }

  const sections = language === 'hebrew'
    ? [
        { label: 'Pentateuch (Law)', count: dist.pentateuchOrGospels, color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
        { label: 'Historical Books', count: dist.historyOrActs, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800' },
        { label: 'Poetry & Wisdom', count: dist.poetryOrPauline, color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800' },
        { label: 'Major & Minor Prophets', count: dist.prophetsOrGeneral, color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' }
      ]
    : [
        { label: 'Four Gospels', count: dist.pentateuchOrGospels, color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
        { label: 'Acts & Early Church', count: dist.historyOrActs, color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
        { label: 'Pauline Epistles', count: dist.poetryOrPauline, color: 'bg-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800' },
        { label: 'General Epistles & Rev', count: dist.prophetsOrGeneral, color: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800' }
      ]

  const totalCount = Math.max(1, occurrences)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              Biblical Frequency & Distribution
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {occurrences.toLocaleString()} occurrences in {language === 'hebrew' ? 'Old Testament (Hebrew/Aramaic)' : 'New Testament (Greek)'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold rounded-lg">
          {occurrences}x Total
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
        {sections.map((sec, idx) => {
          const pct = (sec.count / totalCount) * 100
          if (pct === 0) return null
          return (
            <div
              key={idx}
              className={`${sec.color} h-full transition-all`}
              style={{ width: `${pct}%` }}
              title={`${sec.label}: ${sec.count} occurrences (${Math.round(pct)}%)`}
            />
          )
        })}
      </div>

      {/* Grid of Canonical Divisions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {sections.map((sec, idx) => {
          const pct = Math.round((sec.count / totalCount) * 100)
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${sec.border} ${sec.bg} space-y-1`}
            >
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block truncate">
                {sec.label}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-white font-mono">
                  {sec.count}
                </span>
                <span className="text-[10px] font-semibold text-gray-500">
                  {pct}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100 dark:border-gray-700/60">
        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          Lexical Root: <span className="font-bold">{word}</span> ({transliteration})
        </span>

        <Link
          to={`/bible?query=${encodeURIComponent(strongs)}`}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Search in Bible</span>
        </Link>
      </div>
    </div>
  )
}
