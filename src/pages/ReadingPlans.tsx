import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Plus, 
  Play, 
  Pause, 
  Check, 
  Calendar,
  Clock,
  ChevronRight,
  Trash2,
  Edit,
  Target,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  ReadingPlan,
  UserPlanProgress,
  getUserPlans,
  getActivePlan,
  getUserPlanProgress,
  startPlan,
  stopPlan,
  resumePlan,
  deletePlan,
  calculateProgress
} from '../lib/readingPlans'

export default function ReadingPlans() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<ReadingPlan[]>([])
  const [progress, setProgress] = useState<UserPlanProgress[]>([])
  const [activePlan, setActivePlan] = useState<{ plan: ReadingPlan; progress: UserPlanProgress } | null>(null)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = () => {
    if (!user) return
    setPlans(getUserPlans(user.id))
    setProgress(getUserPlanProgress(user.id))
    setActivePlan(getActivePlan(user.id))
  }

  const handleStartPlan = (planId: string) => {
    if (!user) return
    startPlan(planId, user.id)
    loadData()
  }

  const handleStopPlan = (planId: string) => {
    if (!user) return
    stopPlan(planId, user.id)
    loadData()
  }

  const handleResumePlan = (planId: string) => {
    if (!user) return
    resumePlan(planId, user.id)
    loadData()
  }

  const handleDeletePlan = (planId: string) => {
    if (!user) return
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlan(planId, user.id)
      loadData()
    }
  }

  const getPlanProgress = (planId: string) => {
    return progress.find(p => p.planId === planId)
  }

  const getCategoryColor = (category: ReadingPlan['category']) => {
    const colors = {
      'bible-in-year': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'book-study': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'topical': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'devotional': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      'custom': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[category] || colors.custom
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reading Plans</h1>
            <p className="text-gray-500 dark:text-gray-400">Create and follow Bible reading plans</p>
          </div>
        </div>
        <Link
          to="/reading-plans/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Plan
        </Link>
      </div>

      {/* Active Plan */}
      {activePlan && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-blue-200 text-sm font-medium">Currently Reading</span>
              <h2 className="text-xl font-bold mt-1">{activePlan.plan.title}</h2>
            </div>
            <button
              onClick={() => navigate(`/reading-plans/${activePlan.plan.id}`)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Day {activePlan.progress.currentDay} of {activePlan.plan.duration}</span>
              <span>{calculateProgress(activePlan.plan, activePlan.progress)}% complete</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${calculateProgress(activePlan.plan, activePlan.progress)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Started {new Date(activePlan.progress.startDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {activePlan.progress.completedDays.length} days completed
              </span>
            </div>
            <button
              onClick={() => navigate(`/reading-plans/${activePlan.plan.id}`)}
              className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Continue Reading
            </button>
          </div>
        </div>
      )}

      {/* Your Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Plans</h2>
        
        {plans.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reading plans yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first reading plan to start your Bible reading journey
            </p>
            <Link
              to="/reading-plans/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Plan
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map(plan => {
              const planProgress = getPlanProgress(plan.id)
              const progressPercent = planProgress ? calculateProgress(plan, planProgress) : 0
              const isActive = activePlan?.plan.id === plan.id

              return (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {plan.title}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(plan.category)}`}>
                        {plan.category.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/reading-plans/${plan.id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {plan.duration} days
                    </span>
                    {planProgress && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {progressPercent}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {planProgress && (
                    <div className="mb-4">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!planProgress ? (
                      <button
                        onClick={() => handleStartPlan(plan.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        Start Plan
                      </button>
                    ) : isActive ? (
                      <>
                        <button
                          onClick={() => navigate(`/reading-plans/${plan.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Continue
                        </button>
                        <button
                          onClick={() => handleStopPlan(plan.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Pause"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleResumePlan(plan.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Suggested Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Get Started</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/reading-plans/new?template=bible-in-year"
            className="block p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md transition-shadow"
          >
            <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Bible in a Year</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Read through the entire Bible in 365 days</p>
          </Link>

          <Link
            to="/reading-plans/new?template=new-testament-90"
            className="block p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-md transition-shadow"
          >
            <Clock className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">New Testament in 90 Days</h3>
            <p className="text-sm text-green-700 dark:text-green-300">Complete the New Testament in 3 months</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
