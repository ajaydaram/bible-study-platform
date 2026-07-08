import { useState, useMemo } from 'react';
import { MapPin, Navigation, Book, ExternalLink } from 'lucide-react';
import { bibleMaps, BibleLocation } from '../pages/BibleMaps';

interface BibleMapSyncPanelProps {
  book: string;
  chapter: number;
  chapterText: string;
}

export default function BibleMapSyncPanel({ book, chapter, chapterText }: BibleMapSyncPanelProps) {
  const [selectedLoc, setSelectedLoc] = useState<BibleLocation | null>(null);

  // 1. Gather all locations across all maps
  const allLocations = useMemo(() => {
    const locs: BibleLocation[] = [];
    const seen = new Set<string>();
    
    bibleMaps.forEach(map => {
      map.locations.forEach(loc => {
        if (!seen.has(loc.name)) {
          seen.add(loc.name);
          locs.push(loc);
        }
      });
    });
    
    return locs;
  }, []);

  // 2. Scan chapter text and references for locations mentioned in the active passage
  const activeLocations = useMemo(() => {
    return allLocations.filter(loc => {
      // Direct mention of name in text (case insensitive)
      const nameRegex = new RegExp(`\\b${loc.name}\\b`, 'i');
      if (nameRegex.test(chapterText)) return true;

      // Mentions of key aliases or regions
      if (loc.modernName && new RegExp(`\\b${loc.modernName.split(',')[0]}\\b`, 'i').test(chapterText)) {
        return true;
      }

      // Check direct scripture references match (e.g. "Genesis 12:8")
      const matchesRef = loc.references.some(ref => {
        const parts = ref.toLowerCase();
        return parts.includes(book.toLowerCase()) && parts.includes(chapter.toString());
      });

      return matchesRef;
    });
  }, [allLocations, chapterText, book, chapter]);

  // Set first active location as selected by default if nothing selected
  useMemo(() => {
    if (activeLocations.length > 0) {
      // Find if current selection is still in active, if not reset
      const stillActive = activeLocations.find(l => l.name === selectedLoc?.name);
      if (!stillActive) {
        setSelectedLoc(activeLocations[0]);
      }
    } else {
      setSelectedLoc(null);
    }
  }, [activeLocations]);

  // 3. Map Coordinates to SVG Space (300 x 200 viewport)
  // Bounding box bounds (covering Nile/Egypt to Mesopotamia)
  const mapBounds = useMemo(() => {
    if (activeLocations.length === 0) return null;
    
    // Default regional bounds if multiple locations span a wide area
    // Latitude range: 28 to 38
    // Longitude range: 30 to 48
    let minLat = 28;
    let maxLat = 38;
    let minLng = 30;
    let maxLng = 48;

    // Adjust bounding box dynamically if coordinates are outside
    activeLocations.forEach(loc => {
      if (loc.coordinates.lat < minLat) minLat = loc.coordinates.lat - 1;
      if (loc.coordinates.lat > maxLat) maxLat = loc.coordinates.lat + 1;
      if (loc.coordinates.lng < minLng) minLng = loc.coordinates.lng - 1;
      if (loc.coordinates.lng > maxLng) maxLng = loc.coordinates.lng + 1;
    });

    return { minLat, maxLat, minLng, maxLng };
  }, [activeLocations]);

  const svgPins = useMemo(() => {
    if (!mapBounds) return [];
    const { minLat, maxLat, minLng, maxLng } = mapBounds;
    
    return activeLocations.map(loc => {
      // Map latitude to Y (maxLat maps to Y=10, minLat maps to Y=190)
      const y = 10 + ((maxLat - loc.coordinates.lat) / (maxLat - minLat)) * 180;
      // Map longitude to X (minLng maps to X=10, maxLng maps to X=290)
      const x = 10 + ((loc.coordinates.lng - minLng) / (maxLng - minLng)) * 280;
      
      return {
        location: loc,
        x,
        y
      };
    });
  }, [activeLocations, mapBounds]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      {activeLocations.length > 0 ? (
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
          {/* Interactive SVG Map */}
          <div className="relative border border-gray-200 dark:border-gray-700 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-xl overflow-hidden shadow-inner p-1">
            <svg viewBox="0 0 300 200" className="w-full h-auto bg-sky-50/20 dark:bg-sky-950/20 rounded-lg">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" className="text-gray-150 dark:text-gray-800" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" className="text-gray-150 dark:text-gray-800" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="300" y2="150" stroke="currentColor" className="text-gray-150 dark:text-gray-800" strokeDasharray="4 4" />
              <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" className="text-gray-150 dark:text-gray-800" strokeDasharray="4 4" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="currentColor" className="text-gray-150 dark:text-gray-800" strokeDasharray="4 4" />

              {/* Stylized Historical Region Labels */}
              <text x="35" y="170" className="fill-gray-400 dark:fill-gray-600 text-[8px] font-semibold tracking-wider">EGYPT</text>
              <text x="110" y="110" className="fill-gray-400 dark:fill-gray-600 text-[8px] font-semibold tracking-wider">CANAAN</text>
              <text x="210" y="60" className="fill-gray-400 dark:fill-gray-600 text-[8px] font-semibold tracking-wider">MESOPOTAMIA</text>

              {/* Connecting Lines / Journey Lines if multiple exist */}
              {svgPins.length > 1 && (
                <polyline
                  points={svgPins.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="url(#journeyGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              )}

              {/* Gradients */}
              <defs>
                <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Pins */}
              {svgPins.map(({ location: loc, x, y }) => {
                const isSelected = selectedLoc?.name === loc.name;
                return (
                  <g
                    key={loc.name}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedLoc(loc)}
                    className="cursor-pointer group"
                  >
                    {/* Ripple animation for selected */}
                    {isSelected && (
                      <circle r="12" className="fill-orange-400/20 stroke-orange-400/40 animate-ping" />
                    )}
                    <circle
                      r={isSelected ? "6" : "4.5"}
                      className={`transition-all duration-300 stroke-2 ${
                        isSelected 
                          ? 'fill-orange-500 stroke-white' 
                          : 'fill-emerald-500 stroke-white group-hover:fill-orange-400'
                      }`}
                    />
                    <text
                      y="-9"
                      textAnchor="middle"
                      className={`text-[7px] font-bold pointer-events-none select-none tracking-tight ${
                        isSelected 
                          ? 'fill-orange-650 dark:fill-orange-400 font-extrabold' 
                          : 'fill-gray-550 dark:fill-gray-450 group-hover:fill-orange-500'
                      }`}
                    >
                      {loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[9px] text-gray-300 px-2 py-0.5 rounded font-mono">
              Regional Coordinates Projection Map
            </div>
          </div>

          {/* Location Roster / selector list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Locations In Chapter</h4>
            <div className="flex flex-wrap gap-2">
              {activeLocations.map(loc => {
                const isSelected = selectedLoc?.name === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => setSelectedLoc(loc)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 dark:bg-gray-900/40 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-750'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {loc.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Card */}
          {selectedLoc && (
            <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-850 p-4 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                    {selectedLoc.name}
                  </h4>
                  {selectedLoc.modernName && (
                    <span className="text-xs text-gray-450 dark:text-gray-400 mt-0.5 inline-block">
                      Modern: {selectedLoc.modernName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-350 px-2.5 py-0.75 rounded-full font-bold">
                  {selectedLoc.region}
                </span>
              </div>
              <p className="text-sm text-gray-650 dark:text-gray-355 leading-relaxed">
                {selectedLoc.description}
              </p>
              
              <div className="border-t border-gray-150 dark:border-gray-800 pt-3 flex flex-col gap-2">
                <div className="flex items-center gap-1 text-[11px] text-gray-450">
                  <span className="font-bold">Period:</span>
                  <span>{selectedLoc.period.join(', ')}</span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors mt-2"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  View on Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-gray-500">
          <Book className="w-12 h-12 opacity-30 mb-3" />
          <p className="text-sm font-semibold">No locations detected in this chapter</p>
          <p className="text-xs mt-1 max-w-[220px]">
            Try navigating to Genesis 12 or Exodus 14 to see locations sync interactively.
          </p>
        </div>
      )}
    </div>
  );
}
