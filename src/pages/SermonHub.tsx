import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getSermons, deleteSermon } from '../lib/firestore'
import type { Sermon } from '../types'
import { format } from 'date-fns'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Lightbulb,
  Mic,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import clsx from 'clsx'

const stageInfo = {
  exegesis: { label: 'Exegesis', icon: BookOpen, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  theology: { label: 'Theology', icon: Lightbulb, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  homiletics: { label: 'Homiletics', icon: Mic, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  complete: { label: 'Complete', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' }
}

export default function SermonHub() {
  const { user } = useAuth()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSermons() {
      if (!user?.id) return
      try {
        const data = await getSermons(user.id)
        setSermons(data)
      } catch (error) {
        console.error('Error fetching sermons:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSermons()
  }, [user?.id])

  const handleDelete = async (id: string) => {
    try {
      await deleteSermon(id)
      setSermons(prev => prev.filter(s => s.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting sermon:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sermon Preparation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Craft expository sermons through exegesis, theology, and homiletics
          </p>
        </div>
        <Link
          to="/sermons/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Sermon
        </Link>
      </div>

      {/* Process Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          The Expository Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">1. Exegesis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover the time-bound truth. Use the 6 friends (Who, What, Why, When, Where, How) 
                to understand the author's intent.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Lightbulb className="h-6 w-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">2. Theology</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Abstract the timeless truth. Move from concrete, specific, time-bound to abstract, 
                broad, and timeless principles.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Mic className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">3. Homiletics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apply the timely truth. Address 3 questions: Explain it, Prove it, Apply it.
                Shape for your audience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sermons List */}
      {sermons.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No sermons yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start preparing your first expository sermon
          </p>
          <Link
            to="/sermons/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
            Create Sermon
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sermons.map((sermon) => {
            const stage = stageInfo[sermon.stage]
            const StageIcon = stage.icon
            
            return (
              <div
                key={sermon.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {sermon.title || 'Untitled Sermon'}
                      </h3>
                      <span className={clsx(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        stage.color
                      )}>
                        <StageIcon className="h-3 w-3" />
                        {stage.label}
                      </span>
                    </div>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {sermon.passage || 'No passage selected'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {sermon.date ? format(new Date(sermon.date), 'MMM d, yyyy') : 'No date set'}
                      </span>
                      <span>
                        Updated {format(new Date(sermon.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/sermons/edit/${sermon.id}`}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(sermon.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={clsx(
                    'flex-1 h-2 rounded-full',
                    sermon.exegesis?.centralProposition ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                  <div className={clsx(
                    'flex-1 h-2 rounded-full',
                    sermon.theology?.centralProposition ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                  <div className={clsx(
                    'flex-1 h-2 rounded-full',
                    sermon.homiletics?.homilетicalProposition ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Sermon?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete this sermon and all its content. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
