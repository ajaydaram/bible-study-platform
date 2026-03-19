/**
 * Push Notifications Service
 * 
 * Uses Firebase Cloud Messaging for daily reading reminders
 * and other notifications.
 */

import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging'
import app, { trackEvent, AnalyticsEvents } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

// FCM Vapid Key - get this from Firebase Console > Project Settings > Cloud Messaging
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

export interface NotificationSettings {
  enabled: boolean
  dailyReminder: boolean
  reminderTime: string // HH:mm format
  streakAlerts: boolean
  weeklyDigest: boolean
  timezone: string
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: true,
  reminderTime: '07:00',
  streakAlerts: true,
  weeklyDigest: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
}

// Initialize FCM
let messaging: ReturnType<typeof getMessaging> | null = null

function initMessaging() {
  if (messaging) return messaging
  
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      messaging = getMessaging(app)
    } catch (error) {
      console.error('Failed to initialize FCM:', error)
    }
  }
  
  return messaging
}

// Request notification permission
export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  
  if (permission === 'granted') {
    trackEvent(AnalyticsEvents.SESSION_START, { notifications_enabled: true })
  }
  
  return permission
}

// Get FCM token
export async function getFCMToken(): Promise<string | null> {
  const fcm = initMessaging()
  if (!fcm || !VAPID_KEY) {
    console.log('FCM not available or VAPID key not configured')
    return null
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready
    
    const token = await getToken(fcm, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    })
    
    return token
  } catch (error) {
    console.error('Failed to get FCM token:', error)
    return null
  }
}

// Save FCM token to Firestore
export async function saveFCMToken(userId: string, token: string): Promise<void> {
  const tokenDoc = doc(db, 'fcmTokens', userId)
  
  await setDoc(tokenDoc, {
    token,
    updatedAt: new Date().toISOString(),
    platform: 'web',
    userAgent: navigator.userAgent
  }, { merge: true })
}

// Get notification settings
export async function getNotificationSettings(userId: string): Promise<NotificationSettings> {
  try {
    const settingsDoc = await getDoc(doc(db, 'userSettings', userId))
    const data = settingsDoc.data()
    
    return {
      ...DEFAULT_SETTINGS,
      ...data?.notifications
    }
  } catch (error) {
    console.error('Failed to get notification settings:', error)
    return DEFAULT_SETTINGS
  }
}

// Save notification settings
export async function saveNotificationSettings(
  userId: string, 
  settings: Partial<NotificationSettings>
): Promise<void> {
  const settingsDoc = doc(db, 'userSettings', userId)
  
  await setDoc(settingsDoc, {
    notifications: {
      ...settings,
      updatedAt: new Date().toISOString()
    }
  }, { merge: true })
}

// Enable notifications for user
export async function enableNotifications(userId: string): Promise<boolean> {
  const permission = await requestNotificationPermission()
  
  if (permission !== 'granted') {
    return false
  }
  
  const token = await getFCMToken()
  
  if (!token) {
    console.error('Failed to get FCM token')
    return false
  }
  
  await saveFCMToken(userId, token)
  await saveNotificationSettings(userId, { enabled: true })
  
  return true
}

// Disable notifications
export async function disableNotifications(userId: string): Promise<void> {
  await saveNotificationSettings(userId, { enabled: false })
}

// Handle foreground messages
export function onForegroundMessage(callback: (payload: MessagePayload) => void): () => void {
  const fcm = initMessaging()
  if (!fcm) return () => {}
  
  return onMessage(fcm, callback)
}

// Show local notification (for foreground messages)
export function showLocalNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }
  
  new Notification(title, {
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-192x192.svg',
    ...options
  })
}

// Schedule daily reminder (client-side backup using local storage)
export function scheduleLocalReminder(time: string): void {
  localStorage.setItem('dailyReminderTime', time)
  
  // Check if we need to show reminder
  const checkReminder = () => {
    const now = new Date()
    const [hours, minutes] = time.split(':').map(Number)
    
    if (now.getHours() === hours && now.getMinutes() === minutes) {
      const lastShown = localStorage.getItem('lastReminderShown')
      const today = now.toDateString()
      
      if (lastShown !== today) {
        showLocalNotification('Daily Bible Reading', {
          body: "It's time for your daily Scripture reading!",
          tag: 'daily-reminder',
          requireInteraction: true,
          actions: [
            { action: 'read', title: 'Start Reading' },
            { action: 'later', title: 'Remind Later' }
          ]
        } as NotificationOptions)
        
        localStorage.setItem('lastReminderShown', today)
      }
    }
  }
  
  // Check every minute
  setInterval(checkReminder, 60000)
  checkReminder() // Check immediately
}

// Update reminder time
export async function updateReminderTime(userId: string, time: string): Promise<void> {
  await saveNotificationSettings(userId, { reminderTime: time })
  scheduleLocalReminder(time)
}

// Send test notification
export function sendTestNotification(): void {
  if (Notification.permission === 'granted') {
    showLocalNotification('Test Notification', {
      body: 'Notifications are working! You will receive daily reading reminders.',
      tag: 'test-notification'
    })
  }
}

// Check if notifications are supported
export function areNotificationsSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator
}

// Get current permission status
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied'
  return Notification.permission
}
