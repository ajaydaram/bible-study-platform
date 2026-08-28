import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Scroll, 
  ShieldCheck, 
  ExternalLink, 
  Search,
  Landmark,
  Scale
} from 'lucide-react'
import { 
  TEXTUAL_VARIANTS_DATA, 
  MANUSCRIPT_WITNESSES_LIST,
  CANONS_OF_TEXTUAL_CRITICISM,
  type ManuscriptWitness
} from '../../data/textualVariantsData'

export default function TextualCriticismPage() {
  const [activeTab, setActiveTab] = useState<'variants' | 'museum' | 'canons'>('variants')
  const [selectedVariantId, setSelectedVariantId] = useState<string>(TEXTUAL_VARIANTS_DATA[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWitnessModal, setSelectedWitnessModal] = useState<ManuscriptWitness | null>(null)

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
            <strong>Textus Receptus (KJV basis)</strong>, and <strong>Byzantine Majority Text</strong> with direct manuscript attestations.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Studio Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-2xl">
        <button
          onClick={() => setActiveTab('variants')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'variants'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Scroll className="w-4 h-4" />
          <span>Major Textual Variants</span>
        </button>

        <button
          onClick={() => setActiveTab('museum')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'museum'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Codex & Papyrus Museum</span>
        </button>

        <button
          onClick={() => setActiveTab('canons')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'canons'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Canons of Criticism</span>
        </button>
      </div>

      {/* TAB 1: MAJOR VARIANTS COMPARATOR */}
      {activeTab === 'variants' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Variant Selector */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter variants (e.g. John, 1 John, Mark, Luke)..."
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
                <strong>Core Textual Question:</strong> {activeVariant.theologicalIssue}
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
                    Key Manuscript Witnesses (Click to Inspect):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVariant.readings.criticalText.keyWitnesses.map((w) => {
                      const cleanSiglum = w.replace(/[^a-zA-Z0-9]/g, '')
                      const witnessObj = MANUSCRIPT_WITNESSES_LIST.find(mw => mw.siglum.includes(w) || mw.id === cleanSiglum || mw.name.includes(w))
                      return (
                        <button
                          key={w}
                          onClick={() => witnessObj && setSelectedWitnessModal(witnessObj)}
                          className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                        >
                          {w}
                        </button>
                      )
                    })}
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
                    Key Manuscript Witnesses (Click to Inspect):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVariant.readings.textusReceptus.keyWitnesses.map((w) => {
                      const cleanSiglum = w.replace(/[^a-zA-Z0-9]/g, '')
                      const witnessObj = MANUSCRIPT_WITNESSES_LIST.find(mw => mw.siglum.includes(w) || mw.id === cleanSiglum || mw.name.includes(w))
                      return (
                        <button
                          key={w}
                          onClick={() => witnessObj && setSelectedWitnessModal(witnessObj)}
                          className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold border border-amber-200 dark:border-amber-800 transition-colors"
                        >
                          {w}
                        </button>
                      )
                    })}
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
      )}

      {/* TAB 2: CODEX & PAPYRUS MUSEUM */}
      {activeTab === 'museum' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Ancient Papyri & Major Uncial Codices
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Explore the key Greek manuscript witnesses that preserve the apostolic text of the New Testament.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MANUSCRIPT_WITNESSES_LIST.map((ms) => (
              <div
                key={ms.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 hover:border-indigo-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {ms.siglum}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {ms.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {ms.name}
                    </h4>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {ms.date} • {ms.textType}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {ms.description}
                  </p>

                  <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-xl space-y-1 text-[11px]">
                    <strong className="text-gray-500 uppercase tracking-wider block">Physical Location:</strong>
                    <span className="text-gray-800 dark:text-gray-200">{ms.locationHeld}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <strong className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                    Scholarly Value:
                  </strong>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    {ms.scholarlySignificance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CANONS OF TEXTUAL CRITICISM */}
      {activeTab === 'canons' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              The Golden Canons of Textual Criticism
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Scholarly methodological rules established by J.J. Griesbach, F.J.A. Hort, and modern textual scholars to reconstruct the original apostolic autographs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CANONS_OF_TEXTUAL_CRITICISM.map((canon, idx) => (
              <div
                key={canon.latin}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {canon.title}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 italic">
                      "{canon.latin}"
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {canon.meaning}
                </p>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
                  <div>
                    <strong className="text-gray-500 uppercase tracking-wider text-[10px] block">Hermeneutical Rationale:</strong>
                    <p className="text-gray-700 dark:text-gray-300">{canon.rationale}</p>
                  </div>
                  <div>
                    <strong className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px] block">Prime Example:</strong>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{canon.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Witness Inspection Modal */}
      {selectedWitnessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                  {selectedWitnessModal.siglum}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedWitnessModal.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {selectedWitnessModal.date} • {selectedWitnessModal.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedWitnessModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <strong className="text-gray-400 uppercase tracking-wider text-[10px] block">Text-Type:</strong>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedWitnessModal.textType}</span>
              </div>

              <div>
                <strong className="text-gray-400 uppercase tracking-wider text-[10px] block">Contents:</strong>
                <p className="text-gray-700 dark:text-gray-300">{selectedWitnessModal.contents}</p>
              </div>

              <div>
                <strong className="text-gray-400 uppercase tracking-wider text-[10px] block">Current Location:</strong>
                <p className="text-gray-700 dark:text-gray-300">{selectedWitnessModal.locationHeld}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                <strong className="text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-[10px] block">Significance:</strong>
                <p className="text-gray-800 dark:text-gray-200 mt-1">{selectedWitnessModal.scholarlySignificance}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWitnessModal(null)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
