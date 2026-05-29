import { 
  collection, 
  doc, 
  getDocs, 
  // getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type { JournalEntry, Group, Discussion, Prayer } from '../types'

// Helper to convert Firestore timestamp to ISO string
const toISOString = (timestamp: Timestamp | null) => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString()
}

// ============ JOURNAL ============

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const q = query(
    collection(db, 'journals'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toISOString(doc.data().createdAt),
    updatedAt: toISOString(doc.data().updatedAt)
  })) as JournalEntry[]
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'journals'), {
    ...entry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return docRef.id
}

export async function updateJournalEntry(id: string, data: Partial<JournalEntry>) {
  const docRef = doc(db, 'journals', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deleteJournalEntry(id: string) {
  await deleteDoc(doc(db, 'journals', id))
}

// ============ GROUPS ============

export async function getGroups(): Promise<Group[]> {
  const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toISOString(doc.data().createdAt)
  })) as Group[]
}

export async function addGroup(group: Omit<Group, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'groups'), {
    ...group,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

// ============ DISCUSSIONS ============

export async function getDiscussions(): Promise<Discussion[]> {
  const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toISOString(doc.data().createdAt)
  })) as Discussion[]
}

export async function addDiscussion(discussion: Omit<Discussion, 'id' | 'createdAt' | 'commentCount'>) {
  const docRef = await addDoc(collection(db, 'discussions'), {
    ...discussion,
    commentCount: 0,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

// ============ PRAYERS ============

export async function getPrayers(userId: string): Promise<Prayer[]> {
  const q = query(
    collection(db, 'prayers'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toISOString(doc.data().createdAt),
    answeredAt: doc.data().answeredAt ? toISOString(doc.data().answeredAt) : undefined
  })) as Prayer[]
}

export async function addPrayer(prayer: Omit<Prayer, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'prayers'), {
    ...prayer,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export async function updatePrayer(id: string, data: Partial<Prayer>) {
  const docRef = doc(db, 'prayers', id)
  const updateData: Record<string, unknown> = { ...data }
  if (data.answeredAt) {
    updateData.answeredAt = serverTimestamp()
  }
  await updateDoc(docRef, updateData)
}

export async function deletePrayer(id: string) {
  await deleteDoc(doc(db, 'prayers', id))
}

// ============ READING PROGRESS ============

export async function getReadingProgress(userId: string, pathType: 'chronological' | 'thematic'): Promise<Record<string | number, { completed: boolean; notes: string }>> {
  const q = query(
    collection(db, 'readingProgress'),
    where('userId', '==', userId),
    where('pathType', '==', pathType)
  )
  const snapshot = await getDocs(q)
  const progress: Record<string | number, { completed: boolean; notes: string }> = {}
  
  snapshot.docs.forEach(doc => {
    const data = doc.data()
    progress[data.dayOrTopicId] = {
      completed: data.completed,
      notes: data.notes || ''
    }
  })
  
  return progress
}

export async function saveReadingProgress(
  userId: string, 
  pathType: 'chronological' | 'thematic',
  dayOrTopicId: string | number,
  data: { completed: boolean; notes: string }
) {
  // Check if progress already exists
  const q = query(
    collection(db, 'readingProgress'),
    where('userId', '==', userId),
    where('pathType', '==', pathType),
    where('dayOrTopicId', '==', dayOrTopicId)
  )
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    // Create new
    await addDoc(collection(db, 'readingProgress'), {
      userId,
      pathType,
      dayOrTopicId,
      ...data,
      updatedAt: serverTimestamp()
    })
  } else {
    // Update existing
    const docRef = doc(db, 'readingProgress', snapshot.docs[0].id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  }
}

// ============ SERMONS ============

import type { Sermon } from '../types'

export async function getSermons(userId: string): Promise<Sermon[]> {
  const q = query(
    collection(db, 'sermons'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toISOString(doc.data().createdAt),
    updatedAt: toISOString(doc.data().updatedAt)
  })) as Sermon[]
}

export async function getSermonById(id: string): Promise<Sermon | null> {
  const { getDoc } = await import('firebase/firestore')
  const docRef = doc(db, 'sermons', id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }
  
  const data = docSnap.data()
  return {
    id: docSnap.id,
    ...data,
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt)
  } as Sermon
}

export async function addSermon(sermon: Omit<Sermon, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'sermons'), {
    ...sermon,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return docRef.id
}

export async function updateSermon(id: string, data: Partial<Sermon>) {
  const docRef = doc(db, 'sermons', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deleteSermon(id: string) {
  await deleteDoc(doc(db, 'sermons', id))
}
