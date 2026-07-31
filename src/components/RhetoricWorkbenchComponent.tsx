import { useState } from 'react'
import {
  ARISTOTELIAN_TRIAD,
  CICERO_CANONS,
  CHAPELL_FCF_FRAMEWORK
} from '../data/sacredRhetoricData'
import { FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

export default function RhetoricWorkbenchComponent() {
  const [fcfInput, setFcfInput] = useState('')
  const [bigIdeaInput, setBigIdeaInput] = useState('')
  const [checkedCanons, setCheckedCanons] = useState<Record<string, boolean>>({})

  const toggleCanonCheck = (id: string) => {
    setCheckedCanons((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Homiletics & Expository Tool
            </span>
            <h3 className="text-2xl font-extrabold text-white">Sermon Rhetoric Workbench</h3>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-900/60 border border-indigo-700/50 text-indigo-200 text-xs font-semibold rounded-full">
          Preacher’s Assistant
        </span>
      </div>

      {/* Aristotelian Triad Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Aristotelian Rhetorical Triad for Preachers
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          {ARISTOTELIAN_TRIAD.map((item) => (
            <div
              key={item.mode}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono text-xs font-bold">
                  {item.mode}
                </span>
              </div>
              <h5 className="font-bold text-sm text-white">{item.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-amber-300 font-serif italic">
                "{item.keyQuestion}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bryan Chapell Fallen Condition Focus (FCF) Builder */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Fallen Condition Focus (FCF) & Big Idea Builder
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {CHAPELL_FCF_FRAMEWORK.fcfDefinition}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200">
              1. What is the Fallen Condition Focus (FCF) in your passage?
            </label>
            <textarea
              rows={3}
              value={fcfInput}
              onChange={(e) => setFcfInput(e.target.value)}
              placeholder="e.g. In 1 Samuel 17, Israel fears the giant because they rely on fleshly strength rather than trusting the covenant God..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200">
              2. What is the Christ-Centered Big Idea & Grace Solution?
            </label>
            <textarea
              rows={3}
              value={bigIdeaInput}
              onChange={(e) => setBigIdeaInput(e.target.value)}
              placeholder="e.g. God raises up Jesus as our true anointed Champion who defeats sin and death in our place..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Cicero 5 Canons Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Cicero's 5 Canons Preaching Checklist
        </h4>
        <div className="grid md:grid-cols-5 gap-3">
          {CICERO_CANONS.map((canon) => (
            <div
              key={canon.id}
              onClick={() => toggleCanonCheck(canon.id)}
              className={clsx(
                'p-4 rounded-xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between',
                checkedCanons[canon.id]
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                  : 'bg-slate-800/60 border-slate-700'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    {canon.latinName}
                  </span>
                  <CheckCircle2
                    className={clsx(
                      'w-4 h-4',
                      checkedCanons[canon.id] ? 'text-emerald-400' : 'text-slate-600'
                    )}
                  />
                </div>
                <h5 className="font-bold text-xs text-white">{canon.name}</h5>
                <p className="text-[10px] text-slate-300 mt-1 line-clamp-2">{canon.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
