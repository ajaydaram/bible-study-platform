/**
 * Bible Places Library
 * Loads and provides access to geocoding data for Bible places
 */

export interface BiblePlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
  verses: string[];
  verseCount: number;
}

export interface BiblePlacesData {
  version: string;
  source: string;
  license: string;
  totalPlaces: number;
  places: BiblePlace[];
}

let cachedPlaces: BiblePlacesData | null = null;

export async function loadBiblePlaces(): Promise<BiblePlacesData> {
  if (cachedPlaces) return cachedPlaces;
  
  const response = await fetch('/data/maps/bible-places.json');
  if (!response.ok) {
    throw new Error('Failed to load Bible places data');
  }
  
  cachedPlaces = await response.json();
  return cachedPlaces!;
}

export function getPlacesByType(places: BiblePlace[], type: string): BiblePlace[] {
  return places.filter(p => p.type === type);
}

export function searchPlaces(places: BiblePlace[], query: string): BiblePlace[] {
  const q = query.toLowerCase();
  return places.filter(p => 
    p.name.toLowerCase().includes(q)
  );
}

export function getPlaceTypes(places: BiblePlace[]): { type: string; count: number }[] {
  const types: Record<string, number> = {};
  for (const p of places) {
    types[p.type] = (types[p.type] || 0) + 1;
  }
  return Object.entries(types)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get places near a specific location
 */
export function getPlacesNearby(
  places: BiblePlace[], 
  lat: number, 
  lon: number, 
  radiusKm: number = 50
): BiblePlace[] {
  return places.filter(p => {
    const dist = haversineDistance(lat, lon, p.lat, p.lon);
    return dist <= radiusKm;
  }).sort((a, b) => 
    haversineDistance(lat, lon, a.lat, a.lon) - haversineDistance(lat, lon, b.lat, b.lon)
  );
}

/**
 * Calculate distance between two coordinates in km
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
