import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Loader2,
  X,
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 

  pulseCategories,
  ResponseValue, 
  responseLabels,
  getCategoryQuestions,
  calculateCategoryScore,
  getAlignmentLabel
} from '../data/pulseQuestions'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const sectionToCategoryId: Record<string, number> = {
  'body-sexuality': 1,
  'singleness': 2,
  'marriage': 3,
  'kingdom-family': 4,
  'eschatology': 5
}

export default function PulseSection() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const { user } = useAuth()
  
  
  const categoryId = sectionToCategoryId[sectionId || ''] || 1
  const category = pulseCategories.find(c => c.id === categoryId)
  const sectionQuestions = getCategoryQuestions(categoryId)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, ResponseValue>>({})
  const [showInsight, setShowInsight] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)

  const question = sectionQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / sectionQuestions.length) * 100
  // const answeredCount = sectionQuestions.filter(q => responses[q.id] !== undefined).length
  // const isComplete = answeredCount === sectionQuestions.length

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
            
            // Check if this section is already complete
            const sectionAnswered = sectionQuestions.filter(
              q => data.responses[q.id] !== undefined
            ).length
            if (sectionAnswered === sectionQuestions.length) {
              setShowResults(true)
            }
          }
        }
      } catch (error) {
        console.error('Error loading responses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResponses()
  }, [user?.id, categoryId])

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
        }, { merge: true })
      } catch (error) {
        console.error('Error saving response:', error)
      }
    }
  }

  const nextQuestion = () => {
    setShowInsight(false)
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Section complete - show results
      setShowResults(true)
    }
  }

  const prevQuestion = () => {
    setShowInsight(false)
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const retakeSection = () => {
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!category || !question) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Section not found</p>
        <Link to="/pulse" className="text-purple-600 hover:underline mt-2 inline-block">
          Back to Pulse Hub
        </Link>
      </div>
    )
  }

  // Section Results View
  if (showResults) {
    const sectionScore = calculateCategoryScore(categoryId, responses)
    const alignment = getAlignmentLabel(sectionScore)
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <Link 
          to="/pulse"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pulse Hub
        </Link>

        {/* Results Header */}
        <div 
          className="rounded-2xl p-8 text-white text-center"
          style={{ backgroundColor: category.color }}
        >
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
          <p className="text-white/80">Section Complete!</p>
        </div>

        {/* Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <span className="text-3xl font-bold" style={{ color: category.color }}>
                {sectionScore}%
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {alignment}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
              {sectionScore >= 80 && "Your responses strongly align with traditional biblical teaching in this area."}
              {sectionScore >= 60 && sectionScore < 80 && "Your responses show good alignment with biblical teaching, with some areas for deeper study."}
              {sectionScore >= 40 && sectionScore < 60 && "Your responses show mixed alignment. Consider exploring the scriptural insights provided."}
              {sectionScore < 40 && "Your responses diverge from traditional biblical teaching. The scriptural insights may offer new perspectives."}
            </p>
          </div>

          {/* Question Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Your Responses
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sectionQuestions.map((q, idx) => {
                const response = responses[q.id]
                const matchesBiblical = (
                  (q.biblicalAnswer === 'agree' && response !== undefined && response > 0) ||
                  (q.biblicalAnswer === 'disagree' && response !== undefined && response < 0) ||
                  (q.biblicalAnswer === 'neutral' && response === 0)
                )
                
                return (
                  <div key={q.id} className="flex items-start gap-3 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      matchesBiblical 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {matchesBiblical ? '✓' : '○'}
                    </span>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
                        Q{idx + 1}: {q.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Your answer: {response !== undefined ? responseLabels[response] : 'Not answered'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={retakeSection}
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Review Questions
          </button>
          <Link
            to="/pulse"
            className="flex-1 py-3 text-center rounded-xl font-medium text-white transition-colors"
            style={{ backgroundColor: category.color }}
          >
            Try Another Section
          </Link>
        </div>

        {/* Full Results Link */}
        <div className="text-center">
          <Link
            to="/pulse/results"
            className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
          >
            View Complete Pulse Results →
          </Link>
        </div>
      </div>
    )
  }

  // Quiz View
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link 
        to="/pulse"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pulse Hub
      </Link>

      {/* Section Header */}
      <div 
        className="rounded-xl p-5 text-white"
        style={{ backgroundColor: category.color }}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{category.icon}</div>
          <div>
            <h1 className="text-xl font-bold">{category.name}</h1>
            <p className="text-white/80 text-sm mt-1">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Question {currentQuestionIndex + 1} of {sectionQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: category.color }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {/* Question Number & Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Q{currentQuestionIndex + 1}
            </span>
            {question.isNew && (
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                <Sparkles className="h-3 w-3 inline mr-1" />
                New
              </span>
            )}
            {responses[question.id] !== undefined && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
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
                      ? 'text-white'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={isSelected ? { backgroundColor: category.color } : {}}
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
                
                <div className="mb-3">
                  <span className="text-sm text-amber-700 dark:text-amber-300">
                    Biblical perspective tends toward:{' '}
                    <strong className="capitalize">{question.biblicalAnswer}</strong>
                  </span>
                </div>
                
                <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                  {question.scripturalInsight}
                </p>
                
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
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={responses[question.id] === undefined}
          className="flex items-center gap-2 px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ backgroundColor: category.color }}
        >
          {currentQuestionIndex === sectionQuestions.length - 1 ? 'View Section Results' : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Summary */}
      <div className="flex justify-center gap-1">
        {sectionQuestions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => { setCurrentQuestionIndex(idx); setShowInsight(false); }}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentQuestionIndex
                ? 'scale-125'
                : responses[q.id] !== undefined
                  ? 'opacity-100'
                  : 'opacity-30'
            }`}
            style={{ 
              backgroundColor: idx === currentQuestionIndex || responses[q.id] !== undefined 
                ? category.color 
                : '#9CA3AF'
            }}
          />
        ))}
      </div>
    </div>
  )
}
