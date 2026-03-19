import { useState, useEffect } from 'react'
import { 
  Heart, 
  MessageSquare, 
  BookOpen, 
  Award, 
  Flame,
  Share2,
  Target,
  Check,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Activity, 
  ActivityType, 
  getActivityFeed,
  getPublicActivities,
  likeActivity
} from '../lib/social'

interface ActivityFeedProps {
  userId?: string // If provided, show only this user's activities
  showPublic?: boolean // Show public activities instead of following feed
}

const activityIcons: Record<ActivityType, typeof BookOpen> = {
  reading_started: BookOpen,
  reading_completed: Check,
  journal_shared: Share2,
  streak_reached: Flame,
  achievement_earned: Award,
  plan_started: Target,
  plan_completed: Check,
  verse_shared: BookOpen
}

const activityColors: Record<ActivityType, string> = {
  reading_started: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  reading_completed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  journal_shared: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  streak_reached: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  achievement_earned: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  plan_started: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
  plan_completed: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  verse_shared: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20'
}

export default function ActivityFeed({ showPublic = false }: ActivityFeedProps) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [user, showPublic])

  const loadActivities = async () => {
    setIsLoading(true)
    try {
      const data = showPublic || !user
        ? await getPublicActivities()
        : await getActivityFeed(user.id)
      setActivities(data)
    } catch (error) {
      console.error('Error loading activities:', error)
    }
    setIsLoading(false)
  }

  const handleLike = async (activityId: string) => {
    if (!user || user.isGuest) return
    await likeActivity(activityId, user.id)
    // Optimistically update
    setActivities(prev => prev.map(a => {
      if (a.id === activityId) {
        const isLiked = a.likedBy.includes(user.id)
        return {
          ...a,
          likes: isLiked ? a.likes - 1 : a.likes + 1,
          likedBy: isLiked 
            ? a.likedBy.filter(id => id !== user.id)
            : [...a.likedBy, user.id]
        }
      }
      return a
    }))
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
        <p className="text-sm text-gray-400 mt-1">
          {showPublic ? 'Be the first to share!' : 'Follow others to see their activity'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map(activity => {
        const Icon = activityIcons[activity.type] || BookOpen
        const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-50'
        const isLiked = user && activity.likedBy.includes(user.id)

        return (
          <div
            key={activity.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              {/* User avatar */}
              <div className="flex-shrink-0">
                {activity.userPhoto ? (
                  <img
                    src={activity.userPhoto}
                    alt={activity.userName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activity.userName}
                  </span>
                  <span className={`p-1 rounded-full ${colorClass}`}>
                    <Icon className="w-3 h-3" />
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTime(activity.createdAt)}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {activity.content}
                </p>

                {/* Verse preview for shared verses */}
                {activity.type === 'verse_shared' && typeof activity.metadata?.text === 'string' && (
                  <blockquote className="mt-2 pl-3 border-l-2 border-blue-500 text-gray-600 dark:text-gray-400 italic">
                    &ldquo;{activity.metadata.text.substring(0, 200)}...&rdquo;
                  </blockquote>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => handleLike(activity.id)}
                disabled={!user || user.isGuest}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  isLiked 
                    ? 'text-red-600' 
                    : 'text-gray-500 hover:text-red-600'
                } disabled:opacity-50`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{activity.likes}</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
