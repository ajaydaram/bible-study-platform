import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { Discussion } from '../types'

const STORAGE_KEY = 'scriptorium_discussions'

export default function DiscussionNew() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const stored = localStorage.getItem(STORAGE_KEY)
    const discussions: Discussion[] = stored ? JSON.parse(stored) : []
    
    const newDiscussion: Discussion = {
      id: crypto.randomUUID(),
      title,
      content,
      authorId: user?.id || 'anonymous',
      authorName: user?.name || 'Anonymous',
      commentCount: 0,
      createdAt: new Date().toISOString()
    }
    
    discussions.unshift(newDiscussion)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(discussions))
    navigate('/discussions')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Discussion</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="What would you like to discuss?"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              placeholder="Share your thoughts, questions, or insights..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/discussions')}
            className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Post Discussion
          </button>
        </div>
      </form>
    </div>
  )
}
