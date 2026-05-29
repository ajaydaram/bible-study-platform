import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Loader2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getCategoryQuestions } from '../data/pulseQuestions'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface DiagnosticModule {
  id: string
  categoryId: number
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  questionCount: number
  estimatedTime: string
  topics: string[]
}

const diagnosticModules: DiagnosticModule[] = [
  {
    id: 'body-sexuality',
    categoryId: 1,
    title: "Body & Sexuality",
    subtitle: "Theology of Embodiment",
    description: "Explore God's design for human embodiment, gender, sexuality, and what it means to honor Him with our bodies.",
    icon: "🫀",
    color: "#8B5CF6",
    questionCount: 13,
    estimatedTime: "8-10 min",
    topics: ["Human sexuality", "Gender identity", "Same-sex attraction", "Bodily stewardship", "Celibacy"]
  },
  {
    id: 'singleness',
    categoryId: 2,
    title: "Singleness",
    subtitle: "Kingdom Vocation",
    description: "Discover the dignity, purpose, and unique calling of the single life in God's Kingdom economy.",
    icon: "👤",
    color: "#EC4899",
    questionCount: 10,
    estimatedTime: "6-8 min",
    topics: ["Gift of singleness", "Celibacy", "Wholeness in Christ", "Kingdom service", "Spiritual family"]
  },
  {
    id: 'marriage',
    categoryId: 3,
    title: "Marriage",
    subtitle: "Covenant & Mystery",
    description: "Understand biblical foundations for marriage, covenant relationships, and the mystery of Christ and the Church.",
    icon: "💍",
    color: "#F59E0B",
    questionCount: 15,
    estimatedTime: "10-12 min",
    topics: ["Covenant marriage", "Headship & submission", "Divorce & remarriage", "Complementarity", "Christ & Church"]
  },
  {
    id: 'kingdom-family',
    categoryId: 4,
    title: "Kingdom Family",
    subtitle: "Spiritual Kinship",
    description: "Explore how the Church functions as God's true family, transcending biological relationships.",
    icon: "👨‍👩‍👧‍👦",
    color: "#10B981",
    questionCount: 3,
    estimatedTime: "2-3 min",
    topics: ["Spiritual family", "Church community", "Kingdom priorities", "Biological vs. spiritual bonds"]
  },
  {
    id: 'eschatology',
    categoryId: 5,
    title: "Eschatology",
    subtitle: "The Age to Come",
    description: "What does Scripture teach about resurrection, the future state, and marriage in the Kingdom to come?",
    icon: "✨",
    color: "#3B82F6",
    questionCount: 8,
    estimatedTime: "5-7 min",
    topics: ["Resurrection body", "Marriage in heaven", "New creation", "Eternal state", "Christ's return"]
  }
]

export default function PulseHub() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadProgress() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const docRef = doc(db, 'pulseResponses', user.id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.responses) {
            setResponses(data.responses)
            
            // Check which modules are complete
            const completed = new Set<string>()
            diagnosticModules.forEach(module => {
              const categoryQuestions = getCategoryQuestions(module.categoryId)
              const answeredInCategory = categoryQuestions.filter(
                q => data.responses[q.id] !== undefined
              ).length
              if (answeredInCategory === categoryQuestions.length) {
                completed.add(module.id)
              }
            })
            setCompletedModules(completed)
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [user?.id])

  const getModuleProgress = (categoryId: number) => {
    const categoryQuestions = getCategoryQuestions(categoryId)
    const answered = categoryQuestions.filter(q => responses[q.id] !== undefined).length
    return { answered, total: categoryQuestions.length }
  }

  const getTotalProgress = () => {
    const totalQuestions = 49
    const answered = Object.keys(responses).length
    return Math.round((answered / totalQuestions) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm mb-4">
          <Heart className="h-4 w-4" />
          Scriptorium Pulse
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Theological Diagnostics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Explore your understanding across key areas of faith, identity, sexuality, and relationships through Scripture-based questions.
        </p>
      </div>

      {/* Overall Progress Card */}
      {Object.keys(responses).length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <p className="text-purple-200 text-sm">
                {Object.keys(responses).length} of 49 questions answered
              </p>
            </div>
            {getTotalProgress() === 100 && (
              <Link
                to="/pulse/results"
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                View Results
              </Link>
            )}
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-purple-200">
            <span>{completedModules.size} of 5 modules complete</span>
            <span>{getTotalProgress()}%</span>
          </div>
        </div>
      )}

      {/* Diagnostic Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Choose a Diagnostic
        </h2>
        
        <div className="grid gap-4">
          {diagnosticModules.map((module) => {
            const progress = getModuleProgress(module.categoryId)
            const isComplete = completedModules.has(module.id)
            const hasStarted = progress.answered > 0
            
            return (
              <Link
                key={module.id}
                to={`/pulse/section/${module.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-lg group"
              >
                <div className="flex items-stretch">
                  {/* Color Bar */}
                  <div 
                    className="w-2 flex-shrink-0"
                    style={{ backgroundColor: module.color }}
                  />
                  
                  <div className="flex-1 p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: `${module.color}20` }}
                      >
                        {module.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {module.title}
                          </h3>
                          {isComplete && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {hasStarted && !isComplete && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs font-medium">
                              In Progress
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">
                          {module.subtitle}
                        </p>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {module.description}
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" />
                            {module.questionCount} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {module.estimatedTime}
                          </span>
                        </div>
                        
                        {/* Topics */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {module.topics.slice(0, 3).map(topic => (
                            <span 
                              key={topic}
                              className="px-2 py-0.5 text-xs rounded-full"
                              style={{ 
                                backgroundColor: `${module.color}15`,
                                color: module.color
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                          {module.topics.length > 3 && (
                            <span className="px-2 py-0.5 text-xs text-gray-400">
                              +{module.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress & Arrow */}
                      <div className="flex flex-col items-end gap-2">
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        
                        {hasStarted && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {progress.answered}/{progress.total}
                            </p>
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${(progress.answered / progress.total) * 100}%`,
                                  backgroundColor: module.color
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Take Full Assessment CTA */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
            <Heart className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              Complete Assessment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Take all 49 questions across all 5 categories for a comprehensive theological profile
            </p>
          </div>
          <Link
            to="/pulse/full"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
          >
            Start Full Assessment
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          📖 How It Works
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-purple-500">1.</span>
            Choose a diagnostic module based on what you want to explore
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">2.</span>
            Answer questions using the spectrum from "Strongly Disagree" to "Strongly Agree"
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">3.</span>
            Read scriptural insights after each question to deepen understanding
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">4.</span>
            View your results with a theological compass showing your alignment
          </li>
        </ul>
      </div>
    </div>
  )
}
