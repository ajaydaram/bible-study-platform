import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, Loader2, BookMarked, Headphones, Link2, BookText, PanelRightOpen, PanelRightClose, Users, Info, Scroll, Map, Sparkles } from 'lucide-react'
import ScriptoriumNexusDrawer from '../components/ScriptoriumNexusDrawer'
import { getChapter, BIBLE_VERSIONS, DEFAULT_BIBLE_ID, type ParsedPassage } from '../lib/bibleApi'
import AudioPlayer from '../components/AudioPlayer'
import { isBibleBrainConfigured } from '../lib/bibleBrain'
import CrossReferencesPanel from '../components/CrossReferencesPanel'
import CommentaryPanel from '../components/CommentaryPanel'
import PatristicPanel from '../components/PatristicPanel'
import CreedProofsPanel from '../components/CreedProofsPanel'
import BibleMapSyncPanel from '../components/BibleMapSyncPanel'
import { getVersificationNote, hasVersificationDifference } from '../lib/versification'
import { loadCreedProofs, getCreedsForVerseSync, getOsisRef } from '../lib/creedProofs'
import { addProgressListener, removeProgressListener } from '../lib/localBible'
import { getTypologyForVerse, TypologyMapping } from '../data/typologyBibleMap'
import TypologyMarginBadge from '../components/TypologyMarginBadge'
import TypologySplitScreenModal from '../components/TypologySplitScreenModal'
import { getBookTheme } from '../data/storyOfScriptureData'
import { Link } from 'react-router-dom'

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
  const [showNexusDrawer, setShowNexusDrawer] = useState(false)
  const [studyTab, setStudyTab] = useState<'crossref' | 'commentary' | 'patristic' | 'confession' | 'map'>('crossref')
  const [indexingProgress, setIndexingProgress] = useState<number | null>(null)
  const [selectedTypologyMapping, setSelectedTypologyMapping] = useState<TypologyMapping | null>(null)

  const currentBookInfo = BIBLE_BOOKS.find(b => b.name === selectedBook)
  const currentVersionInfo = BIBLE_VERSIONS.find(v => v.id === selectedVersion)
  const audioConfigured = isBibleBrainConfigured()

  useEffect(() => {
    loadCreedProofs()
  }, [])

  useEffect(() => {
    const version = BIBLE_VERSIONS.find(v => v.id === selectedVersion)
    if (version?.local && version.localId) {
      const localId = version.localId

      const handleProgress = (progress: number) => {
        if (progress >= 100) {
          setIndexingProgress(100)
          setTimeout(() => setIndexingProgress(null), 3000)
        } else if (progress === -1) {
          setIndexingProgress(null)
        } else {
          setIndexingProgress(progress)
        }
      }

      addProgressListener(localId, handleProgress)
      
      // Trigger background indexing
      import('../lib/localBible').then(m => m.loadLocalBible(localId))

      return () => {
        removeProgressListener(localId, handleProgress)
      }
    } else {
      setIndexingProgress(null)
    }
  }, [selectedVersion])

  useEffect(() => {
    const bookParam = searchParams.get('book')
    const chapterParam = searchParams.get('chapter')
    const refParam = searchParams.get('ref') || searchParams.get('passage')

    if (refParam) {
      // Parse references like "John 1:1-3", "Colossians 1:16-17", "Genesis 2", "Genesis1"
      const cleanRef = refParam.replace(/^#/, '')
      const match = cleanRef.match(/^(\d?\s*[A-Za-z]+)\s*(\d+)?(?::(\d+))?/)
      if (match) {
        let rawBook = match[1].trim()
        // Format book name nicely e.g. "Genesis", "1 Samuel", "Colossians"
        const foundBook = BIBLE_BOOKS.find(
          b => b.name.toLowerCase() === rawBook.toLowerCase() || b.name.toLowerCase().replace(/\s+/g, '') === rawBook.toLowerCase()
        )
        if (foundBook) {
          setSelectedBook(foundBook.name)
          const chapNum = match[2] ? parseInt(match[2], 10) : 1
          setSelectedChapter(Math.min(chapNum, foundBook.chapters))
          if (match[3]) {
            setActiveVerse(parseInt(match[3], 10))
          }
        }
      }
    } else if (bookParam && BIBLE_BOOKS.some(b => b.name.toLowerCase() === bookParam.toLowerCase())) {
      const found = BIBLE_BOOKS.find(b => b.name.toLowerCase() === bookParam.toLowerCase())
      if (found) {
        setSelectedBook(found.name)
        if (chapterParam) {
          setSelectedChapter(Math.min(parseInt(chapterParam, 10), found.chapters))
        } else {
          setSelectedChapter(1)
        }
      }
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bible Reader</h1>
          </div>
          {indexingProgress !== null && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 animate-fade-in shadow-sm select-none">
              <div className={indexingProgress < 100 ? "animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 dark:border-indigo-400" : ""}>
                {indexingProgress === 100 ? "✓" : ""}
              </div>
              <span className="font-medium">
                {indexingProgress === 100 
                  ? `Offline Ready`
                  : `Offline Indexing: ${indexingProgress}%`}
              </span>
              <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-650 dark:bg-indigo-400 transition-all duration-300"
                  style={{ width: `${indexingProgress}%` }}
                ></div>
              </div>
            </div>
          )}
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

          {/* Scriptorium Nexus Toggle */}
          <button
            onClick={() => setShowNexusDrawer(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all"
            title="Scriptorium Nexus: Chiastic, Genre, FCF & Typology Engine"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Scriptorium Nexus</span>
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
            {/* Story of Scripture Thematic Header */}
            {(() => {
              const bookTheme = getBookTheme(selectedBook)
              if (!bookTheme) return null
              return (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
                      {bookTheme.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                          {bookTheme.division} • {bookTheme.subdivision}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({bookTheme.date})</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                        <span className="text-slate-400 font-normal">Theme:</span>
                        <span className="text-indigo-200 font-semibold">{bookTheme.theme}</span>
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <Link
                      to={`/bible?ref=${encodeURIComponent(bookTheme.keyVerse)}`}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      Key Verse: {bookTheme.keyVerse}
                    </Link>
                    <Link
                      to="/story-of-scripture"
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Story of Scripture →
                    </Link>
                  </div>
                </div>
              )
            })()}

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
                  
                  // Get confessional proofs
                  const osisRef = getOsisRef(selectedBook, selectedChapter, verse.verse);
                  const proofs = getCreedsForVerseSync(osisRef);
                  
                  // Get Typology Mapping
                  const typologyMapping = getTypologyForVerse(selectedBook, selectedChapter, verse.verse);
                  
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
                    {typologyMapping && (
                      <TypologyMarginBadge
                        mapping={typologyMapping}
                        onClick={() => setSelectedTypologyMapping(typologyMapping)}
                      />
                    )}
                    {proofs.length > 0 && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVerse(verse.verse);
                          setStudyTab('confession');
                          setShowStudyPanel(true);
                        }}
                        className="inline-flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/30 dark:border-indigo-800/30 cursor-pointer select-none"
                      >
                        <Scroll className="w-2.5 h-2.5" />
                        <span>
                          {proofs[0].creedTitle.includes('Westminster Confession')
                            ? 'WCF'
                            : proofs[0].creedTitle.includes('Heidelberg Catechism')
                            ? 'HC'
                            : proofs[0].creedTitle.includes('Baptist Catechism')
                            ? 'LBC'
                            : proofs[0].creedTitle.split(' ')[0]}{' '}
                          {proofs[0].sectionId.replace('chapter-', 'Ch.').replace('-section-', ' Sec.').replace('q-', 'Q')}{' '}
                          {proofs.length > 1 ? `(+${proofs.length - 1})` : ''}
                        </span>
                      </span>
                    )}
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
            <button
              onClick={() => setStudyTab('confession')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                studyTab === 'confession'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Scroll className="h-4 w-4" />
              <span className="hidden sm:inline">Creeds</span>
            </button>
            <button
              onClick={() => setStudyTab('map')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition-colors ${
                studyTab === 'map'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Maps</span>
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
            ) : studyTab === 'patristic' ? (
              <PatristicPanel
                book={selectedBook}
                chapter={selectedChapter}
                verse={activeVerse || 1}
              />
            ) : studyTab === 'confession' ? (
              <CreedProofsPanel
                reference={getOsisRef(selectedBook, selectedChapter, activeVerse || 1)}
              />
            ) : (
              <BibleMapSyncPanel
                book={selectedBook}
                chapter={selectedChapter}
                chapterText={passage?.text || ''}
              />
            )}
          </div>
        </div>
      )}

      {/* Scriptorium Nexus Drawer */}
      <ScriptoriumNexusDrawer
        isOpen={showNexusDrawer}
        onClose={() => setShowNexusDrawer(false)}
        book={selectedBook}
        chapter={selectedChapter}
        verse={activeVerse}
      />

      {/* Split Screen Typology Viewer Modal */}
      <TypologySplitScreenModal
        mapping={selectedTypologyMapping}
        isOpen={!!selectedTypologyMapping}
        onClose={() => setSelectedTypologyMapping(null)}
      />
    </div>
  )
}
