import { ChiasmStructure } from '../data/typologyMatrixData'
import { Sparkles, BookOpen, Layers } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  chiasm: ChiasmStructure
}

export default function ChiasmVisualizer({ chiasm }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          Hebrew Chiastic Inversion Visualizer
        </div>
        <h3 className="text-2xl font-extrabold text-white">{chiasm.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
          "{chiasm.introduction}"
        </p>
      </div>

      {/* Central Pivot Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 text-center space-y-1 shadow-lg">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Chiastic Center & Turning Point
        </span>
        <p className="text-sm font-extrabold text-amber-200">{chiasm.centralFocus}</p>
      </div>

      {/* Symmetrical Chiastic Pyramid */}
      <div className="space-y-3 pt-2">
        {chiasm.items.map((item, idx) => {
          const isPivot = item.level === 'PIVOT'
          const indentLevel = isPivot
            ? 'ml-0 sm:ml-16 bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
            : idx < chiasm.items.length / 2
            ? `ml-0 sm:ml-${(idx + 1) * 3} bg-slate-800/80 border-slate-700/80`
            : `ml-0 sm:ml-${(chiasm.items.length - idx) * 3} bg-slate-800/80 border-slate-700/80`

          return (
            <div
              key={idx}
              className={clsx(
                'p-4 rounded-xl border transition-all space-y-1',
                indentLevel
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded text-xs font-mono font-bold',
                      isPivot
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                    )}
                  >
                    {item.level}
                  </span>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {item.reference}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-serif italic">"{item.text}"</p>
              <p className="text-[11px] text-slate-400 pt-0.5">{item.explanation}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
