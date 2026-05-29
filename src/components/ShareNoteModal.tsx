import { useState } from 'react'
import { Share2, Link2, Globe, Lock, Copy, Check, X } from 'lucide-react'
import { shareNote, ShareVisibility } from '../lib/sharing'
import { useAuth } from '../contexts/AuthContext'

interface ShareNoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: {
    title: string
    content: string
    passage?: string
    tags: string[]
  }
  onShared?: (shareLink: string) => void
}

export default function ShareNoteModal({ isOpen, onClose, note, onShared }: ShareNoteModalProps) {
  const { user } = useAuth()
  const [visibility, setVisibility] = useState<ShareVisibility>('link')
  const [allowComments, setAllowComments] = useState(true)
  const [allowCopy, setAllowCopy] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleShare = async () => {
    if (!user) {
      setError('You must be signed in to share notes')
      return
    }

    if (user.isGuest) {
      setError('Guest users cannot share notes. Please create an account first.')
      return
    }

    setIsSharing(true)
    setError(null)

    const result = await shareNote(
      user.id,
      user.name || 'Anonymous',
      note,
      visibility,
      { allowComments, allowCopy }
    )

    setIsSharing(false)

    if (result.success && result.shareLink) {
      setShareLink(result.shareLink)
      onShared?.(result.shareLink)
    } else {
      setError(result.error || 'Failed to share note')
    }
  }

  const copyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const visibilityOptions = [
    { value: 'private' as ShareVisibility, icon: Lock, label: 'Private', desc: 'Only you can see' },
    { value: 'link' as ShareVisibility, icon: Link2, label: 'Link Only', desc: 'Anyone with the link' },
    { value: 'public' as ShareVisibility, icon: Globe, label: 'Public', desc: 'Visible in community' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Share Note</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Note Preview */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">{note.title}</h3>
            {note.passage && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{note.passage}</p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {note.content}
            </p>
          </div>

          {/* Visibility Options */}
          {!shareLink && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Who can see this?
                </label>
                <div className="space-y-2">
                  {visibilityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setVisibility(option.value)}
                      className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                        visibility === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <option.icon className={`w-5 h-5 mr-3 ${
                        visibility === option.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="text-left">
                        <p className={`font-medium ${
                          visibility === option.value 
                            ? 'text-blue-700 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sharing Settings */}
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow comments</span>
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={e => setAllowComments(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Allow others to copy</span>
                  <input
                    type="checkbox"
                    checked={allowCopy}
                    onChange={e => setAllowCopy(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </>
          )}

          {/* Share Link Display */}
          {shareLink && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
                <button
                  onClick={copyLink}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-1">Link copied to clipboard!</p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {shareLink ? 'Done' : 'Cancel'}
          </button>
          {!shareLink && (
            <button
              onClick={handleShare}
              disabled={isSharing || visibility === 'private'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSharing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
