import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Users, Book, Search } from 'lucide-react';
import { loadBibleEvents, BibleEvent, biblicalEras, Era, getEraForYear, formatYear } from '../lib/bibleTimeline';

export default function Timeline() {
  const [events, setEvents] = useState<BibleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'era'>('era');

  useEffect(() => {
    loadBibleEvents()
      .then(data => {
        setEvents(data.events);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && 
          !e.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    // Era filter
    if (selectedEra && e.year !== null) {
      if (e.year < selectedEra.startYear || e.year >= selectedEra.endYear) {
        return false;
      }
    }
    return true;
  });

  // Group events by era
  const eventsByEra = biblicalEras.map(era => ({
    era,
    events: filteredEvents.filter(e => 
      e.year !== null && e.year >= era.startYear && e.year < era.endYear
    )
  })).filter(g => g.events.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading timeline...</p>
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          Biblical Timeline
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore {events.length} events from Creation to the Apostolic Age
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Era Filter */}
        <select
          value={selectedEra?.name || ''}
          onChange={(e) => setSelectedEra(biblicalEras.find(era => era.name === e.target.value) || null)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Eras</option>
          {biblicalEras.map(era => (
            <option key={era.name} value={era.name}>{era.name}</option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setViewMode('era')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'era' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            By Era
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Era Legend */}
      <div className="mb-6 flex flex-wrap gap-2">
        {biblicalEras.map(era => (
          <button
            key={era.name}
            onClick={() => setSelectedEra(selectedEra?.name === era.name ? null : era)}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium 
                      transition-all ${selectedEra?.name === era.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            <span className={`w-3 h-3 rounded-full ${era.color}`}></span>
            <span className="text-gray-700 dark:text-gray-300">{era.name}</span>
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      {viewMode === 'era' ? (
        <div className="space-y-8">
          {eventsByEra.map(({ era, events: eraEvents }) => (
            <div key={era.name} className="relative">
              {/* Era Header */}
              <div className={`sticky top-0 z-10 ${era.color} text-white px-4 py-3 rounded-t-lg shadow-md`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{era.name}</h2>
                  <span className="text-sm opacity-90">
                    {formatYear(era.startYear)} – {formatYear(era.endYear)}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">
                  {eraEvents.length} event{eraEvents.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Events */}
              <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg 
                            bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {eraEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    isExpanded={expandedEvents.has(event.id)}
                    onToggle={() => toggleExpanded(event.id)}
                    era={era}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEvents.map(event => {
            const era = event.year !== null ? getEraForYear(event.year) : undefined;
            return (
              <EventCard 
                key={event.id} 
                event={event} 
                isExpanded={expandedEvents.has(event.id)}
                onToggle={() => toggleExpanded(event.id)}
                era={era}
              />
            );
          })}
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No events found matching your criteria
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: BibleEvent;
  isExpanded: boolean;
  onToggle: () => void;
  era?: Era;
}

function EventCard({ event, isExpanded, onToggle, era }: EventCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        {/* Era indicator */}
        {era && (
          <div className={`w-2 h-12 rounded-full ${era.color} flex-shrink-0`}></div>
        )}
        
        {/* Year badge */}
        <div className="flex-shrink-0 w-20 text-center">
          <span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 
                         text-xs font-medium text-gray-700 dark:text-gray-300">
            {event.yearLabel || 'Unknown'}
          </span>
        </div>

        {/* Title and preview */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {event.title}
          </h3>
          {!isExpanded && event.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {event.description}
            </p>
          )}
        </div>

        {/* Expand icon */}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="pt-3 space-y-3">
            {event.description && (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {event.description}
              </p>
            )}
            
            {event.osisRef && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Book className="w-4 h-4" />
                <span>{event.osisRef}</span>
              </div>
            )}

            {event.participants && event.participants.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {event.participants.slice(0, 5).map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 
                                           text-purple-700 dark:text-purple-300 rounded text-xs">
                      {p}
                    </span>
                  ))}
                  {event.participants.length > 5 && (
                    <span className="text-gray-500 text-xs">
                      +{event.participants.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {event.places && event.places.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {event.places.slice(0, 5).map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 
                                           text-green-700 dark:text-green-300 rounded text-xs">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
