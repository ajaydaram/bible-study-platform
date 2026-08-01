// Ecclesial Preaching Cohort & Discipleship Sharing Data Layer

export interface SermonPeerComment {
  id: string
  authorName: string
  content: string
  createdAt: string
}

export interface SharedSermonOutline {
  id: string
  groupId: string
  authorName: string
  passage: string
  title: string
  fcf: string
  bigIdea: string
  points: string[]
  comments: SermonPeerComment[]
  createdAt: string
}

const STORAGE_KEY = 'scriptorium_cohort_sermons_v1'

const MOCK_SHARED_SERMONS: SharedSermonOutline[] = [
  {
    id: 'sermon-1',
    groupId: 'default',
    authorName: 'Pastor David',
    passage: 'Genesis 22:1-19',
    title: 'The Lord Will Provide On Moriah',
    fcf: 'We try to secure our own future through earthly idols rather than trusting God’s covenant promises.',
    bigIdea: 'God tests Abraham to reveal that true worship submits everything to the God who provides His own sacrificial Lamb.',
    points: [
      'I. The Ultimate Test of Covenant Loyalty (v. 1-3)',
      'II. The Obedient Ascent of Faith (v. 4-8)',
      'III. Substitutionary Grace Provided by God (v. 9-14)'
    ],
    comments: [
      {
        id: 'c1',
        authorName: 'Michael',
        content: 'Powerful FCF, David! Be sure to emphasize how Isaac carrying the wood prefigures Christ carrying the cross.',
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  }
]

export function getGroupSharedSermons(groupId: string): SharedSermonOutline[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_SHARED_SERMONS))
    return MOCK_SHARED_SERMONS
  }
  const all: SharedSermonOutline[] = JSON.parse(stored)
  return all.filter((s) => s.groupId === groupId || groupId === 'default' || s.groupId === '1')
}

export function saveSharedSermon(sermon: Omit<SharedSermonOutline, 'id' | 'createdAt' | 'comments'>): SharedSermonOutline {
  const stored = localStorage.getItem(STORAGE_KEY)
  const all: SharedSermonOutline[] = stored ? JSON.parse(stored) : MOCK_SHARED_SERMONS

  const newSermon: SharedSermonOutline = {
    ...sermon,
    id: `sermon-${Date.now()}`,
    createdAt: new Date().toISOString(),
    comments: []
  }

  all.unshift(newSermon)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return newSermon
}

export function addSermonComment(sermonId: string, authorName: string, content: string): SharedSermonOutline[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  const all: SharedSermonOutline[] = stored ? JSON.parse(stored) : MOCK_SHARED_SERMONS

  const updated = all.map((s) => {
    if (s.id === sermonId) {
      return {
        ...s,
        comments: [
          ...s.comments,
          {
            id: `comment-${Date.now()}`,
            authorName,
            content,
            createdAt: new Date().toISOString()
          }
        ]
      }
    }
    return s
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
