import { useState } from 'react'
import { eschatologicalPrompts, EschatologicalPrompt } from '../data/eschatologicalPrompts'
import { Sparkles, CheckCircle2, ChevronRight, BookOpen, Quote, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export default function AlreadyNotYetCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [userReflection, setUserReflection] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const currentPrompt: EschatologicalPrompt = eschatologicalPrompts[currentIndex]

  const toggleComplete = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSaveReflection = () => {
    if (!userReflection.trim()) return
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
              Eschatological Discipleship Engine
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              The "Already / Not Yet" Reality
            </h3>
          </div>
        </div>

        {/* Index Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          {eschatologicalPrompts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={clsx(
                'w-6 h-6 rounded-full text-xs font-medium transition-all flex items-center justify-center',
                currentIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Title & Scripture */}
        <div>
          <div className="inline-block px-3 py-1 bg-indigo-900/50 border border-indigo-700/50 rounded-full text-xs font-semibold text-indigo-300 mb-2">
            {currentPrompt.themeTitle}
          </div>
          <p className="text-sm font-serif italic text-indigo-200 flex items-start gap-2 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>{currentPrompt.scriptureAnchor}</span>
          </p>
        </div>

        {/* The Two Dimensions: Already vs Not Yet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ALREADY (Heavenly Reality) */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                The "Already" (Heavenly Reality)
              </span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Seated in Christ
              </span>
            </div>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {currentPrompt.alreadyReality}
            </p>
          </div>

          {/* NOT YET (Mundane Struggle) */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                The "Not Yet" (Earthly Conflict)
              </span>
              <span className="text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded font-mono">
                Present Evil Age
              </span>
            </div>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              {currentPrompt.notYetStruggle}
            </p>
          </div>
        </div>

        {/* Citizenship Action Step */}
        <div className="bg-indigo-900/40 border border-indigo-700/60 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-indigo-400" />
            Today's Heavenly Citizenship Action
          </h4>
          <p className="text-sm text-slate-200 mb-4 font-medium">
            {currentPrompt.citizenshipAction}
          </p>

          {/* Interactive Action Checkbox & Reflection Input */}
          <div className="space-y-3 pt-2 border-t border-indigo-800/40">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleComplete(currentPrompt.id)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  completed[currentPrompt.id]
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                    : 'bg-indigo-800/60 hover:bg-indigo-700 text-indigo-200'
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completed[currentPrompt.id] ? 'Action Completed!' : 'Mark Action Done'}
              </button>

              <Link
                to="/journal/new"
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 underline underline-offset-4"
              >
                Reflect in Journal <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick Journal Entry */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder="Record a brief prayer or reflection on this heavenly reality..."
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveReflection}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                {isSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Geerhardus Vos Quote Footer */}
        <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 italic">
          <Quote className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p>"{currentPrompt.vosQuote}"</p>
            <span className="not-italic font-semibold text-slate-500 mt-1 block">
              — Geerhardus Vos, Biblical Theology
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
