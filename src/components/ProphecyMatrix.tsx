import { MessianicProphecy } from '../data/typologyMatrixData'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'

interface Props {
  prophecies: MessianicProphecy[]
}

export default function ProphecyMatrix({ prophecies }: Props) {
  return (
    <div className="space-y-4">
      {prophecies.map((p) => (
        <div
          key={p.id}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full text-xs font-mono font-bold">
              {p.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Fulfilled in Jesus Christ</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* OT PROPHECY */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Old Testament Prophecy
                </span>
                <span className="font-mono">{p.otPassage}</span>
              </div>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-serif italic">
                "{p.otText}"
              </p>
            </div>

            {/* NT FULFILLMENT */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  New Testament Fulfillment
                </span>
                <span className="font-mono">{p.ntFulfillment}</span>
              </div>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-serif italic">
                "{p.ntText}"
              </p>
            </div>
          </div>

          {/* Theological Insight */}
          <div className="bg-gray-50 dark:bg-gray-900/60 rounded-xl p-3 border border-gray-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white">Redemptive Synthesis: </span>
            {p.theologicalInsight}
          </div>
        </div>
      ))}
    </div>
  )
}
