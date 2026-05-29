import { useState, useEffect } from 'react'
import { Trophy, Lock, Sparkles, X, CheckCircle } from 'lucide-react'
import { 
  getUserAchievements, 
  clearRecentlyUnlocked,
  ACHIEVEMENTS,
  type Achievement as AchievementType,
  type UserAchievements,
  getNextAchievement,
  getStreakData
} from '../lib/achievements'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

interface AchievementCardProps {
  achievement: AchievementType
  isUnlocked: boolean
  unlockedAt?: string
}

function AchievementCard({ achievement, isUnlocked, unlockedAt }: AchievementCardProps) {
  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all
        ${isUnlocked 
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700' 
          : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-60'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`text-3xl ${!isUnlocked && 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {achievement.name}
            </h3>
            {isUnlocked && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {achievement.description}
          </p>
          {isUnlocked && unlockedAt && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              Unlocked {format(new Date(unlockedAt), 'MMM d, yyyy')}
            </p>
          )}
        </div>
        {!isUnlocked && (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  )
}

interface AchievementUnlockedModalProps {
  achievement: AchievementType
  onClose: () => void
}

export function AchievementUnlockedModal({ achievement, onClose }: AchievementUnlockedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-32 h-32 text-amber-200 dark:text-amber-900 animate-pulse" />
          </div>
          <div className="relative text-7xl mb-4">{achievement.icon}</div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Achievement Unlocked!
        </h2>
        <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-2">
          {achievement.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {achievement.description}
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white 
            font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}

interface AchievementsDisplayProps {
  showAll?: boolean
}

export default function AchievementsDisplay({ showAll = false }: AchievementsDisplayProps) {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<UserAchievements | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'progress' | 'special'>('all')
  const [showUnlockedModal, setShowUnlockedModal] = useState(false)
  const [recentAchievement, setRecentAchievement] = useState<AchievementType | null>(null)
  const [nextAchievement, setNextAchievement] = useState<AchievementType | null>(null)

  useEffect(() => {
    if (user) {
      loadAchievements()
    }
  }, [user])

  const loadAchievements = async () => {
    if (!user) return
    try {
      const data = await getUserAchievements(user.id)
      setAchievements(data)
      
      // Check for recently unlocked
      if (data.recentlyUnlocked) {
        setRecentAchievement(data.recentlyUnlocked)
        setShowUnlockedModal(true)
      }
      
      // Get next achievement
      const streakData = await getStreakData(user.id)
      const unlockedIds = data.unlocked.map(a => a.id)
      const next = getNextAchievement(streakData.currentStreak, streakData.totalDaysCompleted, unlockedIds)
      setNextAchievement(next)
    } catch (error) {
      console.error('Failed to load achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = async () => {
    setShowUnlockedModal(false)
    if (user) {
      await clearRecentlyUnlocked(user.id)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-24" />
        ))}
      </div>
    )
  }

  if (!achievements) {
    return null
  }

  const unlockedIds = new Set(achievements.unlocked.map(a => a.id))
  const unlockedCount = achievements.unlocked.length
  const totalCount = ACHIEVEMENTS.length

  const filteredAchievements = selectedCategory === 'all' 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(a => a.category === selectedCategory)

  const categories = [
    { id: 'all', label: 'All', count: ACHIEVEMENTS.length },
    { id: 'streak', label: 'Streaks', count: ACHIEVEMENTS.filter(a => a.category === 'streak').length },
    { id: 'progress', label: 'Progress', count: ACHIEVEMENTS.filter(a => a.category === 'progress').length },
    { id: 'special', label: 'Special', count: ACHIEVEMENTS.filter(a => a.category === 'special').length },
  ]

  return (
    <>
      {/* Achievement unlocked modal */}
      {showUnlockedModal && recentAchievement && (
        <AchievementUnlockedModal 
          achievement={recentAchievement} 
          onClose={handleCloseModal} 
        />
      )}

      <div className="space-y-6">
        {/* Header with progress */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Achievements</h2>
              <p className="text-purple-200">
                {unlockedCount} of {totalCount} unlocked
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </div>
              <div className="text-purple-200 text-sm">Complete</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Next achievement teaser */}
        {nextAchievement && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl opacity-50">{nextAchievement.icon}</div>
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  Next Achievement
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {nextAchievement.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {nextAchievement.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        {showAll && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                  }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        )}

        {/* Achievement grid */}
        <div className={`grid gap-4 ${showAll ? 'md:grid-cols-2' : ''}`}>
          {(showAll ? filteredAchievements : filteredAchievements.slice(0, 4)).map(achievement => {
            const unlocked = achievements.unlocked.find(a => a.id === achievement.id)
            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedIds.has(achievement.id)}
                unlockedAt={unlocked?.unlockedAt}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
