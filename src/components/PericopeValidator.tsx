import { useState } from 'react'
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Scale 
} from 'lucide-react'
import { 
  validatePericopeBoundaries, 
  type PericopeValidationResult 
} from '../data/discourseData'

interface PericopeValidatorProps {
  initialReference?: string
  onApplyBoundary?: (recommendedRef: string) => void
}

export default function PericopeValidator({ initialReference = 'John 3:16', onApplyBoundary }: PericopeValidatorProps) {
  const [reference, setReference] = useState(initialReference)
  const [validationResult, setValidationResult] = useState<PericopeValidationResult>(() => 
    validatePericopeBoundaries(initialReference)
  )

  const handleValidate = (refToUse?: string) => {
    const target = refToUse || reference
    if (!target.trim()) return
    const result = validatePericopeBoundaries(target)
    setValidationResult(result)
  }

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'VALID':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          icon: CheckCircle2,
          text: 'VALID COHERENT PERICOPE'
        }
      case 'EXTEND':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: AlertTriangle,
          text: 'EXTEND BOUNDARY (Missing Ground)'
        }
      case 'CONTRACT':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          icon: ShieldAlert,
          text: 'CONTRACT (Crosses Major Division)'
        }
      default:
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
          icon: Scale,
          text: 'ADJUST BOUNDARIES'
        }
    }
  }

  const currentBadge = getVerdictBadge(validationResult.verdict)
  const IconComponent = currentBadge.icon

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span>Alexandria Discourse Integrity Check</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Pericope Delimitation & Boundary Validator
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Validate whether your sermon or teaching passage holds together as an organic discourse unit without chopping dependent clauses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center pt-2">
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
            placeholder="Enter proposed passage (e.g. John 3:16, Romans 8:28, Ephesians 2:8-9)..."
            className="w-full flex-1 p-3.5 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-650 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => handleValidate()}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Validate Boundary</span>
          </button>
        </div>

        {/* Quick Test Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400 font-medium">Test Passages:</span>
          {['John 3:16', 'Romans 8:28', 'Ephesians 2:8-9', 'Philemon 1:1-25', 'Romans 8:28-30'].map(sample => (
            <button
              key={sample}
              onClick={() => {
                setReference(sample)
                handleValidate(sample)
              }}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Result Box */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 animate-fade-in">
        {/* Verdict Banner */}
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${currentBadge.bg}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-black/20 shadow-xs">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80 block">
                DELIMITATION VERDICT ({validationResult.confidenceScore}% Confidence)
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {currentBadge.text}
              </h3>
            </div>
          </div>

          {validationResult.verdict !== 'VALID' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setReference(validationResult.recommendedReference)
                  handleValidate(validationResult.recommendedReference)
                  if (onApplyBoundary) onApplyBoundary(validationResult.recommendedReference)
                }}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Adopt Recommended: {validationResult.recommendedReference}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Detailed Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Reason */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 space-y-1.5">
            <strong className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Exegetical & Structural Rationale
            </strong>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
              {validationResult.reason}
            </p>
          </div>

          {/* Manuscript & Discourse Markers */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 space-y-1.5">
            <strong className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Discourse & Conjunction Markers
            </strong>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
              {validationResult.discourseBoundaryNotes}
            </p>
          </div>
        </div>

        {/* Missing Context Warning if any */}
        {validationResult.missingContextWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="font-bold block mb-0.5">Homiletical Safeguard Alert:</strong>
              <p className="leading-relaxed">{validationResult.missingContextWarning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
