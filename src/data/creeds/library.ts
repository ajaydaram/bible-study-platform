export type CreedDocumentType = 'creed' | 'confession' | 'catechism' | 'canon' | 'document';

export interface CreedSection {
  id: string;
  title: string;
  content: string;
}

export interface CreedDocument {
  id: string;
  title: string;
  year: number | null;
  type: CreedDocumentType;
  source: 'creeds.json' | 'reformed-standards';
  sourceAttribution?: string | null;
  sourceUrl?: string | null;
  collection?: string;
  sections: CreedSection[];
}

export interface CreedsLibrary {
  generatedAt: string;
  counts: {
    creedsJsonIncluded: number;
    creedsJsonSkipped: number;
    reformedStandardsIncluded: number;
  };
  creedsJsonSkipped: Array<{ id: string; sourceAttribution: string }>;
  documents: CreedDocument[];
}

export async function loadCreedsLibrary(): Promise<CreedsLibrary> {
  const module = await import('./creeds-library.json');
  return module.default as CreedsLibrary;
}
