/**
 * Study Notes Sharing System
 * 
 * Allows users to share their study notes, journal entries,
 * and annotations with others or make them public.
 */

import { 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db, trackEvent, AnalyticsEvents } from './firebase'

export type ShareVisibility = 'private' | 'link' | 'public'

export interface SharedNote {
  id: string
  userId: string
  authorName: string
  title: string
  content: string
  passage?: string
  tags: string[]
  visibility: ShareVisibility
  shareLink?: string
  views: number
  likes: number
  likedBy: string[]
  createdAt: string
  updatedAt: string
}

export interface ShareSettings {
  allowComments: boolean
  allowCopy: boolean
  expiresAt?: string
}

// Generate a unique share link
function generateShareLink(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Share a journal entry or note
export async function shareNote(
  userId: string,
  authorName: string,
  note: {
    title: string
    content: string
    passage?: string
    tags: string[]
  },
  visibility: ShareVisibility = 'link',
  settings?: ShareSettings
): Promise<{ success: boolean; shareId?: string; shareLink?: string; error?: string }> {
  try {
    const shareId = generateShareLink()
    const shareLink = visibility !== 'private' ? `${window.location.origin}/shared/${shareId}` : undefined

    const sharedNote: Omit<SharedNote, 'id'> = {
      userId,
      authorName,
      title: note.title,
      content: note.content,
      passage: note.passage,
      tags: note.tags,
      visibility,
      shareLink,
      views: 0,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await setDoc(doc(db, 'sharedNotes', shareId), {
      ...sharedNote,
      settings: settings || { allowComments: true, allowCopy: true },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    trackEvent(AnalyticsEvents.NOTE_SHARED || 'note_shared', {
      visibility,
      has_passage: !!note.passage
    })

    return { success: true, shareId, shareLink }
  } catch (error) {
    console.error('Error sharing note:', error)
    return { success: false, error: 'Failed to share note' }
  }
}

// Get a shared note by ID
export async function getSharedNote(shareId: string): Promise<SharedNote | null> {
  try {
    const docRef = doc(db, 'sharedNotes', shareId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data()
    
    // Increment view count
    await updateDoc(docRef, {
      views: (data.views || 0) + 1
    })

    return {
      id: shareId,
      ...data,
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate().toISOString() 
        : data.updatedAt
    } as SharedNote
  } catch (error) {
    console.error('Error fetching shared note:', error)
    return null
  }
}

// Get public notes (for discovery)
export async function getPublicNotes(limitCount = 20): Promise<SharedNote[]> {
  try {
    const q = query(
      collection(db, 'sharedNotes'),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt,
      updatedAt: doc.data().updatedAt instanceof Timestamp 
        ? doc.data().updatedAt.toDate().toISOString() 
        : doc.data().updatedAt
    })) as SharedNote[]
  } catch (error) {
    console.error('Error fetching public notes:', error)
    return []
  }
}

// Get user's shared notes
export async function getUserSharedNotes(userId: string): Promise<SharedNote[]> {
  try {
    const q = query(
      collection(db, 'sharedNotes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt,
      updatedAt: doc.data().updatedAt instanceof Timestamp 
        ? doc.data().updatedAt.toDate().toISOString() 
        : doc.data().updatedAt
    })) as SharedNote[]
  } catch (error) {
    console.error('Error fetching user shared notes:', error)
    return []
  }
}

// Like a shared note
export async function likeNote(shareId: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'sharedNotes', shareId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return false

    const data = docSnap.data()
    const likedBy = data.likedBy || []

    if (likedBy.includes(userId)) {
      // Unlike
      await updateDoc(docRef, {
        likes: Math.max(0, (data.likes || 0) - 1),
        likedBy: likedBy.filter((id: string) => id !== userId)
      })
    } else {
      // Like
      await updateDoc(docRef, {
        likes: (data.likes || 0) + 1,
        likedBy: [...likedBy, userId]
      })
    }

    return true
  } catch (error) {
    console.error('Error liking note:', error)
    return false
  }
}

// Update share visibility
export async function updateShareVisibility(
  shareId: string, 
  userId: string, 
  visibility: ShareVisibility
): Promise<boolean> {
  try {
    const docRef = doc(db, 'sharedNotes', shareId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      return false
    }

    await updateDoc(docRef, {
      visibility,
      shareLink: visibility !== 'private' 
        ? `${window.location.origin}/shared/${shareId}` 
        : null,
      updatedAt: serverTimestamp()
    })

    return true
  } catch (error) {
    console.error('Error updating share visibility:', error)
    return false
  }
}

// Delete a shared note
export async function deleteSharedNote(shareId: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'sharedNotes', shareId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      return false
    }

    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting shared note:', error)
    return false
  }
}

// Copy shared note to user's journal
export async function copyNoteToJournal(
  shareId: string,
  userId: string
): Promise<{ success: boolean; journalId?: string; error?: string }> {
  try {
    const sharedNote = await getSharedNote(shareId)
    if (!sharedNote) {
      return { success: false, error: 'Note not found' }
    }

    // Check if copying is allowed
    const docRef = doc(db, 'sharedNotes', shareId)
    const docSnap = await getDoc(docRef)
    const settings = docSnap.data()?.settings

    if (settings && !settings.allowCopy) {
      return { success: false, error: 'Copying is not allowed for this note' }
    }

    // Create a new journal entry
    const journalId = `${userId}_${Date.now()}`
    await setDoc(doc(db, 'users', userId, 'journal', journalId), {
      title: `[Copied] ${sharedNote.title}`,
      content: sharedNote.content,
      passage: sharedNote.passage,
      tags: [...sharedNote.tags, 'copied'],
      originalAuthor: sharedNote.authorName,
      originalShareId: shareId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return { success: true, journalId }
  } catch (error) {
    console.error('Error copying note to journal:', error)
    return { success: false, error: 'Failed to copy note' }
  }
}
