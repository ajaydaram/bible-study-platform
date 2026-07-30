import { useState } from 'react'
import { redemptiveEpochs } from '../data/redemptiveEpochs'
import OrganicRevelationTree from '../components/OrganicRevelationTree'
import CallAndResponseModal from '../components/CallAndResponseModal'
import { isEpochUnlocked, getSharedEcclesialResponses } from '../data/callAndResponseData'
import {
  Compass,
  BookOpen,
  ChevronRight,
  Sparkles,
  Scroll,
  Layers,
  ArrowRight,
  Lock,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export default function EpochProgression() {
  const [selectedEpochId, setSelectedEpochId] = useState<string>('pre-fall')
  const [modalTargetEpochId, setModalTargetEpochId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const currentEpoch = redemptiveEpochs.find((e) => e.id === selectedEpochId) || redemptiveEpochs[0]

  const handleSelectEpoch = (epochId: string) => {
    if (isEpochUnlocked(epochId)) {
      setSelectedEpochId(epochId)
    } else {
      // Prompt modal to unlock
      setModalTargetEpochId(epochId)
    }
  }

  const handleModalSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    if (modalTargetEpochId) {
      setSelectedEpochId(modalTargetEpochId)
    }
  }

  return (
    <div key={refreshKey} className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
            <Compass className="w-4 h-4 text-indigo-400" />
            Geerhardus Vos Redemptive-Historical Architecture
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            The 5 Redemptive Epochs of Revelation
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Special revelation is not a static textbook of isolated dogmas, but an organic, historical unfolding of God’s covenantal self-disclosure. Journey through the five distinct stages from Eden to New Creation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-indigo-200 font-medium">
            <div className="flex items-center gap-1.5 bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-700/50">
              <Scroll className="w-4 h-4 text-amber-400" />
              <span>Organic Growth of Truth</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-700/50">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Covenantal Progress</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-900/60 px-3 py-1.5 rounded-lg border border-indigo-700/50">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Fulfilled in Christ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Organic Tree Visualizer Component */}
      <OrganicRevelationTree />

      {/* Epoch Stepper Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {redemptiveEpochs.map((epoch) => {
          const isSelected = epoch.id === selectedEpochId
          const unlocked = isEpochUnlocked(epoch.id)

          return (
            <button
              key={epoch.id}
              onClick={() => handleSelectEpoch(epoch.id)}
              className={clsx(
                'flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden',
                isSelected
                  ? 'bg-white dark:bg-gray-800 border-indigo-600 dark:border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 scale-[1.02]'
                  : unlocked
                  ? 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800'
                  : 'bg-gray-100/80 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 opacity-85 hover:border-indigo-400'
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
                      : unlocked
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  {epoch.number}
                </span>

                <div className="flex items-center gap-1">
                  {!unlocked && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                  <span className="text-xl">{epoch.icon}</span>
                </div>
              </div>

              <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                {epoch.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-mono">
                {unlocked ? epoch.timeline : 'Unlock via Response'}
              </p>

              {/* Selection indicator bar */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Epoch Detail Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        {/* Epoch Banner Header */}
        <div className={clsx('p-6 sm:p-8 text-white bg-gradient-to-r', currentEpoch.color.gradient)}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              Epoch {currentEpoch.number} of 5 • {currentEpoch.timeline}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/typology"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg transition-colors"
              >
                <span>View Typology Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <span>{currentEpoch.icon}</span>
            <span>{currentEpoch.title}</span>
          </h2>
          <p className="text-white/90 text-sm sm:text-base mt-2 font-medium">
            {currentEpoch.subtitle}
          </p>
        </div>

        {/* Detailed Content Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Overview & Geerhardus Vos Insight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Description */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Redemptive-Historical Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                {currentEpoch.description}
              </p>

              {/* Key Themes Badges */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Dominant Redemptive Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentEpoch.keyThemes.map((theme) => (
                    <span
                      key={theme}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Geerhardus Vos Theological Insight Callout */}
            <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Vosian Insight
              </div>
              <blockquote className="text-sm font-serif italic text-slate-200 leading-relaxed">
                "{currentEpoch.vosianInsight}"
              </blockquote>
              <p className="text-xs font-semibold text-slate-400 pt-2 border-t border-slate-800">
                — Geerhardus Vos, <span className="italic">Biblical Theology: Old and New Testaments</span>
              </p>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Covenants & Primary Passages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Covenants */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Scroll className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Covenantal Administrations
              </h3>
              <ul className="space-y-2">
                {currentEpoch.keyCovenants.map((cov) => (
                  <li
                    key={cov}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-800 dark:text-gray-200 shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {cov}
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Scripture Passages */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Primary Anchor Passages
              </h3>
              <div className="space-y-2">
                {currentEpoch.primaryPassages.map((pas) => (
                  <Link
                    key={pas.reference}
                    to="/bible"
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {pas.title}
                      </h4>
                      <span className="text-xs text-gray-500 font-mono">{pas.reference}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Shadows and Types in this Epoch */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Shadows & Types Foreshadowed in this Epoch
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentEpoch.shadowsAndTypes.map((typeItem, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-indigo-900 dark:text-indigo-300 bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-sm"
                >
                  <span className="text-indigo-500 font-bold">▪</span>
                  <span>{typeItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecclesial Community Discipleship Responses for this Epoch */}
          {(() => {
            const sharedResponses = getSharedEcclesialResponses(selectedEpochId)
            if (sharedResponses.length === 0) return null

            return (
              <div className="bg-amber-950/20 border border-amber-800/40 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Covenant Community Responses for {currentEpoch.title}
                  </h3>
                  <Link
                    to="/groups"
                    className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Group Feed</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sharedResponses.slice(0, 2).map((res) => (
                    <div
                      key={res.id}
                      className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-200"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-400">
                        <span className="text-amber-300">{res.authorName}</span>
                        <span className="uppercase text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                          {res.responseType}
                        </span>
                      </div>
                      <p className="italic font-serif text-slate-300">"{res.responseText}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Call and Response Modal */}
      {modalTargetEpochId && (
        <CallAndResponseModal
          targetEpochId={modalTargetEpochId}
          isOpen={!!modalTargetEpochId}
          onClose={() => setModalTargetEpochId(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}
