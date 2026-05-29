/**
 * User Reading Plans System
 * 
 * Allows users to create, manage, and follow custom reading plans.
 */

import { trackEvent, AnalyticsEvents } from './firebase'

export interface ReadingPlanDay {
  day: number
  passages: string[] // e.g., ["Genesis 1-2", "Psalm 1"]
  title?: string
  notes?: string
  completed?: boolean
  completedAt?: string
}

export interface ReadingPlan {
  id: string
  userId: string
  authorName: string
  title: string
  description: string
  duration: number // days
  category: 'bible-in-year' | 'book-study' | 'topical' | 'devotional' | 'custom'
  isPublic: boolean
  tags: string[]
  days: ReadingPlanDay[]
  followers: number
  rating: number
  ratingCount: number
  createdAt: string
  updatedAt: string
}

export interface UserPlanProgress {
  planId: string
  userId: string
  startDate: string
  currentDay: number
  completedDays: number[]
  lastReadAt?: string
  isActive: boolean
}

const STORAGE_KEY = 'scriptorium_reading_plans'
const PROGRESS_KEY = 'scriptorium_plan_progress'

// Built-in reading plan templates
export const planTemplates = {
  'bible-in-year': {
    title: 'Bible in a Year',
    description: 'Read through the entire Bible in 365 days',
    duration: 365,
    category: 'bible-in-year' as const
  },
  'new-testament-90': {
    title: 'New Testament in 90 Days',
    description: 'Read the entire New Testament in 90 days',
    duration: 90,
    category: 'book-study' as const
  },
  'psalms-30': {
    title: 'Through the Psalms',
    description: 'Read all 150 Psalms in 30 days (5 per day)',
    duration: 30,
    category: 'devotional' as const
  },
  'gospels-4-weeks': {
    title: 'Four Gospels in Four Weeks',
    description: 'Read one Gospel each week',
    duration: 28,
    category: 'book-study' as const
  }
}

// Create a new reading plan (local storage for now)
export function createReadingPlan(
  userId: string,
  authorName: string,
  title: string,
  description: string,
  duration: number,
  category: ReadingPlan['category'],
  days: ReadingPlanDay[],
  isPublic = false,
  tags: string[] = []
): string {
  const planId = `plan_${userId}_${Date.now()}`
  
  const plan: ReadingPlan = {
    id: planId,
    userId,
    authorName,
    title,
    description,
    duration,
    category,
    isPublic,
    tags,
    days,
    followers: 0,
    rating: 0,
    ratingCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Save to local storage
  const plans = getLocalPlans()
  plans.push(plan)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))

  trackEvent(AnalyticsEvents.READING_PLAN_CREATED || 'reading_plan_created', {
    category,
    duration,
    is_public: isPublic
  })

  return planId
}

// Get all local plans
export function getLocalPlans(): ReadingPlan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Get user's plans
export function getUserPlans(userId: string): ReadingPlan[] {
  return getLocalPlans().filter(p => p.userId === userId)
}

// Get a specific plan
export function getPlan(planId: string): ReadingPlan | null {
  return getLocalPlans().find(p => p.id === planId) || null
}

// Update a plan
export function updatePlan(planId: string, userId: string, updates: Partial<ReadingPlan>): boolean {
  const plans = getLocalPlans()
  const index = plans.findIndex(p => p.id === planId && p.userId === userId)
  
  if (index === -1) return false
  
  plans[index] = { 
    ...plans[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  
  return true
}

// Delete a plan
export function deletePlan(planId: string, userId: string): boolean {
  const plans = getLocalPlans()
  const filtered = plans.filter(p => !(p.id === planId && p.userId === userId))
  
  if (filtered.length === plans.length) return false
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  
  // Also delete progress
  deleteProgress(planId, userId)
  
  return true
}

// Start following a plan
export function startPlan(planId: string, userId: string): UserPlanProgress {
  const progress: UserPlanProgress = {
    planId,
    userId,
    startDate: new Date().toISOString(),
    currentDay: 1,
    completedDays: [],
    isActive: true
  }

  const allProgress = getAllProgress()
  // Deactivate other plans for this user
  allProgress.forEach(p => {
    if (p.userId === userId) p.isActive = false
  })
  allProgress.push(progress)
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))

  trackEvent(AnalyticsEvents.READING_PLAN_STARTED || 'reading_plan_started', {
    plan_id: planId
  })

  return progress
}

// Get all progress records
function getAllProgress(): UserPlanProgress[] {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Get user's progress for a plan
export function getPlanProgress(planId: string, userId: string): UserPlanProgress | null {
  return getAllProgress().find(p => p.planId === planId && p.userId === userId) || null
}

// Get user's active plan
export function getActivePlan(userId: string): { plan: ReadingPlan; progress: UserPlanProgress } | null {
  const progress = getAllProgress().find(p => p.userId === userId && p.isActive)
  if (!progress) return null

  const plan = getPlan(progress.planId)
  if (!plan) return null

  return { plan, progress }
}

// Get all user's plan progress
export function getUserPlanProgress(userId: string): UserPlanProgress[] {
  return getAllProgress().filter(p => p.userId === userId)
}

// Mark a day as complete
export function completePlanDay(planId: string, userId: string, day: number): boolean {
  const allProgress = getAllProgress()
  const index = allProgress.findIndex(p => p.planId === planId && p.userId === userId)
  
  if (index === -1) return false
  
  if (!allProgress[index].completedDays.includes(day)) {
    allProgress[index].completedDays.push(day)
  }
  allProgress[index].currentDay = Math.max(allProgress[index].currentDay, day + 1)
  allProgress[index].lastReadAt = new Date().toISOString()
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))

  trackEvent(AnalyticsEvents.READING_PLAN_DAY_COMPLETED || 'reading_plan_day_completed', {
    plan_id: planId,
    day
  })

  return true
}

// Uncomplete a day
export function uncompletePlanDay(planId: string, userId: string, day: number): boolean {
  const allProgress = getAllProgress()
  const index = allProgress.findIndex(p => p.planId === planId && p.userId === userId)
  
  if (index === -1) return false
  
  allProgress[index].completedDays = allProgress[index].completedDays.filter(d => d !== day)
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
  
  return true
}

// Delete progress
function deleteProgress(planId: string, userId: string): void {
  const allProgress = getAllProgress()
  const filtered = allProgress.filter(p => !(p.planId === planId && p.userId === userId))
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(filtered))
}

// Stop/pause a plan
export function stopPlan(planId: string, userId: string): boolean {
  const allProgress = getAllProgress()
  const index = allProgress.findIndex(p => p.planId === planId && p.userId === userId)
  
  if (index === -1) return false
  
  allProgress[index].isActive = false
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
  
  return true
}

// Resume a plan
export function resumePlan(planId: string, userId: string): boolean {
  const allProgress = getAllProgress()
  
  // Deactivate other plans
  allProgress.forEach(p => {
    if (p.userId === userId) p.isActive = false
  })
  
  const index = allProgress.findIndex(p => p.planId === planId && p.userId === userId)
  if (index === -1) return false
  
  allProgress[index].isActive = true
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
  
  return true
}

// Calculate progress percentage
export function calculateProgress(plan: ReadingPlan, progress: UserPlanProgress): number {
  if (plan.duration === 0) return 100
  return Math.round((progress.completedDays.length / plan.duration) * 100)
}

// Generate a simple Bible-in-year plan
export function generateBibleInYearPlan(): ReadingPlanDay[] {
  const days: ReadingPlanDay[] = []
  
  const otBooks = [
    { name: 'Genesis', chapters: 50 },
    { name: 'Exodus', chapters: 40 },
    { name: 'Leviticus', chapters: 27 },
    { name: 'Numbers', chapters: 36 },
    { name: 'Deuteronomy', chapters: 34 },
    { name: 'Joshua', chapters: 24 },
    { name: 'Judges', chapters: 21 },
    { name: 'Ruth', chapters: 4 },
    { name: '1 Samuel', chapters: 31 },
    { name: '2 Samuel', chapters: 24 },
    { name: '1 Kings', chapters: 22 },
    { name: '2 Kings', chapters: 25 },
    { name: '1 Chronicles', chapters: 29 },
    { name: '2 Chronicles', chapters: 36 },
    { name: 'Ezra', chapters: 10 },
    { name: 'Nehemiah', chapters: 13 },
    { name: 'Esther', chapters: 10 },
    { name: 'Job', chapters: 42 },
    { name: 'Psalms', chapters: 150 },
    { name: 'Proverbs', chapters: 31 },
    { name: 'Ecclesiastes', chapters: 12 },
    { name: 'Song of Solomon', chapters: 8 },
    { name: 'Isaiah', chapters: 66 },
    { name: 'Jeremiah', chapters: 52 },
    { name: 'Lamentations', chapters: 5 },
    { name: 'Ezekiel', chapters: 48 },
    { name: 'Daniel', chapters: 12 },
    { name: 'Hosea', chapters: 14 },
    { name: 'Joel', chapters: 3 },
    { name: 'Amos', chapters: 9 },
    { name: 'Obadiah', chapters: 1 },
    { name: 'Jonah', chapters: 4 },
    { name: 'Micah', chapters: 7 },
    { name: 'Nahum', chapters: 3 },
    { name: 'Habakkuk', chapters: 3 },
    { name: 'Zephaniah', chapters: 3 },
    { name: 'Haggai', chapters: 2 },
    { name: 'Zechariah', chapters: 14 },
    { name: 'Malachi', chapters: 4 },
  ]

  const ntBooks = [
    { name: 'Matthew', chapters: 28 },
    { name: 'Mark', chapters: 16 },
    { name: 'Luke', chapters: 24 },
    { name: 'John', chapters: 21 },
    { name: 'Acts', chapters: 28 },
    { name: 'Romans', chapters: 16 },
    { name: '1 Corinthians', chapters: 16 },
    { name: '2 Corinthians', chapters: 13 },
    { name: 'Galatians', chapters: 6 },
    { name: 'Ephesians', chapters: 6 },
    { name: 'Philippians', chapters: 4 },
    { name: 'Colossians', chapters: 4 },
    { name: '1 Thessalonians', chapters: 5 },
    { name: '2 Thessalonians', chapters: 3 },
    { name: '1 Timothy', chapters: 6 },
    { name: '2 Timothy', chapters: 4 },
    { name: 'Titus', chapters: 3 },
    { name: 'Philemon', chapters: 1 },
    { name: 'Hebrews', chapters: 13 },
    { name: 'James', chapters: 5 },
    { name: '1 Peter', chapters: 5 },
    { name: '2 Peter', chapters: 3 },
    { name: '1 John', chapters: 5 },
    { name: '2 John', chapters: 1 },
    { name: '3 John', chapters: 1 },
    { name: 'Jude', chapters: 1 },
    { name: 'Revelation', chapters: 22 },
  ]

  // Generate OT readings (about 3 chapters per day for 270 days)
  const otChapters: string[] = []
  for (const book of otBooks) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      otChapters.push(`${book.name} ${ch}`)
    }
  }

  // Generate NT readings
  const ntChapters: string[] = []
  for (const book of ntBooks) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      ntChapters.push(`${book.name} ${ch}`)
    }
  }

  // Distribute across 365 days
  const otPerDay = Math.ceil(otChapters.length / 365)
  const ntPerDay = Math.ceil(ntChapters.length / 365)

  for (let day = 1; day <= 365; day++) {
    const otStart = (day - 1) * otPerDay
    const otEnd = Math.min(otStart + otPerDay, otChapters.length)
    const ntStart = (day - 1) * ntPerDay
    const ntEnd = Math.min(ntStart + ntPerDay, ntChapters.length)

    const passages: string[] = []
    
    if (otStart < otChapters.length) {
      if (otEnd - otStart === 1) {
        passages.push(otChapters[otStart])
      } else {
        passages.push(`${otChapters[otStart]} - ${otChapters[otEnd - 1]}`)
      }
    }
    
    if (ntStart < ntChapters.length) {
      if (ntEnd - ntStart === 1) {
        passages.push(ntChapters[ntStart])
      } else {
        passages.push(`${ntChapters[ntStart]} - ${ntChapters[ntEnd - 1]}`)
      }
    }

    days.push({
      day,
      passages,
      title: `Day ${day}`
    })
  }

  return days
}

// Duplicate/copy a plan
export function duplicatePlan(planId: string, userId: string, authorName: string): string | null {
  const original = getPlan(planId)
  if (!original) return null

  return createReadingPlan(
    userId,
    authorName,
    `${original.title} (Copy)`,
    original.description,
    original.duration,
    original.category,
    original.days.map(d => ({ ...d, completed: false, completedAt: undefined })),
    false,
    original.tags
  )
}
