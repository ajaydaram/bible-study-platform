import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getReadingProgress, saveReadingProgress } from '../../lib/firestore'
import { 
  biblicalEras, 
  getDayReading, 
  getCurrentEra,
  getEraProgress,
  getOverallProgress
} from '../../data/biblicalEras'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  BookOpen, 
  MessageCircle, 
  Heart,
  PenTool,
  Tag,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Bible versions for the selector (bible-api.com translations + our API versions)
const READING_VERSIONS = [
  { id: 'kjv', name: 'King James Version', abbr: 'KJV', source: 'bible-api' as const },
  { id: 'web', name: 'World English Bible', abbr: 'WEB', source: 'bible-api' as const },
  { id: 'ESV', name: 'English Standard Version', abbr: 'ESV', source: 'esv-api' as const },
] as const

const VERSION_STORAGE_KEY = 'scriptorium_reading_version'

// Cache for Bible text to avoid re-fetching (keyed by day + version)
const bibleTextCache: Record<string, string> = {}

export default function ChronologicalPath() {
  const { user } = useAuth()
  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEras, setShowEras] = useState(false)
  const [bibleText, setBibleText] = useState<string>('')
  const [loadingBible, setLoadingBible] = useState(false)
  const [showBibleText, setShowBibleText] = useState(false) // Lazy load Bible text
  const [selectedVersion, setSelectedVersion] = useState(() => {
    return localStorage.getItem(VERSION_STORAGE_KEY) || 'kjv'
  })

  const dayReading = getDayReading(currentDay)
  const currentEra = getCurrentEra(currentDay)
  const eraProgress = currentEra ? getEraProgress(currentDay, currentEra.id) : null
  const overallProgress = getOverallProgress(completedDays)

  // Reset Bible text display when day or version changes (but keep cache)
  useEffect(() => {
    const cacheKey = `${currentDay}-${selectedVersion}`
    // If cached, show immediately; otherwise reset to load button
    if (bibleTextCache[cacheKey]) {
      setBibleText(bibleTextCache[cacheKey])
      setShowBibleText(true)
    } else {
      setShowBibleText(false)
      setBibleText('')
    }
  }, [currentDay, selectedVersion])

  // Save version preference
  const handleVersionChange = (version: string) => {
    setSelectedVersion(version)
    localStorage.setItem(VERSION_STORAGE_KEY, version)
    setShowBibleText(false) // Reset to trigger re-fetch
  }

  // Load progress from Firestore
  useEffect(() => {
    async function loadProgress() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const progress = await getReadingProgress(user.id, 'chronological')
        const completed: number[] = []
        const notesData: Record<number, string> = {}

        Object.entries(progress).forEach(([day, data]) => {
          const dayNum = parseInt(day)
          if (data.completed) completed.push(dayNum)
          if (data.notes) notesData[dayNum] = data.notes
        })

        setCompletedDays(completed)
        setNotes(notesData)

        // Set current day to first incomplete day
        const maxCompleted = Math.max(0, ...completed)
        setCurrentDay(Math.min(maxCompleted + 1, 502))
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [user?.id])

  // Fetch Bible text when day changes AND user wants to read
  useEffect(() => {
    async function fetchBibleText() {
      if (!dayReading || !showBibleText) return
      
      const cacheKey = `${currentDay}-${selectedVersion}`
      
      // Check cache first
      if (bibleTextCache[cacheKey]) {
        setBibleText(bibleTextCache[cacheKey])
        return
      }
      
      setLoadingBible(true)
      setBibleText('')
      
      const version = READING_VERSIONS.find(v => v.id === selectedVersion)
      
      try {
        // Fetch all passages in PARALLEL for speed
        const fetchPromises = dayReading.scripture.map(async (passage) => {
          try {
            const cleanPassage = passage.trim()
            
            if (version?.source === 'esv-api') {
              // Use ESV API
              const response = await fetch(
                `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(cleanPassage)}&include-passage-references=true&include-verse-numbers=true&include-footnotes=false&include-headings=false&include-short-copyright=false`,
                { headers: { 'Authorization': `Token ${import.meta.env.VITE_ESV_API_KEY}` } }
              )
              if (response.ok) {
                const data = await response.json()
                if (data.passages?.[0]) {
                  return { passage, reference: data.canonical, text: data.passages[0] }
                }
              }
            } else {
              // Use bible-api.com
              const response = await fetch(
                `https://bible-api.com/${encodeURIComponent(cleanPassage)}?translation=${selectedVersion}`
              )
              
              if (response.ok) {
                const data = await response.json()
                if (data.text) {
                  return { passage, reference: data.reference, text: data.text }
                }
              }
            }
          } catch (err) {
            console.error(`Error fetching ${passage}:`, err)
          }
          return null
        })
        
        const results = await Promise.all(fetchPromises)
        const textParts = results
          .filter((r): r is { passage: string; reference: string; text: string } => r !== null)
          .map(r => `\n\n📖 ${r.reference}\n\n${r.text}`)
        
        if (textParts.length > 0) {
          const text = textParts.join('\n')
          bibleTextCache[cacheKey] = text // Cache it
          setBibleText(text)
        } else {
          setBibleText('Unable to load passages. You can read these passages in your Bible:\n\n• ' + dayReading.scripture.join('\n• '))
        }
      } catch (error) {
        console.error('Error fetching Bible text:', error)
        setBibleText('Unable to load passages. You can read these passages in your Bible:\n\n• ' + dayReading.scripture.join('\n• '))
      } finally {
        setLoadingBible(false)
      }
    }

    fetchBibleText()
  }, [currentDay, dayReading, showBibleText, selectedVersion])

  const markComplete = async () => {
    if (!user?.id || !dayReading) return

    setSaving(true)
    try {
      const newCompleted = completedDays.includes(currentDay)
        ? completedDays.filter(d => d !== currentDay)
        : [...completedDays, currentDay]

      await saveReadingProgress(user.id, 'chronological', currentDay, {
        completed: !completedDays.includes(currentDay),
        notes: notes[currentDay] || ''
      })

      setCompletedDays(newCompleted)
    } catch (error) {
      console.error('Error saving progress:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveNotes = async (noteText: string) => {
    if (!user?.id) return

    setNotes(prev => ({ ...prev, [currentDay]: noteText }))

    try {
      await saveReadingProgress(user.id, 'chronological', currentDay, {
        completed: completedDays.includes(currentDay),
        notes: noteText
      })
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Era Info */}
      <div className={`${currentEra?.color || 'bg-primary-600'} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentEra?.icon}</span>
            <div>
              <p className="text-white/80 text-sm">502-Day Deep Dive</p>
              <h1 className="text-2xl font-bold">{currentEra?.name}</h1>
            </div>
          </div>
          <button
            onClick={() => setShowEras(!showEras)}
            className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            View All Eras
            {showEras ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Era Progress</span>
              <span>{eraProgress?.current}/{eraProgress?.total} days</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${eraProgress?.percentage || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress.current}/502 days ({overallProgress.percentage}%)</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/70 transition-all duration-300"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Eras Dropdown */}
      {showEras && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Biblical Eras</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {biblicalEras.map(era => {
              const isActive = era.id === currentEra?.id
              const hasStarted = completedDays.some(d => d >= era.startDay && d <= era.endDay)
              
              return (
                <button
                  key={era.id}
                  onClick={() => {
                    setCurrentDay(era.startDay)
                    setShowEras(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-all ${
                    isActive 
                      ? `${era.color} text-white` 
                      : hasStarted
                        ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-gray-50 dark:bg-gray-800 opacity-60'
                  }`}
                >
                  <span className="text-xl">{era.icon}</span>
                  <p className={`font-medium text-sm mt-1 ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {era.name}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    Days {era.startDay}-{era.endDay}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Day Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
          disabled={currentDay === 1}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Day {currentDay} of 502</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {dayReading?.title || 'Loading...'}
          </h2>
        </div>

        <button
          onClick={() => setCurrentDay(Math.min(502, currentDay + 1))}
          disabled={currentDay === 502}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {dayReading && (
        <>
          {/* Scripture Reference */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Today's Reading</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {dayReading.scripture.map(ref => (
                  <span key={ref} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                    {ref}
                  </span>
                ))}
              </div>
            </div>

            {/* Version Selector */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Version:</label>
              <select
                value={selectedVersion}
                onChange={(e) => handleVersionChange(e.target.value)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {READING_VERSIONS.map(v => (
                  <option key={v.id} value={v.id}>{v.abbr} - {v.name}</option>
                ))}
              </select>
            </div>

            {/* Bible Text - Beautiful Scripture Display */}
            <div className="scripture-text-container">
              {!showBibleText ? (
                <button
                  onClick={() => setShowBibleText(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <BookOpen className="h-5 w-5" />
                  Read Scripture ({READING_VERSIONS.find(v => v.id === selectedVersion)?.abbr})
                </button>
              ) : loadingBible ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Loading Scripture...</p>
                </div>
              ) : (
                <div className="scripture-text animate-fade-in">
                  {bibleText.split('\n\n').map((paragraph, idx) => (
                    <p 
                      key={idx} 
                      className={paragraph.startsWith('📖') 
                        ? 'text-lg font-semibold text-primary-700 dark:text-primary-400 mt-8 mb-4 first:mt-0' 
                        : 'leading-[2] mb-4'}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {dayReading.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Key Themes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Themes</h3>
            <div className="flex flex-wrap gap-2">
              {dayReading.keyThemes.map(theme => (
                <span 
                  key={theme}
                  className={`px-3 py-1 ${currentEra?.color || 'bg-primary-500'} text-white rounded-full text-sm`}
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Discussion Prompt */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-200">Discussion Prompt</h3>
            </div>
            <p className="text-amber-800 dark:text-amber-300 italic">
              "{dayReading.discussionPrompt}"
            </p>
            <Link 
              to="/groups" 
              className="inline-block mt-3 text-sm text-amber-700 dark:text-amber-400 hover:underline"
            >
              Share in Groups →
            </Link>
          </div>

          {/* Prayer Focus */}
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-6 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <h3 className="font-semibold text-rose-900 dark:text-rose-200">Prayer Focus</h3>
            </div>
            <p className="text-rose-800 dark:text-rose-300">
              {dayReading.prayerFocus}
            </p>
            <Link 
              to="/prayers" 
              className="inline-block mt-3 text-sm text-rose-700 dark:text-rose-400 hover:underline"
            >
              Add to Prayer List →
            </Link>
          </div>

          {/* Cross References */}
          {dayReading.crossReferences && dayReading.crossReferences.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Cross References</h3>
              <div className="flex flex-wrap gap-2">
                {dayReading.crossReferences.map(ref => (
                  <span 
                    key={ref}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <PenTool className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">My Notes</h3>
            </div>
            <textarea
              value={notes[currentDay] || ''}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder="Write your reflections on today's reading..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <Link 
                to={`/journal/new?tags=${encodeURIComponent(dayReading.tags.join(','))}&scripture=${encodeURIComponent(dayReading.scripture.join(','))}`}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Save to Journal →
              </Link>
              <span className="text-xs text-gray-500">Auto-saved</span>
            </div>
          </div>

          {/* Mark Complete Button */}
          <div className="flex justify-center">
            <button
              onClick={markComplete}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                completedDays.includes(currentDay)
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : completedDays.includes(currentDay) ? (
                <>
                  <Check className="h-5 w-5" />
                  Completed!
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Mark as Complete
                </>
              )}
            </button>
          </div>

          {/* Navigation to Next Day */}
          {completedDays.includes(currentDay) && currentDay < 502 && (
            <div className="text-center">
              <button
                onClick={() => setCurrentDay(currentDay + 1)}
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
              >
                Continue to Day {currentDay + 1}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
