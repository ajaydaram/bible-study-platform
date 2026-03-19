import { useState, useEffect } from 'react';
import { Music, Search, X } from 'lucide-react';
import { loadHymnal, Hymn, HymnalData, searchHymns, getHymnsByCategory } from '../lib/hymnal';

export default function Hymnal() {
  const [hymnalData, setHymnalData] = useState<HymnalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);

  useEffect(() => {
    loadHymnal()
      .then(data => {
        setHymnalData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter hymns
  const filteredHymns = hymnalData 
    ? getHymnsByCategory(
        searchQuery ? searchHymns(hymnalData.hymns, searchQuery) : hymnalData.hymns,
        selectedCategory
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading hymnal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Full screen hymn view
  if (selectedHymn) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full 
                               bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 
                               font-bold text-lg">
                  {selectedHymn.number}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 
                               bg-gray-100 dark:bg-gray-800 rounded">
                  {selectedHymn.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedHymn.title}
              </h1>
            </div>
            <button
              onClick={() => setSelectedHymn(null)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Lyrics */}
          <div className="space-y-8">
            {selectedHymn.lyrics.map((verse, index) => (
              <div key={index} className="relative">
                {/* Verse number */}
                <div className="absolute -left-2 top-0 flex items-center justify-center 
                              w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 
                              text-purple-600 dark:text-purple-400 text-sm font-bold">
                  {verse.type === 'chorus' ? '♪' : verse.verse}
                </div>
                
                {/* Verse content */}
                <div className={`pl-10 ${verse.type === 'chorus' ? 'italic' : ''}`}>
                  {verse.type === 'chorus' && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1 font-semibold uppercase tracking-wider">
                      Chorus
                    </div>
                  )}
                  <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {verse.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            {hymnalData && (
              <>
                <button
                  onClick={() => {
                    const idx = hymnalData.hymns.findIndex(h => h.id === selectedHymn.id);
                    if (idx > 0) setSelectedHymn(hymnalData.hymns[idx - 1]);
                  }}
                  disabled={hymnalData.hymns.findIndex(h => h.id === selectedHymn.id) === 0}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                           dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setSelectedHymn(null)}
                  className="px-4 py-2 text-purple-600 dark:text-purple-400 font-medium"
                >
                  Back to Hymnal
                </button>
                <button
                  onClick={() => {
                    const idx = hymnalData.hymns.findIndex(h => h.id === selectedHymn.id);
                    if (idx < hymnalData.hymns.length - 1) setSelectedHymn(hymnalData.hymns[idx + 1]);
                  }}
                  disabled={hymnalData.hymns.findIndex(h => h.id === selectedHymn.id) === hymnalData.hymns.length - 1}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                           dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Music className="w-8 h-8 text-purple-600" />
          Hymnal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {hymnalData?.totalHymns} hymns for worship and devotion
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search hymns by title or lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-purple-500"
        >
          <option value="All">All Categories</option>
          {hymnalData?.categories.map(cat => (
            <option key={cat.name} value={cat.name}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {hymnalData?.categories.slice(0, 8).map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.name
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {filteredHymns.length} hymn{filteredHymns.length !== 1 ? 's' : ''}
      </p>

      {/* Hymns Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredHymns.map(hymn => (
          <div
            key={hymn.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                     rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedHymn(hymn)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Hymn number */}
                <span className="flex-shrink-0 inline-flex items-center justify-center 
                               w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 
                               text-purple-600 dark:text-purple-400 font-bold">
                  {hymn.number}
                </span>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {hymn.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hymn.lyrics.length} verse{hymn.lyrics.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* First line preview */}
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">
                "{hymn.lyrics[0]?.content.split('\n')[0]}..."
              </p>

              {/* Category badge */}
              <div className="mt-3">
                <span className="inline-block px-2 py-0.5 text-xs rounded-full 
                               bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {hymn.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHymns.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No hymns found matching your search</p>
        </div>
      )}
    </div>
  );
}
