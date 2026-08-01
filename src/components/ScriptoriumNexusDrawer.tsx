import { X, Sparkles, Layers, BookOpen, AlertCircle, Compass, ArrowRight } from 'lucide-react'
import { getUnifiedHermeneutics } from '../data/unifiedHermeneutics'
import { BIBLICAL_GENRES } from '../data/genreData'
import { CHIASTM_STRUCTURES } from '../data/typologyMatrixData'
import { CHAPELL_FCF_FRAMEWORK } from '../data/sacredRhetoricData'
import { Link } from 'react-router-dom'

interface Props {
  isOpen: boolean
  onClose: () => void
  book: string
  chapter: number
  verse?: number | null
}

export default function ScriptoriumNexusDrawer({ isOpen, onClose, book, chapter, verse }: Props) {
  if (!isOpen) return null

  const reference = `${book} ${chapter}${verse ? `:${verse}` : ''}`
  const triad = getUnifiedHermeneutics(reference)

  // Map book to genre
  const getGenreForBook = (b: string) => {
    const name = b.toLowerCase()
    if (['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'].includes(name)) return BIBLICAL_GENRES[0] // Torah
    if (['joshua', 'judges', 'ruth', '1 samuel', '2 samuel', '1 kings', '2 kings', '1 chronicles', '2 chronicles', 'ezra', 'nehemiah', 'esther', 'acts'].includes(name)) return BIBLICAL_GENRES[1] // History
    if (['job', 'psalms', 'proverbs', 'ecclesiastes', 'song of solomon'].includes(name)) return BIBLICAL_GENRES[2] // Poetry
    if (['isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'].includes(name)) return BIBLICAL_GENRES[3] // Prophecy
    if (['matthew', 'mark', 'luke', 'john'].includes(name)) return BIBLICAL_GENRES[4] // Gospels
    if (['revelation'].includes(name)) return BIBLICAL_GENRES[6] // Apocalyptic
    return BIBLICAL_GENRES[5] // Epistles fallback
  }

  const activeGenre = getGenreForBook(book)

  // Check for matching chiasm
  const activeChiasm = CHIASTM_STRUCTURES.find((c) =>
    c.title.toLowerCase().includes(book.toLowerCase()) ||
    c.introduction.toLowerCase().includes(book.toLowerCase())
  ) || CHIASTM_STRUCTURES[0]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Scriptorium Nexus Engine
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Harmonized Hermeneutics • {reference}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* DIMENSION 1: CHIASTIC POSITION */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                1. Hebrew Chiastic Structure
              </span>
              <Link
                to="/typology-matrix"
                onClick={onClose}
                className="text-[11px] text-amber-300 hover:text-white font-semibold flex items-center gap-1"
              >
                <span>Full Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <h4 className="text-sm font-bold text-white">{activeChiasm.title}</h4>
            <p className="text-xs text-slate-300 font-serif italic">"{activeChiasm.introduction}"</p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 font-bold">
              Turning Point: {activeChiasm.centralFocus}
            </div>
          </div>

          {/* DIMENSION 2: LITERARY GENRE GUIDANCE */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                2. Literary Genre ({activeGenre.name})
              </span>
              <Link
                to="/paths/genre"
                onClick={onClose}
                className="text-[11px] text-blue-300 hover:text-white font-semibold flex items-center gap-1"
              >
                <span>Genre Path</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-slate-300">{activeGenre.description}</p>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Hermeneutical Rules:</span>
              <ul className="space-y-1 text-xs text-slate-200">
                {activeGenre.hermeneuticalRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-400">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DIMENSION 3: FALLEN CONDITION FOCUS (FCF) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                3. Fallen Condition Focus (FCF)
              </span>
              <Link
                to="/sermons/rhetoric"
                onClick={onClose}
                className="text-[11px] text-purple-300 hover:text-white font-semibold flex items-center gap-1"
              >
                <span>Homiletics</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
              "{CHAPELL_FCF_FRAMEWORK.fcfDefinition}"
            </p>
            <div className="p-3 bg-purple-950/50 border border-purple-800/60 rounded-xl text-xs text-purple-200">
              <span className="font-bold text-purple-300">Expository Focus: </span>
              How does this passage expose human sin/weakness and reveal Christ’s redemptive solution?
            </div>
          </div>

          {/* DIMENSION 4: VOSIAN EPOCH & TYPOLOGY */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                4. Redemptive Epoch & Typology
              </span>
              <Link
                to="/epochs"
                onClick={onClose}
                className="text-[11px] text-emerald-300 hover:text-white font-semibold flex items-center gap-1"
              >
                <span>Epoch Tree</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-300">
                {triad.redemptiveEpoch.icon} {triad.redemptiveEpoch.title} ({triad.redemptiveEpoch.covenant})
              </p>
              <p className="text-xs text-slate-300">{triad.typologicalTheme.themeTitle}</p>
            </div>
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-xs text-emerald-200">
              <span className="font-bold text-emerald-300 font-mono">Antitype Fulfillment: </span>
              {triad.typologicalTheme.antitypeFulfillment}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500 font-mono">
          Scriptorium Nexus • Harmonizing Creation to Restoration
        </div>
      </div>
    </div>
  )
}
