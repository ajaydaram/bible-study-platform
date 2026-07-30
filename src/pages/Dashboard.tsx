import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getJournalEntries, getPrayers, getReadingProgress } from '../lib/firestore'
import StreakDisplay from '../components/StreakDisplay'
import DailyPatristicQuote from '../components/DailyPatristicQuote'
import AlreadyNotYetCard from '../components/AlreadyNotYetCard'
import { getDayReading } from '../data/biblicalEras'
import {
  BookOpen,
  Calendar,
  Compass,
  PenTool,
  Heart,
  TrendingUp,
  ArrowRight,
  Activity,
  Sparkles,
  Trophy,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Layers
} from 'lucide-react'

// Daily rotation of scripture verses
const VERSES_OF_THE_DAY = [
  {
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    reference: "Proverbs 3:5-6 (KJV)"
  },
  {
    text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    reference: "Jeremiah 29:11 (KJV)"
  },
  {
    text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    reference: "Psalm 23:1-2 (KJV)"
  },
  {
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    reference: "Isaiah 41:10 (KJV)"
  },
  {
    text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    reference: "Isaiah 40:31 (KJV)"
  },
  {
    text: "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
    reference: "Deuteronomy 31:6 (KJV)"
  },
  {
    text: "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.",
    reference: "Zephaniah 3:17 (KJV)"
  }
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    daysCompleted: 0,
    journalEntries: 0,
    prayers: 0
  })
  const [nextReadingDay, setNextReadingDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Get verse of the day
  const verseOfTheDay = (() => {
    const day = new Date().getDate()
    return VERSES_OF_THE_DAY[day % VERSES_OF_THE_DAY.length]
  })()

  const copyVerse = () => {
    const text = `"${verseOfTheDay.text}"\n\n— ${verseOfTheDay.reference}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareVerse = async () => {
    const text = `"${verseOfTheDay.text}"\n\n— ${verseOfTheDay.reference}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse of the Day',
          text: text
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

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
        const chronoCompleted = Object.entries(chronoProgress).filter(([_, p]) => p.completed).map(([day, _]) => parseInt(day))
        const thematicCompleted = Object.values(thematicProgress).filter(p => p.completed).length

        setStats({
          daysCompleted: chronoCompleted.length + thematicCompleted,
          journalEntries: journals.length,
          prayers: prayers.length
        })

        const maxCompleted = Math.max(0, ...chronoCompleted)
        setNextReadingDay(Math.min(maxCompleted + 1, 502))
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  const nextReading = getDayReading(nextReadingDay)

  const quickActions = [
    {
      title: 'Redemptive Epochs',
      description: 'Explore the 5 stages of special revelation',
      href: '/epochs',
      icon: Compass,
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      title: 'Typology Tracker',
      description: 'Trace shadows in OT to substance in Christ',
      href: '/typology',
      icon: Layers,
      gradient: 'from-purple-600 to-rose-600'
    },
    {
      title: 'Chronological Path',
      description: 'Read the Bible in order of events',
      href: '/paths/chronological',
      icon: Calendar,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Journal',
      description: 'Record your reflections',
      href: '/journal',
      icon: PenTool,
      gradient: 'from-emerald-400 to-teal-600'
    }
  ]

  const statsDisplay = [
    { label: 'Days Completed', value: stats.daysCompleted, icon: TrendingUp, href: '/achievements' },
    { label: 'Journal Entries', value: stats.journalEntries, icon: PenTool, href: '/journal' },
    { label: 'Prayers', value: stats.prayers, icon: Heart, href: '/prayers' },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-indigo-900 dark:from-gray-900 dark:via-primary-950 dark:to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-primary-700/30 dark:border-primary-900/50 animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Friend'}!
          </h1>
          <p className="text-primary-100 text-sm sm:text-base mb-6 max-w-xl">
            Continue your journey through Scripture today. Cultivate a deeper relationship with God and grow in faith.
          </p>

          {nextReading && (
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-primary-200">Next Scripture Reading</span>
                <h3 className="text-lg font-bold text-white mt-1">Day {nextReading.day}: {nextReading.title}</h3>
                <p className="text-sm text-primary-100 mt-1 max-w-xl line-clamp-1 sm:line-clamp-none">
                  {nextReading.scripture.join(', ')}
                </p>
              </div>
              <Link
                to="/paths/chronological"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary-700 dark:bg-gray-800 dark:text-primary-300 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm active:scale-95 whitespace-nowrap self-start sm:self-auto"
              >
                <BookOpen className="h-4.5 w-4.5" />
                Resume Reading
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main/Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Eschatological Discipleship Engine Widget */}
          <AlreadyNotYetCard />

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-transparent dark:hover:border-transparent hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className={`bg-gradient-to-br ${action.gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Reading Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Reading Streak
              </h2>
              <Link
                to="/achievements"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 transition-colors"
              >
                Achievements
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <StreakDisplay compact={false} />
          </div>

          {/* Verse of the Day */}
          <div className="bg-gradient-to-br from-parchment-50 to-parchment-100/50 dark:from-gray-800/40 dark:to-gray-800/20 border border-parchment-200 dark:border-gray-700/80 rounded-2xl p-6 relative overflow-hidden shadow-sm animate-fade-in">
            <div className="absolute right-4 top-4 text-parchment-200 dark:text-gray-700/50 pointer-events-none">
              <BookOpen className="w-24 h-24 stroke-[0.5]" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-parchment-600 dark:text-primary-400">
                  Verse of the Day
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyVerse}
                    className="p-2 hover:bg-parchment-200 dark:hover:bg-gray-700/50 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy Verse"
                  >
                    {copied ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                  </button>
                  <button
                    onClick={shareVerse}
                    className="p-2 hover:bg-parchment-200 dark:hover:bg-gray-700/50 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Share Verse"
                  >
                    {shared ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Share2 className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
              
              <blockquote className="font-scripture text-xl md:text-2xl leading-relaxed text-scripture-text dark:text-scripture-text-dark italic">
                "{verseOfTheDay.text}"
              </blockquote>
              
              <p className="text-sm font-semibold text-parchment-700 dark:text-parchment-400 text-right">
                — {verseOfTheDay.reference}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column / Sidebar */}
        <div className="space-y-8">
          
          {/* Scriptorium Pulse Feature Card */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-purple-500/20 group hover:shadow-purple-500/10 transition-all duration-300 animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse-soft">
                  <Activity className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <span className="text-purple-200 text-xs font-bold uppercase tracking-wider block">Assessment</span>
                  <span className="text-xs bg-yellow-300/20 text-yellow-300 px-2 py-0.5 rounded-full font-semibold">
                    New Feature
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2 tracking-tight">
                Scriptorium Pulse
              </h2>
              <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                Discover where you stand on faith, identity, and relationships with our 49-question theological diagnostic. Get personalized scriptural insights.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/pulse"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-purple-700 rounded-xl font-bold hover:bg-purple-50 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  Take Pulse
                </Link>
                <Link
                  to="/pulse/results"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-200 active:scale-95"
                >
                  View Results
                </Link>
              </div>
            </div>
          </div>

          {/* Daily Patristic Quote (Historical Wisdom) */}
          <div className="shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
            <DailyPatristicQuote />
          </div>

          {/* Quick Stats Grid */}
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
              Your Activities
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {statsDisplay.map((stat) => (
                <Link
                  key={stat.label}
                  to={stat.href}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-soft transition-all duration-150 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 dark:bg-primary-950/40 rounded-lg group-hover:scale-105 transition-transform duration-200">
                      <stat.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {loading ? (
                          <span className="inline-block w-8 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
