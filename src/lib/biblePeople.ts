/**
 * Bible People Library
 * Loads and provides access to biblical people data from Theographic
 */

export interface BiblePerson {
  id: string;
  name: string;
  gender: string;
  description: string;
  dictionaryLink: string;
  verses: string[];
}

export interface BiblePeopleData {
  version: string;
  source: string;
  license: string;
  totalPeople: number;
  people: BiblePerson[];
}

let cachedPeople: BiblePeopleData | null = null;

export async function loadBiblePeople(): Promise<BiblePeopleData> {
  if (cachedPeople) return cachedPeople;
  
  const response = await fetch('/data/people/bible-people.json');
  if (!response.ok) {
    throw new Error('Failed to load Bible people data');
  }
  
  cachedPeople = await response.json();
  return cachedPeople!;
}

export function searchPeople(people: BiblePerson[], query: string): BiblePerson[] {
  const q = query.toLowerCase();
  return people.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

export function getPeopleByGender(people: BiblePerson[], gender: string): BiblePerson[] {
  if (gender === 'All') return people;
  return people.filter(p => p.gender === gender);
}

export function getPeopleByLetter(people: BiblePerson[], letter: string): BiblePerson[] {
  if (letter === 'All') return people;
  return people.filter(p => p.name.toUpperCase().startsWith(letter));
}

// Get unique first letters for navigation
export function getFirstLetters(people: BiblePerson[]): string[] {
  const letters = new Set(people.map(p => p.name[0].toUpperCase()));
  return Array.from(letters).sort();
}
