/**
 * Hymnal Library
 * Loads and provides access to hymn data
 */

export interface HymnVerse {
  verse: number;
  type: 'verse' | 'chorus';
  content: string;
}

export interface Hymn {
  id: number;
  number: string;
  title: string;
  category: string;
  lyrics: HymnVerse[];
}

export interface HymnCategory {
  name: string;
  count: number;
}

export interface HymnalData {
  version: string;
  lastUpdated: string;
  source: string;
  license: string;
  totalHymns: number;
  categories: HymnCategory[];
  hymns: Hymn[];
}

let cachedHymns: HymnalData | null = null;

export async function loadHymnal(): Promise<HymnalData> {
  if (cachedHymns) return cachedHymns;
  
  const response = await fetch('/data/hymnal/hymns.json');
  if (!response.ok) {
    throw new Error('Failed to load hymnal data');
  }
  
  cachedHymns = await response.json();
  return cachedHymns!;
}

export function searchHymns(hymns: Hymn[], query: string): Hymn[] {
  const q = query.toLowerCase();
  return hymns.filter(h => 
    h.title.toLowerCase().includes(q) ||
    h.lyrics.some(l => l.content.toLowerCase().includes(q))
  );
}

export function getHymnsByCategory(hymns: Hymn[], category: string): Hymn[] {
  if (category === 'All') return hymns;
  return hymns.filter(h => h.category === category);
}

export function getHymnByNumber(hymns: Hymn[], number: string): Hymn | undefined {
  return hymns.find(h => h.number === number);
}
