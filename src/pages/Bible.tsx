import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, Loader2, BookMarked, Headphones, Link2, BookText, PanelRightOpen, PanelRightClose, Users, Info } from 'lucide-react'
import { getChapter, BIBLE_VERSIONS, DEFAULT_BIBLE_ID, type ParsedPassage } from '../lib/bibleApi'
import AudioPlayer from '../components/AudioPlayer'
import { isBibleBrainConfigured } from '../lib/bibleBrain'
import CrossReferencesPanel from '../components/CrossReferencesPanel'
import CommentaryPanel from '../components/CommentaryPanel'
import PatristicPanel from '../components/PatristicPanel'
import { getVersificationNote, hasVersificationDifference } from '../lib/versification'

const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
]

export default function Bible() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedBook, setSelectedBook] = useState(searchParams.get('book') || 'John')
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [selectedVersion, setSelectedVersion] = useState(DEFAULT_BIBLE_ID)
  const [passage, setPassage] = useState<ParsedPassage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [activeVerse, setActiveVerse] = useState<number | null>(null)
  const [showStudyPanel, setShowStudyPanel] = useState(false)
  const [studyTab, setStudyTab] = useState<'crossref' | 'commentary' | 'patristic'>('crossref')

  const currentBookInfo = BIBLE_BOOKS.find(b => b.name === selectedBook)
  const currentVersionInfo = BIBLE_VERSIONS.find(v => v.id === selectedVersion)
  const audioConfigured = isBibleBrainConfigured()

  useEffect(() => {
    const bookParam = searchParams.get('book')
    if (bookParam && BIBLE_BOOKS.some(b => b.name === bookParam)) {
      setSelectedBook(bookParam)
      setSelectedChapter(1)
    }
  }, [searchParams])

  useEffect(() => {
    fetchPassage()
  }, [selectedBook, selectedChapter, selectedVersion])

  const fetchPassage = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const data = await getChapter(selectedVersion, selectedBook, selectedChapter)
      setPassage(data)
    } catch (err) {
      console.error('Error fetching passage:', err)
      setError('Failed to load passage. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookChange = (book: string) => {
    setSelectedBook(book)
    setSelectedChapter(1)
    setSearchParams({ book })
  }

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1)
    }
  }

  const handleNextChapter = () => {
    if (currentBookInfo && selectedChapter < currentBookInfo.chapters) {
      setSelectedChapter(prev => prev + 1)
    }
  }

  return (
    <div className="flex gap-4">
      {/* Main content area */}
      <div className={`flex-1 space-y-6 transition-all duration-300 ${showStudyPanel ? 'max-w-3xl' : 'max-w-4xl mx-auto'}`}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bible Reader</h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedBook}
            onChange={(e) => handleBookChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
        >
          {BIBLE_BOOKS.map(book => (
            <option key={book.name} value={book.name}>{book.name}</option>
          ))}
        </select>

        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
        >
          {currentBookInfo && Array.from({ length: currentBookInfo.chapters }, (_, i) => (
            <option key={i + 1} value={i + 1}>Chapter {i + 1}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-gray-500" />
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            {BIBLE_VERSIONS.map(version => (
              <option key={version.id} value={version.id}>{version.abbr}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Listen Button */}
          <button
            onClick={() => setShowAudioPlayer(!showAudioPlayer)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showAudioPlayer 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={audioConfigured ? 'Listen to this chapter' : 'Configure BibleBrain API to enable audio'}
          >
            <Headphones className="h-4 w-4" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          {/* Study Panel Toggle */}
          <button
            onClick={() => setShowStudyPanel(!showStudyPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showStudyPanel 
                ? 'bg-amber-600 text-white border-amber-600' 
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Cross-References & Commentary"
          >
            {showStudyPanel ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Study</span>
          </button>
          
          <button
            onClick={handlePrevChapter}
            disabled={selectedChapter <= 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextChapter}
            disabled={!currentBookInfo || selectedChapter >= currentBookInfo.chapters}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Audio Player */}
      {showAudioPlayer && (
        <AudioPlayer
          bookName={selectedBook}
          chapter={selectedChapter}
          currentVerse={activeVerse || undefined}
          onVerseChange={setActiveVerse}
          onClose={() => setShowAudioPlayer(false)}
        />
      )}

      {/* Content - Scripture Reading Pane */}
      <div className="scripture-card">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading Scripture...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-80 text-red-500">
            <p>{error}</p>
          </div>
        ) : passage ? (
          <div className="animate-fade-in">
            {/* Chapter Header */}
            <div className="text-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="chapter-heading">
                {passage.reference}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
                {currentVersionInfo?.name || 'King James Version'}
              </span>
            </div>
            
            {/* Scripture Text */}
            <div className="scripture-text">
              {passage.verses?.length > 0 ? (
                passage.verses.map((verse) => {
                  // Get book abbreviation for versification lookup
                  const bookAbbr = selectedBook.replace(/\s+/g, '').substring(0, 3);
                  const versificationNote = getVersificationNote(bookAbbr, selectedChapter, verse.verse);
                  const hasVerseDiff = hasVersificationDifference(bookAbbr, selectedChapter, verse.verse);
                  
                  return (
                  <p 
                    key={verse.verse} 
                    className={`verse-line transition-colors duration-300 cursor-pointer ${
                      showAudioPlayer && activeVerse === verse.verse 
                        ? 'bg-primary-50 dark:bg-primary-900/30 -mx-4 px-4 py-1 rounded-lg' 
                        : activeVerse === verse.verse
                        ? 'bg-amber-50 dark:bg-amber-900/20 -mx-4 px-4 py-1 rounded-lg'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 py-1 rounded-lg'
                    }`}
                    onClick={() => {
                      setActiveVerse(verse.verse)
                      if (!showStudyPanel) {
                        setShowStudyPanel(true)
                      }
                    }}
                  >
                    <sup className="verse-num">
                      {verse.verse}
                      {hasVerseDiff && (
                        <span 
                          className="ml-0.5 text-amber-500 cursor-help" 
                          title={versificationNote || 'Versification differs in Hebrew/Greek texts'}
                        >
                          <Info className="inline w-3 h-3" />
                        </span>
                      )}
                    </sup>
                    <span className="verse-text">{verse.text}</span>
                  </p>
                )})
              ) : (
                <p className="verse-text">{passage.text}</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
      </div>

      {/* Study Panel - Cross-References & Commentary */}
      {showStudyPanel && (
        <div className="w-96 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          {/* Tab Header */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStudyTab('crossref')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                studyTab === 'crossref'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Cross-Refs</span>
            </button>
            <button
              onClick={() => setStudyTab('commentary')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                studyTab === 'commentary'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400 bg-amber-50/50 dark:bg-amber-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <BookText className="h-4 w-4" />
              <span className="hidden sm:inline">M. Henry</span>
            </button>
            <button
              onClick={() => setStudyTab('patristic')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                studyTab === 'patristic'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Fathers</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {studyTab === 'crossref' ? (
              <CrossReferencesPanel
                book={selectedBook}
                chapter={selectedChapter}
                verse={activeVerse || 1}
                onNavigate={(book, chapter, verse) => {
                  handleBookChange(book)
                  setSelectedChapter(chapter)
                  setActiveVerse(verse)
                }}
              />
            ) : studyTab === 'commentary' ? (
              <CommentaryPanel
                book={selectedBook}
                chapter={selectedChapter}
                currentVerse={activeVerse || undefined}
                onVerseClick={(verse) => setActiveVerse(verse)}
              />
            ) : (
              <PatristicPanel
                book={selectedBook}
                chapter={selectedChapter}
                verse={activeVerse || 1}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
