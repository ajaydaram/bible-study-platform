import { getUserEpochProgress } from '../data/callAndResponseData'
import {
  Sparkles,
  Eye,
  Lock,
  Layers,
  ArrowRight,
  Shield
} from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export default function ConsummationView() {
  const progress = getUserEpochProgress()
  const unlockedCount = progress.unlockedEpochIds.length // 1 to 5

  // Clarity Levels (1 to 4)
  const isPatriarchalDone = unlockedCount >= 2
  const isMosaicDone = unlockedCount >= 3
  const isPropheticDone = unlockedCount >= 4
  const isMessianicDone = unlockedCount >= 5

  // Clarity percentage for UI indicator
  const clarityPercent = Math.min(unlockedCount * 20, 100)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
        {/* Glowing Background Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Eschatology Precedes Soteriology • Day 1 Access
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>The Consummation: New Heavens & New Earth</span>
          </h1>

          <p className="text-amber-100 text-base sm:text-lg leading-relaxed">
            Geerhardus Vos taught that salvation is an introduction into the heavenly age-to-come reality. The end goal is visible from Day 1, but its visual clarity and theological depth sharpen as you journey through redemptive history.
          </p>

          {/* Clarity Meter */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-amber-500/30 flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-mono block">
                  Vision Clarity Level
                </span>
                <span className="text-xs font-bold text-white">
                  {clarityPercent}% Clarified ({unlockedCount} of 5 Epochs Unlocked)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Journeying through history sharpens your view of eternity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clarity Status Alert */}
      {!isMessianicDone && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-200 flex items-start gap-3 shadow-lg">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <span className="font-bold text-amber-300">
              "For now we see through a glass, darkly..." (1 Corinthians 13:12)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Some elements of the Consummation below remain monochrome or high-level. Complete the remaining Call-and-Response historical epochs to unlock full-color detail and deep theological exposition!
            </p>
          </div>
        </div>
      )}

      {/* Main Consummation Features Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: The 4 Eschatological Pillar Visions (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* PILLAR 1: The Heavenly City & Gemstone Foundations */}
          <div
            className={clsx(
              'rounded-3xl border p-6 sm:p-8 transition-all duration-700 relative overflow-hidden shadow-xl',
              isPatriarchalDone
                ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-indigo-950/60 border-amber-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 grayscale opacity-80'
            )}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                  🏙️
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Revelation 21:10-21 • {isPatriarchalDone ? 'Full Color Unlocked' : 'Monochrome Preview'}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    The Holy City, New Jerusalem
                  </h3>
                </div>
              </div>

              {!isPatriarchalDone && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-800 text-amber-400 px-3 py-1 rounded-full border border-slate-700">
                  <Lock className="w-3.5 h-3.5" /> Requires Patriarchal Epoch
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4">
              The city built by God, possessing the glory of God. Its radiant light is like a most rare jewel, like a jasper, clear as crystal. Its twelve foundation stones are adorned with every precious jewel, fulfilling the city Abraham looked for by pilgrim faith.
            </p>

            {isPatriarchalDone ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono text-amber-200">
                <div className="bg-amber-900/40 p-2 rounded-lg border border-amber-700/40">💎 Jasper & Gold</div>
                <div className="bg-blue-900/40 p-2 rounded-lg border border-blue-700/40">🔷 Sapphire</div>
                <div className="bg-emerald-900/40 p-2 rounded-lg border border-emerald-700/40">🟢 Emerald</div>
                <div className="bg-purple-900/40 p-2 rounded-lg border border-purple-700/40">🔮 Amethyst</div>
              </div>
            ) : (
              <p className="text-xs italic text-slate-500">
                [Complete the Patriarchal Call-and-Response to reveal full gemstone foundation colors]
              </p>
            )}
          </div>

          {/* PILLAR 2: God and the Lamb ARE the Temple */}
          <div
            className={clsx(
              'rounded-3xl border p-6 sm:p-8 transition-all duration-700 relative overflow-hidden shadow-xl',
              isMosaicDone
                ? 'bg-gradient-to-br from-blue-950/60 via-slate-900 to-emerald-950/60 border-blue-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 grayscale opacity-80'
            )}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                  🏛️
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Revelation 21:22-23 • {isMosaicDone ? 'Full Shekinah Glory Unlocked' : 'Monochrome Preview'}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    No Temple in the City: God & the Lamb ARE the Temple
                  </h3>
                </div>
              </div>

              {!isMosaicDone && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-slate-700">
                  <Lock className="w-3.5 h-3.5" /> Requires Mosaic Epoch
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4">
              The earthly Tabernacle and Solomon’s Temple were pedagogical shadows! In the Consummation, there is no physical temple building, for the Lord God Almighty and the Lamb ARE its temple. The city has no need of sun or moon, for the glory of God gives it light.
            </p>

            {isMosaicDone && (
              <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-800/40 text-xs text-blue-200">
                <strong className="block text-blue-300 mb-1">Vosian Insight:</strong>
                "In the New Jerusalem, the dwelling of God with man attains its absolute perfection. Sanctuary space is no longer localized because the entire creation has been transformed into God’s Holy of Holies."
              </div>
            )}
          </div>

          {/* PILLAR 3: The River of Life & Healing of Nations */}
          <div
            className={clsx(
              'rounded-3xl border p-6 sm:p-8 transition-all duration-700 relative overflow-hidden shadow-xl',
              isPropheticDone
                ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/60 border-emerald-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 grayscale opacity-80'
            )}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                  🌊
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Revelation 22:1-5 • {isPropheticDone ? 'Life-Giving River Unlocked' : 'Monochrome Preview'}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    The River of Water of Life & Tree of Life
                  </h3>
                </div>
              </div>

              {!isPropheticDone && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-full border border-slate-700">
                  <Lock className="w-3.5 h-3.5" /> Requires Prophetic Epoch
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4">
              Flowing from the throne of God and of the Lamb down the middle of the street is the river of the water of life, bright as crystal. On either side of the river, the tree of life produces twelve kinds of fruit, and its leaves are for the healing of the nations.
            </p>
          </div>

          {/* PILLAR 4: No More Curse & Reigning Forever */}
          <div
            className={clsx(
              'rounded-3xl border p-6 sm:p-8 transition-all duration-700 relative overflow-hidden shadow-xl',
              isMessianicDone
                ? 'bg-gradient-to-br from-rose-950/60 via-purple-950 to-slate-900 border-rose-500/50 text-white shadow-rose-900/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 grayscale opacity-80'
            )}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-3 bg-rose-500/20 rounded-2xl border border-rose-500/30">
                  👑
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Revelation 22:3-5 • {isMessianicDone ? 'Full 4K Radiant Consummation Unlocked' : 'Monochrome Preview'}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    No More Curse: They Will See His Face
                  </h3>
                </div>
              </div>

              {!isMessianicDone && (
                <span className="inline-flex items-center gap-1 text-xs bg-slate-800 text-rose-400 px-3 py-1 rounded-full border border-slate-700">
                  <Lock className="w-3.5 h-3.5" /> Requires Messianic Realization Epoch
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4">
              No longer will there be anything accursed! His servants will worship Him; they will see His face, and His name will be on their foreheads. Night will be no more, and they will reign forever and ever.
            </p>
          </div>
        </div>

        {/* Right Column: Historical Epoch Clarification Tracker (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Epoch Clarification Progress
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Every historical epoch you complete directly sharpens your theological vision of the Consummation:
            </p>

            <div className="space-y-3 pt-2">
              {/* Epoch 1 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-emerald-400">1. Pre-Fall</span>
                  <p className="text-[10px] text-slate-400">Edenic Sanctuary Blueprint</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold">Unlocked</span>
              </div>

              {/* Epoch 2 */}
              <div
                className={clsx(
                  'p-3 rounded-xl border flex items-center justify-between text-xs',
                  isPatriarchalDone
                    ? 'bg-slate-950 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                )}
              >
                <div>
                  <span className="font-bold">2. Patriarchal</span>
                  <p className="text-[10px]">Gemstone Foundation Colors</p>
                </div>
                <span>{isPatriarchalDone ? '✓ Clarified' : 'Locked'}</span>
              </div>

              {/* Epoch 3 */}
              <div
                className={clsx(
                  'p-3 rounded-xl border flex items-center justify-between text-xs',
                  isMosaicDone
                    ? 'bg-slate-950 border-blue-500/40 text-blue-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                )}
              >
                <div>
                  <span className="font-bold">3. Mosaic & Kingdom</span>
                  <p className="text-[10px]">God & Lamb as Temple</p>
                </div>
                <span>{isMosaicDone ? '✓ Clarified' : 'Locked'}</span>
              </div>

              {/* Epoch 4 */}
              <div
                className={clsx(
                  'p-3 rounded-xl border flex items-center justify-between text-xs',
                  isPropheticDone
                    ? 'bg-slate-950 border-purple-500/40 text-purple-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                )}
              >
                <div>
                  <span className="font-bold">4. Prophetic</span>
                  <p className="text-[10px]">River & Leaves for Healing</p>
                </div>
                <span>{isPropheticDone ? '✓ Clarified' : 'Locked'}</span>
              </div>

              {/* Epoch 5 */}
              <div
                className={clsx(
                  'p-3 rounded-xl border flex items-center justify-between text-xs',
                  isMessianicDone
                    ? 'bg-slate-950 border-rose-500/40 text-rose-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                )}
              >
                <div>
                  <span className="font-bold">5. Messianic Realization</span>
                  <p className="text-[10px]">Radiant 4K Eternal Glory</p>
                </div>
                <span>{isMessianicDone ? '✓ Clarified' : 'Locked'}</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/epochs"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-600/30"
              >
                <span>Continue Epoch Progression</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
