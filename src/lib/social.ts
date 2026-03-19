/**
 * Social Features System
 * 
 * Enables following users, sharing progress, verse of the day sharing,
 * and activity feeds.
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
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db, trackEvent, AnalyticsEvents } from './firebase'

export type ActivityType = 
  | 'reading_started' 
  | 'reading_completed' 
  | 'journal_shared' 
  | 'streak_reached' 
  | 'achievement_earned'
  | 'plan_started'
  | 'plan_completed'
  | 'verse_shared'

export interface Activity {
  id: string
  userId: string
  userName: string
  userPhoto?: string
  type: ActivityType
  content: string
  metadata?: Record<string, unknown>
  likes: number
  likedBy: string[]
  createdAt: string
}

export interface UserProfile {
  uid: string
  displayName: string
  photoURL?: string
  bio?: string
  favoriteVerse?: string
  followers: number
  following: number
  isPublic: boolean
  createdAt: string
}

export interface Follow {
  followerId: string
  followingId: string
  createdAt: string
}

// Follow a user
export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) return false

  try {
    // Add to follows collection
    await setDoc(doc(db, 'follows', `${followerId}_${followingId}`), {
      followerId,
      followingId,
      createdAt: serverTimestamp()
    })

    // Update follower counts
    await updateDoc(doc(db, 'users', followingId), {
      followers: increment(1)
    })
    await updateDoc(doc(db, 'users', followerId), {
      following: increment(1)
    })

    trackEvent(AnalyticsEvents.USER_FOLLOWED || 'user_followed', {
      following_id: followingId
    })

    return true
  } catch (error) {
    console.error('Error following user:', error)
    return false
  }
}

// Unfollow a user
export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'follows', `${followerId}_${followingId}`))

    // Update follower counts
    await updateDoc(doc(db, 'users', followingId), {
      followers: increment(-1)
    })
    await updateDoc(doc(db, 'users', followerId), {
      following: increment(-1)
    })

    return true
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return false
  }
}

// Check if user is following another
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'follows', `${followerId}_${followingId}`)
    const docSnap = await getDoc(docRef)
    return docSnap.exists()
  } catch {
    return false
  }
}

// Get followers of a user
export async function getFollowers(userId: string, limitCount = 50): Promise<string[]> {
  try {
    const q = query(
      collection(db, 'follows'),
      where('followingId', '==', userId),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data().followerId)
  } catch {
    return []
  }
}

// Get users that a user is following
export async function getFollowing(userId: string, limitCount = 50): Promise<string[]> {
  try {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data().followingId)
  } catch {
    return []
  }
}

// Post an activity
export async function postActivity(
  userId: string,
  userName: string,
  type: ActivityType,
  content: string,
  metadata?: Record<string, unknown>,
  userPhoto?: string
): Promise<string | null> {
  try {
    const activityId = `${userId}_${Date.now()}`
    
    await setDoc(doc(db, 'activities', activityId), {
      userId,
      userName,
      userPhoto: userPhoto || null,
      type,
      content,
      metadata: metadata || {},
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp()
    })

    return activityId
  } catch (error) {
    console.error('Error posting activity:', error)
    return null
  }
}

// Get activity feed (from followed users)
export async function getActivityFeed(userId: string, limitCount = 30): Promise<Activity[]> {
  try {
    // Get list of users the current user follows
    const following = await getFollowing(userId, 200)
    
    if (following.length === 0) {
      // Return public activities if not following anyone
      return getPublicActivities(limitCount)
    }

    // Include own activities
    following.push(userId)

    // Get activities from followed users
    const q = query(
      collection(db, 'activities'),
      where('userId', 'in', following.slice(0, 10)), // Firestore limit
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt
    })) as Activity[]
  } catch (error) {
    console.error('Error fetching activity feed:', error)
    return []
  }
}

// Get public activities
export async function getPublicActivities(limitCount = 30): Promise<Activity[]> {
  try {
    const q = query(
      collection(db, 'activities'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt
    })) as Activity[]
  } catch (error) {
    console.error('Error fetching public activities:', error)
    return []
  }
}

// Get user's activities
export async function getUserActivities(userId: string, limitCount = 30): Promise<Activity[]> {
  try {
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt
    })) as Activity[]
  } catch (error) {
    console.error('Error fetching user activities:', error)
    return []
  }
}

// Like an activity
export async function likeActivity(activityId: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'activities', activityId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return false

    const data = docSnap.data()
    const likedBy = data.likedBy || []

    if (likedBy.includes(userId)) {
      // Unlike
      await updateDoc(docRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      })
    } else {
      // Like
      await updateDoc(docRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      })
    }

    return true
  } catch (error) {
    console.error('Error liking activity:', error)
    return false
  }
}

// Share verse of the day
export async function shareVerseOfDay(
  userId: string,
  userName: string,
  verse: { reference: string; text: string },
  reflection?: string,
  userPhoto?: string
): Promise<string | null> {
  const content = reflection 
    ? `Shared "${verse.reference}": "${verse.text}"\n\n${reflection}`
    : `Shared verse of the day: "${verse.reference}"`

  return postActivity(
    userId,
    userName,
    'verse_shared',
    content,
    { reference: verse.reference, text: verse.text, reflection },
    userPhoto
  )
}

// Share reading achievement
export async function shareAchievement(
  userId: string,
  userName: string,
  achievement: { name: string; description: string },
  userPhoto?: string
): Promise<string | null> {
  return postActivity(
    userId,
    userName,
    'achievement_earned',
    `Earned the "${achievement.name}" achievement! ${achievement.description}`,
    { achievement },
    userPhoto
  )
}

// Share reading streak
export async function shareStreak(
  userId: string,
  userName: string,
  streakDays: number,
  userPhoto?: string
): Promise<string | null> {
  return postActivity(
    userId,
    userName,
    'streak_reached',
    `Reached a ${streakDays}-day reading streak! 🔥`,
    { streakDays },
    userPhoto
  )
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: { bio?: string; favoriteVerse?: string; isPublic?: boolean }
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'users', userId), updates)
    return true
  } catch (error) {
    console.error('Error updating profile:', error)
    return false
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      uid: userId,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt instanceof Timestamp 
        ? docSnap.data().createdAt.toDate().toISOString() 
        : docSnap.data().createdAt
    } as UserProfile
  } catch {
    return null
  }
}

// Search users
export async function searchUsers(queryStr: string, limitCount = 20): Promise<UserProfile[]> {
  try {
    // Simple search by displayName prefix
    const q = query(
      collection(db, 'users'),
      where('displayName', '>=', queryStr),
      where('displayName', '<=', queryStr + '\uf8ff'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt.toDate().toISOString() 
        : doc.data().createdAt
    })) as UserProfile[]
  } catch {
    return []
  }
}
