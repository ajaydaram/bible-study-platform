import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { Discussion } from '../types'

const STORAGE_KEY = 'scriptorium_discussions'

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setDiscussions(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discussions</h1>
            <p className="text-gray-500 dark:text-gray-400">Share and discuss Scripture</p>
          </div>
        </div>
        <Link
          to="/discussions/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Discussion
        </Link>
      </div>

      {/* Discussions list */}
      {discussions.length > 0 ? (
        <div className="space-y-4">
          {discussions.map(discussion => (
            <div
              key={discussion.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {discussion.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {discussion.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>by {discussion.authorName}</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {discussion.commentCount} comments
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {format(new Date(discussion.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No discussions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start a conversation about Scripture
          </p>
          <Link
            to="/discussions/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Start a Discussion
          </Link>
        </div>
      )}
    </div>
  )
}
