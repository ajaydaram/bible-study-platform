import { getUserEpochProgress } from '../data/callAndResponseData'
import { Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function OrganicRevelationTree() {
  const progress = getUserEpochProgress()
  const unlockedCount = progress.unlockedEpochIds.length // 1 to 5

  // Stage labels
  const stageLabels = [
    { name: 'Protoevangelium Seed', passage: 'Genesis 3:15', epoch: 'Pre-Fall' },
    { name: 'Pilgrim Root & Sprout', passage: 'Genesis 15:6', epoch: 'Patriarchal' },
    { name: '4 Theological Branches', passage: 'Exodus 25', epoch: 'Mosaic' },
    { name: 'Prophetic Leaves & Buds', passage: 'Jeremiah 31', epoch: 'Prophetic' },
    { name: 'Full Blooming Tree of Life', passage: 'John 1:14', epoch: 'Messianic' }
  ]

  const currentStage = stageLabels[Math.min(unlockedCount - 1, 4)]

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/40 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            Organic Progression Engine (Vosian Organic Growth)
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>The Tree of Special Revelation</span>
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Truth unfolds organically from the seed promise of Genesis 3:15 to full bloom in Christ.
          </p>
        </div>

        {/* Current Organic State Badge */}
        <div className="bg-emerald-950/70 border border-emerald-700/50 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50" />
          <div>
            <span className="text-[10px] text-emerald-300 font-mono block">CURRENT STAGE</span>
            <span className="text-xs font-bold text-emerald-100">{currentStage.name}</span>
          </div>
        </div>
      </div>

      {/* Visual SVG Organic Tree Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-center overflow-hidden shadow-inner">
        <svg
          viewBox="0 0 400 260"
          className="w-full h-full max-w-lg transition-all duration-700"
        >
          {/* Soil Ground Line */}
          <line
            x1="20"
            y1="230"
            x2="380"
            y2="230"
            stroke="#1e293b"
            strokeWidth="4"
            strokeDasharray="6 6"
          />
          <path
            d="M 40 230 Q 200 220 360 230"
            fill="none"
            stroke="#064e3b"
            strokeWidth="3"
          />

          {/* STAGE 1: PROTOEVANGELIUM SEED (Genesis 3:15) */}
          <g className="transition-all duration-500">
            {/* Glowing Seed in Soil */}
            <ellipse cx="200" cy="225" rx="8" ry="5" fill="#f59e0b" />
            <circle cx="200" cy="225" r="12" fill="#f59e0b" opacity="0.2" className="animate-ping" />
            <text x="200" y="248" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
              Gen 3:15 Seed
            </text>
          </g>

          {/* STAGE 2: PILGRIM SPROUT (Patriarchal Era) */}
          {unlockedCount >= 2 && (
            <g className="animate-fade-in transition-all duration-700">
              {/* Main Stem */}
              <path
                d="M 200 220 Q 200 170 200 150"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* First Sprout Leaves */}
              <path d="M 200 190 Q 180 180 175 190 Q 190 200 200 190 Z" fill="#34d399" />
              <path d="M 200 170 Q 220 160 225 170 Q 210 180 200 170 Z" fill="#34d399" />
              <circle cx="200" cy="150" r="4" fill="#a7f3d0" />
            </g>
          )}

          {/* STAGE 3: THE 4 THEOLOGICAL BRANCHES (Mosaic Era) */}
          {unlockedCount >= 3 && (
            <g className="animate-fade-in transition-all duration-700">
              {/* Main Trunk extension */}
              <path
                d="M 200 150 Q 200 120 200 100"
                fill="none"
                stroke="#059669"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Branch 1: The Temple (Left Top) */}
              <path d="M 200 130 Q 150 100 120 80" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <circle cx="120" cy="80" r="5" fill="#38bdf8" />
              <text x="110" y="70" textAnchor="end" fill="#7dd3fc" fontSize="9" fontWeight="bold">
                🏛️ Temple
              </text>

              {/* Branch 2: Kingship (Right Top) */}
              <path d="M 200 130 Q 250 100 280 80" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <circle cx="280" cy="80" r="5" fill="#f43f5e" />
              <text x="290" y="70" textAnchor="start" fill="#fda4af" fontSize="9" fontWeight="bold">
                👑 Kingship
              </text>

              {/* Branch 3: Priesthood (Left Lower) */}
              <path d="M 200 145 Q 140 130 100 120" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="100" cy="120" r="4.5" fill="#fbbf24" />
              <text x="90" y="125" textAnchor="end" fill="#fef08a" fontSize="8" fontWeight="bold">
                ⚖️ Priesthood
              </text>

              {/* Branch 4: Sabbath (Right Lower) */}
              <path d="M 200 145 Q 260 130 300 120" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="300" cy="120" r="4.5" fill="#c084fc" />
              <text x="310" y="125" textAnchor="start" fill="#e9d5ff" fontSize="8" fontWeight="bold">
                🌅 Sabbath
              </text>
            </g>
          )}

          {/* STAGE 4: PROPHETIC LEAVES & BUDS (Prophetic Era) */}
          {unlockedCount >= 4 && (
            <g className="animate-fade-in transition-all duration-700">
              {/* Extra Foliage clusters */}
              <circle cx="120" cy="80" r="14" fill="#10b981" opacity="0.4" />
              <circle cx="280" cy="80" r="14" fill="#10b981" opacity="0.4" />
              <circle cx="200" cy="80" r="18" fill="#059669" opacity="0.5" />
              <circle cx="100" cy="120" r="12" fill="#047857" opacity="0.4" />
              <circle cx="300" cy="120" r="12" fill="#047857" opacity="0.4" />

              {/* Prophetic Buds */}
              <circle cx="200" cy="70" r="5" fill="#f472b6" />
              <circle cx="160" cy="65" r="4" fill="#f472b6" />
              <circle cx="240" cy="65" r="4" fill="#f472b6" />
            </g>
          )}

          {/* STAGE 5: FULL BLOOM IN CHRIST (Messianic Realization) */}
          {unlockedCount >= 5 && (
            <g className="animate-fade-in transition-all duration-700">
              {/* Crown of Radiant Flowers / Golden Fruits */}
              <circle cx="200" cy="50" r="22" fill="#f59e0b" opacity="0.3" className="animate-pulse" />
              
              {/* Golden Central Fruit (Christ) */}
              <circle cx="200" cy="50" r="10" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
              <text x="200" y="32" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="extrabold">
                ✨ CHRIST THE FULFILLMENT ✨
              </text>

              {/* Interwoven Golden Rays connecting to branches */}
              <line x1="200" y1="50" x2="120" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="200" y1="50" x2="280" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="200" y1="50" x2="100" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="200" y1="50" x2="300" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          )}
        </svg>
      </div>

      {/* Interactive 4 Theological Branches Quick Links */}
      <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/typology"
          className="flex items-center gap-2 p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group"
        >
          <span className="text-base">🏛️</span>
          <div>
            <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">The Temple</h4>
            <span className="text-[10px] text-slate-400">Eden → Christ</span>
          </div>
        </Link>

        <Link
          to="/typology"
          className="flex items-center gap-2 p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group"
        >
          <span className="text-base">👑</span>
          <div>
            <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Kingship</h4>
            <span className="text-[10px] text-slate-400">Adam → David → Messiah</span>
          </div>
        </Link>

        <Link
          to="/typology"
          className="flex items-center gap-2 p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group"
        >
          <span className="text-base">⚖️</span>
          <div>
            <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Priesthood</h4>
            <span className="text-[10px] text-slate-400">Melchizedek → High Priest</span>
          </div>
        </Link>

        <Link
          to="/typology"
          className="flex items-center gap-2 p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group"
        >
          <span className="text-base">🌅</span>
          <div>
            <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Sabbath</h4>
            <span className="text-[10px] text-slate-400">Creation → Heavenly Rest</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
