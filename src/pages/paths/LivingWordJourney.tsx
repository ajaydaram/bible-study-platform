import { useState, useEffect } from 'react'
import {
  narrativeMovements,
  covenantNodes,
  personas,
  thematicThreads,
  redemptiveActs,
  getStoryById,
  getMovementForStory,
  BibleStory,
  PersonaId
} from '../../data/livingWordData'
import UnifiedHermeneuticsBanner from '../../components/UnifiedHermeneuticsBanner'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  PenTool,
  Compass,
  Users,
  Scroll
} from 'lucide-react'
import clsx from 'clsx'

const STORAGE_KEY = 'scriptorium_living_word_story_v1'
const COMPLETED_KEY = 'scriptorium_living_word_completed_v1'

export default function LivingWordJourney() {
  const [activeTab, setActiveTab] = useState<'stories' | 'acts' | 'covenants' | 'personas'>('stories')
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('disoriented-reader')

  const [currentStoryId, setCurrentStoryId] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved, 10) : 1
  })

  const [completedStories, setCompletedStories] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem(COMPLETED_KEY)
    return saved ? JSON.parse(saved) : {}
  })

  const [reflectionText, setReflectionText] = useState('')
  const [savedMessage, setSavedMessage] = useState(false)

  const currentStory: BibleStory = getStoryById(currentStoryId)
  const currentMovement = getMovementForStory(currentStoryId)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentStoryId.toString())
  }, [currentStoryId])

  const toggleComplete = (id: number) => {
    setCompletedStories((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2500)
  }

  const completedCount = Object.values(completedStories).filter(Boolean).length
  const progressPercent = Math.round((completedCount / 100) * 100)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            The Living Word Bible Journey • Full Master Dataset
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            One Unified Story from Genesis to Revelation
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Full integration of the Living Word framework: 100 Essential Redemptive Stories, 8 Redemptive Acts (1,189 chapters), 7 Covenant Nodes, and Persona-based discipleship modes.
          </p>

          {/* 4 Narrative Movements Progress Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {narrativeMovements.map((mov) => {
              const isActive = currentMovement.id === mov.id
              return (
                <div
                  key={mov.id}
                  className={clsx(
                    'p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all',
                    isActive
                      ? 'bg-emerald-900/80 border-emerald-500 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-500/50 scale-[1.02]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  )}
                >
                  <span className="text-base">{mov.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[11px] truncate">{mov.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Stories {mov.range[0]}–{mov.range[1]}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-4">
        <button
          onClick={() => setActiveTab('stories')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'stories'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <BookOpen className="w-4 h-4" />
          100-Story Journey
        </button>

        <button
          onClick={() => setActiveTab('acts')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'acts'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Compass className="w-4 h-4" />
          8 Redemptive Acts (1,189 Chapters)
        </button>

        <button
          onClick={() => setActiveTab('covenants')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'covenants'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Scroll className="w-4 h-4" />
          7 Covenant Nodes
        </button>

        <button
          onClick={() => setActiveTab('personas')}
          className={clsx(
            'pb-3 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors',
            activeTab === 'personas'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <Users className="w-4 h-4" />
          Learner Personas & Threads
        </button>
      </div>

      {/* TAB 1: 100-STORY JOURNEY */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          {/* Stepper Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStoryId((prev) => Math.max(1, prev - 1))}
                disabled={currentStoryId === 1}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Story
              </button>

              <div className="text-center">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {currentMovement.icon} {currentMovement.label} Movement
                </span>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  Story {currentStoryId} of 100: {currentStory.title}
                </h2>
              </div>

              <button
                onClick={() => setCurrentStoryId((prev) => Math.min(100, prev + 1))}
                disabled={currentStoryId === 100}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-md transition-colors disabled:opacity-40"
              >
                Next Story
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-semibold">
                <span>Overall Redemptive Journey Progress</span>
                <span>{completedCount} / 100 Completed ({progressPercent}%)</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Story Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 sm:p-8 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-mono font-semibold">
                  {currentStory.category} • {currentStory.reference}
                </span>
                <button
                  onClick={() => toggleComplete(currentStory.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                    completedStories[currentStory.id]
                      ? 'bg-emerald-400 text-slate-950 shadow-md'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completedStories[currentStory.id] ? 'Completed!' : 'Mark Story Complete'}
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentStory.title}
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-serif italic">
                "{currentStory.context}"
              </p>
            </div>

            {/* UNIFIED HERMENEUTICAL TRIAD BANNER */}
            <div className="px-6 pt-4">
              <UnifiedHermeneuticsBanner referenceKey={currentStory.reference} />
            </div>

            {/* Reflection & Discipleship Action */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Living Word Daily Discipleship Reflection
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  How does this story in {currentStory.reference} reveal God’s covenant faithfulness and point forward to Jesus Christ?
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Record your reflection on this redemptive story..."
                    className="flex-1 bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSaveReflection}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    {savedMessage ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setCurrentStoryId(1)}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start from Story 1 (Genesis)</span>
                </button>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono text-gray-600 dark:text-gray-400">
                    Redemptive Narrative Arc
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 8 REDEMPTIVE ACTS */}
      {activeTab === 'acts' && (
        <div className="grid md:grid-cols-2 gap-4">
          {redemptiveActs.map((act) => (
            <div
              key={act.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-mono font-bold">
                  {act.chapterCount} Chapters
                </span>
                <span className="text-xs font-serif italic text-gray-500 dark:text-gray-400">
                  {act.covenantFocus}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {act.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {act.subtitle}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {act.focus}
              </p>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-500">
                <span>Books: {act.keyBooks.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: 7 COVENANT NODES */}
      {activeTab === 'covenants' && (
        <div className="space-y-4">
          {covenantNodes.map((node, index) => (
            <div
              key={node.label}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 flex items-start gap-4 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {index + 1}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {node.label}
                  </h3>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono">
                    {node.scripture}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {node.description}
                </p>
                <span className="inline-block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  Stories {node.range[0]}–{node.range[1]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: PERSONAS & THEMATIC THREADS */}
      {activeTab === 'personas' && (
        <div className="space-y-8">
          {/* Personas */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Learner Personas Framework
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {personas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={clsx(
                    'p-5 rounded-2xl border cursor-pointer transition-all space-y-2',
                    selectedPersona === p.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  )}
                >
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.label}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{p.description}</p>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-[11px] text-emerald-600 font-semibold">
                    Emphasis: {p.emphasis}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thematic Threads */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Curated Thematic Reading Threads
            </h3>
            <div className="space-y-3">
              {thematicThreads.map((thread) => (
                <div
                  key={thread.title}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">
                      {thread.title}
                    </h4>
                    <span className="text-xs font-serif italic text-emerald-600 dark:text-emerald-400">
                      {thread.theme}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{thread.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-gray-500">Key Checkpoints:</span>
                    {thread.storyIds.map((sid) => (
                      <button
                        key={sid}
                        onClick={() => {
                          setCurrentStoryId(sid)
                          setActiveTab('stories')
                        }}
                        className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded text-xs font-bold hover:bg-emerald-200"
                      >
                        Story {sid}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
