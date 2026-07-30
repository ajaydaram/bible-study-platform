import { useState } from 'react'
import {
  callAndResponseData,
  submitEpochResponse,
  bypassPauseForStudy,
  CallAndResponseItem,
  ResponseOption
} from '../data/callAndResponseData'
import {
  Sparkles,
  BookOpen,
  Quote,
  X,
  Send,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react'
import clsx from 'clsx'

interface Props {
  targetEpochId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CallAndResponseModal({ targetEpochId, isOpen, onClose, onSuccess }: Props) {
  const item: CallAndResponseItem | undefined = callAndResponseData[targetEpochId]
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    item?.responseOptions[0]?.id || ''
  )
  const [responseText, setResponseText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !item) return null

  const selectedOption: ResponseOption =
    item.responseOptions.find((o) => o.id === selectedOptionId) || item.responseOptions[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!responseText.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      submitEpochResponse(targetEpochId, selectedOptionId, responseText)
      setIsSubmitting(false)
      onSuccess()
      onClose()
    }, 600)
  }

  const handleBypass = () => {
    bypassPauseForStudy(targetEpochId)
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-800/60 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            Call-and-Response Engine • Unlocking {item.targetEpochTitle}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {item.callTitle}
          </h2>
          <p className="text-xs font-mono font-semibold text-indigo-300">
            {item.callScripture}
          </p>
        </div>

        {/* PART 1: THE CALL (REVELATION) */}
        <div className="space-y-4 mb-6">
          <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              1. The Call (Special Revelation)
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-serif italic">
              "{item.callPassage}"
            </p>
          </div>

          {/* Vosian Theological Insight */}
          <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
            <span className="font-bold text-indigo-300 uppercase tracking-wider block flex items-center gap-1">
              <Quote className="w-3.5 h-3.5 text-indigo-400" />
              Vosian Theological Insight
            </span>
            <p className="leading-relaxed italic">"{item.callTheologicalInsight}"</p>
          </div>
        </div>

        {/* PART 2: THE RESPONSE (DISCIPLESHIP INPUT) */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              2. The Response (Discipleship Input)
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Progression is relational and obedient. Choose your mode of response to digest this truth:
            </p>

            {/* Response Type Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {item.responseOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={clsx(
                    'p-2.5 rounded-xl border text-left text-xs font-semibold transition-all',
                    selectedOptionId === opt.id
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Active Response Text Prompt & Area */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                {selectedOption.promptText}
              </label>
              <textarea
                rows={3}
                required
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={selectedOption.placeholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Pause Timer Notice & Submission */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Initiates 24-hr digestion pause after submission</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Study Override Bypass Button */}
              <button
                type="button"
                onClick={handleBypass}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                title="Bypass 24-hr timer for immediate study & testing"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Study Mode (Instant)
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !responseText.trim()}
                className={clsx(
                  'px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all',
                  !responseText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                )}
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit & Unlock Epoch'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
