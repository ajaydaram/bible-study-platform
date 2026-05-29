import { useState, useEffect } from 'react'
import { Compass, ChevronRight, Check, BookOpen, Loader2 } from 'lucide-react'
import { thematicTopics } from '../../data/thematicPath'
import clsx from 'clsx'

// Bible versions for the selector
const READING_VERSIONS = [
  { id: 'kjv', name: 'King James Version', abbr: 'KJV', source: 'bible-api' as const },
  { id: 'web', name: 'World English Bible', abbr: 'WEB', source: 'bible-api' as const },
  { id: 'ESV', name: 'English Standard Version', abbr: 'ESV', source: 'esv-api' as const },
] as const

const VERSION_STORAGE_KEY = 'scriptorium_reading_version'

interface TopicProgress {
  completed: boolean
  notes: string
}

const STORAGE_KEY = 'scriptorium_thematic_progress'

export default function ThematicPath() {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({})
  const [passage, setPassage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [selectedVersion, setSelectedVersion] = useState(() => {
    return localStorage.getItem(VERSION_STORAGE_KEY) || 'kjv'
  })

  const currentTopic = selectedTopic !== null ? thematicTopics[selectedTopic] : null
  const completedCount = Object.values(progress).filter(p => p.completed).length
  const progressPercent = Math.round((completedCount / thematicTopics.length) * 100)

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
      fetchPassage()
    }
  }, [selectedTopic])

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version)
    localStorage.setItem(VERSION_STORAGE_KEY, version)
    // Re-fetch passage with new version
    if (currentTopic) {
      fetchPassageWithVersion(version)
    }
  }

  const fetchPassageWithVersion = async (version: string) => {
    if (!currentTopic?.passages?.length) return
    
    setIsLoading(true)
    try {
      const ref = currentTopic.passages[0]
      const versionConfig = READING_VERSIONS.find(v => v.id === version)
      
      if (versionConfig?.source === 'esv-api') {
        const response = await fetch(
          `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-passage-references=false&include-verse-numbers=true&include-footnotes=false&include-headings=false&include-short-copyright=false`,
          { headers: { 'Authorization': `Token ${import.meta.env.VITE_ESV_API_KEY}` } }
        )
        if (response.ok) {
          const data = await response.json()
          setPassage(data.passages?.[0] || 'Failed to load passage.')
        }
      } else {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=${version}`)
        if (response.ok) {
          const data = await response.json()
          setPassage(data.text)
        }
      }
    } catch {
      setPassage('Failed to load passage.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPassage = async () => {
    fetchPassageWithVersion(selectedVersion)
  }

  const saveProgress = (newProgress: Record<string, TopicProgress>) => {
    setProgress(newProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
  }

  const markComplete = () => {
    if (!currentTopic) return
    const newProgress = {
      ...progress,
      [currentTopic.id]: { completed: true, notes }
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Compass className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kingdom Path (Thematic)
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore the Bible through key themes
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Topics Completed
          </span>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {completedCount} / {thematicTopics.length} ({progressPercent}%)
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics list */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topics</h2>
          <div className="space-y-2">
            {thematicTopics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(index)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  selectedTopic === index
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                )}
              >
                <div className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  progress[topic.id]?.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}>
                  {progress[topic.id]?.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    topic.order
                  )}
                </div>
                <span className={clsx(
                  'font-medium flex-1',
                  selectedTopic === index
                    ? 'text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300'
                )}>
                  {topic.title}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Topic detail */}
        <div className="lg:col-span-2">
          {currentTopic ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Topic header */}
              <div className={clsx(
                'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
                progress[currentTopic.id]?.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-purple-50 dark:bg-purple-900/20'
              )}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentTopic.title}
                  </h2>
                  {progress[currentTopic.id]?.completed && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">{currentTopic.description}</p>
              </div>

              {/* Passages */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Key Passages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentTopic.passages.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Passage text */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Scripture Reading</h3>
                  </div>
                  <select
                    value={selectedVersion}
                    onChange={(e) => handleVersionChange(e.target.value)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {READING_VERSIONS.map(v => (
                      <option key={v.id} value={v.id}>{v.abbr}</option>
                    ))}
                  </select>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading Scripture...</p>
                  </div>
                ) : (
                  <div className="scripture-text max-h-64 overflow-y-auto pr-2 animate-fade-in">
                    <p className="leading-[2] text-gray-700 dark:text-gray-300">{passage}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={saveNotes}
                  placeholder="Write your reflections on this theme..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                {!progress[currentTopic.id]?.completed ? (
                  <button
                    onClick={markComplete}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Check className="h-5 w-5" />
                    Mark as Complete
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedTopic(prev => prev !== null && prev < thematicTopics.length - 1 ? prev + 1 : prev)}
                    disabled={selectedTopic === thematicTopics.length - 1}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Continue to Next Topic
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Compass className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a Topic
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a topic from the list to begin exploring
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
