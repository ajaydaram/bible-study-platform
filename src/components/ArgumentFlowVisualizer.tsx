import { useState } from 'react'
import { 
  GitCommit, 
  Sparkles, 
  Layers, 
  BookOpen
} from 'lucide-react'
import { 
  SAMPLE_ARGUMENT_FLOWS, 
  GREEK_DISCOURSE_CONJUNCTIONS,
  type PropositionNode,
  type DiscourseMarker
} from '../data/discourseData'

export default function ArgumentFlowVisualizer() {
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0)
  const [selectedMarker, setSelectedMarker] = useState<DiscourseMarker | null>(null)

  const activeFlow = SAMPLE_ARGUMENT_FLOWS[selectedFlowIndex]

  const getConnectiveBadgeStyle = (category?: string) => {
    switch (category) {
      case 'inference':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'ground':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'purpose':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      case 'contrast':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
      case 'condition':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Flow Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <GitCommit className="w-3.5 h-3.5 text-indigo-500" />
            <span>Levinsohn NT Discourse Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Connective-Anchored Argument Flow Mapper
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Trace the logical architecture of biblical thought through discourse markers and clause relations.
          </p>
        </div>

        {/* Passage Switcher */}
        <div className="flex items-center gap-2">
          {SAMPLE_ARGUMENT_FLOWS.map((flow, idx) => (
            <button
              key={flow.passage}
              onClick={() => setSelectedFlowIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFlowIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {flow.passage}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-indigo-900/10 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-0.5 text-xs sm:text-sm">
          <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
            {activeFlow.title} ({activeFlow.passage})
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {activeFlow.summary}
          </p>
        </div>
      </div>

      {/* Main Proposition Flow Tree */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Clause Hierarchy & Discourse Progression</span>
          </h3>

          <span className="text-xs text-gray-400">
            {activeFlow.propositions.length} Propositional Clauses
          </span>
        </div>

        <div className="space-y-3">
          {activeFlow.propositions.map((node: PropositionNode) => {
            const indentPixels = node.indent * 24

            return (
              <div
                key={node.id}
                style={{ marginLeft: `${indentPixels}px` }}
                className={`p-4 rounded-2xl border transition-all relative ${
                  node.indent > 0
                    ? 'border-l-4 border-l-indigo-500 border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-850/60'
                    : 'border-2 border-indigo-500/50 bg-indigo-50/40 dark:bg-indigo-950/20'
                }`}
              >
                {/* Visual Branch Line for Indented Children */}
                {node.indent > 0 && (
                  <div className="absolute -left-4 top-5 w-4 h-0.5 bg-indigo-400/50" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-md font-mono text-[10px] font-bold">
                      {node.verse}
                    </span>

                    {node.connective && (
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getConnectiveBadgeStyle(node.connective.category)}`}>
                        {node.connective.word} • {node.connective.role}
                      </span>
                    )}

                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      {node.propositionType}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                    ✝️ {node.redemptiveTheme}
                  </span>
                </div>

                {/* English Clause */}
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {node.clauseText}
                </p>

                {/* Greek Original Clause */}
                {node.greekText && (
                  <p className="text-xs font-greek text-indigo-700 dark:text-indigo-300 mt-1">
                    {node.greekText}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Discourse Conjunction Glossary Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Levinsohn Discourse Conjunction Key (Quick Guide)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(GREEK_DISCOURSE_CONJUNCTIONS).map(([key, marker]) => (
            <div
              key={key}
              onClick={() => setSelectedMarker(marker)}
              className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 hover:border-indigo-500 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-greek text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {marker.greek} ({marker.transliteration})
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${getConnectiveBadgeStyle(marker.category)}`}>
                  {marker.category}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                "{marker.englishEquivalents.join(', ')}"
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                {marker.rhetoricalFunction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Marker Modal / Detail Drawer if selected */}
      {selectedMarker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-greek text-indigo-600 dark:text-indigo-400">
                  {selectedMarker.greek}
                </span>
                <span className="text-sm font-bold text-gray-400">({selectedMarker.transliteration})</span>
                <span className="text-xs font-mono font-semibold text-gray-500">[{selectedMarker.strongs}]</span>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center text-xs font-bold hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <strong className="text-gray-400 uppercase tracking-wider text-[10px] block">Rhetorical Function</strong>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedMarker.rhetoricalFunction}</p>
              </div>

              <div>
                <strong className="text-gray-400 uppercase tracking-wider text-[10px] block">English Equivalents</strong>
                <p className="text-gray-700 dark:text-gray-300">{selectedMarker.englishEquivalents.join(', ')}</p>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200">
                <strong className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-indigo-700 dark:text-indigo-300">
                  Exegetical & Homiletical Significance
                </strong>
                <p className="text-xs leading-relaxed">{selectedMarker.exegeticalSignificance}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
