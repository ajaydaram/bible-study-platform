import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Compass, 
  ChevronRight, 
  Check, 
  BookOpen, 
  Loader2, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Sparkles, 
  HelpCircle,
  Search
} from 'lucide-react'
import { thematicTopics, THEMATIC_CATEGORIES, type ThematicTopic } from '../../data/thematicPath'
import UnifiedHermeneuticsBanner from '../../components/UnifiedHermeneuticsBanner'

// Bible versions for the selector
const READING_VERSIONS = [
  { id: 'kjv', name: 'King James Version', abbr: 'KJV', source: 'bible-api' as const },
  { id: 'web', name: 'World English Bible', abbr: 'WEB', source: 'bible-api' as const },
  { id: 'ESV', name: 'English Standard Version', abbr: 'ESV', source: 'esv-api' as const },
] as const

const VERSION_STORAGE_KEY = 'scriptorium_reading_version'
const STORAGE_KEY = 'scriptorium_thematic_progress'

interface TopicProgress {
  completed: boolean
  notes: string
}

export default function ThematicPath() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(thematicTopics[0].id)
  const [activePassageIndex, setActivePassageIndex] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({})
  const [passage, setPassage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(() => {
    return localStorage.getItem(VERSION_STORAGE_KEY) || 'kjv'
  })

  const currentTopic: ThematicTopic = thematicTopics.find(t => t.id === selectedTopicId) || thematicTopics[0]
  const activePassageRef = currentTopic.passages[activePassageIndex] || currentTopic.passages[0]

  const completedCount = Object.values(progress).filter(p => p.completed).length
  const progressPercent = Math.round((completedCount / thematicTopics.length) * 100)

  // Filter topics by category and search
  const filteredTopics = thematicTopics.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    const matchesSearch = !searchQuery.trim() || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.passages.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setProgress(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (currentTopic) {
      const topicProgress = progress[currentTopic.id]
      setNotes(topicProgress?.notes || '')
      setActivePassageIndex(0)
    }
  }, [selectedTopicId])

  useEffect(() => {
    if (currentTopic && activePassageRef) {
      fetchPassageWithVersion(selectedVersion, activePassageRef)
      if (isPlayingAudio) {
        window.speechSynthesis?.cancel()
        setIsPlayingAudio(false)
      }
    }
  }, [selectedTopicId, activePassageIndex, selectedVersion])

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version)
    localStorage.setItem(VERSION_STORAGE_KEY, version)
  }

  const fetchPassageWithVersion = async (version: string, ref: string) => {
    setIsLoading(true)
    try {
      const versionConfig = READING_VERSIONS.find(v => v.id === version)
      
      if (versionConfig?.source === 'esv-api') {
        const response = await fetch(
          `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-passage-references=false&include-verse-numbers=true&include-footnotes=false&include-headings=false&include-short-copyright=false`,
          { headers: { 'Authorization': `Token ${import.meta.env.VITE_ESV_API_KEY}` } }
        )
        if (response.ok) {
          const data = await response.json()
          setPassage(data.passages?.[0] || 'Passage text not available.')
        }
      } else {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=${version}`)
        if (response.ok) {
          const data = await response.json()
          if (data.verses && data.verses.length > 0) {
            const formatted = data.verses.map((v: any) => `[${v.verse}] ${v.text.trim()}`).join('\n')
            setPassage(formatted)
          } else {
            setPassage(data.text || '')
          }
        }
      }
    } catch {
      setPassage('Unable to load passage. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSpeechPlayback = () => {
    if (!('speechSynthesis' in window)) return

    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
    } else {
      const cleanText = passage.replace(/\[\d+\]/g, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.95
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      window.speechSynthesis.speak(utterance)
      setIsPlayingAudio(true)
    }
  }

  const saveProgress = (newProgress: Record<string, TopicProgress>) => {
    setProgress(newProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
  }

  const toggleComplete = () => {
    if (!currentTopic) return
    const isAlreadyComplete = progress[currentTopic.id]?.completed
    const newProgress = {
      ...progress,
      [currentTopic.id]: { completed: !isAlreadyComplete, notes }
    }
    saveProgress(newProgress)
  }

  const saveNotes = () => {
    if (!currentTopic) return
    const newProgress = {
      ...progress,
      [currentTopic.id]: { ...progress[currentTopic.id], notes }
    }
    saveProgress(newProgress)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-semibold text-purple-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Kingdom Thematic Path</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Biblical Theology & Key Themes Explorer
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Trace foundational doctrines across Scripture from Old Testament shadows to their climax in <strong>Jesus Christ</strong> and ultimate consummation.
          </p>
        </div>
      </div>

      {/* Progress & Category Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-700 dark:text-gray-300">
              Thematic Mastery Progress
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono">
              {completedCount} / {thematicTopics.length} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {THEMATIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes or passages..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Topics List */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Biblical Themes ({filteredTopics.length})
          </h2>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopicId === topic.id
              const isDone = progress[topic.id]?.completed

              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-xs'
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : topic.order}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs font-bold truncate ${
                        isSelected
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {topic.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 block truncate">
                      {topic.passages[0]} • {topic.passages.length} passages
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8 space-y-6">
          {currentTopic && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
              {/* Topic Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                    Theme #{currentTopic.order}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentTopic.title}
                  </h2>
                </div>

                <button
                  onClick={toggleComplete}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    progress[currentTopic.id]?.completed
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{progress[currentTopic.id]?.completed ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>

              {/* Theme Overview & Unified Hermeneutics */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentTopic.description}
                </p>
                <UnifiedHermeneuticsBanner referenceKey={currentTopic.passages.join(', ')} />
              </div>

              {/* CHRISTOLOGICAL TRAJECTORY CARD ("Shadow to Reality") */}
              {currentTopic.theologicalTrajectory && (
                <div className="bg-purple-50/60 dark:bg-purple-950/30 rounded-3xl p-5 border border-purple-100 dark:border-purple-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Redemptive Trajectory: From Old Testament Shadow to Christ</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-purple-100 dark:border-purple-900/50 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block">
                        1. OT Shadow / Promise:
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 leading-snug">
                        {currentTopic.theologicalTrajectory.otShadow}
                      </p>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 block">
                        2. Christ's Fulfillment:
                      </span>
                      <p className="text-gray-800 dark:text-gray-200 font-semibold leading-snug">
                        {currentTopic.theologicalTrajectory.christFulfillment}
                      </p>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-purple-100 dark:border-purple-900/50 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block">
                        3. Eternal Consummation:
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 leading-snug">
                        {currentTopic.theologicalTrajectory.consummation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MULTI-PASSAGE CAROUSEL & SELECTOR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Key Scripture Passages ({currentTopic.passages.length})
                  </h3>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Click any passage to read
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentTopic.passages.map((p, idx) => (
                    <button
                      key={p}
                      onClick={() => setActivePassageIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activePassageIndex === idx
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SCRIPTURE READING STUDIO */}
              <div className="bg-gray-50 dark:bg-gray-850 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-purple-700 dark:text-purple-300">
                      📖 {activePassageRef}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Audio Speech Button */}
                    <button
                      onClick={toggleSpeechPlayback}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                      }`}
                      title="Listen to scripture reading"
                    >
                      {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
                    </button>

                    {/* Version Selector */}
                    <select
                      value={selectedVersion}
                      onChange={(e) => handleVersionChange(e.target.value)}
                      className="px-2.5 py-1.5 bg-white dark:bg-gray-750 border border-gray-300 dark:border-gray-650 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                    >
                      {READING_VERSIONS.map(v => (
                        <option key={v.id} value={v.id}>{v.abbr}</option>
                      ))}
                    </select>

                    {/* Open in Bible Reader Bridge */}
                    <Link
                      to={`/bible?ref=${encodeURIComponent(activePassageRef.split(' ')[0] + ' ' + (activePassageRef.split(' ')[1] || '1'))}`}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Study in Reader</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-2">
                    <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
                    <p className="text-xs text-gray-500 font-medium">Loading Scripture text...</p>
                  </div>
                ) : (
                  <div className="scripture-text max-h-72 overflow-y-auto pr-2 space-y-2 text-xs sm:text-sm leading-relaxed">
                    {passage.split('\n').map((line, idx) => {
                      const trimmed = line.trim()
                      if (!trimmed) return null
                      const match = trimmed.match(/^\[(\d+)\]\s*(.*)/)
                      if (match) {
                        const [, verseNum, text] = match
                        return (
                          <p key={idx} className="text-gray-800 dark:text-gray-200 flex items-start gap-2">
                            <span className="inline-flex items-center justify-center text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700/60 rounded px-1.5 py-0.5 shrink-0 select-none mt-0.5 shadow-xs">
                              {verseNum}
                            </span>
                            <span>{text}</span>
                          </p>
                        )
                      }
                      return (
                        <p key={idx} className="text-gray-800 dark:text-gray-200">
                          {line}
                        </p>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* GUIDED REFLECTION QUESTIONS */}
              {currentTopic.reflectionQuestions && currentTopic.reflectionQuestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    <span>Exegetical & Heart Reflection Prompts</span>
                  </h4>
                  <div className="space-y-1.5">
                    {currentTopic.reflectionQuestions.map((q, i) => (
                      <div key={i} className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30 text-xs text-gray-800 dark:text-gray-200 font-medium">
                        • {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTES */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Your Thematic Study Notes
                </h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={saveNotes}
                  rows={4}
                  placeholder="Record what the Holy Spirit is teaching you through this theme..."
                  className="w-full p-4 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[10px] text-gray-400 block text-right">
                  Notes are automatically saved to your browser storage.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
