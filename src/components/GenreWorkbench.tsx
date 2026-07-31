import { BiblicalGenre } from '../data/genreData'
import { BookOpen, Check, Layers, Sparkles, HelpCircle } from 'lucide-react'

interface Props {
  genre: BiblicalGenre
  onSelectPassage?: (reference: string) => void
}

export default function GenreWorkbench({ genre, onSelectPassage }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 bg-slate-800 rounded-2xl border border-slate-700">
            {genre.icon}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Literary Hermeneutic Workbench
            </span>
            <h3 className="text-2xl font-extrabold text-white">{genre.name} Form Analysis</h3>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-900/60 border border-indigo-700/50 text-indigo-200 text-xs font-semibold rounded-full">
          Hermeneutical Precision
        </span>
      </div>

      {/* Description & Key Structural Question */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Literary Definition & Purpose
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {genre.description}
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Primary Exegetical Question
          </h4>
          <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
            "{genre.structuralQuestion}"
          </p>
        </div>
      </div>

      {/* Hermeneutical Rules Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Hermeneutical Rules of Engagement
        </h4>
        <div className="grid md:grid-cols-3 gap-3">
          {genre.hermeneuticalRules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-200"
            >
              <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-md shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="leading-snug">{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Exemplar Readings */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Exemplar Passages in {genre.name}
        </h4>
        <div className="grid md:grid-cols-3 gap-3">
          {genre.keyPassages.map((kp) => (
            <button
              key={kp.reference}
              onClick={() => onSelectPassage && onSelectPassage(kp.reference)}
              className="p-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500 rounded-xl text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-white">
                <span>{kp.reference}</span>
                <span className="text-[10px] text-slate-400 font-mono">Read</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{kp.title}</p>
              <p className="text-[10px] text-slate-400 line-clamp-1">{kp.focus}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
