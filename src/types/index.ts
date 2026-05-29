export interface User {
  id: string
  email: string
  name: string
  image?: string
  createdAt: string
  isGuest?: boolean
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  passage?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
  createdBy: string
}

export interface Discussion {
  id: string
  title: string
  content: string
  groupId?: string
  authorId: string
  authorName: string
  commentCount: number
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  discussionId: string
  createdAt: string
}

export interface Prayer {
  id: string
  content: string
  isAnswered: boolean
  createdAt: string
  answeredAt?: string
  userId: string
}

export interface ReadingProgress {
  id: string
  dayNumber: number
  completed: boolean
  completedAt?: string
  notes?: string
  userId: string
  pathType: 'chronological' | 'thematic'
}

export interface ChronologicalDay {
  day: number
  title: string
  passages: string[]
  summary: string
}

export interface ThematicTopic {
  id: string
  title: string
  description: string
  passages: string[]
  order: number
}

export interface BibleVerse {
  book_name: string
  chapter: number
  verse: number
  text: string
}

export interface BiblePassage {
  reference: string
  verses: BibleVerse[]
  text: string
  translation_id: string
  translation_name: string
}

// ============ SERMON PREPARATION ============

export interface SermonExegesis {
  prayedForUnderstanding: boolean
  textIsolated: string
  // 6 Friends - Inductive Bible Study
  who: string
  what: string
  why: string
  when: string
  where: string
  how: string
  // Outline and Proposition
  textOutline: string
  subject: string // What is the author talking about?
  complement: string // What is the answer to what he is talking about?
  // Purpose
  textPurpose: string
  purposeType: 'exhortation' | 'warning' | 'encouragement' | ''
  desiredChange: string // How is this text designed to change attitudes/actions?
  centralProposition: string // Exegetical central proposition (concrete, specific, time-bound)
}

export interface SermonTheology {
  crossReferences: string // What does the rest of the Bible say?
  theologicalOutline: string
  theologicalSubject: string // What does this passage say about God, creation, and their relationship?
  theologicalComplement: string // The answer to the theological question
  theologicalPrinciple: string // Timeless, universal subject and complement
  theologicalPurpose: string // Flows from theological central proposition, timeless
  centralProposition: string // Theological central proposition (abstract, broad, timeless)
}

export interface SermonHomiletics {
  // Purpose and Goals
  homilетicalPurpose: string // What you want to see achieved in listeners' lives
  goals: string[] // Steps to arrive at the purpose
  // 3 Developmental Questions
  explanation: string // "I don't understand, please explain"
  validation: string // "Prove it and I will believe it"
  application: string // "So, what do I do about it?"
  // Proposition
  homilетicalProposition: string // Based on answers to 3 questions
  // Audience Analysis
  audienceProfile: string
  audienceNeeds: string[]
  // Sermon Structure
  sermonForm: 'deductive' | 'inductive' | 'semi-inductive' | ''
  introduction: string
  movements: SermonMovement[]
  conclusion: string
  // Supporting Materials
  illustrations: string[]
  supportingMaterials: string
}

export interface SermonMovement {
  id: string
  title: string
  content: string
  application: string
}

export interface Sermon {
  id: string
  title: string
  passage: string
  date: string
  stage: 'exegesis' | 'theology' | 'homiletics' | 'complete'
  exegesis: SermonExegesis
  theology: SermonTheology
  homiletics: SermonHomiletics
  notes: string
  createdAt: string
  updatedAt: string
  userId: string
}
