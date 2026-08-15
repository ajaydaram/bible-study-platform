import { useState } from 'react'
import { Info, HelpCircle } from 'lucide-react'
import { expandMorphCode } from '../lib/morphology'

interface MorphologyBadgeProps {
  morphCode: string
  language?: 'greek' | 'hebrew'
  briefParsing?: string
  explanation?: string
  compact?: boolean
}

export default function MorphologyBadge({
  morphCode,
  language = 'greek',
  briefParsing,
  explanation,
  compact = false
}: MorphologyBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!morphCode) return null

  const parsed = briefParsing || expandMorphCode(morphCode, language)
  const parts = parsed.split(' ').filter(Boolean)

  // Color mapping based on grammatical category
  const getBadgeColor = (part: string) => {
    const p = part.toLowerCase()
    // Tense
    if (p.includes('aorist')) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    if (p.includes('present')) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    if (p.includes('perfect')) return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    if (p.includes('imperfect')) return 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800'
    if (p.includes('future')) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    
    // Voice
    if (p.includes('active')) return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    if (p.includes('passive')) return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    if (p.includes('middle')) return 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'

    // Mood
    if (p.includes('indicative')) return 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700'
    if (p.includes('imperative')) return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
    if (p.includes('subjunctive')) return 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
    if (p.includes('participle')) return 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800'

    // Case (Nouns)
    if (p.includes('nominative')) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200'
    if (p.includes('genitive')) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200'
    if (p.includes('dative')) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200'
    if (p.includes('accusative')) return 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 border-violet-200'

    // Hebrew Stems
    if (p.includes('qal')) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200'
    if (p.includes('piel')) return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-200'
    if (p.includes('hiphil')) return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200'
    if (p.includes('niphal')) return 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border-sky-200'

    return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
  }

  // Get Exegetical significance note for grammar
  const getExegeticalNote = (parsedStr: string) => {
    const s = parsedStr.toLowerCase()
    if (s.includes('aorist') && s.includes('indicative')) {
      return '⚡ Exegetical Note: Aorist Indicative views the action as a completed historical whole (punctiliar), often denoting a decisive, once-for-all event in redemptive history.'
    }
    if (s.includes('perfect')) {
      return '✨ Exegetical Note: Perfect tense denotes a completed past action with abiding, ongoing present results (e.g. "It has been written and stands written!").'
    }
    if (s.includes('present') && s.includes('participle')) {
      return '🔄 Exegetical Note: Present Participle denotes continuous, ongoing, or habitual action in progress (e.g. "continually believing", "walking in the light").'
    }
    if (s.includes('genitive')) {
      return '🗝️ Exegetical Note: Genitive case specifies definition, possession, or source (e.g. "faith OF Christ", "righteousness OF God").'
    }
    if (s.includes('qal')) {
      return '🇮🇱 Hebrew Qal Stem: Basic simple active voice in Hebrew verbal morphology.'
    }
    if (s.includes('piel')) {
      return '🔥 Hebrew Piel Stem: Intensive or causative active action, expressing heightened energy or deliberate effect.'
    }
    if (s.includes('hiphil')) {
      return '⚡ Hebrew Hiphil Stem: Causative action (e.g. "to cause to reign", "to declare righteous").'
    }
    return 'Grammatical parsing code from the STEPBible Original Language morphological dataset.'
  }

  const exegeticalInsight = explanation || getExegeticalNote(parsed)

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
        <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          {morphCode}
        </span>
        <span className="text-gray-600 dark:text-gray-400 text-xs font-sans">
          ({parsed})
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
            {morphCode}
          </span>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Grammar Information"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breakdown Chips */}
      <div className="flex flex-wrap gap-1.5">
        {parts.map((p, idx) => (
          <span
            key={idx}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-2xs ${getBadgeColor(p)}`}
          >
            {p}
          </span>
        ))}
      </div>

      {/* Exegetical Insight Box */}
      {(showTooltip || exegeticalInsight) && (
        <div className="mt-2 p-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
            <Info className="w-3.5 h-3.5" />
            <span>Syntax & Exegetical Note</span>
          </div>
          <p>{exegeticalInsight}</p>
        </div>
      )}
    </div>
  )
}
