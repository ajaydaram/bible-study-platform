import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { Group } from '../types'

const STORAGE_KEY = 'scriptorium_groups'

export default function GroupNew() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const stored = localStorage.getItem(STORAGE_KEY)
    const groups: Group[] = stored ? JSON.parse(stored) : []
    
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      description,
      memberCount: 1,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'anonymous'
    }
    
    groups.unshift(newGroup)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
    navigate('/groups')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-orange-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Group</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Group Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Morning Bible Study"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe what your group is about..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  )
}
