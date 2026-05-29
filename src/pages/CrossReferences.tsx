import { useState, useRef, useEffect } from 'react'
import { Link2, BookOpen, Loader2, Search, X } from 'lucide-react'

// Common cross-reference data (curated important connections)
const crossReferenceData: Record<string, string[]> = {
  'Genesis 1:1': ['John 1:1-3', 'Colossians 1:16-17', 'Hebrews 11:3', 'Psalm 33:6'],
  'Genesis 1:26': ['Genesis 5:1', 'Genesis 9:6', 'Colossians 3:10', 'James 3:9'],
  'Genesis 3:15': ['Romans 16:20', 'Galatians 4:4', 'Hebrews 2:14', 'Revelation 12:9'],
  'Genesis 12:1-3': ['Acts 7:2-3', 'Hebrews 11:8', 'Galatians 3:8', 'Romans 4:13'],
  'Genesis 22:18': ['Acts 3:25', 'Galatians 3:16', 'Hebrews 6:13-14'],
  'Exodus 12:21': ['1 Corinthians 5:7', '1 Peter 1:19', 'John 1:29', 'Revelation 5:6'],
  'Exodus 20:3': ['Deuteronomy 5:7', 'Matthew 4:10', 'Mark 12:30'],
  'Leviticus 17:11': ['Hebrews 9:22', 'Matthew 26:28', 'Ephesians 1:7'],
  'Deuteronomy 6:4-5': ['Mark 12:29-30', 'Matthew 22:37', 'Luke 10:27'],
  'Psalm 2:7': ['Acts 13:33', 'Hebrews 1:5', 'Hebrews 5:5'],
  'Psalm 16:10': ['Acts 2:27', 'Acts 13:35'],
  'Psalm 22:1': ['Matthew 27:46', 'Mark 15:34'],
  'Psalm 22:18': ['John 19:24', 'Matthew 27:35'],
  'Psalm 23:1': ['John 10:11', 'Hebrews 13:20', '1 Peter 2:25', '1 Peter 5:4'],
  'Psalm 34:20': ['John 19:36'],
  'Psalm 40:6-8': ['Hebrews 10:5-7'],
  'Psalm 45:6-7': ['Hebrews 1:8-9'],
  'Psalm 69:21': ['Matthew 27:34', 'John 19:29'],
  'Psalm 110:1': ['Matthew 22:44', 'Acts 2:34-35', 'Hebrews 1:13'],
  'Psalm 118:22': ['Matthew 21:42', 'Acts 4:11', '1 Peter 2:7'],
  'Isaiah 7:14': ['Matthew 1:23', 'Luke 1:31'],
  'Isaiah 9:6': ['John 1:1', 'Romans 9:5', 'Titus 2:13'],
  'Isaiah 40:3': ['Matthew 3:3', 'Mark 1:3', 'Luke 3:4', 'John 1:23'],
  'Isaiah 53:5': ['1 Peter 2:24', 'Romans 4:25', 'Hebrews 9:28'],
  'Isaiah 53:7': ['Acts 8:32', '1 Peter 2:23'],
  'Isaiah 53:12': ['Mark 15:28', 'Luke 22:37'],
  'Isaiah 61:1-2': ['Luke 4:18-19'],
  'Jeremiah 31:31-34': ['Hebrews 8:8-12', 'Hebrews 10:16-17'],
  'Daniel 7:13-14': ['Matthew 24:30', 'Mark 14:62', 'Revelation 1:7'],
  'Micah 5:2': ['Matthew 2:6', 'John 7:42'],
  'Zechariah 9:9': ['Matthew 21:5', 'John 12:15'],
  'Zechariah 11:12-13': ['Matthew 27:9-10'],
  'Zechariah 12:10': ['John 19:37', 'Revelation 1:7'],
  'Malachi 3:1': ['Matthew 11:10', 'Mark 1:2', 'Luke 7:27'],
  'Matthew 1:23': ['Isaiah 7:14'],
  'Matthew 5:17': ['Romans 10:4', 'Galatians 3:24'],
  'Matthew 16:18': ['Ephesians 2:20', '1 Peter 2:4-8'],
  'Matthew 22:37-40': ['Deuteronomy 6:5', 'Leviticus 19:18', 'Romans 13:9'],
  'Matthew 28:19': ['Mark 16:15', 'Acts 1:8'],
  'John 1:1': ['Genesis 1:1', 'Colossians 1:17', '1 John 1:1', 'Revelation 19:13'],
  'John 1:14': ['Colossians 1:19', 'Colossians 2:9', '1 Timothy 3:16'],
  'John 1:29': ['Exodus 12:3', 'Isaiah 53:7', '1 Peter 1:19', 'Revelation 5:6'],
  'John 3:14-15': ['Numbers 21:9', 'John 12:32'],
  'John 3:16': ['Romans 5:8', '1 John 4:9-10'],
  'John 10:11': ['Psalm 23:1', 'Isaiah 40:11', 'Hebrews 13:20', '1 Peter 5:4'],
  'John 14:6': ['Acts 4:12', '1 Timothy 2:5'],
  'Romans 3:23': ['Romans 5:12', 'Galatians 3:22', '1 John 1:8'],
  'Romans 5:8': ['John 3:16', '1 John 4:10', 'Ephesians 2:4-5'],
  'Romans 6:23': ['Genesis 2:17', 'Romans 5:12', 'James 1:15'],
  'Romans 8:28': ['Genesis 50:20', 'Ephesians 1:11'],
  'Romans 10:9-10': ['Acts 16:31', 'Philippians 2:11'],
  'Ephesians 2:8-9': ['Romans 3:24', 'Titus 3:5', 'Romans 4:4-5'],
  '1 John 1:9': ['Psalm 32:5', 'Proverbs 28:13'],
  'Revelation 1:7': ['Daniel 7:13', 'Zechariah 12:10', 'Matthew 24:30'],
  'Revelation 21:4': ['Isaiah 25:8', 'Isaiah 65:19'],
  'Revelation 22:13': ['Isaiah 44:6', 'Revelation 1:8'],
}

// Cache for fetched verses
const verseCache: Record<string, string> = {}

interface TooltipPosition {
  x: number
  y: number
}

export default function CrossReferences() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVerse, setSelectedVerse] = useState<string>('')
  const [crossRefs, setCrossRefs] = useState<string[]>([])
  const [hoveredRef, setHoveredRef] = useState<string | null>(null)
  const [tooltipText, setTooltipText] = useState<string>('')
  const [tooltipLoading, setTooltipLoading] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 })
  const [expandedRef, setExpandedRef] = useState<string | null>(null)
  const [expandedText, setExpandedText] = useState<string>('')
  const [loadingExpanded, setLoadingExpanded] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Popular verses for quick access
  const popularVerses = [
    'John 3:16', 'Romans 8:28', 'Psalm 23:1', 'Isaiah 53:5', 
    'Genesis 1:1', 'John 1:1', 'Romans 6:23', 'Ephesians 2:8-9'
  ]

  // Fetch verse text from API
  const fetchVerseText = async (reference: string): Promise<string> => {
    if (verseCache[reference]) {
      return verseCache[reference]
    }

    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`
      )
      if (response.ok) {
        const data = await response.json()
        const text = data.text?.trim() || 'Unable to load verse'
        verseCache[reference] = text
        return text
      }
    } catch (err) {
      console.error('Error fetching verse:', err)
    }
    return 'Unable to load verse'
  }

  // Handle verse selection
  const handleVerseSelect = (verse: string) => {
    setSelectedVerse(verse)
    setExpandedRef(null)
    setExpandedText('')
    
    // Find cross-references
    const refs = crossReferenceData[verse] || []
    setCrossRefs(refs)
    
    if (refs.length === 0) {
      // Try to find partial matches
      const matchingKeys = Object.keys(crossReferenceData).filter(key => 
        key.toLowerCase().includes(verse.toLowerCase()) ||
        verse.toLowerCase().includes(key.split(':')[0].toLowerCase())
      )
      if (matchingKeys.length > 0) {
        setCrossRefs(crossReferenceData[matchingKeys[0]] || [])
        setSelectedVerse(matchingKeys[0])
      }
    }
  }

  // Track active hover
  const hoverActive = useRef<string | null>(null)
  useEffect(() => {
    hoverActive.current = hoveredRef
  }, [hoveredRef])

  // Handle mouse enter on reference
  const handleMouseEnter = async (ref: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 8
    })
    setHoveredRef(ref)
    setTooltipLoading(true)
    
    const text = await fetchVerseText(ref)
    if (hoverActive.current === ref) {
      setTooltipText(text)
      setTooltipLoading(false)
    }
  }

  const handleMouseLeave = () => {
    setHoveredRef(null)
    setTooltipText('')
    setTooltipLoading(false)
  }

  // Handle click to expand
  const handleRefClick = async (ref: string) => {
    if (expandedRef === ref) {
      setExpandedRef(null)
      setExpandedText('')
      return
    }
    
    setExpandedRef(ref)
    setLoadingExpanded(true)
    
    const text = await fetchVerseText(ref)
    setExpandedText(text)
    setLoadingExpanded(false)
  }

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleVerseSelect(searchQuery.trim())
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link2 className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cross References</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover connected passages throughout Scripture
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a verse reference (e.g., John 3:16)"
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Popular Verses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Popular Verses</h3>
        <div className="flex flex-wrap gap-2">
          {popularVerses.map(verse => (
            <button
              key={verse}
              onClick={() => handleVerseSelect(verse)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedVerse === verse
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
              }`}
            >
              {verse}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Verse & Cross References */}
      {selectedVerse && (
        <div className="space-y-4">
          {/* Selected Verse Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-purple-200 text-sm">Selected Verse</span>
            </div>
            <h2 className="text-xl font-bold">{selectedVerse}</h2>
            <p className="text-purple-100 mt-2 text-sm">
              {crossRefs.length} cross reference{crossRefs.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Cross References List */}
          {crossRefs.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Hover</span> to preview or <span className="text-purple-600 dark:text-purple-400 font-medium">click</span> to expand any reference
                </p>
              </div>
              {crossRefs.map((ref, index) => (
                <div key={ref} className="relative">
                  <button
                    onMouseEnter={(e) => handleMouseEnter(ref, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleRefClick(ref)}
                    className={`w-full text-left p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${
                      expandedRef === ref ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{ref}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {expandedRef === ref ? 'Click to collapse' : 'Click to expand'}
                      </span>
                    </div>
                    
                    {/* Expanded content */}
                    {expandedRef === ref && (
                      <div className="mt-3 pl-9">
                        {loadingExpanded ? (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                          </div>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                            {expandedText}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No cross-references found for this verse.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try searching for a different verse like "John 3:16" or "Romans 8:28"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedVerse && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Link2 className="h-12 w-12 text-purple-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Explore Cross References
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Select a popular verse above or search for any verse to discover its connected passages throughout Scripture.
          </p>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredRef && (
        <div
          ref={tooltipRef}
          className="fixed z-50 max-w-sm bg-gray-900 text-white p-4 rounded-lg shadow-xl"
          style={{
            left: Math.min(tooltipPosition.x, window.innerWidth - 320),
            top: tooltipPosition.y,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-purple-300">{hoveredRef}</span>
            <X 
              className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" 
              onClick={handleMouseLeave}
            />
          </div>
          {tooltipLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <p className="text-sm text-gray-200 leading-relaxed">
              {tooltipText.length > 300 ? tooltipText.substring(0, 300) + '...' : tooltipText}
            </p>
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <h3 className="font-medium text-purple-900 dark:text-purple-200 mb-2">
          💡 About Cross References
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-300">
          Cross-references connect related passages in the Bible, helping you see how themes, prophecies, and teachings are woven throughout Scripture. Many Old Testament passages are fulfilled or quoted in the New Testament.
        </p>
      </div>
    </div>
  )
}
