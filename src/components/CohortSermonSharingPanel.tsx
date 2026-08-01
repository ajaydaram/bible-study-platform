import { useState } from 'react'
import {
  SharedSermonOutline,
  getGroupSharedSermons,
  saveSharedSermon,
  addSermonComment
} from '../data/ecclesialSharingData'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Plus, MessageSquare, Send, Sparkles, AlertCircle } from 'lucide-react'

interface Props {
  groupId: string
}

export default function CohortSermonSharingPanel({ groupId }: Props) {
  const { user } = useAuth()
  const [sermons, setSermons] = useState<SharedSermonOutline[]>(() => getGroupSharedSermons(groupId))
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [passage, setPassage] = useState('')
  const [fcf, setFcf] = useState('')
  const [bigIdea, setBigIdea] = useState('')
  const [pointsText, setPointsText] = useState('')

  // Comment state
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  const handleCreateSermon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !passage) return

    const points = pointsText.split('\n').filter((p) => p.trim() !== '')

    saveSharedSermon({
      groupId,
      authorName: user?.name || user?.email?.split('@')[0] || 'Cohort Brother',
      title,
      passage,
      fcf,
      bigIdea,
      points
    })

    setSermons(getGroupSharedSermons(groupId))
    setTitle('')
    setPassage('')
    setFcf('')
    setBigIdea('')
    setPointsText('')
    setShowForm(false)
  }

  const handleAddComment = (sermonId: string) => {
    const text = commentInputs[sermonId]
    if (!text?.trim()) return

    const updated = addSermonComment(
      sermonId,
      user?.name || user?.email?.split('@')[0] || 'Peer Reviewer',
      text
    )

    setSermons(updated.filter((s) => s.groupId === groupId || groupId === 'default' || s.groupId === '1'))
    setCommentInputs((prev) => ({ ...prev, [sermonId]: '' }))
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Preaching Cohort Outlines & FCF Review
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Share sermon drafts, Fallen Condition Focus (FCF) notes, and Big Ideas for peer review.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Share Outline
        </button>
      </div>

      {/* Submission Form */}
      {showForm && (
        <form
          onSubmit={handleCreateSermon}
          className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl"
        >
          <h4 className="font-extrabold text-base text-purple-400">Share Sermon Outline for Peer Feedback</h4>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Sermon Title (e.g. The Lord Will Provide)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Scripture Passage (e.g. Genesis 22:1-19)"
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              required
              className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-300">Fallen Condition Focus (FCF):</label>
            <input
              type="text"
              placeholder="What human sin/weakness in hearers does this text address?"
              value={fcf}
              onChange={(e) => setFcf(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-300">Christ-Centered Big Idea:</label>
            <input
              type="text"
              placeholder="What is the central gospel truth of the sermon?"
              value={bigIdea}
              onChange={(e) => setBigIdea(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Expository Outline Points (1 per line):</label>
            <textarea
              rows={3}
              placeholder="I. Point 1&#10;II. Point 2&#10;III. Point 3"
              value={pointsText}
              onChange={(e) => setPointsText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
            >
              Post to Cohort
            </button>
          </div>
        </form>
      )}

      {/* Shared Outlines Feed */}
      <div className="space-y-6">
        {sermons.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {s.authorName}
                </span>
                <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">{s.title}</h4>
              </div>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full font-mono text-xs font-bold">
                {s.passage}
              </span>
            </div>

            {/* FCF & Big Idea Cards */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Fallen Condition Focus (FCF)
                </span>
                <p className="text-xs text-gray-800 dark:text-gray-200">{s.fcf}</p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Christ-Centered Big Idea
                </span>
                <p className="text-xs text-gray-800 dark:text-gray-200">{s.bigIdea}</p>
              </div>
            </div>

            {/* Expository Points */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-2 border border-gray-100 dark:border-gray-700">
              <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Expository Structure:
              </h5>
              <ul className="space-y-1 text-xs text-gray-800 dark:text-gray-200 font-mono">
                {s.points.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Peer Reviews / Feedback */}
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Cohort Peer Reviews ({s.comments.length})
              </h5>

              {s.comments.map((c) => (
                <div key={c.id} className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{c.authorName}: </span>
                  <span className="text-gray-800 dark:text-gray-200">{c.content}</span>
                </div>
              ))}

              {/* Add Comment Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Give constructive feedback or homiletical encouragement..."
                  value={commentInputs[s.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [s.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(s.id)}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => handleAddComment(s.id)}
                  className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
