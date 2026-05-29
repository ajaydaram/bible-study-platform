/**
 * Creed Proofs Library
 * Maps Bible verses to confession/catechism sections using Creeds.json proof texts
 */

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
          const proofEntry: CreedProof = {
            creedId: doc.id,
            creedTitle: doc.title,
            sectionId: section.id,
            sectionTitle: section.title,
            proofId: proof.Id,
            references: proof.References
          };
          creedProofs.push(proofEntry);
          for (const ref of proof.References) {
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
