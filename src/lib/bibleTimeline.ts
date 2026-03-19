/**
 * Bible Timeline Library
 * Loads and provides access to biblical events for timeline display
 */

export interface BibleEvent {
  id: string;
  title: string;
  description: string;
  year: number | null;
  yearLabel: string;
  osisRef: string;
  participants: string[];
  places: string[];
}

export interface BibleEventsData {
  version: string;
  source: string;
  license: string;
  totalEvents: number;
  events: BibleEvent[];
}

let cachedEvents: BibleEventsData | null = null;

export async function loadBibleEvents(): Promise<BibleEventsData> {
  if (cachedEvents) return cachedEvents;
  
  const response = await fetch('/data/timeline/bible-events.json');
  if (!response.ok) {
    throw new Error('Failed to load Bible events data');
  }
  
  cachedEvents = await response.json();
  return cachedEvents!;
}

export interface Era {
  name: string;
  startYear: number;
  endYear: number;
  color: string;
}

export const biblicalEras: Era[] = [
  { name: 'Creation & Patriarchs', startYear: -4000, endYear: -1800, color: 'bg-amber-500' },
  { name: 'Egyptian Sojourn', startYear: -1800, endYear: -1446, color: 'bg-yellow-500' },
  { name: 'Exodus & Wilderness', startYear: -1446, endYear: -1406, color: 'bg-orange-500' },
  { name: 'Conquest & Judges', startYear: -1406, endYear: -1050, color: 'bg-red-500' },
  { name: 'United Kingdom', startYear: -1050, endYear: -930, color: 'bg-purple-500' },
  { name: 'Divided Kingdom', startYear: -930, endYear: -586, color: 'bg-pink-500' },
  { name: 'Exile', startYear: -586, endYear: -538, color: 'bg-gray-500' },
  { name: 'Return & Restoration', startYear: -538, endYear: -400, color: 'bg-teal-500' },
  { name: 'Intertestamental', startYear: -400, endYear: -4, color: 'bg-slate-400' },
  { name: 'Life of Christ', startYear: -4, endYear: 33, color: 'bg-blue-500' },
  { name: 'Apostolic Age', startYear: 33, endYear: 100, color: 'bg-indigo-500' },
];

export function getEraForYear(year: number): Era | undefined {
  return biblicalEras.find(era => year >= era.startYear && year < era.endYear);
}

export function getEventsByEra(events: BibleEvent[], era: Era): BibleEvent[] {
  return events.filter(e => 
    e.year !== null && e.year >= era.startYear && e.year < era.endYear
  );
}

export function formatYear(year: number | null): string {
  if (year === null) return 'Unknown';
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
}
