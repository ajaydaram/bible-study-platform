import { Link } from 'react-router-dom'
import { BookMarked, Map, BookOpen, Link2, Languages, Sparkles, Church, Clock, Music, Users, Heart } from 'lucide-react'

const resources = [
  {
    title: 'Word Study',
    description: 'Explore Greek & Hebrew words with transliteration and definitions',
    icon: Sparkles,
    href: '/resources/word-study',
    color: 'bg-amber-500',
    ready: true
  },
  {
    title: 'Interlinear Bible',
    description: 'Word-by-word Greek/Hebrew with transliteration and glosses',
    icon: Languages,
    href: '/resources/interlinear',
    color: 'bg-indigo-500',
    ready: true
  },
  {
    title: 'Church History',
    description: 'Church Fathers, councils, creeds & the first 500 years of Christianity',
    icon: Church,
    href: '/resources/church-history',
    color: 'bg-orange-500',
    ready: true
  },
  {
    title: 'Timeline',
    description: 'Explore 450+ biblical events across 11 eras from Creation to Apostolic Age',
    icon: Clock,
    href: '/resources/timeline',
    color: 'bg-teal-500',
    ready: true
  },
  {
    title: 'Biblical People',
    description: 'Browse 3,000+ people from Scripture with references',
    icon: Users,
    href: '/resources/people',
    color: 'bg-blue-600',
    ready: true
  },
  {
    title: 'Hymnal',
    description: '300 classic hymns with full lyrics for worship',
    icon: Music,
    href: '/resources/hymnal',
    color: 'bg-purple-600',
    ready: true
  },
  {
    title: 'Bible Dictionary',
    description: 'Look up definitions of biblical terms, places, and concepts',
    icon: BookOpen,
    href: '/resources/dictionary',
    color: 'bg-blue-500',
    ready: true
  },
  {
    title: 'Bible Maps',
    description: 'Explore the geography of the Bible lands',
    icon: Map,
    href: '/resources/maps',
    color: 'bg-green-500',
    ready: true
  },
  {
    title: 'Cross References',
    description: 'Find related passages throughout Scripture',
    icon: Link2,
    href: '/resources/cross-references',
    color: 'bg-purple-500',
    ready: true
  },
  {
    title: 'Discipleship Study',
    description: 'What Is a Biblical Christian? Teaching on conversion & faith',
    icon: Heart,
    href: '/resources/discipleship',
    color: 'bg-rose-500',
    ready: true
  }
]

const readingPlans = [
  {
    title: 'Chronological',
    description: 'Read the Bible in the order events occurred',
    href: '/paths/chronological',
    duration: '502 days'
  },
  {
    title: 'Thematic',
    description: 'Explore key biblical themes',
    href: '/paths/thematic',
    duration: '24 topics'
  }
]

export default function Resources() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookMarked className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h1>
          <p className="text-gray-500 dark:text-gray-400">Tools to enhance your Bible study</p>
        </div>
      </div>

      {/* Study Tools */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Tools</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {resources.map((resource) => (
            resource.ready ? (
              <Link
                key={resource.title}
                to={resource.href}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
              >
                <div className={`${resource.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <resource.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {resource.description}
                </p>
                <p className="mt-3 text-xs text-primary-600 dark:text-primary-400 font-medium">
                  Hover & click to see verses →
                </p>
              </Link>
            ) : (
              <div
                key={resource.title}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 opacity-75"
              >
                <div className={`${resource.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <resource.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {resource.description}
                </p>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Coming soon</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Reading Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Plans</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {readingPlans.map((plan) => (
            <Link
              key={plan.title}
              to={plan.href}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {plan.title}
                </h3>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs">
                  {plan.duration}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {plan.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Need help getting started?</h2>
        <p className="text-primary-100 mb-4">
          Choose a reading plan and start your journey through Scripture today.
        </p>
        <Link
          to="/paths/chronological"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          Start Chronological Plan
        </Link>
      </div>
    </div>
  )
}
