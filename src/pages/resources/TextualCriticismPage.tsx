import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Scroll, 
  ShieldCheck, 
  ExternalLink, 
  Search
} from 'lucide-react'
import { 
  TEXTUAL_VARIANTS_DATA 
} from '../../data/textualVariantsData'

export default function TextualCriticismPage() {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(TEXTUAL_VARIANTS_DATA[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const activeVariant = TEXTUAL_VARIANTS_DATA.find(v => v.id === selectedVariantId) || TEXTUAL_VARIANTS_DATA[0]

  const filteredVariants = TEXTUAL_VARIANTS_DATA.filter(v => 
    v.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.passageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.theologicalIssue.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getUbsGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
        return { text: 'UBS Grade A: Virtually Certain', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' }
      case 'B':
        return { text: 'UBS Grade B: Some Degree of Doubt', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800' }
      case 'C':
        return { text: 'UBS Grade C: Considerable Doubt', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800' }
      default:
        return { text: 'UBS Grade D: Difficult Evaluation', color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800' }
    }
  }

  const ubsBadge = getUbsGradeBadge(activeVariant.ubsRating)

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span>New Testament Textual Criticism Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Manuscript Variants & Textual Apparatus
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Compare ancient Greek readings across the <strong>Critical Text (NA28/UBS5)</strong>, 
            <strong>Textus Receptus</strong>, and <strong>Byzantine Majority Text</strong> with direct manuscript attestations.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Variant Selector */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter variants (e.g. John, 1 John, Mark)..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredVariants.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedVariantId(item.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                  selectedVariantId === item.id
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {item.reference}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    Grade {item.ubsRating}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">
                  {item.passageTitle}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {item.theologicalIssue}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Main Panel: Variant Deep-Dive */}
        <div className="lg:col-span-8 space-y-6">
          {/* Variant Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  {activeVariant.reference}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {activeVariant.passageTitle}
                </h2>
              </div>

              <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${ubsBadge.color}`}>
                {ubsBadge.text}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <strong>Core Question:</strong> {activeVariant.theologicalIssue}
            </p>
          </div>

          {/* Readings Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reading 1: Critical Text */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-indigo-500/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {activeVariant.readings.criticalText.textLabel}
                </span>
              </div>

              <p className="font-greek text-sm sm:text-base font-bold text-indigo-700 dark:text-indigo-300 leading-relaxed">
                {activeVariant.readings.criticalText.greekText}
              </p>

              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                "{activeVariant.readings.criticalText.englishTranslation}"
              </p>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block">
                  Key Manuscript Witnesses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeVariant.readings.criticalText.keyWitnesses.map((w) => (
                    <span
                      key={w}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-[11px] font-bold"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                {activeVariant.readings.criticalText.evaluationNotes}
              </p>
            </div>

            {/* Reading 2: Textus Receptus */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-amber-500/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {activeVariant.readings.textusReceptus.textLabel}
                </span>
              </div>

              <p className="font-greek text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300 leading-relaxed">
                {activeVariant.readings.textusReceptus.greekText}
              </p>

              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                "{activeVariant.readings.textusReceptus.englishTranslation}"
              </p>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block">
                  Key Manuscript Witnesses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeVariant.readings.textusReceptus.keyWitnesses.map((w) => (
                    <span
                      key={w}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-[11px] font-bold"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                {activeVariant.readings.textusReceptus.evaluationNotes}
              </p>
            </div>
          </div>

          {/* Scholarly Evaluation & Patristic Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Textual Scholarship Consensus</span>
              </span>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {activeVariant.scholarlyConsensus}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Scroll className="w-4 h-4" />
                <span>Patristic & Church Father Attestations</span>
              </span>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {activeVariant.patristicAttestation}
              </p>
            </div>
          </div>

          {/* Translation Impact & Bible Reader Bridge */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                English Translation Impact:
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {activeVariant.translationImpact}
              </p>
            </div>

            <Link
              to={`/bible?ref=${encodeURIComponent(activeVariant.reference)}`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>Open in Bible Reader</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
