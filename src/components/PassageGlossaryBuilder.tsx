import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Languages, 
  Copy, 
  Check, 
  ArrowRight
} from 'lucide-react'

interface GlossaryLemma {
  strongs: string
  lemma: string
  transliteration: string
  partOfSpeech: string
  gloss: string
  totalOccurrences: number
  tier: 'core' | 'intermediate' | 'rare'
}

const SAMPLE_PASSAGE_GLOSSARIES: Record<string, { title: string; language: 'greek' | 'hebrew'; lemmas: GlossaryLemma[] }> = {
  'John 1:1-18': {
    title: 'The Prologue to the Fourth Gospel',
    language: 'greek',
    lemmas: [
      { strongs: 'G3056', lemma: 'λόγος', transliteration: 'logos', partOfSpeech: 'Noun, Masc', gloss: 'Word, Divine Reason, Message', totalOccurrences: 330, tier: 'core' },
      { strongs: 'G2316', lemma: 'θεός', transliteration: 'theos', partOfSpeech: 'Noun, Masc', gloss: 'God, deity', totalOccurrences: 1317, tier: 'core' },
      { strongs: 'G2222', lemma: 'ζωή', transliteration: 'zoe', partOfSpeech: 'Noun, Fem', gloss: 'Life, divine spiritual life', totalOccurrences: 135, tier: 'core' },
      { strongs: 'G5457', lemma: 'φῶς', transliteration: 'phos', partOfSpeech: 'Noun, Neut', gloss: 'Light, illumination', totalOccurrences: 73, tier: 'core' },
      { strongs: 'G5485', lemma: 'χάρις', transliteration: 'charis', partOfSpeech: 'Noun, Fem', gloss: 'Grace, unmerited favor', totalOccurrences: 155, tier: 'core' },
      { strongs: 'G225', lemma: 'ἀλήθεια', transliteration: 'aletheia', partOfSpeech: 'Noun, Fem', gloss: 'Truth, divine reality', totalOccurrences: 109, tier: 'core' },
      { strongs: 'G4653', lemma: 'σκοτία', transliteration: 'skotia', partOfSpeech: 'Noun, Fem', gloss: 'Darkness, spiritual blindness', totalOccurrences: 16, tier: 'intermediate' },
      { strongs: 'G4592', lemma: 'σημεῖον', transliteration: 'semeion', partOfSpeech: 'Noun, Neut', gloss: 'Sign, attesting miracle', totalOccurrences: 77, tier: 'core' },
      { strongs: 'G4637', lemma: 'σκηνόω', transliteration: 'skenoo', partOfSpeech: 'Verb', gloss: 'Tabernacle, pitch a tent, dwell', totalOccurrences: 5, tier: 'rare' },
      { strongs: 'G3439', lemma: 'μονογενής', transliteration: 'monogenes', partOfSpeech: 'Adjective', gloss: 'Only-begotten, unique, one and only', totalOccurrences: 9, tier: 'rare' },
      { strongs: 'G1834', lemma: 'ἐξηγέομαι', transliteration: 'exegeomai', partOfSpeech: 'Verb', gloss: 'Explain, make known, exegete', totalOccurrences: 6, tier: 'rare' }
    ]
  },
  'Romans 8:18-39': {
    title: 'The Inseparable Love of God in Christ',
    language: 'greek',
    lemmas: [
      { strongs: 'G4151', lemma: 'πνεῦμα', transliteration: 'pneuma', partOfSpeech: 'Noun, Neut', gloss: 'Spirit, Holy Spirit, breath', totalOccurrences: 379, tier: 'core' },
      { strongs: 'G1343', lemma: 'δικαιοσύνη', transliteration: 'dikaiosyne', partOfSpeech: 'Noun, Fem', gloss: 'Righteousness, divine justice', totalOccurrences: 92, tier: 'core' },
      { strongs: 'G1680', lemma: 'ἐλπίς', transliteration: 'elpis', partOfSpeech: 'Noun, Fem', gloss: 'Hope, certain expectation', totalOccurrences: 53, tier: 'core' },
      { strongs: 'G4267', lemma: 'προγινώσκω', transliteration: 'proginosko', partOfSpeech: 'Verb', gloss: 'Foreknow, choose beforehand in covenant', totalOccurrences: 5, tier: 'rare' },
      { strongs: 'G4309', lemma: 'προορίζω', transliteration: 'proorizo', partOfSpeech: 'Verb', gloss: 'Predestine, mark out beforehand', totalOccurrences: 6, tier: 'rare' },
      { strongs: 'G4832', lemma: 'σύμμορφος', transliteration: 'symmorphos', partOfSpeech: 'Adjective', gloss: 'Conformed, of the same inner form', totalOccurrences: 2, tier: 'rare' },
      { strongs: 'G5245', lemma: 'ὑπερνικάω', transliteration: 'hypernikao', partOfSpeech: 'Verb', gloss: 'More than conquer, triumph overwhelmingly', totalOccurrences: 1, tier: 'rare' }
    ]
  }
}

export default function PassageGlossaryBuilder() {
  const [selectedPassage, setSelectedPassage] = useState('John 1:1-18')
  const [tierFilter, setTierFilter] = useState<'all' | 'core' | 'intermediate' | 'rare'>('all')
  const [copied, setCopied] = useState(false)

  const activeGlossary = SAMPLE_PASSAGE_GLOSSARIES[selectedPassage] || SAMPLE_PASSAGE_GLOSSARIES['John 1:1-18']

  const filteredLemmas = activeGlossary.lemmas.filter(l => {
    if (tierFilter === 'all') return true
    return l.tier === tierFilter
  })

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'core':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      case 'intermediate':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'rare':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleCopyGlossary = () => {
    const text = filteredLemmas.map(l => `${l.lemma} (${l.transliteration}) [${l.strongs}] - ${l.gloss} (${l.totalOccurrences}x)`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            <span>Graded Passage Reader Lexicon</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Deduplicated Passage Lemma Glossary
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Extract every unique original language headword in a passage, graded by biblical occurrence frequency.
          </p>
        </div>

        {/* Passage Switcher */}
        <div className="flex items-center gap-2">
          {Object.keys(SAMPLE_PASSAGE_GLOSSARIES).map(passageKey => (
            <button
              key={passageKey}
              onClick={() => setSelectedPassage(passageKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPassage === passageKey
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {passageKey}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Frequency Tier:
          </span>
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              tierFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            All ({activeGlossary.lemmas.length})
          </button>
          <button
            onClick={() => setTierFilter('core')}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              tierFilter === 'core' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            Core (&gt;50x)
          </button>
          <button
            onClick={() => setTierFilter('intermediate')}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              tierFilter === 'intermediate' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-amber-700 dark:text-amber-300'
            }`}
          >
            Intermediate (10-50x)
          </button>
          <button
            onClick={() => setTierFilter('rare')}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              tierFilter === 'rare' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-purple-700 dark:text-purple-300'
            }`}
          >
            Rare / Hapax (&lt;10x)
          </button>
        </div>

        <button
          onClick={handleCopyGlossary}
          className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Glossary'}</span>
        </button>
      </div>

      {/* Lemma Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLemmas.map((item) => (
          <div
            key={item.strongs}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-gray-400">
                  {item.strongs}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getTierBadge(item.tier)}`}>
                  {item.totalOccurrences}x ({item.tier})
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold font-greek text-indigo-600 dark:text-indigo-400">
                  {item.lemma}
                </h3>
                <span className="text-xs text-gray-400 font-semibold italic">
                  /{item.transliteration}/
                </span>
              </div>

              <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 block">
                {item.partOfSpeech}
              </span>

              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.gloss}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-750 flex items-center justify-between">
              <Link
                to={`/word-study?strongs=${item.strongs}`}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Full Lexicon Entry</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
