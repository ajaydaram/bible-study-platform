/**
 * Community Annotations System
 * 
 * Allows users to add, view, and interact with community notes on Bible verses.
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
  Timestamp,
  increment
} from 'firebase/firestore'
import { db, trackEvent, AnalyticsEvents } from './firebase'

export type AnnotationType = 'note' | 'insight' | 'question' | 'prayer'

export interface CommunityAnnotation {
  id: string
  userId: string
  authorName: string
  authorPhoto?: string
  verseRef: string // e.g., "John 3:16"
  book: string
  chapter: number
  verse: number
  type: AnnotationType
  content: string
  isPublic: boolean
  likes: number
  likedBy: string[]
  reports: number
  reportedBy: string[]
  replies: number
  createdAt: string
  updatedAt: string
}

export interface AnnotationReply {
  id: string
  annotationId: string
  userId: string
  authorName: string
  authorPhoto?: string
  content: string
  likes: number
  likedBy: string[]
  createdAt: string
}

// Create a new annotation
export async function createAnnotation(
  userId: string,
  authorName: string,
  verseRef: string,
  book: string,
  chapter: number,
  verse: number,
  content: string,
  type: AnnotationType = 'note',
  isPublic: boolean = true,
  authorPhoto?: string
): Promise<{ success: boolean; annotationId?: string; error?: string }> {
  try {
    const annotationId = `${userId}_${book}_${chapter}_${verse}_${Date.now()}`
    
    await setDoc(doc(db, 'annotations', annotationId), {
      userId,
      authorName,
      authorPhoto: authorPhoto || null,
      verseRef,
      book,
      chapter,
      verse,
      type,
      content,
      isPublic,
      likes: 0,
      likedBy: [],
      reports: 0,
      reportedBy: [],
      replies: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    trackEvent(AnalyticsEvents.ANNOTATION_CREATED || 'annotation_created', {
      type,
      is_public: isPublic,
      verse_ref: verseRef
    })

    return { success: true, annotationId }
  } catch (error) {
    console.error('Error creating annotation:', error)
    return { success: false, error: 'Failed to create annotation' }
  }
}

// Get annotations for a specific verse
export async function getVerseAnnotations(
  book: string,
  chapter: number,
  verse: number,
  userId?: string
): Promise<CommunityAnnotation[]> {
  try {
    // Get public annotations
    const publicQuery = query(
      collection(db, 'annotations'),
      where('book', '==', book),
      where('chapter', '==', chapter),
      where('verse', '==', verse),
      where('isPublic', '==', true),
      orderBy('likes', 'desc'),
      limit(50)
    )

    const publicSnapshot = await getDocs(publicQuery)
    const annotations: CommunityAnnotation[] = publicSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt,
      updatedAt: doc.data().updatedAt instanceof Timestamp 
        ? doc.data().updatedAt.toDate().toISOString() 
        : doc.data().updatedAt
    })) as CommunityAnnotation[]

    // If user is logged in, also get their private annotations
    if (userId) {
      const privateQuery = query(
        collection(db, 'annotations'),
        where('book', '==', book),
        where('chapter', '==', chapter),
        where('verse', '==', verse),
        where('userId', '==', userId),
        where('isPublic', '==', false)
      )

      const privateSnapshot = await getDocs(privateQuery)
      const privateAnnotations = privateSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof Timestamp 
          ? doc.data().createdAt.toDate().toISOString() 
          : doc.data().createdAt,
        updatedAt: doc.data().updatedAt instanceof Timestamp 
          ? doc.data().updatedAt.toDate().toISOString() 
          : doc.data().updatedAt
      })) as CommunityAnnotation[]

      // Merge and deduplicate
      const allIds = new Set(annotations.map(a => a.id))
      privateAnnotations.forEach(a => {
        if (!allIds.has(a.id)) {
          annotations.push(a)
        }
      })
    }

    return annotations
  } catch (error) {
    console.error('Error fetching annotations:', error)
    return []
  }
}

// Get user's annotations
export async function getUserAnnotations(userId: string): Promise<CommunityAnnotation[]> {
  try {
    const q = query(
      collection(db, 'annotations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(100)
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
    })) as CommunityAnnotation[]
  } catch (error) {
    console.error('Error fetching user annotations:', error)
    return []
  }
}

// Get popular annotations (trending)
export async function getTrendingAnnotations(limitCount = 20): Promise<CommunityAnnotation[]> {
  try {
    const q = query(
      collection(db, 'annotations'),
      where('isPublic', '==', true),
      orderBy('likes', 'desc'),
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
    })) as CommunityAnnotation[]
  } catch (error) {
    console.error('Error fetching trending annotations:', error)
    return []
  }
}

// Like/unlike an annotation
export async function toggleAnnotationLike(
  annotationId: string, 
  userId: string
): Promise<boolean> {
  try {
    const docRef = doc(db, 'annotations', annotationId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return false

    const data = docSnap.data()
    const likedBy = data.likedBy || []

    if (likedBy.includes(userId)) {
      await updateDoc(docRef, {
        likes: increment(-1),
        likedBy: likedBy.filter((id: string) => id !== userId)
      })
    } else {
      await updateDoc(docRef, {
        likes: increment(1),
        likedBy: [...likedBy, userId]
      })
    }

    return true
  } catch (error) {
    console.error('Error toggling annotation like:', error)
    return false
  }
}

// Report an annotation
export async function reportAnnotation(
  annotationId: string, 
  userId: string,
  reason: string
): Promise<boolean> {
  try {
    const docRef = doc(db, 'annotations', annotationId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return false

    const data = docSnap.data()
    const reportedBy = data.reportedBy || []

    if (reportedBy.includes(userId)) {
      return false // Already reported
    }

    await updateDoc(docRef, {
      reports: increment(1),
      reportedBy: [...reportedBy, userId]
    })

    // Log the report for moderation
    await setDoc(doc(collection(db, 'reports')), {
      annotationId,
      reporterId: userId,
      reason,
      createdAt: serverTimestamp()
    })

    return true
  } catch (error) {
    console.error('Error reporting annotation:', error)
    return false
  }
}

// Delete an annotation
export async function deleteAnnotation(
  annotationId: string, 
  userId: string
): Promise<boolean> {
  try {
    const docRef = doc(db, 'annotations', annotationId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      return false
    }

    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting annotation:', error)
    return false
  }
}

// Update an annotation
export async function updateAnnotation(
  annotationId: string,
  userId: string,
  updates: { content?: string; type?: AnnotationType; isPublic?: boolean }
): Promise<boolean> {
  try {
    const docRef = doc(db, 'annotations', annotationId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      return false
    }

    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })

    return true
  } catch (error) {
    console.error('Error updating annotation:', error)
    return false
  }
}

// Add a reply to an annotation
export async function addAnnotationReply(
  annotationId: string,
  userId: string,
  authorName: string,
  content: string,
  authorPhoto?: string
): Promise<{ success: boolean; replyId?: string; error?: string }> {
  try {
    const replyId = `${annotationId}_${userId}_${Date.now()}`
    
    await setDoc(doc(db, 'annotations', annotationId, 'replies', replyId), {
      userId,
      authorName,
      authorPhoto: authorPhoto || null,
      content,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp()
    })

    // Increment reply count
    await updateDoc(doc(db, 'annotations', annotationId), {
      replies: increment(1)
    })

    return { success: true, replyId }
  } catch (error) {
    console.error('Error adding reply:', error)
    return { success: false, error: 'Failed to add reply' }
  }
}

// Get replies for an annotation
export async function getAnnotationReplies(annotationId: string): Promise<AnnotationReply[]> {
  try {
    const q = query(
      collection(db, 'annotations', annotationId, 'replies'),
      orderBy('createdAt', 'asc'),
      limit(100)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      annotationId,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt
    })) as AnnotationReply[]
  } catch (error) {
    console.error('Error fetching replies:', error)
    return []
  }
}
