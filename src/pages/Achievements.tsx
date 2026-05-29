import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  getUserAchievements, 
  getStreakData, 
  getAllAchievements,
  Achievement,
  StreakData
} from '../lib/achievements'
import StreakDisplay from '../components/StreakDisplay'
import AchievementsDisplay from '../components/AchievementsDisplay'
import { Trophy, Flame, Star, Calendar } from 'lucide-react'

export default function Achievements() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user?.id])

  const loadData = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      const [userAchievements, streak] = await Promise.all([
        getUserAchievements(user.id),
        getStreakData(user.id)
      ])

      setAchievements(getAllAchievements())
      setUnlockedIds(new Set(userAchievements.unlocked.map((a: Achievement) => a.id)))
      setStreakData(streak)
    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const unlockedCount = unlockedIds.size
  const totalCount = achievements.length
  const percentComplete = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Achievements</h1>
        </div>
        <p className="text-orange-100 mb-6">
          Track your Bible reading progress and unlock achievements as you grow in your faith journey.
        </p>
        
        {/* Progress overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Unlocked"
            value={`${unlockedCount}/${totalCount}`}
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Progress"
            value={`${percentComplete}%`}
          />
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="Current Streak"
            value={`${streakData?.currentStreak || 0} days`}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Total Days"
            value={`${streakData?.totalDaysCompleted || 0}`}
          />
        </div>
      </div>

      {/* Streak section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Reading Streak
        </h2>
        <StreakDisplay compact={false} />
      </div>

      {/* Achievement gallery */}
      <AchievementsDisplay />
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-lg p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-orange-100">{label}</p>
    </div>
  )
}
