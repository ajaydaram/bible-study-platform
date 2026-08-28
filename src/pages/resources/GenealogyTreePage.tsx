import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  GitFork, 
  Crown, 
  Sparkles, 
  ExternalLink, 
  Search, 
  ChevronRight, 
  Calendar,
  Heart
} from 'lucide-react'
import { 
  BIBLICAL_PEOPLE_DATABASE, 
  DYNASTY_TREES_DATA, 
  type BiblicalPerson, 
  type DynastyTree 
} from '../../data/genealogyData'

export default function GenealogyTreePage() {
  const [selectedTreeId, setSelectedTreeId] = useState<string>('patriarchs')
  const [selectedPerson, setSelectedPerson] = useState<BiblicalPerson | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'matthew-luke'>('tree')

  const activeTree: DynastyTree = DYNASTY_TREES_DATA.find(t => t.id === selectedTreeId) || DYNASTY_TREES_DATA[0]

  const treePeople: BiblicalPerson[] = useMemo(() => {
    return activeTree.personIds
      .map(id => BIBLICAL_PEOPLE_DATABASE[id])
      .filter(Boolean)
  }, [activeTree])

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return treePeople
    return Object.values(BIBLICAL_PEOPLE_DATABASE).filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hebrewName && p.hebrewName.includes(searchQuery)) ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tribe && p.tribe.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [searchQuery, treePeople])

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300">
            <GitFork className="w-3.5 h-3.5 text-amber-400" />
            <span>Biblical Knowledge Graph & Genealogies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Biblical Family Trees & Dynasty Explorer
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Explore the genealogical lineages of the Patriarchs, the Davidic Royal line to Christ, 
            the Aaronite High Priesthood, and the Herodian Dynasty with rich biographical and covenantal profiles.
          </p>
        </div>
      </div>

      {/* Dynasty Selector & Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Tree Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {DYNASTY_TREES_DATA.map((tree) => (
              <button
                key={tree.id}
                onClick={() => {
                  setSelectedTreeId(tree.id)
                  setViewMode('tree')
                  setSearchQuery('')
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  selectedTreeId === tree.id && viewMode === 'tree'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {tree.title}
              </button>
            ))}

            {/* Matthew 1 vs Luke 3 Comparison Button */}
            <button
              onClick={() => setViewMode('matthew-luke')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'matthew-luke'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Matthew 1 vs. Luke 3 Studio</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search person (e.g. Abraham, David, Aaron)..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {viewMode === 'tree' && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>{activeTree.subtitle}:</strong> {activeTree.description}
            </p>
          </div>
        )}
      </div>

      {/* VIEW 1: INTERACTIVE TREE GRAPH */}
      {viewMode === 'tree' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPeople.map((person) => {
              const spouseNames = (person.spouseIds || [])
                .map(id => BIBLICAL_PEOPLE_DATABASE[id]?.name)
                .filter(Boolean)

              const childrenCount = (person.childrenIds || []).length

              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {person.tribe || 'Israel'}
                      </span>
                      {person.hebrewName && (
                        <span className="font-hebrew text-sm font-bold text-gray-400 dark:text-gray-500">
                          {person.hebrewName}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {person.title}
                      </p>
                    </div>

                    {person.dates && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{person.dates}</span>
                      </span>
                    )}

                    {spouseNames.length > 0 && (
                      <p className="text-[11px] text-gray-600 dark:text-gray-400">
                        <span className="text-gray-400">Spouse:</span> {spouseNames.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400">
                      {childrenCount > 0 ? `${childrenCount} Children` : 'Covenant Record'}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>View Bio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MATTHEW 1 VS LUKE 3 HARMONIZATION */}
      {viewMode === 'matthew-luke' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Genealogy Harmonization: Matthew 1 vs. Luke 3
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Why do the genealogies of Jesus in Matthew and Luke diverge after King David?
              Classical Christian exegesis recognizes two distinct, harmonizing purposes in the Gospel accounts:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matthew 1: Royal Throne Line */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-indigo-500/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                    Matthew 1:1–17
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    The Legal Royal Throne Succession
                  </h3>
                </div>
                <Crown className="w-6 h-6 text-indigo-500" />
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Direction:</strong> Descending from <em>Abraham $\rightarrow$ David $\rightarrow$ Christ</em>.
                </p>
                <p>
                  <strong>Focus:</strong> Establishes Jesus as the legitimate heir to King David's throne through the <strong>Royal Solomon line</strong>.
                </p>
                <p>
                  <strong>Key Anchor:</strong> Traced through <strong>Joseph</strong> (Jesus' legal adoptive earthly father).
                </p>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                  <strong className="text-indigo-900 dark:text-indigo-200 text-xs block mb-1">
                    The Jeconiah Curse Bypassed:
                  </strong>
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    Jeremiah 22:30 cursed Jeconiah so that no physical seed would sit on David’s throne. 
                    Because Jesus was virgin-born (not Joseph's biological seed), He inherited the legal crown without inheriting the curse!
                  </span>
                </div>
              </div>
            </div>

            {/* Luke 3: Physical Seed Line */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-purple-500/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                    Luke 3:23–38
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    The Biological "Seed of the Woman"
                  </h3>
                </div>
                <Heart className="w-6 h-6 text-purple-500" />
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Direction:</strong> Ascending from <em>Jesus $\rightarrow$ David $\rightarrow$ Adam $\rightarrow$ God</em>.
                </p>
                <p>
                  <strong>Focus:</strong> Establishes Jesus as the true physical seed of David and the universal Savior of all humanity (Second Adam).
                </p>
                <p>
                  <strong>Key Anchor:</strong> Traced through David’s son <strong>Nathan</strong> to <strong>Mary</strong> (via her father Heli).
                </p>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/40">
                  <strong className="text-purple-900 dark:text-purple-200 text-xs block mb-1">
                    Genesis 3:15 Fulfillment:
                  </strong>
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    Luke traces all the way back to Adam, demonstrating Christ is the promised "seed of the woman" who crushes the serpent's head for people of every nation.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERSON DETAIL MODAL / DRAWER */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                    {selectedPerson.name}
                  </h2>
                  {selectedPerson.hebrewName && (
                    <span className="font-hebrew text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedPerson.hebrewName}
                    </span>
                  )}
                  {selectedPerson.greekName && (
                    <span className="font-greek text-base font-bold text-purple-600 dark:text-purple-400">
                      {selectedPerson.greekName}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedPerson.title}
                </p>
              </div>

              <button
                onClick={() => setSelectedPerson(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {selectedPerson.meaning && (
                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-2xl">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Name Meaning:</span>
                  <strong className="text-gray-900 dark:text-white">{selectedPerson.meaning}</strong>
                </div>
              )}
              {selectedPerson.dates && (
                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-2xl">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Dates & Era:</span>
                  <strong className="text-gray-900 dark:text-white">{selectedPerson.dates}</strong>
                </div>
              )}
              {selectedPerson.tribe && (
                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-2xl">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Tribe / Lineage:</span>
                  <strong className="text-gray-900 dark:text-white">{selectedPerson.tribe}</strong>
                </div>
              )}
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Biblical Biography
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedPerson.bio}
              </p>
            </div>

            {/* Theological & Christological Significance */}
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Theological & Redemptive Significance</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {selectedPerson.theologicalSignificance}
              </p>
            </div>

            {/* Key Scripture Verses */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Key Scripture Passages:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPerson.keyVerses.map((ref) => (
                  <Link
                    key={ref}
                    to={`/bible?ref=${encodeURIComponent(ref.split(' ')[0] + ' ' + (ref.split(' ')[1] || '1'))}`}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>{ref}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 shadow-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
