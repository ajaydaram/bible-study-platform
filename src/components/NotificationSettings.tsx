import { useState, useEffect } from 'react'
import { Bell, BellOff, Clock, Calendar, Zap, TestTube, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  areNotificationsSupported,
  getNotificationPermission,
  getNotificationSettings,
  enableNotifications,
  disableNotifications,
  updateReminderTime,
  sendTestNotification,
  type NotificationSettings
} from '../lib/notifications'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationSettingsPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(areNotificationsSupported())
    setPermissionStatus(getNotificationPermission())
    
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    if (!user) return
    try {
      const data = await getNotificationSettings(user.id)
      setSettings(data)
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    if (!user) return
    setSaving(true)
    try {
      const success = await enableNotifications(user.id)
      if (success) {
        setPermissionStatus('granted')
        setSettings(prev => prev ? { ...prev, enabled: true } : null)
      } else {
        setPermissionStatus(getNotificationPermission())
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDisableNotifications = async () => {
    if (!user) return
    setSaving(true)
    try {
      await disableNotifications(user.id)
      setSettings(prev => prev ? { ...prev, enabled: false } : null)
    } catch (error) {
      console.error('Failed to disable notifications:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTimeChange = async (time: string) => {
    if (!user || !settings) return
    setSaving(true)
    try {
      await updateReminderTime(user.id, time)
      setSettings(prev => prev ? { ...prev, reminderTime: time } : null)
    } catch (error) {
      console.error('Failed to update reminder time:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTestNotification = () => {
    sendTestNotification()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Not supported warning */}
          {!supported && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BellOff className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Notifications not supported
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Your browser doesn't support push notifications. Try using Chrome, Firefox, or Edge.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Permission denied warning */}
          {supported && permissionStatus === 'denied' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BellOff className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Notifications blocked
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    You've blocked notifications for this site. To enable them, click the lock icon in your browser's address bar and allow notifications.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main toggle */}
          {supported && permissionStatus !== 'denied' && (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex items-center gap-3">
                {settings?.enabled ? (
                  <Bell className="w-6 h-6 text-primary-600" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    {settings?.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={settings?.enabled ? handleDisableNotifications : handleEnableNotifications}
                disabled={saving || loading}
                className={`relative w-14 h-8 rounded-full transition-colors
                  ${settings?.enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
                  ${saving ? 'opacity-50 cursor-wait' : ''}`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform
                    ${settings?.enabled ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>
          )}

          {/* Settings (only shown when enabled) */}
          {settings?.enabled && (
            <>
              {/* Daily reminder time */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  Daily Reading Reminder
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500">
                    {settings.timezone.split('/')[1]?.replace('_', ' ') || settings.timezone}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  We'll remind you to complete your daily reading at this time.
                </p>
              </div>

              {/* Additional settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification Types
                </h3>
                
                {/* Streak alerts */}
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Streak Alerts</p>
                      <p className="text-sm text-gray-500">Get notified about streak milestones</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.streakAlerts}
                    onChange={() => {}}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>

                {/* Weekly digest */}
                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                      <p className="text-sm text-gray-500">Summary of your reading progress</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigest}
                    onChange={() => {}}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                </label>
              </div>

              {/* Test notification */}
              <button
                onClick={handleTestNotification}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 
                  rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <TestTube className="w-5 h-5" />
                Send Test Notification
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact notification toggle for header/settings
export function NotificationToggle() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    setPermissionStatus(getNotificationPermission())
  }, [])

  return (
    <>
      <button
        onClick={() => setShowPanel(true)}
        className={`p-2 rounded-lg transition-colors
          ${permissionStatus === 'granted' 
            ? 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20' 
            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        title="Notification Settings"
      >
        {permissionStatus === 'granted' ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5" />
        )}
      </button>
      
      <NotificationSettingsPanel 
        isOpen={showPanel} 
        onClose={() => setShowPanel(false)} 
      />
    </>
  )
}

// Inline notification settings for settings page
export function NotificationSettingsInline() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(areNotificationsSupported())
    setPermissionStatus(getNotificationPermission())
    
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await getNotificationSettings(user.id)
      setSettings(data)
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    if (!user) return
    setSaving(true)
    try {
      const success = await enableNotifications(user.id)
      if (success) {
        setPermissionStatus('granted')
        setSettings(prev => prev ? { ...prev, enabled: true } : null)
      } else {
        setPermissionStatus(getNotificationPermission())
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDisableNotifications = async () => {
    if (!user) return
    setSaving(true)
    try {
      await disableNotifications(user.id)
      setSettings(prev => prev ? { ...prev, enabled: false } : null)
    } catch (error) {
      console.error('Failed to disable notifications:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTimeChange = async (time: string) => {
    if (!user || !settings) return
    setSaving(true)
    try {
      await updateReminderTime(user.id, time)
      setSettings(prev => prev ? { ...prev, reminderTime: time } : null)
    } catch (error) {
      console.error('Failed to update reminder time:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTestNotification = () => {
    sendTestNotification()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5" />
        Notifications
      </h2>
      
      <div className="space-y-4">
        {/* Not supported warning */}
        {!supported && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
            <p className="text-amber-800 dark:text-amber-200">
              Your browser doesn't support push notifications.
            </p>
          </div>
        )}

        {/* Permission denied warning */}
        {supported && permissionStatus === 'denied' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
            <p className="text-red-800 dark:text-red-200">
              Notifications are blocked. Enable them in your browser settings.
            </p>
          </div>
        )}

        {/* Main toggle */}
        {supported && permissionStatus !== 'denied' && (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get daily reading reminders</p>
            </div>
            <button
              onClick={settings?.enabled ? handleDisableNotifications : handleEnableNotifications}
              disabled={saving || loading}
              className={`relative w-12 h-6 rounded-full transition-colors
                ${settings?.enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
                ${saving ? 'opacity-50 cursor-wait' : ''}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${settings?.enabled ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>
        )}

        {/* Reminder time (only shown when enabled) */}
        {settings?.enabled && (
          <>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Reminder Time</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">When to receive reminders</p>
              </div>
              <input
                type="time"
                value={settings?.reminderTime || '08:00'}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <button
              onClick={handleTestNotification}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm
                border border-gray-300 dark:border-gray-600 rounded-lg
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TestTube className="w-4 h-4" />
              Send Test
            </button>
          </>
        )}
      </div>
    </div>
  )
}
