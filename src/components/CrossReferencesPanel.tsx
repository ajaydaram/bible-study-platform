import { useState, useEffect, useCallback } from 'react'
import { 
  Link2, 
  ChevronRight, 
  ChevronDown,
  Loader2, 
  BookOpen, 
  Filter, 
  SortAsc,
  SortDesc,
  Layers,
  Book
} from 'lucide-react'
import {
  getCrossReferences,
  formatCrossReference,
  BOOK_NAMES,
  type CrossReference
} from '../lib/crossReferences'
import { getLocalVerse } from '../lib/localBible'

interface CrossReferencesPanelProps {
  book: string
  chapter: number
  verse: number
  onNavigate?: (book: string, chapter: number, verse: number) => void
  className?: string
}

type SortOption = 'relevance' | 'book-order' | 'votes'
type FilterOption = 'all' | 'ot' | 'nt' | 'parallel'

// OT books (using codes)
const OT_BOOKS = new Set([
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL'
])

// Synoptic Gospel parallel passages (simplified mapping)
const SYNOPTIC_GOSPELS = new Set(['MAT', 'MRK', 'LUK'])
const GOSPEL_BOOKS = new Set(['MAT', 'MRK', 'LUK', 'JHN'])

// Book order for sorting
const BOOK_ORDER = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
  'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
  'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS',
  '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
]

interface EnrichedReference extends CrossReference {
  text?: string
  isParallel?: boolean
  testament: 'ot' | 'nt'
}

export default function CrossReferencesPanel({
  book,
  chapter,
  verse,
  onNavigate,
  className = ''
}: CrossReferencesPanelProps) {
  const [references, setReferences] = useState<EnrichedReference[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedRefs, setExpandedRefs] = useState<Set<string>>(new Set())
  const [verseTexts, setVerseTexts] = useState<Record<string, string>>({})
  const [loadingTexts, setLoadingTexts] = useState<Set<string>>(new Set())
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Get current book code
  const currentBookCode = Object.entries(BOOK_NAMES).find(([_, name]) => name === book)?.[0] || book.toUpperCase().substring(0, 3)
  const isInGospel = GOSPEL_BOOKS.has(currentBookCode)

  useEffect(() => {
    loadReferences()
  }, [book, chapter, verse])

  const loadReferences = async () => {
    setIsLoading(true)
    setError(null)
    setExpandedRefs(new Set())
    setVerseTexts({})
    
    try {
      const refs = await getCrossReferences(book, chapter, verse)
      
      // Enrich references with metadata
      const enriched: EnrichedReference[] = refs.map(ref => ({
        ...ref,
        testament: OT_BOOKS.has(ref.book) ? 'ot' : 'nt',
        isParallel: isInGospel && SYNOPTIC_GOSPELS.has(ref.book) && ref.book !== currentBookCode
      }))
      
      setReferences(enriched)
    } catch (err) {
      setError('Failed to load cross-references')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRefKey = (ref: CrossReference) => `${ref.book}.${ref.chapter}.${ref.verseStart}`

  const loadVerseText = useCallback(async (ref: CrossReference) => {
    const key = getRefKey(ref)
    if (verseTexts[key] || loadingTexts.has(key)) return

    setLoadingTexts(prev => new Set(prev).add(key))
    
    try {
      const verse = await getLocalVerse('kjv', ref.book, ref.chapter, ref.verseStart)
      if (verse) {
        setVerseTexts(prev => ({ ...prev, [key]: verse.text }))
      }
    } catch (err) {
      console.error('Error loading verse text:', err)
    } finally {
      setLoadingTexts(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }, [verseTexts, loadingTexts])

  const toggleExpanded = (ref: CrossReference) => {
    const key = getRefKey(ref)
    setExpandedRefs(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
        loadVerseText(ref)
      }
      return next
    })
  }

  const handleNavigate = (ref: CrossReference) => {
    const bookName = BOOK_NAMES[ref.book] || ref.book
    onNavigate?.(bookName, ref.chapter, ref.verseStart)
  }

  // Filter and sort references
  const filteredAndSorted = references
    .filter(ref => {
      if (filterBy === 'all') return true
      if (filterBy === 'ot') return ref.testament === 'ot'
      if (filterBy === 'nt') return ref.testament === 'nt'
      if (filterBy === 'parallel') return ref.isParallel
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0)
      if (sortBy === 'book-order') {
        const aIndex = BOOK_ORDER.indexOf(a.book)
        const bIndex = BOOK_ORDER.indexOf(b.book)
        if (aIndex !== bIndex) return aIndex - bIndex
        if (a.chapter !== b.chapter) return a.chapter - b.chapter
        return a.verseStart - b.verseStart
      }
      // Default: relevance (votes)
      return (b.votes || 0) - (a.votes || 0)
    })

  // Count stats
  const otCount = references.filter(r => r.testament === 'ot').length
  const ntCount = references.filter(r => r.testament === 'nt').length
  const parallelCount = references.filter(r => r.isParallel).length

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading cross-references...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-sm text-red-500 py-4 text-center ${className}`}>
        {error}
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Cross-References
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {book} {chapter}:{verse}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 shadow-sm">
            {references.length} total
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-300">
            {otCount} OT
          </span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300">
            {ntCount} NT
          </span>
          {parallelCount > 0 && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {parallelCount} parallel
            </span>
          )}
        </div>

        {/* Filter/Sort Controls */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Filter */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Filter
              </label>
              <div className="flex flex-wrap gap-1">
                {[
                  { value: 'all' as FilterOption, label: 'All' },
                  { value: 'ot' as FilterOption, label: 'Old Testament' },
                  { value: 'nt' as FilterOption, label: 'New Testament' },
                  ...(parallelCount > 0 ? [{ value: 'parallel' as FilterOption, label: 'Parallel Passages' }] : [])
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterBy(opt.value)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      filterBy === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Sort by
              </label>
              <div className="flex flex-wrap gap-1">
                {[
                  { value: 'relevance' as SortOption, label: 'Relevance', icon: SortDesc },
                  { value: 'book-order' as SortOption, label: 'Book Order', icon: Book },
                  { value: 'votes' as SortOption, label: 'Votes', icon: SortAsc }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      sortBy === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <opt.icon className="h-3 w-3" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* References list */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Link2 className="h-10 w-10 opacity-30 mb-3" />
            <p className="text-sm font-medium">No cross-references found</p>
            <p className="text-xs mt-1 text-gray-400">
              {filterBy !== 'all' ? 'Try changing the filter' : 'Try selecting a different verse'}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredAndSorted.map((ref, index) => {
              const key = getRefKey(ref)
              const isExpanded = expandedRefs.has(key)
              const text = verseTexts[key]
              const isLoadingText = loadingTexts.has(key)

              return (
                <div
                  key={`${key}-${index}`}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    ref.isParallel
                      ? 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  } ${isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
                >
                  {/* Reference header */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleExpanded(ref)}
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        ref.testament === 'ot'
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : 'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        <BookOpen className={`h-4 w-4 ${
                          ref.testament === 'ot'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-green-600 dark:text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCrossReference(ref)}
                          </span>
                          {ref.isParallel && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded">
                              PARALLEL
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {BOOK_NAMES[ref.book]} • {ref.votes} votes
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <button
                      onClick={() => handleNavigate(ref)}
                      className="px-3 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-l border-gray-200 dark:border-gray-700"
                      title="Go to verse"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Expanded verse text */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-700">
                      {isLoadingText ? (
                        <div className="flex items-center gap-2 py-2 text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Loading verse...</span>
                        </div>
                      ) : text ? (
                        <blockquote className="text-sm text-gray-600 dark:text-gray-300 italic border-l-2 border-blue-300 dark:border-blue-700 pl-3 py-1">
                          "{text}"
                        </blockquote>
                      ) : (
                        <p className="text-sm text-gray-400 italic py-2">
                          Verse text not available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Treasury of Scripture Knowledge •{' '}
          <a 
            href="https://www.crosswire.org/sword/modules/ModInfo.jsp?modName=TSK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            CrossWire SWORD
          </a>
        </p>
      </div>
    </div>
  )
}

/**
 * Inline cross-references badge for verse display
 */
export function CrossReferencesBadge({
  book,
  chapter,
  verse,
  onClick
}: {
  book: string
  chapter: number
  verse: number
  onClick?: () => void
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getCrossReferences(book, chapter, verse).then(refs => {
      setCount(refs.length)
    })
  }, [book, chapter, verse])

  if (count === 0) return null

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs 
        bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
        rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
      title={`${count} cross-references`}
    >
      <Link2 className="h-3 w-3" />
      <span>{count}</span>
    </button>
  )
}
