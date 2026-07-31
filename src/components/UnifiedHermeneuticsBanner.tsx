import { Link } from 'react-router-dom'
import { Calendar, Compass, Layers, ArrowRight, BookOpen } from 'lucide-react'
import { getUnifiedHermeneutics, UnifiedTriad } from '../data/unifiedHermeneutics'

interface Props {
  referenceKey: string
  customTriad?: UnifiedTriad
}

export default function UnifiedHermeneuticsBanner({ referenceKey, customTriad }: Props) {
  const triad = customTriad || getUnifiedHermeneutics(referenceKey)

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 rounded-2xl p-4 text-white shadow-xl space-y-3 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300">
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-300">
              Unified Hermeneutical Triad • {triad.reference}
            </span>
            <h4 className="text-sm font-bold text-white">
              3-Fold Interconnected Message of Scripture
            </h4>
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-0.5 bg-indigo-900/60 border border-indigo-700/50 text-[10px] font-semibold text-indigo-200 rounded-full">
          Harmonized Reading Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {/* 1. CHRONOLOGICAL ERA */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-blue-500/50 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Chronological Era
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {triad.chronologicalEra.timeline}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100">
              {triad.chronologicalEra.name}
            </p>
          </div>
          <Link
            to="/paths/chronological"
            className="inline-flex items-center justify-between text-[11px] font-semibold text-blue-300 hover:text-white pt-1 border-t border-slate-800"
          >
            <span>Read Timeline Path</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 2. REDEMPTIVE EPOCH */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-amber-500/50 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Redemptive Epoch
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                {triad.redemptiveEpoch.icon} Epoch {triad.redemptiveEpoch.number}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100 line-clamp-1">
              {triad.redemptiveEpoch.title}
            </p>
            <p className="text-[10px] text-slate-400 font-serif italic line-clamp-1">
              {triad.redemptiveEpoch.covenant}
            </p>
          </div>
          <Link
            to="/epochs?tab=epochs"
            className="inline-flex items-center justify-between text-[11px] font-semibold text-amber-300 hover:text-white pt-1 border-t border-slate-800"
          >
            <span>Explore Revelation Tree</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 3. TYPOLOGICAL THEME */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-emerald-500/50 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Thematic Typology
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">Shadow → Antitype</span>
            </div>
            <p className="text-xs font-bold text-slate-100 line-clamp-1">
              {triad.typologicalTheme.themeTitle}
            </p>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              {triad.typologicalTheme.antitypeFulfillment}
            </p>
          </div>
          <Link
            to="/epochs?tab=typology"
            className="inline-flex items-center justify-between text-[11px] font-semibold text-emerald-300 hover:text-white pt-1 border-t border-slate-800"
          >
            <span>Trace Theme to Christ</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
