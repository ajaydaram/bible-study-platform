/**
 * Creed Proofs Library
 * Maps Bible verses to confession/catechism sections using Creeds.json proof texts
 */

const bookToOsis: Record<string, string> = {
  'Genesis': 'Gen',
  'Exodus': 'Exod',
  'Leviticus': 'Lev',
  'Numbers': 'Num',
  'Deuteronomy': 'Deut',
  'Joshua': 'Josh',
  'Judges': 'Judg',
  'Ruth': 'Ruth',
  '1 Samuel': '1Sam',
  '2 Samuel': '2Sam',
  '1 Kings': '1Kgs',
  '2 Kings': '2Kgs',
  '1 Chronicles': '1Chr',
  '2 Chronicles': '2Chr',
  'Ezra': 'Ezra',
  'Nehemiah': 'Neh',
  'Esther': 'Esth',
  'Job': 'Job',
  'Psalms': 'Ps',
  'Proverbs': 'Prov',
  'Ecclesiastes': 'Eccl',
  'Song of Solomon': 'Song',
  'Isaiah': 'Isa',
  'Jeremiah': 'Jer',
  'Lamentations': 'Lam',
  'Ezekiel': 'Ezek',
  'Daniel': 'Dan',
  'Hosea': 'Hos',
  'Joel': 'Joel',
  'Amos': 'Amos',
  'Obadiah': 'Obad',
  'Jonah': 'Jon',
  'Micah': 'Mic',
  'Nahum': 'Nah',
  'Habakkuk': 'Hab',
  'Zephaniah': 'Zeph',
  'Haggai': 'Hag',
  'Zechariah': 'Zech',
  'Malachi': 'Mal',
  'Matthew': 'Matt',
  'Mark': 'Mark',
  'Luke': 'Luke',
  'John': 'John',
  'Acts': 'Acts',
  'Romans': 'Rom',
  '1 Corinthians': '1Cor',
  '2 Corinthians': '2Cor',
  'Galatians': 'Gal',
  'Ephesians': 'Eph',
  'Philippians': 'Phil',
  'Colossians': 'Col',
  '1 Thessalonians': '1Thess',
  '2 Thessalonians': '2Thess',
  '1 Timothy': '1Tim',
  '2 Timothy': '2Tim',
  'Titus': 'Titus',
  'Philemon': 'Philem',
  'Hebrews': 'Heb',
  'James': 'Jas',
  '1 Peter': '1Pet',
  '2 Peter': '2Pet',
  '1 John': '1John',
  '2 John': '2John',
  '3 John': '3John',
  'Jude': 'Jude',
  'Revelation': 'Rev'
};

export function getOsisRef(bookName: string, chapter: number, verse: number): string {
  const osisBook = bookToOsis[bookName] || bookName;
  return `${osisBook}.${chapter}.${verse}`;
}


export interface CreedProof {
  creedId: string;
  creedTitle: string;
  sectionId: string;
  sectionTitle: string;
  proofId: number;
  references: string[];
}

export interface VerseProofLink {
  reference: string; // OSIS format (e.g. Eph.1.4)
  creedId: string;
  creedTitle: string;
  sectionId: string;
  sectionTitle: string;
  proofId: number;
}

// In-memory index
let verseToCreed: Record<string, VerseProofLink[]> = {};
let creedProofs: CreedProof[] = [];
let loaded = false;

/**
 * Expand reference ranges like "Rom.1.19-Rom.1.20" or "Ps.19.1-3"
 */
function expandOsisReference(refStr: string): string[] {
  if (!refStr.includes('-')) {
    return [refStr];
  }
  const [start, end] = refStr.split('-');
  const startParts = start.split('.');
  if (startParts.length < 3) return [refStr];

  const book = startParts[0];
  const chapter = parseInt(startParts[1], 10);
  const startVerse = parseInt(startParts[2], 10);

  const endParts = end.split('.');
  let endVerse = startVerse;
  if (endParts.length === 3) {
    endVerse = parseInt(endParts[2], 10);
  } else if (endParts.length === 1 && !isNaN(parseInt(end, 10))) {
    endVerse = parseInt(end, 10);
  } else {
    // Return start and end as fallback
    return [start, end];
  }

  const result: string[] = [];
  for (let v = startVerse; v <= endVerse; v++) {
    result.push(`${book}.${chapter}.${v}`);
  }
  return result;
}

/**
 * Load creeds-library.json and build verse-to-creed index
 */
export async function loadCreedProofs(): Promise<void> {
  if (loaded) return;
  const module = await import('../data/creeds/creeds-library.json');
  const data = module.default;

  for (const doc of data.documents) {
    for (const section of doc.sections || []) {
      // Only process sections with proof texts
      if ('Proofs' in section && Array.isArray((section as any).Proofs)) {
        for (const proof of (section as any).Proofs) {
          const rawReferences = proof.References || [];
          const expandedRefs: string[] = [];
          for (const ref of rawReferences) {
            expandedRefs.push(...expandOsisReference(ref));
          }

          const proofEntry: CreedProof = {
            creedId: doc.id,
            creedTitle: doc.title,
            sectionId: section.id,
            sectionTitle: section.title,
            proofId: proof.Id,
            references: expandedRefs
          };
          creedProofs.push(proofEntry);
          for (const ref of expandedRefs) {
            if (!verseToCreed[ref]) verseToCreed[ref] = [];
            verseToCreed[ref].push({
              reference: ref,
              creedId: doc.id,
              creedTitle: doc.title,
              sectionId: section.id,
              sectionTitle: section.title,
              proofId: proof.Id
            });
          }
        }
      }
    }
  }
  loaded = true;
}

/**
 * Get all creed sections that cite a given verse (OSIS format)
 */
export async function getCreedsForVerse(reference: string): Promise<VerseProofLink[]> {
  await loadCreedProofs();
  return verseToCreed[reference] || [];
}

/**
 * Get all creed sections that cite a given verse synchronously (must load index first)
 */
export function getCreedsForVerseSync(reference: string): VerseProofLink[] {
  if (!loaded) return [];
  return verseToCreed[reference] || [];
}

/**
 * Get all proof texts for a given creed section
 */
export async function getProofsForCreedSection(creedId: string, sectionId: string): Promise<CreedProof[]> {
  await loadCreedProofs();
  return creedProofs.filter(p => p.creedId === creedId && p.sectionId === sectionId);
}

/**
 * Get all proof texts for a given creed
 */
export async function getProofsForCreed(creedId: string): Promise<CreedProof[]> {
  await loadCreedProofs();
  return creedProofs.filter(p => p.creedId === creedId);
}
