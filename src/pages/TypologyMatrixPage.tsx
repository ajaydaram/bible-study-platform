import { useState } from 'react'
import {
  CHIASTM_STRUCTURES,
  SACRED_LOCATIONS,
  MESSIANIC_PROPHECIES
} from '../data/typologyMatrixData'
import ChiasmVisualizer from '../components/ChiasmVisualizer'
import ProphecyMatrix from '../components/ProphecyMatrix'
import UnifiedHermeneuticsBanner from '../components/UnifiedHermeneuticsBanner'
import { Layers, MapPin, Scroll, Sparkles } from 'lucide-react'
import clsx from 'clsx'

export default function TypologyMatrixPage() {
  const [activeTab, setActiveTab] = useState<'chiasms' | 'locations' | 'prophecies'>('chiasms')
  const [selectedChiasmIndex, setSelectedChiasmIndex] = useState(0)

  const activeChiasm = CHIASTM_STRUCTURES[selectedChiasmIndex]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-purple-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Scripture Typology Matrix Engine
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Chiastic Pyramids, Sacred Geography & Prophecy
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Unveil the structural symmetry of Hebrew chiasms, explore sacred redemptive geography, and trace Messianic prophecy fulfillments in Jesus Christ.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-4">
        <button
          onClick={() => setActiveTab('chiasms')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'chiasms'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Layers className="w-4 h-4" />
          Literary Chiasms
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'locations'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <MapPin className="w-4 h-4" />
          Sacred Geography
        </button>

        <button
          onClick={() => setActiveTab('prophecies')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'prophecies'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Scroll className="w-4 h-4" />
          Messianic Prophecy Matrix
        </button>
      </div>

      {/* TAB 1: LITERARY CHIASMS */}
      {activeTab === 'chiasms' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {CHIASTM_STRUCTURES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedChiasmIndex(idx)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                  selectedChiasmIndex === idx
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                )}
              >
                {c.title}
              </button>
            ))}
          </div>

          <ChiasmVisualizer chiasm={activeChiasm} />
        </div>
      )}

      {/* TAB 2: SACRED GEOGRAPHY */}
      {activeTab === 'locations' && (
        <div className="grid md:grid-cols-3 gap-6">
          {SACRED_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                  {loc.region}
                </span>
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {loc.name}
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-serif italic mt-1">
                  "{loc.typologicalMeaning}"
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Redemptive Events:
                </h4>
                <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  {loc.historicalEvents.map((evt, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl p-3 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  Fulfilled in Christ:
                </span>
                <p className="text-[11px] leading-relaxed">{loc.fulfillmentInChrist}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MESSIANIC PROPHECY MATRIX */}
      {activeTab === 'prophecies' && (
        <div className="space-y-6">
          <UnifiedHermeneuticsBanner referenceKey="Isaiah 53" />
          <ProphecyMatrix prophecies={MESSIANIC_PROPHECIES} />
        </div>
      )}
    </div>
  )
}
