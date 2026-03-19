import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'
import { 
  Search, 
  X, 
  BookOpen, 
  PenTool, 
  Users, 
  Calendar, 
  Compass,
  FileText,
  Music,
  Clock,
  Filter,
  Trash2
} from 'lucide-react'
import { 
  performSearch, 
  SearchResult, 
  SearchCategory,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches
} from '../lib/advancedSearch'

const quickLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
  { name: 'Bible Reader', href: '/bible', icon: BookOpen },
  { name: 'Chronological Path', href: '/paths/chronological', icon: Calendar },
  { name: 'Thematic Path', href: '/paths/thematic', icon: Compass },
  { name: 'New Journal Entry', href: '/journal/new', icon: PenTool },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Word Study', href: '/word-study', icon: FileText },
  { name: 'Hymnal', href: '/resources/hymnal', icon: Music },
]

const categoryFilters: { value: SearchCategory; label: string; icon: typeof BookOpen }[] = [
  { value: 'all', label: 'All', icon: Search },
  { value: 'bible', label: 'Bible', icon: BookOpen },
  { value: 'journal', label: 'Journal', icon: PenTool },
  { value: 'sermon', label: 'Sermons', icon: FileText },
]

const typeIcons: Record<SearchCategory, typeof BookOpen> = {
  all: Search,
  bible: BookOpen,
  journal: PenTool,
  sermon: FileText,
  annotation: PenTool,
  hymn: Music,
  people: Users
}

export default function SearchModal() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const { closeSearch } = useSearch()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    setRecentSearches(getRecentSearches())
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true)
        const searchResults = await performSearch(query, { category })
        setResults(searchResults)
        setIsSearching(false)
      } else {
        setResults([])
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query, category])

  const filteredLinks = useMemo(() => {
    if (!query) return quickLinks
    return quickLinks.filter(link =>
      link.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const handleSelect = (href: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim())
    }
    closeSearch()
    navigate(href)
  }

  const handleResultSelect = (result: SearchResult) => {
    addRecentSearch(query.trim())
    closeSearch()
    navigate(result.href)
  }

  const handleRecentSearch = (search: string) => {
    setQuery(search)
    inputRef.current?.focus()
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const ResultIcon = (type: SearchCategory) => {
    const Icon = typeIcons[type] || Search
    return <Icon className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSearch}
      />
      
      <div className="relative min-h-full flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Bible passages, journal entries, sermons..."
              className="flex-1 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            {isSearching && (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              onClick={closeSearch}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500 uppercase">Category:</span>
                {categoryFilters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setCategory(filter.value)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      category === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <filter.icon className="h-3 w-3" />
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Search Results ({results.length})
                </div>
                {results.slice(0, 15).map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className="flex items-start gap-3 w-full px-3 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <div className="mt-0.5">
                      {ResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </span>
                        {result.reference && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {result.reference}
                          </span>
                        )}
                      </div>
                      {result.highlight && (
                        <p 
                          className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5"
                          dangerouslySetInnerHTML={{ __html: result.highlight }}
                        />
                      )}
                      <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                    </div>
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100">
                      {Math.round(result.relevance * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent searches */}
            {!query && recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Recent Searches
                  </span>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleRecentSearch(search)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick links */}
            {filteredLinks.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  {query ? 'Pages' : 'Quick Links'}
                </div>
                {filteredLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleSelect(link.href)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <link.icon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{link.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query && results.length === 0 && !isSearching && query.length >= 2 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term or filter</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                {' '}to navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd>
                {' '}to select
              </span>
            </div>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
              {' '}to close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
