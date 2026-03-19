import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Loader2,
  Info,
  X,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  pulseQuestions, 
  pulseCategories,
  ResponseValue, 
  responseLabels,
  getCategoryQuestions
} from '../data/pulseQuestions'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function Pulse() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, ResponseValue>>({})
  const [showInsight, setShowInsight] = useState(false)
  const [loading, setLoading] = useState(true)
  // const [saving, setSaving] = useState(false)
  const [hasExistingResults, setHasExistingResults] = useState(false)

  const question = pulseQuestions[currentQuestion]
  const category = pulseCategories.find(c => c.id === question.categoryId)
  const progress = ((currentQuestion + 1) / pulseQuestions.length) * 100
  const categoryProgress = getCategoryQuestions(question.categoryId)
  const categoryQuestionIndex = categoryProgress.findIndex(q => q.id === question.id)

  // Load existing responses
  useEffect(() => {
    async function loadResponses() {
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
            setHasExistingResults(true)
          }
        }
      } catch (error) {
        console.error('Error loading responses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResponses()
  }, [user?.id])

  const handleResponse = async (value: ResponseValue) => {
    const newResponses = { ...responses, [question.id]: value }
    setResponses(newResponses)
    setShowInsight(true)

    // Auto-save progress
    if (user?.id) {
      try {
        await setDoc(doc(db, 'pulseResponses', user.id), {
          responses: newResponses,
          lastUpdated: new Date().toISOString(),
          currentQuestion: currentQuestion
        }, { merge: true })
      } catch (error) {
        console.error('Error saving response:', error)
      }
    }
  }

  const nextQuestion = () => {
    setShowInsight(false)
    if (currentQuestion < pulseQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Complete - navigate to results
      navigate('/pulse/results')
    }
  }

  const prevQuestion = () => {
    setShowInsight(false)
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const jumpToCategory = (categoryId: number) => {
    const firstQuestion = pulseQuestions.findIndex(q => q.categoryId === categoryId)
    if (firstQuestion !== -1) {
      setCurrentQuestion(firstQuestion)
      setShowInsight(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm mb-3">
          <Heart className="h-4 w-4" />
          Scriptorium Pulse
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Theological Diagnostic
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Explore your understanding of faith, identity, and relationships
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {pulseCategories.map((cat) => {
          const catQuestions = getCategoryQuestions(cat.id)
          const answeredCount = catQuestions.filter(q => responses[q.id] !== undefined).length
          const isActive = cat.id === question.categoryId
          
          return (
            <button
              key={cat.id}
              onClick={() => jumpToCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.shortName}</span>
              <span className="ml-1 text-xs opacity-70">
                {answeredCount}/{catQuestions.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Question {currentQuestion + 1} of {pulseQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category Header */}
      <div 
        className="rounded-xl p-4 text-white"
        style={{ backgroundColor: category?.color || '#8B5CF6' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <p className="text-white/80 text-sm">{category?.name}</p>
            <p className="text-white/60 text-xs">
              Question {categoryQuestionIndex + 1} of {categoryProgress.length} in this category
            </p>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {/* Question Number & New Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Q{question.id}
            </span>
            {question.isNew && (
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                <Sparkles className="h-3 w-3 inline mr-1" />
                New
              </span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
            "{question.text}"
          </h2>

          {/* Response Buttons */}
          <div className="mt-6 space-y-2">
            {([-2, -1, 0, 1, 2] as ResponseValue[]).map((value) => {
              const isSelected = responses[question.id] === value
              return (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{responseLabels[value]}</span>
                  {isSelected && (
                    <span className="text-sm">✓ Selected</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Scriptural Insight Panel */}
        {showInsight && responses[question.id] !== undefined && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                    Scriptural Insight
                  </h3>
                  <button
                    onClick={() => setShowInsight(false)}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Biblical Answer Indicator */}
                <div className="mb-3">
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    Biblical perspective tends toward:{' '}
                    <strong className="capitalize">{question.biblicalAnswer}</strong>
                  </span>
                </div>
                
                <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                  {question.scripturalInsight}
                </p>
                
                {/* Scripture References */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {question.references.map((ref) => (
                    <span
                      key={ref}
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded text-xs font-medium"
                    >
                      📖 {ref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={responses[question.id] === undefined}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === pulseQuestions.length - 1 ? 'View Results' : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Skip to Results (if has existing) */}
      {hasExistingResults && Object.keys(responses).length > 10 && (
        <div className="text-center">
          <button
            onClick={() => navigate('/pulse/results')}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Skip to Results ({Object.keys(responses).length} questions answered)
          </button>
        </div>
      )}

      {/* Info Footer */}
      <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Your responses are saved automatically. This diagnostic helps you reflect on your theological understanding, not test you. Take your time with each question.
        </p>
      </div>
    </div>
  )
}
