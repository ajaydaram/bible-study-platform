import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  BookOpen, 
  Scroll, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Languages, 
  Layers, 
  Compass, 
  Loader2,
  Lightbulb,
  Heart
} from 'lucide-react'
import { 
  getVerseExegesis, 
  getConfessionalSynthesis, 
  getSermonOutline, 
  askTheologicalQuestion,
  type ExegesisResponse,
  type ConfessionalSynthesisResponse,
  type SermonOutlineResponse
} from '../lib/geminiApi'

export default function ScribePage() {
  const [activeTab, setActiveTab] = useState<'exegesis' | 'confessional' | 'sermon' | 'chat'>('exegesis')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // 1. Exegesis State
  const [exegesisRef, setExegesisRef] = useState('Romans 8:28-30')
  const [exegesisResult, setExegesisResult] = useState<ExegesisResponse | null>(null)

  // 2. Confessional Synthesis State
  const [confessionQuery, setConfessionQuery] = useState("How do Westminster, the 39 Articles, and Augsburg Confession understand the Lord's Supper?")
  const [confessionResult, setConfessionResult] = useState<ConfessionalSynthesisResponse | null>(null)

  // 3. Sermon Outlining State
  const [sermonPassage, setSermonPassage] = useState('Ephesians 2:1-10')
  const [sermonGoal, setSermonGoal] = useState('Preach on grace vs. works and the new creation in Christ.')
  const [sermonResult, setSermonResult] = useState<SermonOutlineResponse | null>(null)

  // 4. Chat State
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'scribe'; content: string }[]>([
    {
      role: 'scribe',
      content: 'Grace and peace! I am Scriptorium Scribe, your AI theological assistant and exegesis copilot. How can I assist your study of God’s Word today?'
    }
  ])

  // Handlers
  const handleRunExegesis = async (refToUse?: string) => {
    const target = refToUse || exegesisRef
    if (!target.trim()) return
    setLoading(true)
    try {
      const res = await getVerseExegesis(target)
      setExegesisResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleRunConfession = async (queryToUse?: string) => {
    const target = queryToUse || confessionQuery
    if (!target.trim()) return
    setLoading(true)
    try {
      const res = await getConfessionalSynthesis(target)
      setConfessionResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleRunSermon = async () => {
    if (!sermonPassage.trim()) return
    setLoading(true)
    try {
      const res = await getSermonOutline(sermonPassage, sermonGoal)
      setSermonResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const reply = await askTheologicalQuestion(userMsg)
      setChatMessages(prev => [...prev, { role: 'scribe', content: reply }])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini AI Theological Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Scriptorium Scribe
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your personal biblical scholar and sermon copilot. Conduct deep verse exegesis, 
            synthesize historic confessions, and construct Christ-centered expository sermon outlines.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-800 pt-6">
          <button
            onClick={() => setActiveTab('exegesis')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'exegesis'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Verse Exegesis</span>
          </button>

          <button
            onClick={() => setActiveTab('confessional')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'confessional'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-400" />
            <span>Confessional Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('sermon')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'sermon'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Sermon Copilot</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span>Ask Scribe Consultation</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VERSE EXEGESIS */}
      {activeTab === 'exegesis' && (
        <div className="space-y-6">
          {/* Input Box */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={exegesisRef}
                  onChange={(e) => setExegesisRef(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunExegesis()}
                  placeholder="Enter Bible reference (e.g. John 1:1, Romans 8:28, Isaiah 53:5)..."
                  className="w-full pl-4 pr-4 py-3.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                onClick={() => handleRunExegesis()}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Exegete Passage</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-750">
              <span className="text-xs text-gray-400 font-medium">Quick Studies:</span>
              {['Romans 8:28-30', 'John 1:1-5', 'Genesis 12:1-3', 'Isaiah 53:4-6', 'Ephesians 2:8-10'].map(ref => (
                <button
                  key={ref}
                  onClick={() => {
                    setExegesisRef(ref)
                    handleRunExegesis(ref)
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {exegesisResult && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Exegetical Report for {exegesisResult.reference}</span>
                </h3>

                <button
                  onClick={() => handleCopy(JSON.stringify(exegesisResult, null, 2))}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Report'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Historical Background */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>Historical & Cultural Context</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {exegesisResult.historicalBackground}
                  </p>
                </div>

                {/* Original Language Nuance */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Languages className="w-4 h-4" />
                    <span>Original Language & Grammatical Nuance</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {exegesisResult.originalLanguageNuance}
                  </p>
                </div>

                {/* Covenantal Typology */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Covenantal Typology & Christ-Centered Lens</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {exegesisResult.covenantalTypology}
                  </p>
                </div>

                {/* Practical & Pastoral Application */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <Heart className="w-4 h-4" />
                    <span>Pastoral & Personal Application</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {exegesisResult.practicalApplication}
                  </p>
                </div>
              </div>

              {/* Cross References */}
              {exegesisResult.keyCrossReferences?.length > 0 && (
                <div className="bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Covenantal Cross-References:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exegesisResult.keyCrossReferences.map(cr => (
                      <Link
                        key={cr}
                        to={`/bible?ref=${encodeURIComponent(cr)}`}
                        className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline border border-indigo-200 dark:border-indigo-800 shadow-2xs"
                      >
                        {cr}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONFESSIONAL SYNTHESIS */}
      {activeTab === 'confessional' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Theological Question or Topic Across Creeds
              </label>
              <textarea
                rows={2}
                value={confessionQuery}
                onChange={(e) => setConfessionQuery(e.target.value)}
                placeholder="Ask any theological question (e.g. How is Justification defined across Westminster and Augsburg?)..."
                className="w-full p-4 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['The Lord’s Supper', 'Justification by Faith', 'Baptism & Covenant', 'Divine Election'].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      const queryText = `Compare historic confessional stances on ${q}.`
                      setConfessionQuery(queryText)
                      handleRunConfession(queryText)
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleRunConfession()}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scroll className="w-4 h-4" />}
                <span>Synthesize Confessions</span>
              </button>
            </div>
          </div>

          {/* Results */}
          {confessionResult && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Consensus & Overview
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {confessionResult.summary}
                </p>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                  <strong>Consensus:</strong> {confessionResult.theologicalConsensus}
                </div>
              </div>

              {/* Traditions Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {confessionResult.traditions?.map((tr, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                          {tr.name}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-gray-400">
                          {tr.citation}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {tr.confession}
                      </h4>

                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {tr.stance}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-750">
                      <Link
                        to="/confessions"
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Open Confessions Hub →</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXPOSITORY SERMON COPILOT */}
      {activeTab === 'sermon' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Sermon Scripture Passage
                </label>
                <input
                  type="text"
                  value={sermonPassage}
                  onChange={(e) => setSermonPassage(e.target.value)}
                  placeholder="e.g. Ephesians 2:1-10, Romans 8:31-39..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-xl text-sm font-semibold text-gray-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Homiletical Target / Theme
                </label>
                <input
                  type="text"
                  value={sermonGoal}
                  onChange={(e) => setSermonGoal(e.target.value)}
                  placeholder="e.g. Preach the assurance of salvation and active love..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-xl text-sm font-semibold text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunSermon}
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                <span>Generate 3-Point Expository Outline</span>
              </button>
            </div>
          </div>

          {/* Sermon Outline Result */}
          {sermonResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Title & Proposition Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300">
                  {sermonResult.passage}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {sermonResult.title}
                </h2>
                <p className="text-slate-300 text-sm italic">
                  <strong>Proposition:</strong> {sermonResult.themeProposition}
                </p>

                <div className="pt-2">
                  <Link
                    to="/sermons/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open in Sermon Prep Studio</span>
                  </Link>
                </div>
              </div>

              {/* 3 Main Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {sermonResult.homileticalStructure.map((pt) => (
                  <div
                    key={pt.pointNumber}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-extrabold flex items-center justify-center">
                          {pt.pointNumber}
                        </span>
                        <span className="text-xs font-semibold text-gray-400 font-mono">
                          {pt.scripturalBasis}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {pt.mainPoint}
                      </h4>

                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {pt.expositoryExplanation}
                      </p>

                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs space-y-1">
                        <span className="font-bold text-amber-800 dark:text-amber-300 block">
                          💡 Illustration Suggestion:
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          {pt.illustrationSuggestion}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs">
                      <strong className="text-indigo-700 dark:text-indigo-300">Application:</strong> {pt.personalApplication}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gospel Focus & Call to Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    ✝️ Gospel / Christ-Centered Resolution
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {sermonResult.gospelFocus}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    📢 Pastoral Call to Action & Benediction
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {sermonResult.concludingCallToAction}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ASK SCRIBE CONSULTATION */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'scribe' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                      : 'bg-gray-100 dark:bg-gray-750 text-gray-900 dark:text-gray-100 rounded-tl-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Scriptorium Scribe is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask a theological, exegesis, or pastoral question..."
              className="flex-1 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendChat}
              disabled={loading || !chatInput.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
