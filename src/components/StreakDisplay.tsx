import { useState, useEffect } from 'react'
import { Flame, Star, ChevronRight, Trophy } from 'lucide-react'
import { 
  getStreakData, 
  getStreakMessage, 
  getDaysUntilMilestone,
  type StreakData 
} from '../lib/achievements'
import { useAuth } from '../contexts/AuthContext'

interface StreakDisplayProps {
  compact?: boolean
  showMessage?: boolean
  onExpand?: () => void
}

export default function StreakDisplay({ compact = false, showMessage = true, onExpand }: StreakDisplayProps) {
  const { user } = useAuth()
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStreakData()
    }
  }, [user])

  const loadStreakData = async () => {
    if (!user) return
    try {
      const data = await getStreakData(user.id)
      setStreakData(data)
    } catch (error) {
      console.error('Failed to load streak data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !streakData) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-16" />
    )
  }

  const milestone = getDaysUntilMilestone(streakData.currentStreak)
  const streakMessage = getStreakMessage(streakData.currentStreak)

  if (compact) {
    return (
      <button
        onClick={onExpand}
        className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 
          text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 
          dark:hover:bg-orange-900/50 transition-colors"
      >
        <Flame className="w-5 h-5" />
        <span className="font-bold">{streakData.currentStreak}</span>
        <span className="text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
      </button>
    )
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <div className="text-4xl font-bold">{streakData.currentStreak}</div>
              <div className="text-orange-100 text-sm">
                day streak
              </div>
            </div>
          </div>
          
          {showMessage && (
            <p className="text-orange-100 mt-3">{streakMessage}</p>
          )}
          
          {milestone && (
            <div className="mt-3 flex items-center gap-2 text-sm bg-white/20 rounded-full px-3 py-1 w-fit">
              <Star className="w-4 h-4" />
              <span>
                {milestone.daysLeft} day{milestone.daysLeft !== 1 ? 's' : ''} to {milestone.milestone}-day milestone!
              </span>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-orange-100 text-sm mb-1">Best Streak</div>
          <div className="flex items-center gap-1">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-2xl font-bold">{streakData.longestStreak}</span>
          </div>
          <div className="text-orange-100 text-sm mt-3">Total Days</div>
          <div className="text-xl font-bold">{streakData.totalDaysCompleted}</div>
        </div>
      </div>

      {/* Weekly progress */}
      <div className="mt-6">
        <div className="text-sm text-orange-100 mb-2">This Week</div>
        <div className="flex gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
            // Get the actual day (0 = Sunday)
            const today = new Date().getDay()
            const isCompleted = streakData.weeklyProgress[6 - index] || false
            const isCurrentDay = index === today
            
            return (
              <div
                key={index}
                className={`flex-1 aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  ${isCompleted 
                    ? 'bg-white text-orange-600' 
                    : isCurrentDay 
                      ? 'bg-white/30 text-white ring-2 ring-white' 
                      : 'bg-white/10 text-white/50'
                  }`}
              >
                {isCompleted ? '✓' : day}
              </div>
            )
          })}
        </div>
      </div>

      {onExpand && (
        <button
          onClick={onExpand}
          className="mt-4 flex items-center gap-1 text-sm text-orange-100 hover:text-white transition-colors"
        >
          View Achievements <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
