import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PenTool, Plus, Search, Trash2, Edit, Download, Share2, FileText } from 'lucide-react'
import { format } from 'date-fns'
import type { JournalEntry } from '../types'
import { exportJournalToPdf, exportMultipleJournalsToPdf } from '../lib/pdfExport'
import ShareNoteModal from '../components/ShareNoteModal'

const STORAGE_KEY = 'scriptorium_journal'

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [search, setSearch] = useState('')
  const [shareEntry, setShareEntry] = useState<JournalEntry | null>(null)
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(search.toLowerCase()) ||
    entry.content.toLowerCase().includes(search.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

  const deleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const newEntries = entries.filter(e => e.id !== id)
      setEntries(newEntries)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries))
    }
  }

  const handleExportSingle = (entry: JournalEntry) => {
    exportJournalToPdf({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      passage: entry.passage,
      tags: entry.tags,
      createdAt: entry.createdAt
    })
  }

  const handleExportAll = () => {
    const entriesToExport = selectedEntries.size > 0
      ? entries.filter(e => selectedEntries.has(e.id))
      : filteredEntries
    
    if (entriesToExport.length === 0) return
    
    exportMultipleJournalsToPdf(
      entriesToExport.map(e => ({
        id: e.id,
        title: e.title,
        content: e.content,
        passage: e.passage,
        tags: e.tags,
        createdAt: e.createdAt
      })),
      selectedEntries.size > 0 ? 'Selected Journal Entries' : 'My Journal'
    )
    setSelectedEntries(new Set())
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedEntries)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedEntries(newSelected)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PenTool className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
            <p className="text-gray-500 dark:text-gray-400">Your spiritual reflections</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {filteredEntries.length > 0 && (
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={selectedEntries.size > 0 ? `Export ${selectedEntries.size} selected` : 'Export all to PDF'}
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">
                {selectedEntries.size > 0 ? `Export (${selectedEntries.size})` : 'Export PDF'}
              </span>
            </button>
          )}
          <Link
            to="/journal/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Entry
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entries..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Entries */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedEntries.has(entry.id)}
                    onChange={() => toggleSelect(entry.id)}
                    className="mt-1.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
                      {entry.passage && ` • ${entry.passage}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShareEntry(entry)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleExportSingle(entry)}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    title="Export to PDF"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/journal/edit/${entry.id}`}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                {entry.content}
              </p>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <PenTool className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {search ? 'No entries found' : 'No journal entries yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search ? 'Try a different search term' : 'Start documenting your spiritual journey'}
          </p>
          {!search && (
            <Link
              to="/journal/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Entry
            </Link>
          )}
        </div>
      )}

      {/* Share Modal */}
      {shareEntry && (
        <ShareNoteModal
          isOpen={!!shareEntry}
          onClose={() => setShareEntry(null)}
          note={{
            title: shareEntry.title,
            content: shareEntry.content,
            passage: shareEntry.passage,
            tags: shareEntry.tags
          }}
        />
      )}
    </div>
  )
}
