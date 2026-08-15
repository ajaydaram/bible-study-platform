import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  GitFork, 
  ArrowRight, 
  ExternalLink,
  Search
} from 'lucide-react'
import { 
  TYPOLOGY_NETWORK_DATA 
} from '../../data/typologyNetworkData'

export default function TypologyNetworkPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    'Sacrificial & Temple',
    'Prophetic Figures',
    'Redemptive Events'
  ]

  const filteredNodes = TYPOLOGY_NETWORK_DATA.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = 
      item.otType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ntFulfillment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.theologicalConnection.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <GitFork className="w-3.5 h-3.5 text-amber-400" />
            <span>Redemptive-Historical Typology Atlas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Biblical Typology & Prophecy Network
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Trace how Old Testament shadows, institutions, and figures radiate forward into their ultimate fulfillment 
            in the person, work, and kingdom of Jesus Christ.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search types, fulfillments, passages..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              All Categories ({TYPOLOGY_NETWORK_DATA.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typology Connector Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5 hover:border-indigo-400 transition-all"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-750">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {node.category}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                Type-Antitype Correlation
              </span>
            </div>

            {/* Side-by-side Shadow vs Fulfillment */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left: OT Shadow */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  📜 Old Testament Shadow (The Type)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {node.otType}
                </h3>
                <Link
                  to={`/bible?ref=${encodeURIComponent(node.otPassage)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <span>{node.otPassage}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Middle: Radiating Arrow */}
              <div className="md:col-span-2 flex flex-col items-center justify-center text-indigo-500">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
                  Fulfilled In
                </span>
              </div>

              {/* Right: NT Reality */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 block">
                  ✝️ New Testament Reality (The Antitype)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {node.ntFulfillment}
                </h3>
                <Link
                  to={`/bible?ref=${encodeURIComponent(node.ntPassage.split(';')[0])}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>{node.ntPassage}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Exegetical Synthesis & Hermeneutics */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 space-y-2 text-xs sm:text-sm">
              <div>
                <strong className="text-gray-500 uppercase tracking-wider text-[10px] block">
                  Theological Continuity
                </strong>
                <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                  {node.theologicalConnection}
                </p>
              </div>

              <div className="pt-1">
                <strong className="text-gray-500 uppercase tracking-wider text-[10px] block">
                  Hermeneutical Significance
                </strong>
                <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                  {node.hermeneuticalSignificance}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
