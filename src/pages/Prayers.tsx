import { useState, useEffect } from 'react'
import { Heart, Plus, Check, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import type { Prayer } from '../types'

const STORAGE_KEY = 'scriptorium_prayers'

export default function Prayers() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [newPrayer, setNewPrayer] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all')
  
  const { user } = useAuth()

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setPrayers(JSON.parse(stored))
    }
  }, [])

  const savePrayers = (newPrayers: Prayer[]) => {
    setPrayers(newPrayers)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrayers))
  }

  const addPrayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPrayer.trim()) return
    
    const prayer: Prayer = {
      id: crypto.randomUUID(),
      content: newPrayer,
      isAnswered: false,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'anonymous'
    }
    
    savePrayers([prayer, ...prayers])
    setNewPrayer('')
  }

  const toggleAnswered = (id: string) => {
    const updated = prayers.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isAnswered: !p.isAnswered,
          answeredAt: !p.isAnswered ? new Date().toISOString() : undefined
        }
      }
      return p
    })
    savePrayers(updated)
  }

  const deletePrayer = (id: string) => {
    if (confirm('Are you sure you want to delete this prayer?')) {
      savePrayers(prayers.filter(p => p.id !== id))
    }
  }

  const filteredPrayers = prayers.filter(p => {
    if (filter === 'active') return !p.isAnswered
    if (filter === 'answered') return p.isAnswered
    return true
  })

  const answeredCount = prayers.filter(p => p.isAnswered).length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {answeredCount} of {prayers.length} prayers answered
          </p>
        </div>
      </div>

      {/* Add prayer */}
      <form onSubmit={addPrayer} className="flex gap-3">
        <input
          type="text"
          value={newPrayer}
          onChange={(e) => setNewPrayer(e.target.value)}
          placeholder="Add a prayer request..."
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'answered'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Prayers list */}
      {filteredPrayers.length > 0 ? (
        <div className="space-y-3">
          {filteredPrayers.map(prayer => (
            <div
              key={prayer.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border p-4 ${
                prayer.isAnswered
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleAnswered(prayer.id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    prayer.isAnswered
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {prayer.isAnswered && <Check className="h-3 w-3" />}
                </button>
                <div className="flex-1">
                  <p className={`text-gray-700 dark:text-gray-300 ${prayer.isAnswered ? 'line-through opacity-70' : ''}`}>
                    {prayer.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(prayer.createdAt), 'MMM d, yyyy')}
                    {prayer.answeredAt && ` • Answered ${format(new Date(prayer.answeredAt), 'MMM d, yyyy')}`}
                  </p>
                </div>
                <button
                  onClick={() => deletePrayer(prayer.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {filter === 'all' ? 'No prayer requests yet' : `No ${filter} prayers`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'all' ? 'Add your first prayer request above' : 'Check other filters'}
          </p>
        </div>
      )}
    </div>
  )
}
