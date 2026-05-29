import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  BookOpen,
  Calendar,
  Save
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  ReadingPlan,
  ReadingPlanDay,
  createReadingPlan,
  planTemplates,
  generateBibleInYearPlan
} from '../lib/readingPlans'

const categories: { value: ReadingPlan['category']; label: string }[] = [
  { value: 'bible-in-year', label: 'Bible in a Year' },
  { value: 'book-study', label: 'Book Study' },
  { value: 'topical', label: 'Topical' },
  { value: 'devotional', label: 'Devotional' },
  { value: 'custom', label: 'Custom' }
]

export default function ReadingPlanNew() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const template = searchParams.get('template')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ReadingPlan['category']>('custom')
  const [duration, setDuration] = useState(30)
  const [days, setDays] = useState<ReadingPlanDay[]>([])
  const [isPublic, _setIsPublic] = useState(false)
  const [tags, setTags] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Initialize from template if provided
    if (template && planTemplates[template as keyof typeof planTemplates]) {
      const t = planTemplates[template as keyof typeof planTemplates]
      setTitle(t.title)
      setDescription(t.description)
      setDuration(t.duration)
      setCategory(t.category)

      // Generate days for Bible in a Year
      if (template === 'bible-in-year') {
        setDays(generateBibleInYearPlan())
      } else {
        // Generate empty days
        setDays(Array.from({ length: t.duration }, (_, i) => ({
          day: i + 1,
          passages: [],
          title: `Day ${i + 1}`
        })))
      }
    }
  }, [template])

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    
    // Adjust days array
    if (newDuration > days.length) {
      const newDays = [...days]
      for (let i = days.length + 1; i <= newDuration; i++) {
        newDays.push({
          day: i,
          passages: [],
          title: `Day ${i}`
        })
      }
      setDays(newDays)
    } else {
      setDays(days.slice(0, newDuration))
    }
  }

  const updateDay = (index: number, updates: Partial<ReadingPlanDay>) => {
    const newDays = [...days]
    newDays[index] = { ...newDays[index], ...updates }
    setDays(newDays)
  }

  const addPassageToDay = (dayIndex: number) => {
    const newDays = [...days]
    newDays[dayIndex].passages.push('')
    setDays(newDays)
  }

  const updatePassage = (dayIndex: number, passageIndex: number, value: string) => {
    const newDays = [...days]
    newDays[dayIndex].passages[passageIndex] = value
    setDays(newDays)
  }

  const removePassage = (dayIndex: number, passageIndex: number) => {
    const newDays = [...days]
    newDays[dayIndex].passages.splice(passageIndex, 1)
    setDays(newDays)
  }

  const handleSave = () => {
    if (!user || !title.trim()) return

    setIsSaving(true)

    createReadingPlan(
      user.id,
      user.name || 'Anonymous',
      title.trim(),
      description.trim(),
      duration,
      category,
      days,
      isPublic,
      tags.split(',').map(t => t.trim()).filter(Boolean)
    )

    navigate('/reading-plans')
  }

  const initializeDays = () => {
    const newDays: ReadingPlanDay[] = Array.from({ length: duration }, (_, i) => ({
      day: i + 1,
      passages: [],
      title: `Day ${i + 1}`
    }))
    setDays(newDays)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Reading Plan
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Design your custom Bible reading plan
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Plan Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Through the Gospels"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your reading plan..."
            rows={3}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ReadingPlan['category'])}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={duration}
              onChange={e => handleDurationChange(parseInt(e.target.value) || 1)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g., gospels, beginners, daily"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Days */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Readings
          </h2>
          {days.length === 0 && (
            <button
              onClick={initializeDays}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Initialize Days
            </button>
          )}
        </div>

        {days.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {days.map((day, dayIndex) => (
              <div
                key={day.day}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Day {day.day}
                  </h4>
                  <input
                    type="text"
                    value={day.title || ''}
                    onChange={e => updateDay(dayIndex, { title: e.target.value })}
                    placeholder="Optional title"
                    className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  {day.passages.map((passage, passageIndex) => (
                    <div key={passageIndex} className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={passage}
                        onChange={e => updatePassage(dayIndex, passageIndex, e.target.value)}
                        placeholder="e.g., Genesis 1-2 or Matthew 5"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => removePassage(dayIndex, passageIndex)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPassageToDay(dayIndex)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add passage
                  </button>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={day.notes || ''}
                    onChange={e => updateDay(dayIndex, { notes: e.target.value })}
                    placeholder="Optional notes for this day..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Click "Initialize Days" to create {duration} days for your plan
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim() || isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Create Plan
        </button>
      </div>
    </div>
  )
}
