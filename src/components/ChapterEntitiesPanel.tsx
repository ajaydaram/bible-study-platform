import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  MapPin, 
  ExternalLink, 
  GitFork, 
  Navigation
} from 'lucide-react'
import { 
  getChapterEntities
} from '../data/chapterEntitiesData'

interface ChapterEntitiesPanelProps {
  book: string
  chapter: number
  onNavigateToVerse?: (verse: number) => void
}

export default function ChapterEntitiesPanel({ book, chapter }: ChapterEntitiesPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'people' | 'places'>('all')

  const chapterData = getChapterEntities(book, chapter)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      {/* Header Context Summary */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-850 space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
            {chapterData.era}
          </span>
          <span className="text-[11px] font-medium text-gray-400">
            {chapterData.people.length} People • {chapterData.places.length} Places
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
          {chapterData.historicalSetting}
        </p>

        {/* Sub-Tabs (All / People / Places) */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveSubTab('people')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              activeSubTab === 'people'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>People ({chapterData.people.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('places')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              activeSubTab === 'places'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Places ({chapterData.places.length})</span>
          </button>
        </div>
      </div>

      {/* Main List Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PEOPLE SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'people') && (
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>People in {book} {chapter}</span>
            </h4>

            <div className="space-y-2">
              {chapterData.people.map((person) => (
                <div
                  key={person.name}
                  className="p-3.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl space-y-2 hover:border-indigo-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{person.name}</span>
                        {person.hebrewOrGreek && (
                          <span className="font-mono text-[11px] text-gray-400">({person.hebrewOrGreek})</span>
                        )}
                      </h5>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                        {person.role}
                      </span>
                    </div>

                    {person.tribeOrOrigin && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {person.tribeOrOrigin}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    {person.bio}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {person.verseMention && (
                      <span className="text-[10px] font-mono text-gray-400">
                        📖 {person.verseMention}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {person.genealogyId && (
                        <Link
                          to={`/resources/genealogies`}
                          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5 text-[10px]"
                        >
                          <GitFork className="w-3 h-3" />
                          <span>Family Tree</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLACES SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'places') && (
          <div className="space-y-2.5 pt-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Places in {book} {chapter}</span>
            </h4>

            <div className="space-y-2">
              {chapterData.places.map((place) => (
                <div
                  key={place.name}
                  className="p-3.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl space-y-2 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{place.name}</span>
                      </h5>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                        Modern: {place.modernName} ({place.country})
                      </span>
                    </div>

                    {place.distanceFromJerusalemKm !== undefined && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {place.distanceFromJerusalemKm === 0 ? 'Jerusalem' : `${place.distanceFromJerusalemKm} km from JLM`}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    {place.significance}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-[10px] font-mono text-gray-400">
                      {place.coordinates.lat.toFixed(2)}°, {place.coordinates.lng.toFixed(2)}°
                    </span>

                    <a
                      href={`https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 text-[10px]"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>GPS Satellite Map</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Link */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-between text-xs">
        <Link
          to="/resources/maps"
          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open Full Biblical Atlas</span>
        </Link>

        <Link
          to="/resources/genealogies"
          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Family Trees</span>
        </Link>
      </div>
    </div>
  )
}
