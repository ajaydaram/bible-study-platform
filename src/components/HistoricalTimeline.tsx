import { useState } from 'react';
import { 
  Calendar,
  Church,
  Scroll,
  Users,
  Flame,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import {
  historicalTimeline,
  getEventsByType,
  getFatherById,
  type HistoricalEvent
} from '../data/churchFathers';

type EventTypeFilter = HistoricalEvent['type'] | 'all';

const eventTypeIcons: Record<HistoricalEvent['type'], React.ReactNode> = {
  council: <Church className="h-4 w-4" />,
  creed: <Scroll className="h-4 w-4" />,
  persecution: <Flame className="h-4 w-4" />,
  figure: <Users className="h-4 w-4" />,
  writing: <BookOpen className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />
};

const eventTypeColors: Record<HistoricalEvent['type'], string> = {
  council: 'bg-blue-500',
  creed: 'bg-purple-500',
  persecution: 'bg-red-500',
  figure: 'bg-green-500',
  writing: 'bg-amber-500',
  event: 'bg-gray-500'
};

const eventTypeBgColors: Record<HistoricalEvent['type'], string> = {
  council: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  creed: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  persecution: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  figure: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  writing: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  event: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
};

const eras = [
  { id: 'apostolic', name: 'Apostolic Era', start: 30, end: 100 },
  { id: 'ante-nicene', name: 'Ante-Nicene', start: 100, end: 325 },
  { id: 'nicene', name: 'Nicene Era', start: 325, end: 381 },
  { id: 'post-nicene', name: 'Post-Nicene', start: 381, end: 500 }
];

interface HistoricalTimelineProps {
  onSelectFather?: (fatherId: string) => void;
}

export default function HistoricalTimeline({ onSelectFather }: HistoricalTimelineProps) {
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const filteredEvents = (() => {
    let events = typeFilter === 'all' 
      ? historicalTimeline 
      : getEventsByType(typeFilter);
    
    if (selectedEra) {
      const era = eras.find(e => e.id === selectedEra);
      if (era) {
        events = events.filter(e => e.year >= era.start && e.year <= era.end);
      }
    }
    
    return events.sort((a, b) => a.year - b.year);
  })();

  const toggleExpand = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Church History Timeline
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                30 AD – 500 AD • {filteredEvents.length} events
              </p>
            </div>
          </div>
        </div>

        {/* Era Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedEra(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !selectedEra
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Eras
          </button>
          {eras.map(era => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedEra === era.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {era.name}
            </button>
          ))}
        </div>

        {/* Type Filter */}
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
              All
            </button>
            {Object.keys(eventTypeIcons).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as HistoricalEvent['type'])}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  typeFilter === type
                    ? `${eventTypeColors[type as HistoricalEvent['type']]} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {eventTypeIcons[type as HistoricalEvent['type']]}
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-5 max-h-[600px] overflow-y-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Events */}
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const isExpanded = expandedEvent === event.id;
              const relatedFathers = event.relatedFathers?.map(id => getFatherById(id)).filter(Boolean);

              return (
                <div key={event.id} className="relative pl-14 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full ${eventTypeColors[event.type]} flex items-center justify-center ring-4 ring-white dark:ring-gray-900`}>
                    <span className="text-white text-xs">
                      {eventTypeIcons[event.type]}
                    </span>
                  </div>

                  {/* Event Card */}
                  <button
                    onClick={() => toggleExpand(event.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${eventTypeBgColors[event.type]} hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            {event.year} AD
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${eventTypeColors[event.type]}`}>
                            {event.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 animate-fade-in">
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Significance
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {event.significance}
                          </p>
                        </div>

                        {/* Related Scripture */}
                        {event.relatedScripture && event.relatedScripture.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              Related Scripture
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {event.relatedScripture.map(ref => (
                                <span key={ref} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-800/30 text-amber-800 dark:text-amber-300 rounded text-xs font-medium">
                                  {ref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related Fathers */}
                        {relatedFathers && relatedFathers.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                              Related Figures
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {relatedFathers.map(father => father && (
                                <button
                                  key={father.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectFather?.(father.id);
                                  }}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <Users className="h-3.5 w-3.5" />
                                  {father.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
