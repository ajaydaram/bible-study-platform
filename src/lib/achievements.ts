/**
 * Reading Streaks & Achievements System
 * 
 * Tracks consecutive days of Bible reading and awards achievements
 * to encourage consistent engagement.
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db, trackEvent, AnalyticsEvents } from './firebase'
import { startOfDay, format, isToday, isYesterday } from 'date-fns'

// Achievement definitions
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'streak' | 'progress' | 'special' | 'social'
  requirement: number
  unlockedAt?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  { id: 'streak-3', name: 'Getting Started', description: 'Complete readings for 3 days in a row', icon: '🌱', category: 'streak', requirement: 3 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Complete readings for 7 days in a row', icon: '🔥', category: 'streak', requirement: 7 },
  { id: 'streak-14', name: 'Fortnight Fighter', description: 'Complete readings for 14 days in a row', icon: '⚡', category: 'streak', requirement: 14 },
  { id: 'streak-30', name: 'Monthly Master', description: 'Complete readings for 30 days in a row', icon: '🌟', category: 'streak', requirement: 30 },
  { id: 'streak-60', name: 'Devoted Disciple', description: 'Complete readings for 60 days in a row', icon: '💎', category: 'streak', requirement: 60 },
  { id: 'streak-90', name: 'Quarterly Champion', description: 'Complete readings for 90 days in a row', icon: '👑', category: 'streak', requirement: 90 },
  { id: 'streak-180', name: 'Half-Year Hero', description: 'Complete readings for 180 days in a row', icon: '🏆', category: 'streak', requirement: 180 },
  { id: 'streak-365', name: 'Annual Ambassador', description: 'Complete readings for 365 days in a row', icon: '🎖️', category: 'streak', requirement: 365 },
  
  // Progress achievements
  { id: 'days-10', name: 'First Steps', description: 'Complete 10 daily readings', icon: '📖', category: 'progress', requirement: 10 },
  { id: 'days-50', name: 'Faithful Reader', description: 'Complete 50 daily readings', icon: '📚', category: 'progress', requirement: 50 },
  { id: 'days-100', name: 'Century Club', description: 'Complete 100 daily readings', icon: '💯', category: 'progress', requirement: 100 },
  { id: 'days-250', name: 'Halfway There', description: 'Complete 250 daily readings', icon: '🎯', category: 'progress', requirement: 250 },
  { id: 'days-400', name: 'Almost Done', description: 'Complete 400 daily readings', icon: '🏅', category: 'progress', requirement: 400 },
  { id: 'days-502', name: 'Journey Complete', description: 'Finish all 502 days of the reading plan', icon: '🎊', category: 'progress', requirement: 502 },
  
  // Special achievements
  { id: 'early-bird', name: 'Early Bird', description: 'Complete a reading before 7 AM', icon: '🌅', category: 'special', requirement: 1 },
  { id: 'night-owl', name: 'Night Owl', description: 'Complete a reading after 10 PM', icon: '🦉', category: 'special', requirement: 1 },
  { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Complete readings on both Saturday and Sunday', icon: '📅', category: 'special', requirement: 1 },
  { id: 'era-complete-1', name: 'Era Pioneer', description: 'Complete your first Biblical Era', icon: '🗺️', category: 'special', requirement: 1 },
  { id: 'era-complete-5', name: 'Era Explorer', description: 'Complete 5 Biblical Eras', icon: '🧭', category: 'special', requirement: 5 },
  { id: 'era-complete-13', name: 'Era Master', description: 'Complete all 13 Biblical Eras', icon: '🌎', category: 'special', requirement: 13 },
  { id: 'journal-10', name: 'Reflective Reader', description: 'Write 10 journal entries', icon: '✍️', category: 'special', requirement: 10 },
  { id: 'prayer-10', name: 'Prayer Warrior', description: 'Log 10 prayer requests', icon: '🙏', category: 'special', requirement: 10 },
]

// Streak data interface
export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysCompleted: number
  lastCompletedDate: string | null
  streakStartDate: string | null
  weeklyProgress: boolean[] // Last 7 days, index 0 = today
  monthlyProgress: Record<string, boolean> // YYYY-MM-DD -> completed
}

export interface UserAchievements {
  unlocked: Achievement[]
  recentlyUnlocked: Achievement | null
  progress: Record<string, number> // Achievement ID -> current progress
}

// Get all available achievements
export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENTS
}

// Get user's streak data
export async function getStreakData(userId: string): Promise<StreakData> {
  try {
    const userDoc = await getDoc(doc(db, 'userStats', userId))
    const data = userDoc.data()
    
    if (!data?.streaks) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDaysCompleted: 0,
        lastCompletedDate: null,
        streakStartDate: null,
        weeklyProgress: [false, false, false, false, false, false, false],
        monthlyProgress: {}
      }
    }
    
    return data.streaks as StreakData
  } catch (error) {
    console.error('Failed to get streak data:', error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      lastCompletedDate: null,
      streakStartDate: null,
      weeklyProgress: [false, false, false, false, false, false, false],
      monthlyProgress: {}
    }
  }
}

// Update streak when completing a day
export async function updateStreak(userId: string): Promise<{
  streakData: StreakData
  newAchievements: Achievement[]
}> {
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd')
  const streakData = await getStreakData(userId)
  const newAchievements: Achievement[] = []
  
  // Check if already completed today
  if (streakData.lastCompletedDate === today) {
    return { streakData, newAchievements }
  }
  
  // Calculate new streak
  let newCurrentStreak = 1
  let newStreakStartDate = today
  
  if (streakData.lastCompletedDate) {
    const lastDate = new Date(streakData.lastCompletedDate)
    
    if (isYesterday(lastDate)) {
      // Continuing streak
      newCurrentStreak = streakData.currentStreak + 1
      newStreakStartDate = streakData.streakStartDate || today
    } else if (isToday(lastDate)) {
      // Already completed today
      newCurrentStreak = streakData.currentStreak
      newStreakStartDate = streakData.streakStartDate || today
    }
    // Otherwise, streak resets to 1
  }
  
  const newLongestStreak = Math.max(newCurrentStreak, streakData.longestStreak)
  const newTotalDays = streakData.totalDaysCompleted + 1
  
  // Update weekly progress
  const weeklyProgress = [...streakData.weeklyProgress]
  weeklyProgress.pop()
  weeklyProgress.unshift(true)
  
  // Update monthly progress
  const monthlyProgress = { ...streakData.monthlyProgress, [today]: true }
  
  const newStreakData: StreakData = {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    totalDaysCompleted: newTotalDays,
    lastCompletedDate: today,
    streakStartDate: newStreakStartDate,
    weeklyProgress,
    monthlyProgress
  }
  
  // Save to Firestore
  await setDoc(doc(db, 'userStats', userId), {
    streaks: newStreakData,
    updatedAt: new Date().toISOString()
  }, { merge: true })
  
  // Track analytics
  trackEvent(AnalyticsEvents.STREAK_MILESTONE, {
    current_streak: newCurrentStreak,
    total_days: newTotalDays
  })
  
  // Check for new achievements
  const userAchievements = await getUserAchievements(userId)
  const unlockedIds = new Set(userAchievements.unlocked.map(a => a.id))
  
  // Check streak achievements
  for (const achievement of ACHIEVEMENTS.filter(a => a.category === 'streak')) {
    if (!unlockedIds.has(achievement.id) && newCurrentStreak >= achievement.requirement) {
      newAchievements.push(achievement)
    }
  }
  
  // Check progress achievements
  for (const achievement of ACHIEVEMENTS.filter(a => a.category === 'progress')) {
    if (!unlockedIds.has(achievement.id) && newTotalDays >= achievement.requirement) {
      newAchievements.push(achievement)
    }
  }
  
  // Check time-based achievements
  const hour = new Date().getHours()
  if (!unlockedIds.has('early-bird') && hour < 7) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'early-bird')!)
  }
  if (!unlockedIds.has('night-owl') && hour >= 22) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'night-owl')!)
  }
  
  // Save new achievements
  if (newAchievements.length > 0) {
    await unlockAchievements(userId, newAchievements)
  }
  
  return { streakData: newStreakData, newAchievements }
}

// Get user's achievements
export async function getUserAchievements(userId: string): Promise<UserAchievements> {
  try {
    const userDoc = await getDoc(doc(db, 'userStats', userId))
    const data = userDoc.data()
    
    if (!data?.achievements) {
      return {
        unlocked: [],
        recentlyUnlocked: null,
        progress: {}
      }
    }
    
    const unlockedIds = data.achievements.unlocked || []
    const unlocked = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id))
      .map(a => ({
        ...a,
        unlockedAt: data.achievements.unlockedDates?.[a.id]
      }))
    
    return {
      unlocked,
      recentlyUnlocked: data.achievements.recentlyUnlocked 
        ? ACHIEVEMENTS.find(a => a.id === data.achievements.recentlyUnlocked) || null
        : null,
      progress: data.achievements.progress || {}
    }
  } catch (error) {
    console.error('Failed to get achievements:', error)
    return {
      unlocked: [],
      recentlyUnlocked: null,
      progress: {}
    }
  }
}

// Unlock achievements
export async function unlockAchievements(userId: string, achievements: Achievement[]): Promise<void> {
  const userDoc = doc(db, 'userStats', userId)
  const existing = await getDoc(userDoc)
  const data = existing.data()
  
  const currentUnlocked = data?.achievements?.unlocked || []
  const currentDates = data?.achievements?.unlockedDates || {}
  
  const newIds = achievements.map(a => a.id)
  const unlockedDates = { ...currentDates }
  const now = new Date().toISOString()
  
  for (const id of newIds) {
    unlockedDates[id] = now
  }
  
  await setDoc(userDoc, {
    achievements: {
      unlocked: [...new Set([...currentUnlocked, ...newIds])],
      unlockedDates,
      recentlyUnlocked: achievements[achievements.length - 1]?.id || null
    }
  }, { merge: true })
  
  // Track analytics
  for (const achievement of achievements) {
    trackEvent('achievement_unlocked', {
      achievement_id: achievement.id,
      achievement_name: achievement.name,
      achievement_category: achievement.category
    })
  }
}

// Clear recently unlocked (after showing notification)
export async function clearRecentlyUnlocked(userId: string): Promise<void> {
  await updateDoc(doc(db, 'userStats', userId), {
    'achievements.recentlyUnlocked': null
  })
}

// Check and update special achievements
export async function checkSpecialAchievements(
  userId: string, 
  context: {
    journalCount?: number
    prayerCount?: number
    erasCompleted?: number
    isWeekendComplete?: boolean
  }
): Promise<Achievement[]> {
  const userAchievements = await getUserAchievements(userId)
  const unlockedIds = new Set(userAchievements.unlocked.map(a => a.id))
  const newAchievements: Achievement[] = []
  
  // Journal achievement
  if (context.journalCount !== undefined) {
    if (!unlockedIds.has('journal-10') && context.journalCount >= 10) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'journal-10')!)
    }
  }
  
  // Prayer achievement
  if (context.prayerCount !== undefined) {
    if (!unlockedIds.has('prayer-10') && context.prayerCount >= 10) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'prayer-10')!)
    }
  }
  
  // Era achievements
  if (context.erasCompleted !== undefined) {
    if (!unlockedIds.has('era-complete-1') && context.erasCompleted >= 1) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'era-complete-1')!)
    }
    if (!unlockedIds.has('era-complete-5') && context.erasCompleted >= 5) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'era-complete-5')!)
    }
    if (!unlockedIds.has('era-complete-13') && context.erasCompleted >= 13) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'era-complete-13')!)
    }
  }
  
  // Weekend warrior
  if (context.isWeekendComplete && !unlockedIds.has('weekend-warrior')) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'weekend-warrior')!)
  }
  
  if (newAchievements.length > 0) {
    await unlockAchievements(userId, newAchievements)
  }
  
  return newAchievements
}

// Get streak status message
export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your reading journey today!"
  if (streak === 1) return "Great start! Keep it going tomorrow!"
  if (streak < 7) return `${streak} day streak! You're building momentum!`
  if (streak < 14) return `${streak} day streak! A full week and counting!`
  if (streak < 30) return `${streak} day streak! You're on fire! 🔥`
  if (streak < 60) return `${streak} day streak! A month of dedication!`
  if (streak < 90) return `${streak} day streak! Incredible consistency!`
  if (streak < 180) return `${streak} day streak! You're unstoppable!`
  if (streak < 365) return `${streak} day streak! Half a year strong!`
  return `${streak} day streak! A year of faithfulness! 🎉`
}

// Get next achievement to unlock (for motivation)
export function getNextAchievement(
  currentStreak: number, 
  totalDays: number,
  unlockedIds: string[]
): Achievement | null {
  // Find next streak achievement
  const streakAchievements = ACHIEVEMENTS
    .filter(a => a.category === 'streak' && !unlockedIds.includes(a.id))
    .sort((a, b) => a.requirement - b.requirement)
  
  if (streakAchievements.length > 0 && streakAchievements[0].requirement > currentStreak) {
    return streakAchievements[0]
  }
  
  // Find next progress achievement
  const progressAchievements = ACHIEVEMENTS
    .filter(a => a.category === 'progress' && !unlockedIds.includes(a.id))
    .sort((a, b) => a.requirement - b.requirement)
  
  if (progressAchievements.length > 0 && progressAchievements[0].requirement > totalDays) {
    return progressAchievements[0]
  }
  
  return null
}

// Calculate days until next milestone
export function getDaysUntilMilestone(currentStreak: number): { milestone: number; daysLeft: number } | null {
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365]
  
  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return { milestone, daysLeft: milestone - currentStreak }
    }
  }
  
  return null
}
