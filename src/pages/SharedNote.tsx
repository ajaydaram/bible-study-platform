import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Heart, 
  Eye, 
  Copy, 
  ArrowLeft, 
  Tag,
  Calendar,
  User,
  BookOpen,
  Check,
  AlertCircle
} from 'lucide-react'
import { getSharedNote, likeNote, copyNoteToJournal, SharedNote } from '../lib/sharing'
import { useAuth } from '../contexts/AuthContext'

export default function SharedNotePage() {
  const { shareId } = useParams<{ shareId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [note, setNote] = useState<SharedNote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [copying, setCopying] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    async function loadNote() {
      if (!shareId) {
        setError('Invalid share link')
        setIsLoading(false)
        return
      }

      const sharedNote = await getSharedNote(shareId)
      if (sharedNote) {
        setNote(sharedNote)
        setLikeCount(sharedNote.likes)
        setIsLiked(user ? sharedNote.likedBy.includes(user.id) : false)
      } else {
        setError('Note not found or has been deleted')
      }
      setIsLoading(false)
    }

    loadNote()
  }, [shareId, user])

  const handleLike = async () => {
    if (!user || !shareId) return

    if (user.isGuest) {
      return
    }

    const success = await likeNote(shareId, user.id)
    if (success) {
      if (isLiked) {
        setLikeCount(prev => prev - 1)
      } else {
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    }
  }

  const handleCopyToJournal = async () => {
    if (!user || !shareId) return

    if (user.isGuest) {
      return
    }

    setCopying(true)
    const result = await copyNoteToJournal(shareId, user.id)
    setCopying(false)

    if (result.success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to copy note')
    }
  }

  const handleShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || 'Note Not Found'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This note may have been deleted or the link is invalid.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{note.authorName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{note.title}</h1>
          
          {/* Passage Reference */}
          {note.passage && (
            <Link
              to={`/bible?passage=${encodeURIComponent(note.passage)}`}
              className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              {note.passage}
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div 
            className="prose dark:prose-invert max-w-none"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {note.content}
          </div>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={!user || user.isGuest}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              } disabled:opacity-50`}
              title={!user ? 'Sign in to like' : user.isGuest ? 'Create an account to like' : ''}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            {/* Views */}
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <Eye className="w-5 h-5" />
              <span>{note.views}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Copy Link */}
            <button
              onClick={handleShareLink}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {linkCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            {/* Copy to Journal */}
            {user && !user.isGuest && (
              <button
                onClick={handleCopyToJournal}
                disabled={copying || copySuccess}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : copying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Copying...</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Save to Journal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Not signed in notice */}
        {!user && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
            <p className="text-sm">
              <Link to="/auth/signin" className="font-medium underline">Sign in</Link> to like this note or save it to your journal.
            </p>
          </div>
        )}

        {/* Guest notice */}
        {user?.isGuest && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg">
            <p className="text-sm">
              <Link to="/profile" className="font-medium underline">Create an account</Link> to like notes and save them to your journal.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
