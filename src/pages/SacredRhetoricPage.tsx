import { useState } from 'react'
import {
  AUGUSTINE_PRINCIPLES,
  CHAPELL_FCF_FRAMEWORK,
  PAULINE_DIATRIBE_DEVICES
} from '../data/sacredRhetoricData'
import RhetoricWorkbenchComponent from '../components/RhetoricWorkbenchComponent'
import UnifiedHermeneuticsBanner from '../components/UnifiedHermeneuticsBanner'
import { BookOpen, Sparkles, AlertCircle, Quote } from 'lucide-react'
import clsx from 'clsx'

export default function SacredRhetoricPage() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'augustine' | 'chapell' | 'diatribe'>('workbench')

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Sacred Homiletical Rhetoric Engine
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Classical Rhetoric & Christ-Centered Preaching
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Synthesizing Aristotle’s Triad (*Logos, Ethos, Pathos*), Cicero’s 5 Canons, Augustine’s *De Doctrina Christiana*, Bryan Chapell’s Fallen Condition Focus (FCF), and Paul’s Greco-Roman Diatribe.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-4">
        <button
          onClick={() => setActiveTab('workbench')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'workbench'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <BookOpen className="w-4 h-4" />
          Rhetoric Workbench & 5 Canons
        </button>

        <button
          onClick={() => setActiveTab('augustine')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'augustine'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Quote className="w-4 h-4" />
          Augustine: De Doctrina Christiana
        </button>

        <button
          onClick={() => setActiveTab('chapell')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'chapell'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <AlertCircle className="w-4 h-4" />
          Chapell: Fallen Condition Focus (FCF)
        </button>

        <button
          onClick={() => setActiveTab('diatribe')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'diatribe'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Sparkles className="w-4 h-4" />
          Pauline Diatribe & Devices
        </button>
      </div>

      {/* TAB 1: WORKBENCH */}
      {activeTab === 'workbench' && (
        <div className="space-y-6">
          <UnifiedHermeneuticsBanner referenceKey="2 Timothy 2:15" />
          <RhetoricWorkbenchComponent />
        </div>
      )}

      {/* TAB 2: AUGUSTINE */}
      {activeTab === 'augustine' && (
        <div className="grid md:grid-cols-2 gap-6">
          {AUGUSTINE_PRINCIPLES.map((aug) => (
            <div
              key={aug.id}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                  {aug.phase}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{aug.title}</h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-serif italic mt-1">
                  "{aug.principle}"
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 font-mono">
                {aug.biblicalQuote}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Homiletical Guidance:
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {aug.homileticalGuidance}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CHAPELL FCF */}
      {activeTab === 'chapell' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Bryan Chapell's 3 Homiletical Questions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {CHAPELL_FCF_FRAMEWORK.threeQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-4 space-y-2"
                >
                  <h4 className="font-bold text-sm text-purple-900 dark:text-purple-200">
                    {q.question}
                  </h4>
                  <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAULINE DIATRIBE */}
      {activeTab === 'diatribe' && (
        <div className="space-y-4">
          {PAULINE_DIATRIBE_DEVICES.map((d, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {d.device} ({d.greekTerm})
                </h3>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {d.biblicalExample}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{d.definition}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1 border-t border-gray-100 dark:border-gray-700">
                Homiletical Application: {d.homileticalUse}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
