import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, UserPlus } from 'lucide-react'
import { format } from 'date-fns'
import type { Group } from '../types'

const STORAGE_KEY = 'scriptorium_groups'

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setGroups(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
            <p className="text-gray-500 dark:text-gray-400">Study together with others</p>
          </div>
        </div>
        <Link
          to="/groups/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Group
        </Link>
      </div>

      {/* Groups list */}
      {groups.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {groups.map(group => (
            <div
              key={group.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {group.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <UserPlus className="h-4 w-4" />
                  {group.memberCount} members
                </div>
                <span className="text-xs text-gray-400">
                  Created {format(new Date(group.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No groups yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create a group to study the Bible together
          </p>
          <Link
            to="/groups/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Your First Group
          </Link>
        </div>
      )}
    </div>
  )
}
