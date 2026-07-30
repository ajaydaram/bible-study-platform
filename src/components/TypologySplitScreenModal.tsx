import { TypologyMapping } from '../data/typologyBibleMap'
import {
  Sparkles,
  BookOpen,
  Quote,
  X
} from 'lucide-react'

interface Props {
  mapping: TypologyMapping | null
  isOpen: boolean
  onClose: () => void
}

export default function TypologySplitScreenModal({ mapping, isOpen, onClose }: Props) {
  if (!isOpen || !mapping) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 text-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6 border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Vosian Split-Screen Typology Viewer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>{mapping.themeIcon}</span>
            <span>{mapping.themeTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Side-by-Side Comparison: Shadow (*Type*) in the Old Testament → Substance (*Antitype*) in Christ
          </p>
        </div>

        {/* SPLIT SCREEN COMPARISON GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* LEFT PANE: OT SHADOW (TYPE) */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                1. Old Testament Shadow (Type)
              </span>
              <span className="text-[10px] font-mono bg-amber-900/60 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                {mapping.otReference}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-amber-200">
                {mapping.otPassageTitle}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-serif italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                "{mapping.otSummary}"
              </p>
            </div>

            <div className="space-y-1 text-xs text-amber-100/90 pt-1">
              <span className="font-bold text-amber-300 block uppercase tracking-wider text-[10px]">
                Redemptive Symbolism
              </span>
              <p className="leading-relaxed text-slate-300">
                This historical event or institution served as an earthen shadow pointing ahead to the ultimate redemptive goal.
              </p>
            </div>
          </div>

          {/* RIGHT PANE: NT SUBSTANCE (ANTITYPE) */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                2. New Testament Substance (Antitype)
              </span>
              <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                {mapping.ntReference}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-emerald-200">
                {mapping.ntPassageTitle}
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-serif italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                "{mapping.ntPassageText}"
              </p>
            </div>

            <div className="space-y-1 text-xs text-emerald-100/90 pt-1">
              <span className="font-bold text-emerald-300 block uppercase tracking-wider text-[10px]">
                Fulfillment in Christ
              </span>
              <p className="leading-relaxed text-slate-300">
                {mapping.ntFulfillmentSummary}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER: GEERHARDUS VOS SYNTHESIS */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            <Quote className="w-3.5 h-3.5" />
            Geerhardus Vos Typological Synthesis
          </div>
          <p className="text-slate-300 italic font-serif leading-relaxed">
            "{mapping.vosianInsight}"
          </p>
          <span className="text-[10px] font-semibold text-slate-500 block pt-1">
            — Geerhardus Vos, <span className="italic">Biblical Theology: Old and New Testaments</span>
          </span>
        </div>
      </div>
    </div>
  )
}
