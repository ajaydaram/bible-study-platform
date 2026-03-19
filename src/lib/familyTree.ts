/**
 * Bible People Family Tree Utilities
 * Access STEPBible TIPNR data for biblical people and their relationships
 * 
 * Data source: STEPBible TIPNR (Translators Individualised Proper Names with all References)
 * License: CC BY 4.0
 */

// Type definitions
export interface FamilyRelations {
  father: string | null
  mother: string | null
  siblings: string[]
  spouses: string[]
  children: string[]
}

export interface BiblePerson {
  id: string
  name: string
  strongs: string | null
  firstReference: string | null
  description: string
  family: {
    parents: { father: PersonRef | null; mother: PersonRef | null }
    siblings: PersonRef[]
    partners: PersonRef[]
    children: PersonRef[]
  }
  relations: FamilyRelations
  tribe: string
  briefDescription?: string
  briefestDescription?: string
  shortDescription?: string
}

export interface PersonRef {
  name: string
  strongs: string | null
  firstRef: string | null
  raw: string
}

// Lazy-loaded data
let biblePeople: Record<string, BiblePerson> | null = null
let majorFigures: Record<string, BiblePerson> | null = null
let peopleIndex: string[] | null = null

/**
 * Load all Bible people data
 */
export async function loadBiblePeople(): Promise<Record<string, BiblePerson>> {
  if (!biblePeople) {
    try {
      const response = await fetch('/data/stepbible/json/biblePeople.min.json')
      if (response.ok) {
        biblePeople = await response.json()
      } else {
        biblePeople = {}
      }
    } catch (e) {
      console.warn('Could not load Bible people data:', e)
      biblePeople = {}
    }
  }
  return biblePeople!
}

/**
 * Load major Bible figures (subset for quick access)
 */
export async function loadMajorFigures(): Promise<Record<string, BiblePerson>> {
  if (!majorFigures) {
    try {
      const response = await fetch('/data/stepbible/json/majorBibleFigures.json')
      if (response.ok) {
        majorFigures = await response.json()
      } else {
        majorFigures = {}
      }
    } catch (e) {
      console.warn('Could not load major figures data:', e)
      majorFigures = {}
    }
  }
  return majorFigures!
}

/**
 * Load people name index for autocomplete
 */
export async function loadPeopleIndex(): Promise<string[]> {
  if (!peopleIndex) {
    try {
      const response = await fetch('/data/stepbible/json/peopleIndex.json')
      if (response.ok) {
        peopleIndex = await response.json()
      } else {
        peopleIndex = []
      }
    } catch (e) {
      console.warn('Could not load people index:', e)
      peopleIndex = []
    }
  }
  return peopleIndex!
}

/**
 * Get a specific person by name
 */
export async function getPerson(name: string): Promise<BiblePerson | null> {
  const people = await loadBiblePeople()
  
  // Try exact match first
  if (people[name]) {
    return people[name]
  }
  
  // Try case-insensitive match
  const lowerName = name.toLowerCase()
  for (const [key, person] of Object.entries(people)) {
    if (key.toLowerCase() === lowerName || person.name.toLowerCase() === lowerName) {
      return person
    }
  }
  
  return null
}

/**
 * Search for people by name (partial match)
 */
export async function searchPeople(query: string, limit: number = 20): Promise<BiblePerson[]> {
  const people = await loadBiblePeople()
  const lowerQuery = query.toLowerCase()
  
  const matches: BiblePerson[] = []
  for (const [key, person] of Object.entries(people)) {
    if (key.toLowerCase().includes(lowerQuery) || 
        person.name.toLowerCase().includes(lowerQuery)) {
      matches.push(person)
      if (matches.length >= limit) break
    }
  }
  
  return matches
}

/**
 * Get family tree for a person (multi-generational)
 */
export async function getFamilyTree(
  name: string, 
  generations: { ancestors: number; descendants: number } = { ancestors: 2, descendants: 2 }
): Promise<{
  person: BiblePerson | null
  ancestors: BiblePerson[][]
  descendants: BiblePerson[][]
}> {
  const people = await loadBiblePeople()
  const person = await getPerson(name)
  
  if (!person) {
    return { person: null, ancestors: [], descendants: [] }
  }
  
  const ancestors: BiblePerson[][] = []
  const descendants: BiblePerson[][] = []
  
  // Get ancestors (parents, grandparents, etc.)
  let currentGen = [person]
  for (let i = 0; i < generations.ancestors; i++) {
    const nextGen: BiblePerson[] = []
    for (const p of currentGen) {
      if (p.relations.father && people[p.relations.father]) {
        nextGen.push(people[p.relations.father])
      }
      if (p.relations.mother && people[p.relations.mother]) {
        nextGen.push(people[p.relations.mother])
      }
    }
    if (nextGen.length > 0) {
      ancestors.push(nextGen)
      currentGen = nextGen
    } else {
      break
    }
  }
  
  // Get descendants (children, grandchildren, etc.)
  currentGen = [person]
  for (let i = 0; i < generations.descendants; i++) {
    const nextGen: BiblePerson[] = []
    for (const p of currentGen) {
      for (const childName of p.relations.children) {
        if (people[childName]) {
          nextGen.push(people[childName])
        }
      }
    }
    if (nextGen.length > 0) {
      descendants.push(nextGen)
      currentGen = nextGen
    } else {
      break
    }
  }
  
  return { person, ancestors, descendants }
}

/**
 * Get all descendants of a person (for lineage tracking)
 */
export async function getLineage(
  ancestorName: string, 
  maxGenerations: number = 10
): Promise<BiblePerson[][]> {
  const people = await loadBiblePeople()
  const ancestor = await getPerson(ancestorName)
  
  if (!ancestor) return []
  
  const lineage: BiblePerson[][] = [[ancestor]]
  let currentGen = [ancestor]
  
  for (let i = 0; i < maxGenerations; i++) {
    const nextGen: BiblePerson[] = []
    const seenNames = new Set<string>()
    
    for (const p of currentGen) {
      for (const childName of p.relations.children) {
        if (!seenNames.has(childName) && people[childName]) {
          nextGen.push(people[childName])
          seenNames.add(childName)
        }
      }
    }
    
    if (nextGen.length > 0) {
      lineage.push(nextGen)
      currentGen = nextGen
    } else {
      break
    }
  }
  
  return lineage
}

/**
 * Find common ancestors between two people
 */
export async function findCommonAncestors(
  person1Name: string,
  person2Name: string,
  maxGenerations: number = 10
): Promise<BiblePerson[]> {
  const people = await loadBiblePeople()
  
  // Build ancestor sets for both people
  const getAncestorSet = async (name: string): Promise<Set<string>> => {
    const ancestors = new Set<string>()
    let current: string[] = [name]
    
    for (let i = 0; i < maxGenerations; i++) {
      const next: string[] = []
      for (const n of current) {
        const p = people[n]
        if (p) {
          if (p.relations.father) {
            ancestors.add(p.relations.father)
            next.push(p.relations.father)
          }
          if (p.relations.mother) {
            ancestors.add(p.relations.mother)
            next.push(p.relations.mother)
          }
        }
      }
      if (next.length === 0) break
      current = next
    }
    
    return ancestors
  }
  
  const ancestors1 = await getAncestorSet(person1Name)
  const ancestors2 = await getAncestorSet(person2Name)
  
  // Find intersection
  const common: BiblePerson[] = []
  for (const name of ancestors1) {
    if (ancestors2.has(name) && people[name]) {
      common.push(people[name])
    }
  }
  
  return common
}

/**
 * Get siblings and half-siblings
 */
export async function getSiblings(name: string): Promise<{
  fullSiblings: BiblePerson[]
  halfSiblings: BiblePerson[]
}> {
  const people = await loadBiblePeople()
  const person = await getPerson(name)
  
  if (!person) {
    return { fullSiblings: [], halfSiblings: [] }
  }
  
  const fullSiblings: BiblePerson[] = []
  const halfSiblings: BiblePerson[] = []
  
  const { father, mother } = person.relations
  
  // Get all children of father
  const fatherChildren = new Set<string>()
  if (father && people[father]) {
    for (const child of people[father].relations.children) {
      if (child !== name) fatherChildren.add(child)
    }
  }
  
  // Get all children of mother
  const motherChildren = new Set<string>()
  if (mother && people[mother]) {
    for (const child of people[mother].relations.children) {
      if (child !== name) motherChildren.add(child)
    }
  }
  
  // Full siblings = children of BOTH parents
  // Half siblings = children of ONE parent only
  const allSiblings = new Set([...fatherChildren, ...motherChildren])
  
  for (const sibName of allSiblings) {
    if (people[sibName]) {
      const sib = people[sibName]
      if (fatherChildren.has(sibName) && motherChildren.has(sibName)) {
        fullSiblings.push(sib)
      } else {
        halfSiblings.push(sib)
      }
    }
  }
  
  return { fullSiblings, halfSiblings }
}

/**
 * Get timeline of a person's life (based on Scripture references)
 */
export async function getPersonTimeline(name: string): Promise<{
  person: BiblePerson | null
  firstMention: string | null
  references: string[]
}> {
  const person = await getPerson(name)
  
  if (!person) {
    return { person: null, firstMention: null, references: [] }
  }
  
  return {
    person,
    firstMention: person.firstReference,
    references: [] // Would need to parse from TIPNR more fully
  }
}

/**
 * Get people mentioned in a specific book of the Bible
 */
export async function getPeopleByBook(book: string): Promise<BiblePerson[]> {
  const people = await loadBiblePeople()
  const bookAbbrev = book.slice(0, 3)
  
  const matches: BiblePerson[] = []
  for (const person of Object.values(people)) {
    if (person.firstReference?.includes(bookAbbrev)) {
      matches.push(person)
    }
  }
  
  return matches
}

/**
 * Get a visual representation of family relationships
 * (for use with visualization libraries)
 */
export async function getFamilyGraphData(
  centerPerson: string,
  depth: number = 2
): Promise<{
  nodes: Array<{ id: string; name: string; group: string }>
  links: Array<{ source: string; target: string; relation: string }>
}> {
  const people = await loadBiblePeople()
  const person = await getPerson(centerPerson)
  
  if (!person) {
    return { nodes: [], links: [] }
  }
  
  const nodes: Array<{ id: string; name: string; group: string }> = []
  const links: Array<{ source: string; target: string; relation: string }> = []
  const seenNodes = new Set<string>()
  
  const addNode = (name: string, group: string) => {
    if (!seenNodes.has(name)) {
      nodes.push({ id: name, name, group })
      seenNodes.add(name)
    }
  }
  
  const addPerson = (p: BiblePerson, currentDepth: number) => {
    if (currentDepth > depth) return
    
    addNode(p.name, currentDepth === 0 ? 'center' : 'related')
    
    // Add parents
    if (p.relations.father) {
      addNode(p.relations.father, 'parent')
      links.push({ source: p.relations.father, target: p.name, relation: 'parent' })
      if (currentDepth < depth && people[p.relations.father]) {
        addPerson(people[p.relations.father], currentDepth + 1)
      }
    }
    
    if (p.relations.mother) {
      addNode(p.relations.mother, 'parent')
      links.push({ source: p.relations.mother, target: p.name, relation: 'parent' })
      if (currentDepth < depth && people[p.relations.mother]) {
        addPerson(people[p.relations.mother], currentDepth + 1)
      }
    }
    
    // Add spouses
    for (const spouse of p.relations.spouses) {
      addNode(spouse, 'spouse')
      links.push({ source: p.name, target: spouse, relation: 'spouse' })
    }
    
    // Add children
    for (const child of p.relations.children) {
      addNode(child, 'child')
      links.push({ source: p.name, target: child, relation: 'child' })
      if (currentDepth < depth && people[child]) {
        addPerson(people[child], currentDepth + 1)
      }
    }
  }
  
  addPerson(person, 0)
  
  return { nodes, links }
}
