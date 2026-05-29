import { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react'
import { isOnline, onConnectivityChange, getUnsyncedProgress, getCacheStats } from '../lib/offlineStorage'

interface OfflineIndicatorProps {
  showDetails?: boolean
}

export default function OfflineIndicator({ showDetails = false }: OfflineIndicatorProps) {
  const [online, setOnline] = useState(isOnline())
  const [unsyncedCount, setUnsyncedCount] = useState(0)
  const [cacheStats, setCacheStats] = useState<{ cachedDaysCount: number; cachedVersesCount: number; cacheSize: string } | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const cleanup = onConnectivityChange((isOnline) => {
      setOnline(isOnline)
      if (!isOnline) {
        setShowBanner(true)
      } else {
        // Auto-hide banner after coming back online
        setTimeout(() => setShowBanner(false), 3000)
      }
    })

    // Check for unsynced progress
    checkUnsyncedProgress()

    return cleanup
  }, [])

  useEffect(() => {
    if (showDetails) {
      loadCacheStats()
    }
  }, [showDetails])

  const checkUnsyncedProgress = async () => {
    try {
      const unsynced = await getUnsyncedProgress()
      setUnsyncedCount(unsynced.length)
    } catch (error) {
      console.error('Failed to check unsynced progress:', error)
    }
  }

  const loadCacheStats = async () => {
    try {
      const stats = await getCacheStats()
      setCacheStats(stats)
    } catch (error) {
      console.error('Failed to load cache stats:', error)
    }
  }

  // Compact indicator for header
  if (!showDetails) {
    if (online && unsyncedCount === 0) {
      return null // Don't show anything when online and synced
    }

    return (
      <>
        {/* Status indicator */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
          ${online 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
          }`}
        >
          {online ? (
            <>
              <Wifi className="w-3 h-3" />
              {unsyncedCount > 0 && (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Syncing...
                </span>
              )}
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Offline banner */}
        {showBanner && !online && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
            <div className="bg-amber-500 text-white rounded-lg p-4 shadow-lg flex items-center gap-3">
              <WifiOff className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-medium">You're offline</p>
                <p className="text-sm text-amber-100">
                  Don't worry! Your cached readings are still available.
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="ml-auto p-1 hover:bg-amber-600 rounded"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Detailed view for settings page
  return (
    <div className="space-y-4">
      {/* Connection status */}
      <div className={`p-4 rounded-xl flex items-center gap-4
        ${online 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
        }`}
      >
        {online ? (
          <Cloud className="w-8 h-8 text-green-500" />
        ) : (
          <CloudOff className="w-8 h-8 text-amber-500" />
        )}
        <div>
          <p className={`font-medium ${online ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
            {online ? 'Connected' : 'Offline Mode'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {online 
              ? 'Your data is syncing with the cloud' 
              : 'Reading from cached data'
            }
          </p>
        </div>
      </div>

      {/* Cache statistics */}
      {cacheStats && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Offline Cache
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {cacheStats.cachedDaysCount}
              </p>
              <p className="text-xs text-gray-500">Days Cached</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {cacheStats.cachedVersesCount}
              </p>
              <p className="text-xs text-gray-500">Passages</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {cacheStats.cacheSize}
              </p>
              <p className="text-xs text-gray-500">Storage</p>
            </div>
          </div>
        </div>
      )}

      {/* Unsynced progress warning */}
      {unsyncedCount > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className={`w-5 h-5 text-blue-500 ${online ? 'animate-spin' : ''}`} />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">
                {unsyncedCount} item{unsyncedCount !== 1 ? 's' : ''} pending sync
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {online 
                  ? 'Syncing your progress...' 
                  : 'Will sync when back online'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Connection status hook
export function useOnlineStatus() {
  const [online, setOnline] = useState(isOnline())

  useEffect(() => {
    const cleanup = onConnectivityChange(setOnline)
    return cleanup
  }, [])

  return online
}
