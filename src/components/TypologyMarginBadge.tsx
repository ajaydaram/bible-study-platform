import { TypologyMapping } from '../data/typologyBibleMap'
import { Sparkles, ArrowRight } from 'lucide-react'

interface Props {
  mapping: TypologyMapping
  onClick: () => void
}

export default function TypologyMarginBadge({ mapping, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="inline-flex items-center gap-1.5 ml-2.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm transition-all hover:scale-105 select-none animate-pulse"
      title={`Click to open split-screen typology view: ${mapping.themeTitle}`}
    >
      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
      <span className="font-bold text-amber-800 dark:text-amber-200">
        Typology: {mapping.themeTitle}
      </span>
      <ArrowRight className="w-2.5 h-2.5 text-amber-500" />
      <span className="font-mono text-[10px] opacity-90">{mapping.ntReference.split('&')[0]}</span>
    </button>
  )
}
