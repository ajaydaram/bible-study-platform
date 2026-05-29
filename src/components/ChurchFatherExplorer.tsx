import { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  MapPin, 
  Clock, 
  Tag,
  Quote,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import {
  churchFathers,
  getQuotesByFather,
  getAllEras,
  type ChurchFather,
  type PatristicQuote
} from '../data/churchFathers';

interface ChurchFatherExplorerProps {
  initialFatherId?: string;
  onClose?: () => void;
}

export default function ChurchFatherExplorer({ initialFatherId, onClose }: ChurchFatherExplorerProps) {
  const [selectedFather, setSelectedFather] = useState<ChurchFather | null>(
    initialFatherId ? churchFathers.find(f => f.id === initialFatherId) || null : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [fatherQuotes, setFatherQuotes] = useState<PatristicQuote[]>([]);

  const eras = getAllEras();

  const filteredFathers = churchFathers.filter(father => {
    const matchesSearch = searchQuery === '' || 
      father.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      father.themes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEra = !selectedEra || father.era === selectedEra;
    return matchesSearch && matchesEra;
  });

  const handleSelectFather = (father: ChurchFather) => {
    setSelectedFather(father);
    setFatherQuotes(getQuotesByFather(father.id));
  };

  const eraColors: Record<ChurchFather['era'], string> = {
    'apostolic': 'from-amber-500 to-orange-500',
    'ante-nicene': 'from-emerald-500 to-teal-500',
    'nicene': 'from-blue-500 to-indigo-500',
    'post-nicene': 'from-purple-500 to-violet-500'
  };

  const eraBgColors: Record<ChurchFather['era'], string> = {
    'apostolic': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    'ante-nicene': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200',
    'nicene': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    'post-nicene': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Church Fathers
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {churchFathers.length} theologians • 4 eras
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or theme..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Era Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEra(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !selectedEra
                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            All Eras
          </button>
          {eras.map(era => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedEra === era.id
                  ? eraBgColors[era.id as ChurchFather['era']]
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {era.name} ({era.years})
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700">
        {/* Fathers List */}
        <div className="p-4 max-h-[500px] overflow-y-auto">
          <div className="space-y-2">
            {filteredFathers.map(father => (
              <button
                key={father.id}
                onClick={() => handleSelectFather(father)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedFather?.id === father.id
                    ? `bg-gradient-to-r ${eraColors[father.era]} text-white`
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                    selectedFather?.id === father.id
                      ? 'bg-white/20'
                      : `bg-gradient-to-br ${eraColors[father.era]} text-white`
                  }`}>
                    {father.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${
                      selectedFather?.id === father.id
                        ? 'text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {father.name}
                    </h3>
                    <p className={`text-sm ${
                      selectedFather?.id === father.id
                        ? 'text-white/80'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {father.title}
                    </p>
                    <p className={`text-xs mt-1 ${
                      selectedFather?.id === father.id
                        ? 'text-white/70'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {father.dates}
                    </p>
                  </div>
                  <ChevronRight className={`h-5 w-5 flex-shrink-0 ${
                    selectedFather?.id === father.id
                      ? 'text-white'
                      : 'text-gray-300 dark:text-gray-600'
                  }`} />
                </div>
              </button>
            ))}

            {filteredFathers.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No fathers found matching your search
              </div>
            )}
          </div>
        </div>

        {/* Father Detail */}
        <div className="p-4 max-h-[500px] overflow-y-auto">
          {selectedFather ? (
            <div className="animate-fade-in">
              {/* Header */}
              <div className={`bg-gradient-to-r ${eraColors[selectedFather.era]} rounded-xl p-5 mb-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 text-white`}>
                    {eras.find(e => e.id === selectedFather.era)?.name}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {selectedFather.name}
                </h3>
                {selectedFather.latinName && (
                  <p className="text-white/80 italic mb-2">{selectedFather.latinName}</p>
                )}
                <p className="text-white/90 font-medium">{selectedFather.title}</p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Dates</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedFather.dates}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">Location</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedFather.location}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Biography</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedFather.bio}
                </p>
              </div>

              {/* Major Works */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Major Works</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFather.majorWorks.map(work => (
                    <span
                      key={work}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {work}
                    </span>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Key Themes</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFather.themes.map(theme => (
                    <span
                      key={theme}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${eraBgColors[selectedFather.era]}`}
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quotes */}
              {fatherQuotes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Quote className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Notable Quotes ({fatherQuotes.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {fatherQuotes.slice(0, 3).map(quote => (
                      <div
                        key={quote.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-3 border-primary-500"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2 line-clamp-3">
                          "{quote.text}"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          — {quote.source}{quote.chapter && `, ${quote.chapter}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a Church Father
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Choose from the list to learn about their life, writings, and theological contributions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
