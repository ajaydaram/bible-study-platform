import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function GuestBanner() {
  const { isGuest } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!isGuest || dismissed) {
    return null
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-amber-800 dark:text-amber-200">
          <UserPlus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>
            You're using Scriptorium as a guest. 
            <span className="hidden sm:inline"> Your progress won't sync across devices.</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/auth/signup"
            className="text-xs font-medium px-3 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Create Account
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 rounded"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
