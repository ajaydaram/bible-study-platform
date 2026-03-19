import { Settings as SettingsIcon, Moon, Sun, Shield, Trash2, Wifi, Download } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { NotificationSettingsInline } from '../components/NotificationSettings'
import OfflineIndicator from '../components/OfflineIndicator'
import { InstallButton } from '../components/PWAInstallPrompt'
import AccessibilitySettings from '../components/AccessibilitySettings'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { signOut } = useAuth()

  const clearData = () => {
    if (confirm('Are you sure you want to clear all your local data? This cannot be undone.')) {
      const keys = [
        'scriptorium_journal',
        'scriptorium_groups',
        'scriptorium_discussions',
        'scriptorium_prayers',
        'scriptorium_chrono_progress',
        'scriptorium_thematic_progress'
      ]
      keys.forEach(key => localStorage.removeItem(key))
      alert('All data has been cleared.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          Appearance
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Sun className="h-4 w-4 inline mr-1" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Moon className="h-4 w-4 inline mr-1" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <AccessibilitySettings />

      {/* Notifications */}
      <NotificationSettingsInline />

      {/* Offline & PWA */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Offline & App
        </h2>
        
        <div className="space-y-4">
          <OfflineIndicator showDetails />
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Install App
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add Scriptorium to your home screen
              </p>
            </div>
            <InstallButton />
          </div>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Data
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Clear local data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove all saved progress and entries</p>
            </div>
            <button
              onClick={clearData}
              className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="h-4 w-4 inline mr-1" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="w-full py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl font-medium transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}
