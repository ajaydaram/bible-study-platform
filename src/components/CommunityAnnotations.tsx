import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Heart, 
  ChevronDown, 
  ChevronUp,
  Send,
  Lightbulb,
  HelpCircle,
  BookHeart,
  Edit3,
  Trash2,
  Globe,
  Lock
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  CommunityAnnotation, 
  AnnotationType,
  getVerseAnnotations,
  createAnnotation,
  toggleAnnotationLike,
  deleteAnnotation,
  addAnnotationReply,
  getAnnotationReplies,
  AnnotationReply
} from '../lib/communityAnnotations'

interface CommunityAnnotationsProps {
  verseRef: string
  book: string
  chapter: number
  verse: number
  isOpen?: boolean
  onToggle?: () => void
}

const typeIcons: Record<AnnotationType, typeof MessageSquare> = {
  note: Edit3,
  insight: Lightbulb,
  question: HelpCircle,
  prayer: BookHeart
}

const typeColors: Record<AnnotationType, string> = {
  note: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  insight: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  question: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  prayer: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20'
}

export default function CommunityAnnotations({ 
  verseRef, 
  book, 
  chapter, 
  verse,
  isOpen = false,
  onToggle
}: CommunityAnnotationsProps) {
  const { user } = useAuth()
  const [annotations, setAnnotations] = useState<CommunityAnnotation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<AnnotationType>('note')
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expanded, setExpanded] = useState(isOpen)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [replies, setReplies] = useState<Record<string, AnnotationReply[]>>({})
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})

  useEffect(() => {
    setExpanded(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (expanded) {
      loadAnnotations()
    }
  }, [expanded, book, chapter, verse])

  const loadAnnotations = async () => {
    setIsLoading(true)
    const data = await getVerseAnnotations(book, chapter, verse, user?.id)
    setAnnotations(data)
    setIsLoading(false)
  }

  const handleToggle = () => {
    setExpanded(!expanded)
    onToggle?.()
  }

  const handleSubmit = async () => {
    if (!user || !newContent.trim()) return
    if (user.isGuest) return

    setIsSubmitting(true)
    const result = await createAnnotation(
      user.id,
      user.name || 'Anonymous',
      verseRef,
      book,
      chapter,
      verse,
      newContent.trim(),
      newType,
      isPublic,
      user.image || undefined
    )

    if (result.success) {
      setNewContent('')
      setShowAddForm(false)
      await loadAnnotations()
    }
    setIsSubmitting(false)
  }

  const handleLike = async (annotationId: string) => {
    if (!user || user.isGuest) return
    await toggleAnnotationLike(annotationId, user.id)
    await loadAnnotations()
  }

  const handleDelete = async (annotationId: string) => {
    if (!user) return
    if (confirm('Are you sure you want to delete this annotation?')) {
      await deleteAnnotation(annotationId, user.id)
      await loadAnnotations()
    }
  }

  const toggleReplies = async (annotationId: string) => {
    const newExpanded = new Set(expandedReplies)
    if (newExpanded.has(annotationId)) {
      newExpanded.delete(annotationId)
    } else {
      newExpanded.add(annotationId)
      // Load replies if not already loaded
      if (!replies[annotationId]) {
        const data = await getAnnotationReplies(annotationId)
        setReplies(prev => ({ ...prev, [annotationId]: data }))
      }
    }
    setExpandedReplies(newExpanded)
  }

  const handleReply = async (annotationId: string) => {
    if (!user || user.isGuest || !replyContent[annotationId]?.trim()) return

    const result = await addAnnotationReply(
      annotationId,
      user.id,
      user.name || 'Anonymous',
      replyContent[annotationId].trim(),
      user.image || undefined
    )

    if (result.success) {
      setReplyContent(prev => ({ ...prev, [annotationId]: '' }))
      const data = await getAnnotationReplies(annotationId)
      setReplies(prev => ({ ...prev, [annotationId]: data }))
      await loadAnnotations()
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900 dark:text-white">Community Notes</span>
          {annotations.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">
              {annotations.length}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4">
          {/* Add new annotation */}
          {user && !user.isGuest && (
            <div className="mb-4">
              {showAddForm ? (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {/* Type selector */}
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(typeIcons) as AnnotationType[]).map(type => {
                      const Icon = typeIcons[type]
                      return (
                        <button
                          key={type}
                          onClick={() => setNewType(type)}
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                            newType === type 
                              ? typeColors[type] + ' ring-2 ring-offset-1 ring-current'
                              : 'text-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{type}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Content input */}
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder={`Add a ${newType}...`}
                    rows={3}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Visibility toggle */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setIsPublic(!isPublic)}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      {isPublic ? (
                        <>
                          <Globe className="w-4 h-4" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                        </>
                      )}
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!newContent.trim() || isSubmitting}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add a note, insight, or question
                </button>
              )}
            </div>
          )}

          {/* Guest notice */}
          {user?.isGuest && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm">
              Create an account to add and interact with community notes.
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : annotations.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No community notes yet. Be the first to add one!
            </p>
          ) : (
            <div className="space-y-4">
              {annotations.map(annotation => {
                const Icon = typeIcons[annotation.type]
                const isOwner = user?.id === annotation.userId
                const isLiked = user && annotation.likedBy.includes(user.id)

                return (
                  <div
                    key={annotation.id}
                    className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-full ${typeColors[annotation.type]}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {annotation.authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(annotation.createdAt).toLocaleDateString()}
                        </span>
                        {!annotation.isPublic && (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(annotation.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                      {annotation.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(annotation.id)}
                          disabled={!user || user.isGuest}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            isLiked 
                              ? 'text-red-600' 
                              : 'text-gray-500 hover:text-red-600'
                          } disabled:opacity-50`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{annotation.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleReplies(annotation.id)}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{annotation.replies}</span>
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {expandedReplies.has(annotation.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        {replies[annotation.id]?.map(reply => (
                          <div key={reply.id} className="ml-4 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {reply.authorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                          </div>
                        ))}

                        {/* Reply input */}
                        {user && !user.isGuest && (
                          <div className="flex space-x-2 mt-2 ml-4">
                            <input
                              type="text"
                              value={replyContent[annotation.id] || ''}
                              onChange={e => setReplyContent(prev => ({ 
                                ...prev, 
                                [annotation.id]: e.target.value 
                              }))}
                              placeholder="Write a reply..."
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              onKeyPress={e => e.key === 'Enter' && handleReply(annotation.id)}
                            />
                            <button
                              onClick={() => handleReply(annotation.id)}
                              disabled={!replyContent[annotation.id]?.trim()}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
