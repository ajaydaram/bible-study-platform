import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  Loader2,
  RefreshCw,
  // Download,
  BookOpen,
  // TrendingUp,
  // Share2,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  pulseQuestions, 
  pulseCategories,
  ResponseValue,
  calculateScore,
  getAlignmentLabel,
  getAlignmentColor,
  getCategoryQuestions
} from '../data/pulseQuestions'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface CategoryScore {
  categoryId: number
  name: string
  shortName: string
  score: number
  answeredCount: number
  totalCount: number
  color: string
  icon: string
}

export default function PulseResults() {
  const { user } = useAuth()
  // const navigate = useNavigate()
  const [responses, setResponses] = useState<Record<number, ResponseValue>>({})
  const [loading, setLoading] = useState(true)
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([])
  const [overallScore, setOverallScore] = useState(0)

  // Load responses and calculate scores
  useEffect(() => {
    async function loadAndCalculate() {
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
            calculateScores(data.responses)
          }
        }
      } catch (error) {
        console.error('Error loading responses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAndCalculate()
  }, [user?.id])

  const calculateScores = (userResponses: Record<number, ResponseValue>) => {
    const scores: CategoryScore[] = []
    let totalScore = 0
    let totalAnswered = 0

    pulseCategories.forEach(category => {
      const questions = getCategoryQuestions(category.id)
      let categoryTotal = 0
      let answeredCount = 0

      questions.forEach(q => {
        if (userResponses[q.id] !== undefined) {
          const score = calculateScore(q.biblicalAnswer, userResponses[q.id])
          categoryTotal += score
          answeredCount++
          totalScore += score
          totalAnswered++
        }
      })

      scores.push({
        categoryId: category.id,
        name: category.name,
        shortName: category.shortName,
        score: answeredCount > 0 ? Math.round(categoryTotal / answeredCount) : 0,
        answeredCount,
        totalCount: questions.length,
        color: category.color,
        icon: category.icon
      })
    })

    setCategoryScores(scores)
    setOverallScore(totalAnswered > 0 ? Math.round(totalScore / totalAnswered) : 0)
  }

  const getRadarPoints = () => {
    // Generate SVG path for radar chart
    const center = 150
    const maxRadius = 120
    const angleStep = (2 * Math.PI) / categoryScores.length

    return categoryScores.map((cat, i) => {
      const angle = angleStep * i - Math.PI / 2 // Start from top
      const radius = (cat.score / 100) * maxRadius
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return { x, y, category: cat }
    })
  }

  const renderRadarChart = () => {
    const center = 150
    const maxRadius = 120
    const levels = [20, 40, 60, 80, 100]
    const points = getRadarPoints()
    const angleStep = (2 * Math.PI) / categoryScores.length

    // Create path for the score polygon
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z'

    return (
      <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
        {/* Background circles */}
        {levels.map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {categoryScores.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2
          const x = center + maxRadius * Math.cos(angle)
          const y = center + maxRadius * Math.sin(angle)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.2}
              strokeWidth={1}
            />
          )
        })}

        {/* Score polygon */}
        <path
          d={pathData}
          fill="url(#radarGradient)"
          fillOpacity={0.3}
          stroke="url(#radarGradient)"
          strokeWidth={2}
        />

        {/* Score points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6}
            fill={p.category.color}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Category labels */}
        {categoryScores.map((cat, i) => {
          const angle = angleStep * i - Math.PI / 2
          const labelRadius = maxRadius + 25
          const x = center + labelRadius * Math.cos(angle)
          const y = center + labelRadius * Math.sin(angle)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current text-gray-600 dark:text-gray-400"
              fontSize={10}
            >
              {cat.icon}
            </text>
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const answeredCount = Object.keys(responses).length
  const completionPercentage = Math.round((answeredCount / pulseQuestions.length) * 100)

  if (answeredCount === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Heart className="h-16 w-16 text-purple-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Results Yet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Complete the Pulse diagnostic to see your theological profile.
        </p>
        <Link
          to="/pulse"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Start Diagnostic
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm mb-3">
          <Heart className="h-4 w-4" />
          Scriptorium Pulse
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Theological Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {completionPercentage}% complete ({answeredCount} of {pulseQuestions.length} questions)
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
        <p className="text-purple-200 text-sm mb-2">Overall Alignment Score</p>
        <div className="text-6xl font-bold mb-2">{overallScore}%</div>
        <p className="text-xl font-medium">{getAlignmentLabel(overallScore)}</p>
        <p className="text-purple-200 text-sm mt-4 max-w-md mx-auto">
          This score reflects how closely your responses align with biblical teaching across all categories.
        </p>
      </div>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Theological Compass
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Outer edge = Higher biblical alignment • Center = Lower alignment
        </p>
        {renderRadarChart()}
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryScores.map(cat => (
            <div key={cat.categoryId} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {cat.icon} {cat.shortName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category Breakdown
        </h2>
        
        {categoryScores.map(cat => (
          <div 
            key={cat.categoryId}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cat.answeredCount} of {cat.totalCount} answered
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: cat.color }}>
                  {cat.score}%
                </div>
                <p className={`text-sm ${getAlignmentColor(cat.score)}`}>
                  {getAlignmentLabel(cat.score)}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${cat.score}%`,
                  backgroundColor: cat.color
                }}
              />
            </div>

            {/* Recommendation */}
            {cat.score < 60 && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  💡 Consider exploring our reading paths on {cat.shortName.toLowerCase()} to deepen your biblical understanding.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/pulse"
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <RefreshCw className="h-4 w-4" />
          {answeredCount < pulseQuestions.length ? 'Continue Diagnostic' : 'Retake Diagnostic'}
        </Link>
        
        <Link
          to="/paths/chronological"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <BookOpen className="h-4 w-4" />
          Explore Reading Paths
        </Link>
      </div>

      {/* Explanation Card */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">
          📊 Understanding Your Results
        </h3>
        <div className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
          <p>
            <strong>80-100%:</strong> Scripturally Grounded — Your views closely align with biblical teaching.
          </p>
          <p>
            <strong>60-79%:</strong> Biblically Informed — Good foundation with room for deeper study.
          </p>
          <p>
            <strong>40-59%:</strong> Mixed Perspectives — Cultural and biblical views are blended.
          </p>
          <p>
            <strong>20-39%:</strong> Culturally Influenced — Your views may be shaped more by culture than Scripture.
          </p>
          <p>
            <strong>0-19%:</strong> Needs Reflection — Consider studying these topics more deeply.
          </p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          🔒 Your responses are stored securely and privately in your account.
        </p>
      </div>
    </div>
  )
}
