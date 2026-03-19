import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700"></div>
        
        {/* Avatar and info */}
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.name}
          </h2>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Mail className="h-5 w-5" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Calendar className="h-5 w-5" />
              <span>Joined {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Days Read</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Journal Entries</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Prayers</p>
        </div>
      </div>
    </div>
  )
}
