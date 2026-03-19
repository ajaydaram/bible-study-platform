import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BookOpen, BookMarked, Calendar, Filter, Scroll, Search } from 'lucide-react';
import {
  loadCreedsLibrary,
  type CreedDocument,
  type CreedDocumentType,
  type CreedsLibrary
} from '../data/creeds/library';

type CenturyFilter = 'all' | string;
type SourceFilter = 'all' | CreedDocument['source'];
type TypeFilter = 'all' | CreedDocumentType;

const typeIcons: Record<CreedDocumentType, ReactNode> = {
  creed: <Scroll className="h-4 w-4" />,
  confession: <BookMarked className="h-4 w-4" />,
  catechism: <BookOpen className="h-4 w-4" />,
  canon: <BookMarked className="h-4 w-4" />,
  document: <BookOpen className="h-4 w-4" />
};

const typeColors: Record<CreedDocumentType, string> = {
  creed: 'bg-purple-500',
  confession: 'bg-blue-500',
  catechism: 'bg-emerald-500',
  canon: 'bg-indigo-500',
  document: 'bg-gray-500'
};

const sourceLabels: Record<CreedDocument['source'], string> = {
  'creeds.json': 'Creeds.json (Public Domain)',
  'reformed-standards': 'Reformed Standards'
};

const getCenturyKey = (year: number | null): string => {
  if (!year) return 'unknown';
  const absYear = Math.abs(year);
  const century = Math.ceil(absYear / 100);
  return year < 0 ? `BC ${century}` : `AD ${century}`;
};

const formatYear = (year: number | null): string => {
  if (!year) return 'Unknown year';
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
};

export default function CreedsConfessions() {
  const [library, setLibrary] = useState<CreedsLibrary | null>(null);
  const [centuryFilter, setCenturyFilter] = useState<CenturyFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadCreedsLibrary().then(setLibrary);
  }, []);

  const documents = library?.documents ?? [];

  const centuries = useMemo(() => {
    const keys = new Set<string>();
    documents.forEach(doc => keys.add(getCenturyKey(doc.year)));
    return Array.from(keys).filter(key => key !== 'unknown').sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    let items = documents;

    if (centuryFilter !== 'all') {
      items = items.filter(doc => getCenturyKey(doc.year) === centuryFilter);
    }

    if (sourceFilter !== 'all') {
      items = items.filter(doc => doc.source === sourceFilter);
    }

    if (typeFilter !== 'all') {
      items = items.filter(doc => doc.type === typeFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      items = items.filter(doc => doc.title.toLowerCase().includes(term));
    }

    return items.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  }, [documents, centuryFilter, sourceFilter, typeFilter, search]);

  useEffect(() => {
    if (!selectedId && filteredDocuments.length > 0) {
      setSelectedId(filteredDocuments[0].id);
    }
  }, [selectedId, filteredDocuments]);

  const selectedDocument = filteredDocuments.find(doc => doc.id === selectedId) ?? null;

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Scroll className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Creeds & Confessions
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Across the centuries • {filteredDocuments.length} documents
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCenturyFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              centuryFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Centuries
          </button>
          {centuries.map(century => (
            <button
              key={century}
              onClick={() => setCenturyFilter(century)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                centuryFilter === century
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {century.replace('AD ', '').replace('BC ', '')}th {century.startsWith('BC') ? 'Century BC' : 'Century'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              All Types
            </button>
            {(['creed', 'confession', 'catechism', 'canon', 'document'] as CreedDocumentType[]).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  typeFilter === type
                    ? `${typeColors[type]} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {typeIcons[type]}
                {type}
              </button>
            ))}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
              className="ml-2 px-2.5 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Sources</option>
              {Object.entries(sourceLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creeds, confessions, catechisms"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr]">
        <div className="border-r border-gray-100 dark:border-gray-700 max-h-[650px] overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedId === doc.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${typeColors[doc.type]}`}>
                    {doc.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatYear(doc.year)}
                  </span>
                </div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {doc.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {sourceLabels[doc.source]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[650px] overflow-y-auto">
          <div className="p-5">
            {!library && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading creeds and confessions…
              </div>
            )}

            {library && selectedDocument && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedDocument.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className={`px-2 py-0.5 rounded text-white ${typeColors[selectedDocument.type]}`}>
                        {selectedDocument.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {formatYear(selectedDocument.year)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {sourceLabels[selectedDocument.source]}
                      </span>
                      {selectedDocument.collection && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {selectedDocument.collection}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {getCenturyKey(selectedDocument.year)}
                  </div>
                </div>

                {selectedDocument.sourceAttribution && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Source: {selectedDocument.sourceAttribution}
                  </div>
                )}

                <div className="space-y-3">
                  {selectedDocument.sections.map(section => (
                    <div key={section.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                        {section.title}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {library && !selectedDocument && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No documents match the current filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {library && library.counts.creedsJsonSkipped > 0 && (
        <div className="px-5 pb-5 text-xs text-gray-500 dark:text-gray-400">
          Note: {library.counts.creedsJsonSkipped} Creeds.json documents were skipped because they are not public domain.
        </div>
      )}
    </div>
  );
}
