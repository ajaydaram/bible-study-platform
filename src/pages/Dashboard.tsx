import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getJournalEntries, getPrayers, getReadingProgress } from '../lib/firestore'
import StreakDisplay from '../components/StreakDisplay'
import {
  BookOpen,
  Calendar,
  Compass,
  PenTool,
  Users,
  Heart,
  TrendingUp,
  ArrowRight,
  Activity,
  Sparkles,
  Trophy
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    daysCompleted: 0,
    journalEntries: 0,
    prayers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const [journals, prayers, chronoProgress, thematicProgress] = await Promise.all([
          getJournalEntries(user.id),
          getPrayers(user.id),
          getReadingProgress(user.id, 'chronological'),
          getReadingProgress(user.id, 'thematic')
        ])

        // Count completed days from both paths
        const chronoCompleted = Object.values(chronoProgress).filter(p => p.completed).length
        const thematicCompleted = Object.values(thematicProgress).filter(p => p.completed).length

        setStats({
          daysCompleted: chronoCompleted + thematicCompleted,
          journalEntries: journals.length,
          prayers: prayers.length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  const quickActions = [
    {
      title: 'Chronological Path',
      description: 'Read the Bible in order of events',
      href: '/paths/chronological',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Thematic Path',
      description: 'Explore key biblical themes',
      href: '/paths/thematic',
      icon: Compass,
      color: 'bg-purple-500'
    },
    {
      title: 'Journal',
      description: 'Record your reflections',
      href: '/journal',
      icon: PenTool,
      color: 'bg-green-500'
    },
    {
      title: 'Groups',
      description: 'Study with others',
      href: '/groups',
      icon: Users,
      color: 'bg-orange-500'
    }
  ]

  const statsDisplay = [
    { label: 'Days Completed', value: stats.daysCompleted, icon: TrendingUp },
    { label: 'Journal Entries', value: stats.journalEntries, icon: PenTool },
    { label: 'Prayers', value: stats.prayers, icon: Heart },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Friend'}!
        </h1>
        <p className="text-primary-100 mb-6">
          Continue your journey through Scripture today.
        </p>
        <Link
          to="/paths/chronological"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          <BookOpen className="h-5 w-5" />
          Continue Reading
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Pulse Feature Card - NEW */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-6 w-6" />
            <span className="text-purple-200 text-sm font-medium">NEW FEATURE</span>
            <Sparkles className="h-4 w-4 text-yellow-300" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Scriptorium Pulse
          </h2>
          <p className="text-purple-100 mb-4 max-w-md">
            Discover where you stand on faith, identity, and relationships with our 49-question theological diagnostic. Get personalized scriptural insights.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link
              to="/pulse"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Take the Pulse
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pulse/results"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsDisplay.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Streak */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Reading Streak
          </h2>
          <Link
            to="/achievements"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <Trophy className="w-4 h-4" />
            View Achievements
          </Link>
        </div>
        <StreakDisplay compact={false} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Verse of the Day */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Verse of the Day
        </h2>
        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
          "Trust in the LORD with all thine heart; and lean not unto thine own understanding.
          In all thy ways acknowledge him, and he shall direct thy paths."
        </blockquote>
        <p className="mt-3 text-sm font-medium text-primary-600 dark:text-primary-400">
          — Proverbs 3:5-6 (KJV)
        </p>
      </div>
    </div>
  )
}
