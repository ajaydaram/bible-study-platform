import { useState, useEffect, useMemo } from 'react'
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  HelpCircle, 
  Columns, 
  Calendar, 
  User, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Shuffle
} from 'lucide-react'

export interface CreedSection {
  id: string
  title: string
  content: string
}

export interface CreedDocument {
  id: string
  title: string
  year: number | null
  tradition: string
  type: string
  author: string
  summary: string
  pages: number
  sectionCount: number
  sections: CreedSection[]
}

export interface CreedsLibraryData {
  totalDocuments: number
  traditions: string[]
  documents: CreedDocument[]
}

export default function ConfessionsHubPage() {
  const [library, setLibrary] = useState<CreedsLibraryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'reader' | 'flashcards' | 'comparative'>('reader')
  
  // Filters
  const [selectedTradition, setSelectedTradition] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDocId, setSelectedDocId] = useState<string>('westminster-confession-1647')
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null)

  // Flashcard State
  const [flashcardDocId, setFlashcardDocId] = useState<string>('westminster-shorter-catechism-1647')
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0)
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

  // Comparative State
  const [compDocAId, setCompDocAId] = useState<string>('westminster-confession-1647')
  const [compDocBId, setCompDocBId] = useState<string>('london-baptist-confession-1689')

  useEffect(() => {
    fetch('/data/creeds/comprehensive-creeds.json')
      .then(res => res.json())
      .then((data: CreedsLibraryData) => {
        setLibrary(data)
        if (data.documents.length > 0) {
          setSelectedDocId(data.documents[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load comprehensive creeds:', err)
        setLoading(false)
      })
  }, [])

  const traditions = [
    { id: 'all', label: 'All Traditions' },
    { id: 'ecumenical', label: 'Ecumenical Creeds' },
    { id: 'reformed', label: 'Reformed' },
    { id: 'lutheran', label: 'Lutheran' },
    { id: 'presbyterian', label: 'Presbyterian' },
    { id: 'anglican', label: 'Anglican' },
    { id: 'baptist', label: 'Baptist' },
    { id: 'anabaptist', label: 'Anabaptist' },
    { id: 'pre-reformation', label: 'Pre-Reformation' },
    { id: 'modern', label: 'Modern Confessions' },
  ]

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'creed', label: 'Creeds' },
    { id: 'confession', label: 'Confessions' },
    { id: 'catechism', label: 'Catechisms' },
    { id: 'theses', label: 'Theses & Articles' },
    { id: 'canon', label: 'Canons' },
  ]

  const documents = library?.documents ?? []

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchTradition = selectedTradition === 'all' || doc.tradition === selectedTradition
      const matchType = selectedType === 'all' || doc.type === selectedType
      const matchSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase())
      return matchTradition && matchType && matchSearch
    })
  }, [documents, selectedTradition, selectedType, searchQuery])

  // Active selected document
  const selectedDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || filteredDocuments[0] || documents[0]
  }, [documents, selectedDocId, filteredDocuments])

  // Catechism documents for flashcard mode
  const catechismDocs = useMemo(() => {
    return documents.filter(d => d.type === 'catechism' || d.title.toLowerCase().includes('catechism'))
  }, [documents])

  const activeFlashcardDoc = useMemo(() => {
    return documents.find(d => d.id === flashcardDocId) || catechismDocs[0]
  }, [documents, flashcardDocId, catechismDocs])

  const flashcardSections = activeFlashcardDoc?.sections ?? []
  const currentFlashcard = flashcardSections[flashcardIdx]

  // Comparative documents
  const compDocA = documents.find(d => d.id === compDocAId)
  const compDocB = documents.find(d => d.id === compDocBId)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSectionId(id)
    setTimeout(() => setCopiedSectionId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading 49 Historic Creeds & Confessions...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-800/40 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>49 Primary-Source Historic Standards (325 A.D. – Present)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Historic Creeds & Confessions Hub
          </h1>
          <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed">
            Explore the timeless doctrinal foundations of the Christian Church across Ecumenical, Reformed, 
            Lutheran, Anglican, Presbyterian, and Baptist confessions with interactive flashcard and comparative theology modes.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-stone-800 pt-6">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'reader'
                ? 'bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Primary Document Reader</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'flashcards'
                ? 'bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Catechism Flashcard Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('comparative')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'comparative'
                ? 'bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Comparative Theology Matrix</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRIMARY DOCUMENT READER */}
      {activeTab === 'reader' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 49 documents, authors, summaries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {types.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedType === t.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tradition Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
              {traditions.map((trad) => (
                <button
                  key={trad.id}
                  onClick={() => setSelectedTradition(trad.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    selectedTradition === trad.id
                      ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {trad.label}
                </button>
              ))}
            </div>
          </div>

          {/* Master 2-Column Reader Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Document List Selector */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm space-y-2 max-h-[800px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Documents ({filteredDocuments.length})
                </span>
              </div>

              {filteredDocuments.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id)
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col space-y-1 ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-xs'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {doc.tradition} • {doc.year ? `${doc.year} AD` : 'Historic'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {doc.sectionCount} parts
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold line-clamp-1 ${
                      isSelected ? 'text-amber-900 dark:text-amber-200' : 'text-gray-900 dark:text-white'
                    }`}>
                      {doc.title}
                    </h4>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {doc.author}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Right: Selected Document Reader Display */}
            {selectedDoc && (
              <div className="lg:col-span-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Document Header */}
                <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold uppercase">
                        {selectedDoc.tradition}
                      </span>
                      <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold">
                        {selectedDoc.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedDoc.year ? `${selectedDoc.year} AD` : 'Historic'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                    {selectedDoc.title}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>{selectedDoc.author}</span>
                  </div>

                  {selectedDoc.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 italic">
                      "{selectedDoc.summary}"
                    </p>
                  )}
                </div>

                {/* Document Sections Content */}
                <div className="space-y-6">
                  {selectedDoc.sections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-750/50 border border-gray-200/80 dark:border-gray-700/80 space-y-3 group hover:border-amber-400/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {sec.title}
                        </h4>
                        <button
                          onClick={() => handleCopy(sec.content, sec.id || `sec-${idx}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Copy Section"
                        >
                          {copiedSectionId === (sec.id || `sec-${idx}`) ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-serif whitespace-pre-line">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CATECHISM FLASHCARDS MODE */}
      {activeTab === 'flashcards' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Catechism Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">Select Catechism:</span>
            </div>

            <select
              value={flashcardDocId}
              onChange={(e) => {
                setFlashcardDocId(e.target.value)
                setFlashcardIdx(0)
                setIsFlipped(false)
              }}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {catechismDocs.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} ({doc.sectionCount} Q&As)
                </option>
              ))}
            </select>
          </div>

          {/* Flashcard Component */}
          {currentFlashcard ? (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[320px] rounded-3xl p-8 border cursor-pointer transition-all flex flex-col justify-between shadow-lg relative select-none ${
                  isFlipped
                    ? 'bg-amber-950 text-white border-amber-700'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-amber-500'
                }`}
              >
                {/* Card Top Label */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    {activeFlashcardDoc?.title} • Card {flashcardIdx + 1} of {flashcardSections.length}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {isFlipped ? 'Click to show Question' : 'Click to Reveal Answer'}
                  </span>
                </div>

                {/* Card Main Text */}
                <div className="py-8 text-center space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif leading-relaxed">
                    {isFlipped ? (
                      <span className="text-amber-100">{currentFlashcard.content}</span>
                    ) : (
                      <span className="text-gray-900 dark:text-white">{currentFlashcard.title}</span>
                    )}
                  </h3>
                </div>

                {/* Card Footer Hint */}
                <div className="text-center">
                  <span className="text-xs font-semibold text-amber-500">
                    {isFlipped ? 'Answer Revealed' : 'Tap anywhere to reveal response'}
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setFlashcardIdx(Math.max(0, flashcardIdx - 1))
                    setIsFlipped(false)
                  }}
                  disabled={flashcardIdx === 0}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    const rand = Math.floor(Math.random() * flashcardSections.length)
                    setFlashcardIdx(rand)
                    setIsFlipped(false)
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-semibold text-sm flex items-center gap-1.5"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Shuffle</span>
                </button>

                <button
                  onClick={() => {
                    setFlashcardIdx(Math.min(flashcardSections.length - 1, flashcardIdx + 1))
                    setIsFlipped(false)
                  }}
                  disabled={flashcardIdx >= flashcardSections.length - 1}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No questions available for this catechism.</div>
          )}
        </div>
      )}

      {/* TAB 3: COMPARATIVE THEOLOGY MATRIX */}
      {activeTab === 'comparative' && (
        <div className="space-y-6">
          {/* Comparative Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Document 1</span>
              <select
                value={compDocAId}
                onChange={(e) => setCompDocAId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white"
              >
                {documents.map(d => (
                  <option key={d.id} value={d.id}>{d.title} ({d.tradition})</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Document 2</span>
              <select
                value={compDocBId}
                onChange={(e) => setCompDocBId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-900 dark:text-white"
              >
                {documents.map(d => (
                  <option key={d.id} value={d.id}>{d.title} ({d.tradition})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">{compDocA?.tradition} • {compDocA?.year} AD</span>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{compDocA?.title}</h3>
                <p className="text-xs text-gray-500">{compDocA?.author}</p>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {compDocA?.sections.map((sec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-200/60 dark:border-gray-700 space-y-2">
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white">{sec.title}</h5>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-serif leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{compDocB?.tradition} • {compDocB?.year} AD</span>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{compDocB?.title}</h3>
                <p className="text-xs text-gray-500">{compDocB?.author}</p>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {compDocB?.sections.map((sec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-200/60 dark:border-gray-700 space-y-2">
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white">{sec.title}</h5>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-serif leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
